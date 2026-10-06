/**
 * Club 1600 Treasury — Google Sheets API bridge
 *
 * Bind this script to the working Club 1600 treasury spreadsheet:
 * Extensions -> Apps Script.
 *
 * The spreadsheet remains the source of truth. Cloudflare Pages proxies requests
 * to this script so the sheet URL and API token never need to be shipped to the browser.
 */

const TREASURY = {
  programYear: "2026/2027",
  programYearStart: "2026-07-01",
  programYearEnd: "2027-06-30",
  currency: "BSD",
  budgetSheet: "Budget 26-27",
  notesSheet: "Notes",
  transactionsSheet: "Transactions",
  membershipSheet: "Membership Listing",
  duesSheet: "Dues Payments",
};

function doGet(e) {
  try {
    assertToken_(e && e.parameter && e.parameter.token);
    const resource = (e && e.parameter && e.parameter.resource) || "bootstrap";
    if (resource !== "bootstrap") return json_({ ok: false, error: "Unknown resource." });
    return json_({ ok: true, data: buildBootstrap_(), updatedAt: new Date().toISOString() });
  } catch (error) {
    return json_({ ok: false, error: error && error.message ? error.message : String(error) });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    assertToken_(body.token);
    const action = body.action;
    const payload = body.payload || {};

    if (action === "addTransaction") addTransaction_(payload);
    else if (action === "recordDuesPayment") recordDuesPayment_(payload);
    else if (action === "recordMeetingCollections") recordMeetingCollections_(payload);
    else if (action === "voidTransaction") voidTransaction_(payload);
    else throw new Error("Unknown treasury action.");

    return json_({ ok: true, data: buildBootstrap_(), updatedAt: new Date().toISOString() });
  } catch (error) {
    return json_({ ok: false, error: error && error.message ? error.message : String(error) });
  }
}

function configureTreasuryApiToken() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    "Club 1600 Treasury API",
    "Enter a long private token. You will add the same value to Cloudflare as TREASURY_API_TOKEN.",
    ui.ButtonSet.OK_CANCEL
  );
  if (response.getSelectedButton() !== ui.Button.OK) return;
  const token = response.getResponseText().trim();
  if (token.length < 20) throw new Error("Use a token of at least 20 characters.");
  PropertiesService.getScriptProperties().setProperty("TREASURY_API_TOKEN", token);
  ensureSupportSheets_();
  ui.alert("Treasury API token saved. Support sheets/columns are ready.");
}

function ensureSupportSheets_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tx = mustSheet_(TREASURY.transactionsSheet);
  const txHeader = findHeaderRow_(tx, ["Date", "Category"]);
  const extraHeaders = ["Status", "Payment Method", "Reference", "Notes", "Batch ID", "Record ID"];
  extraHeaders.forEach(function(header, index) {
    const col = 9 + index;
    if (!tx.getRange(txHeader, col).getValue()) tx.getRange(txHeader, col).setValue(header);
  });

  let dues = ss.getSheetByName(TREASURY.duesSheet);
  if (!dues) dues = ss.insertSheet(TREASURY.duesSheet);
  if (!dues.getLastRow()) {
    dues.getRange(1, 1, 1, 8).setValues([[
      "Record ID", "Date", "Member", "Amount", "Payment Method", "Reference", "Notes", "Status"
    ]]);
    dues.setFrozenRows(1);
  }
}

function buildBootstrap_() {
  ensureSupportSheets_();
  const budget = readBudget_();
  const transactions = readTransactions_(budget);
  const memberBundle = readMembersAndPayments_();
  const issues = []
    .concat(transactions.issues)
    .concat(memberBundle.issues);

  return {
    meta: {
      club: "Toastmasters Club 1600",
      program_year: TREASURY.programYear,
      program_year_start: TREASURY.programYearStart,
      program_year_end: TREASURY.programYearEnd,
      currency: TREASURY.currency,
      approved_budgeted_inflows: budget.lines.filter(function(x){ return x.type === "inflow"; }).reduce(function(s,x){ return s + x.amount; }, 0),
      approved_budgeted_outflows: budget.lines.filter(function(x){ return x.type === "outflow"; }).reduce(function(s,x){ return s + x.amount; }, 0),
      source: "Google Sheets",
      note: "Live data from the Club 1600 working treasury spreadsheet."
    },
    budget: budget.lines,
    transactions: transactions.rows,
    members: memberBundle.members,
    issues: issues
  };
}

function readBudget_() {
  const sheet = mustSheet_(TREASURY.budgetSheet);
  const notes = readBudgetNotes_();
  const values = sheet.getDataRange().getValues();
  const lines = [];

  values.forEach(function(row) {
    const item = Number(row[3]);
    const name = String(row[2] || "").trim();
    if (!Number.isFinite(item) || !name) return;
    lines.push({
      item: item,
      name: name,
      type: item <= 18 ? "inflow" : "outflow",
      amount: number_(row[4]),
      legacyActual: number_(row[5]),
      prior: number_(row[8]),
      rationale: notes[item] || ""
    });
  });

  return { lines: lines };
}

function readBudgetNotes_() {
  const sheet = mustSheet_(TREASURY.notesSheet);
  const values = sheet.getDataRange().getValues();
  const map = {};
  values.forEach(function(row) {
    const label = String(row[0] || "");
    const match = label.match(/^\s*(\d+)\./);
    if (match) map[Number(match[1])] = String(row[1] || "").trim();
  });
  return map;
}

function readTransactions_(budget) {
  const sheet = mustSheet_(TREASURY.transactionsSheet);
  const headerRow = findHeaderRow_(sheet, ["Date", "Category"]);
  const lastRow = sheet.getLastRow();
  if (lastRow <= headerRow) return { rows: [], issues: [] };

  const values = sheet.getRange(headerRow + 1, 1, lastRow - headerRow, Math.max(14, sheet.getLastColumn())).getValues();
  const byItem = {};
  budget.lines.forEach(function(line){ byItem[line.item] = line.name; });

  const rows = [];
  const issues = [];

  values.forEach(function(row, index) {
    if (!row.some(function(v){ return v !== "" && v !== null; })) return;
    const sourceRow = headerRow + 1 + index;
    const item = Number(row[2]);
    const amount = number_(row[5]);
    const description = String(row[4] || "").trim();
    if (!Number.isFinite(item) && !amount && !description) return;

    const date = isoDate_(row[0]);
    const valid = row[7];
    const explicitStatus = String(row[8] || "").toLowerCase().trim();
    let status = explicitStatus || (valid === false || String(valid).toLowerCase() === "false" ? "voided" : "posted");
    const recordId = String(row[13] || "").trim() || ("sheet-row-" + sourceRow);
    const itemName = byItem[item] || stripCategoryPrefix_(row[1]) || "Uncategorised";

    const rowIssues = [];
    if (!date) rowIssues.push("Missing or invalid transaction date");
    else if (date < TREASURY.programYearStart || date > TREASURY.programYearEnd) rowIssues.push("Transaction is outside the 2026/2027 program year");
    if (!Number.isFinite(item)) rowIssues.push("Missing or invalid budget item number");
    if (!amount || amount < 0) rowIssues.push("Missing or invalid amount");
    if (rowIssues.length && status === "posted") status = "needs_review";

    const tx = {
      id: recordId,
      date: date,
      rawDate: String(row[0] || ""),
      itemNumber: Number.isFinite(item) ? item : undefined,
      type: normalizeType_(row[3], item),
      category: itemName,
      description: description || itemName,
      amount: amount,
      account: "Operating account",
      method: String(row[9] || "Legacy record"),
      reference: String(row[10] || ""),
      notes: String(row[11] || ""),
      status: status,
      issues: rowIssues,
      batchId: String(row[12] || ""),
      sourceRow: sourceRow
    };
    rows.push(tx);

    rowIssues.forEach(function(issue) {
      issues.push({
        entity: "transaction",
        legacy_id: recordId,
        description: tx.description,
        issue: issue,
        raw_value: tx.rawDate || null
      });
    });
  });

  return { rows: rows, issues: issues };
}

function readMembersAndPayments_() {
  const membership = mustSheet_(TREASURY.membershipSheet);
  const headerRow = findHeaderRow_(membership, ["Member Name"]);
  const lastRow = membership.getLastRow();
  const values = lastRow > headerRow
    ? membership.getRange(headerRow + 1, 1, lastRow - headerRow, Math.max(7, membership.getLastColumn())).getValues()
    : [];

  const members = [];
  const byName = {};
  const issues = [];

  values.forEach(function(row, index) {
    const name = String(row[0] || "").trim();
    if (!name) return;
    const memberType = String(row[1] || "Existing").trim();
    const memberId = "member-row-" + (headerRow + 1 + index);
    const expected = memberType.toLowerCase() === "new" ? 300 : 250;
    const notes = String(row[5] || "").trim();
    const special = /club cover|covered by club/i.test(notes) ? "Covered by Club" : undefined;

    const member = {
      id: memberId,
      name: name,
      type: memberType.toLowerCase() === "new" ? "New" : "Existing",
      expected: expected,
      payments: [],
      computedStatus: "unpaid",
      notes: notes || null,
      special: special
    };

    const legacyAmount = number_(row[3]);
    if (legacyAmount > 0) {
      const paymentDate = isoDate_(row[2]);
      const paymentIssues = [];
      let paymentStatus = "posted";
      if (!paymentDate) {
        paymentIssues.push("Payment amount exists but payment date is missing");
        paymentStatus = "needs_review";
      } else if (paymentDate < TREASURY.programYearStart || paymentDate > TREASURY.programYearEnd) {
        paymentIssues.push("Payment is outside the 2026/2027 program year");
        paymentStatus = "needs_review";
      }
      member.payments.push({
        id: "legacy-dues-row-" + (headerRow + 1 + index),
        date: paymentDate,
        amount: legacyAmount,
        method: notes || "Legacy record",
        status: paymentStatus,
        issues: paymentIssues
      });
      paymentIssues.forEach(function(issue) {
        issues.push({
          entity: "dues_payment",
          legacy_id: "legacy-dues-row-" + (headerRow + 1 + index),
          member_name: name,
          issue: issue,
          raw_value: String(row[2] || "")
        });
      });
    }

    members.push(member);
    byName[name.toLowerCase()] = member;
  });

  const dues = mustSheet_(TREASURY.duesSheet);
  if (dues.getLastRow() > 1) {
    const rows = dues.getRange(2, 1, dues.getLastRow() - 1, 8).getValues();
    rows.forEach(function(row) {
      const name = String(row[2] || "").trim();
      if (!name) return;
      const member = byName[name.toLowerCase()];
      if (!member) {
        issues.push({
          entity: "dues_payment",
          legacy_id: String(row[0] || ""),
          member_name: name,
          issue: "Dues payment references a member not found in Membership Listing",
          raw_value: name
        });
        return;
      }
      const paymentDate = isoDate_(row[1]);
      const paymentIssues = [];
      let status = String(row[7] || "posted").toLowerCase();
      if (!paymentDate && status === "posted") {
        paymentIssues.push("Payment date is missing");
        status = "needs_review";
      }
      member.payments.push({
        id: String(row[0] || Utilities.getUuid()),
        date: paymentDate,
        amount: number_(row[3]),
        method: String(row[4] || ""),
        status: status,
        issues: paymentIssues
      });
    });
  }

  members.forEach(function(member) {
    const paid = member.payments
      .filter(function(p){ return p.status === "posted"; })
      .reduce(function(sum, p){ return sum + number_(p.amount); }, 0);
    if (member.special) member.computedStatus = "covered_by_club";
    else if (paid >= member.expected) member.computedStatus = "paid";
    else if (paid > 0) member.computedStatus = "partial";
    else member.computedStatus = "unpaid";
  });

  return { members: members, issues: issues };
}

function addTransaction_(payload) {
  const sheet = mustSheet_(TREASURY.transactionsSheet);
  const headerRow = findHeaderRow_(sheet, ["Date", "Category"]);
  ensureSupportSheets_();

  const item = Number(payload.itemNumber);
  if (!payload.date || !payload.description || !payload.amount || !Number.isFinite(item)) {
    throw new Error("Date, category, description, and amount are required.");
  }

  const row = [
    new Date(payload.date + "T12:00:00"),
    item + " - " + String(payload.category || ""),
    item,
    payload.type === "outflow" ? "Outflow" : "Inflow",
    String(payload.description),
    number_(payload.amount),
    shortMonth_(payload.date),
    true,
    "posted",
    String(payload.method || ""),
    String(payload.reference || ""),
    String(payload.notes || ""),
    String(payload.batchId || ""),
    String(payload.id || Utilities.getUuid())
  ];

  sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length).setValues([row]);
}

function recordMeetingCollections_(payload) {
  const date = payload.date;
  const notes = String(payload.notes || "");
  const batchId = String(payload.batchId || Utilities.getUuid());
  [
    { itemNumber: 2, category: "Refreshments", amount: number_(payload.refreshments) },
    { itemNumber: 3, category: "Raffle", amount: number_(payload.raffle) },
    { itemNumber: 4, category: "Fines", amount: number_(payload.fines) }
  ].forEach(function(entry) {
    if (entry.amount <= 0) return;
    addTransaction_({
      id: Utilities.getUuid(),
      date: date,
      itemNumber: entry.itemNumber,
      category: entry.category,
      type: "inflow",
      description: "Meeting collections",
      amount: entry.amount,
      method: "Cash",
      notes: notes,
      batchId: batchId
    });
  });
}

function recordDuesPayment_(payload) {
  if (!payload.memberName || !payload.date || number_(payload.amount) <= 0) {
    throw new Error("Member, date, and payment amount are required.");
  }
  ensureSupportSheets_();
  const sheet = mustSheet_(TREASURY.duesSheet);
  sheet.appendRow([
    String(payload.id || Utilities.getUuid()),
    new Date(payload.date + "T12:00:00"),
    String(payload.memberName),
    number_(payload.amount),
    String(payload.method || ""),
    String(payload.reference || ""),
    String(payload.notes || ""),
    "posted"
  ]);
}

function voidTransaction_(payload) {
  const sheet = mustSheet_(TREASURY.transactionsSheet);
  const headerRow = findHeaderRow_(sheet, ["Date", "Category"]);
  const id = String(payload.id || "");
  if (!id) throw new Error("Transaction ID is required.");

  let rowNumber = null;
  const legacyMatch = id.match(/^sheet-row-(\d+)$/);
  if (legacyMatch) {
    rowNumber = Number(legacyMatch[1]);
  } else if (sheet.getLastRow() > headerRow) {
    const ids = sheet.getRange(headerRow + 1, 14, sheet.getLastRow() - headerRow, 1).getValues();
    for (let i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) === id) {
        rowNumber = headerRow + 1 + i;
        break;
      }
    }
  }

  if (!rowNumber) throw new Error("Transaction could not be found in Google Sheets.");
  sheet.getRange(rowNumber, 8).setValue(false);
  sheet.getRange(rowNumber, 9).setValue("voided");
  const currentNotes = String(sheet.getRange(rowNumber, 12).getValue() || "");
  const reason = String(payload.reason || "No reason supplied");
  sheet.getRange(rowNumber, 12).setValue([currentNotes, "Void reason: " + reason].filter(Boolean).join(" · "));
}

function assertToken_(provided) {
  const expected = PropertiesService.getScriptProperties().getProperty("TREASURY_API_TOKEN");
  if (!expected) throw new Error("Treasury API token has not been configured in Apps Script.");
  if (!provided || String(provided) !== String(expected)) throw new Error("Unauthorized.");
}

function mustSheet_(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error('Required sheet "' + name + '" was not found.');
  return sheet;
}

function findHeaderRow_(sheet, requiredHeaders) {
  const scanRows = Math.min(Math.max(sheet.getLastRow(), 1), 12);
  const scanCols = Math.min(Math.max(sheet.getLastColumn(), requiredHeaders.length), 20);
  const values = sheet.getRange(1, 1, scanRows, scanCols).getDisplayValues();
  for (let r = 0; r < values.length; r++) {
    const normalized = values[r].map(function(v){ return String(v).trim().toLowerCase(); });
    const found = requiredHeaders.every(function(header){ return normalized.indexOf(header.toLowerCase()) !== -1; });
    if (found) return r + 1;
  }
  throw new Error('Could not find headers in sheet "' + sheet.getName() + '".');
}

function stripCategoryPrefix_(value) {
  return String(value || "").replace(/^\s*\d+\s*-\s*/, "").replace(/\s*\((Inflow|Outflow)\)\s*$/i, "").trim();
}

function normalizeType_(value, item) {
  const text = String(value || "").toLowerCase();
  if (text.indexOf("out") !== -1) return "outflow";
  if (text.indexOf("in") !== -1) return "inflow";
  return Number(item) <= 18 ? "inflow" : "outflow";
}

function isoDate_(value) {
  if (!value) return null;
  let date = value;
  if (!(date instanceof Date)) {
    date = new Date(value);
  }
  if (!(date instanceof Date) || isNaN(date.getTime())) return null;
  return Utilities.formatDate(date, Session.getScriptTimeZone() || "America/Nassau", "yyyy-MM-dd");
}

function shortMonth_(isoDate) {
  return Utilities.formatDate(new Date(isoDate + "T12:00:00"), Session.getScriptTimeZone() || "America/Nassau", "MMM");
}

function number_(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
