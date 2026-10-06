import budgetSource from "@/data/club1600_budget.json";
import metaSource from "@/data/club1600_meta.json";
import snapshotSource from "@/data/club1600_snapshot.json";
import {
  fetchGoogleSheetsSnapshot,
  postGoogleSheetsAction,
  TreasuryApiAction,
} from "@/services/googleSheetsTreasuryService";

export type TxType = "inflow" | "outflow";
export type RecordStatus = "posted" | "voided" | "needs_review";
export type Payment = {
  id: string;
  date: string | null;
  amount: number;
  method: string | null;
  status: RecordStatus;
  issues: string[];
};
export type Transaction = {
  id: string;
  date: string | null;
  rawDate?: string;
  itemNumber?: number;
  type: TxType;
  category: string;
  description: string;
  amount: number;
  account: string;
  method: string;
  reference?: string;
  notes?: string;
  receipt?: string;
  status: RecordStatus;
  issues?: string[];
  batchId?: string;
  sourceRow?: number;
};
export type BudgetLine = {
  item: number;
  name: string;
  type: TxType;
  amount: number;
  prior: number;
  legacyActual: number;
  rationale?: string;
  group?: string;
};
export type Member = {
  id: string;
  name: string;
  type: "Existing" | "New";
  expected: number;
  payments: Payment[];
  computedStatus: string;
  notes: string | null;
  special?: "Covered by Club" | "Exempt / Waived";
};
export type DataIssue = {
  entity: string;
  legacy_id: string;
  description?: string;
  member_name?: string;
  issue: string;
  raw_value: string | null;
};
export type TreasuryMeta = {
  club: string;
  program_year: string;
  program_year_start: string;
  program_year_end: string;
  currency: string;
  approved_budgeted_inflows: number;
  approved_budgeted_outflows: number;
  source?: string;
  note?: string;
  legacy_workbook_actual_inflows?: number;
  legacy_workbook_actual_outflows?: number;
  legacy_workbook_net_movement?: number;
  snapshot_updated_at?: string;
};
export type TreasuryState = { transactions: Transaction[]; members: Member[] };
export type TreasurySnapshot = {
  meta: TreasuryMeta;
  budget: BudgetLine[];
  transactions: Transaction[];
  members: Member[];
  issues: DataIssue[];
};
export type TreasurySyncResult = {
  state: TreasuryState;
  source: "google-sheets" | "sheet-snapshot";
  updatedAt?: string;
  error?: string;
};

const STORAGE_KEY = "club1600-treasury-working-data-v3";
const eventGroups: Record<number, string> = {
  6: "installation",
  7: "ladies-night",
  8: "back-to-school",
  10: "family-fun-day",
  11: "boil-fish",
  12: "socials",
  13: "past-presidents",
  14: "leadership-tour",
  15: "membership-drives",
  17: "speech-contest",
  18: "the-pitch",
  21: "ladies-night",
  22: "installation",
  24: "socials",
  25: "back-to-school",
  32: "past-presidents",
  35: "boil-fish",
  36: "family-fun-day",
  45: "leadership-tour",
  46: "membership-drives",
  50: "speech-contest",
  51: "the-pitch",
};

export let meta: TreasuryMeta = { ...(metaSource as TreasuryMeta) };
export let issues: DataIssue[] = (snapshotSource.issues || []) as DataIssue[];
export let budget: BudgetLine[] = budgetSource.map((line) => ({
  item: line.item_number,
  name: line.name,
  type: line.type as TxType,
  amount: line.budget_amount,
  prior: line.prior_year_budget,
  legacyActual: line.legacy_workbook_actual,
  rationale: line.budget_rationale || undefined,
  group: eventGroups[line.item_number],
}));

function sourceState(): TreasuryState {
  return {
    transactions: snapshotSource.transactions as Transaction[],
    members: snapshotSource.members as Member[],
  };
}

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export function loadTreasuryData(): TreasuryState {
  if (typeof window === "undefined") return sourceState();
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    const initial = sourceState();
    saveTreasuryData(initial);
    return initial;
  }
  try {
    return JSON.parse(saved) as TreasuryState;
  } catch {
    return sourceState();
  }
}

export function saveTreasuryData(state: TreasuryState) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

export function resetTreasuryData(): TreasuryState {
  const initial = clone(sourceState());
  saveTreasuryData(initial);
  return initial;
}

function normaliseSnapshot(snapshot: TreasurySnapshot): TreasurySnapshot {
  return {
    meta: {
      ...snapshot.meta,
      approved_budgeted_inflows: Number(snapshot.meta.approved_budgeted_inflows || 0),
      approved_budgeted_outflows: Number(snapshot.meta.approved_budgeted_outflows || 0),
    },
    budget: (snapshot.budget || []).map((line) => ({
      ...line,
      item: Number(line.item),
      amount: Number(line.amount || 0),
      prior: Number(line.prior || 0),
      legacyActual: Number(line.legacyActual || 0),
      type: line.type as TxType,
      group: line.group || eventGroups[Number(line.item)],
    })),
    transactions: (snapshot.transactions || []).map((record) => ({
      ...record,
      amount: Number(record.amount || 0),
      account: record.account || "Operating account",
      method: record.method || "Google Sheets",
      status: (record.status || "posted") as RecordStatus,
      issues: record.issues || [],
    })),
    members: (snapshot.members || []).map((member) => ({
      ...member,
      expected: Number(member.expected || 0),
      type: member.type === "New" ? "New" : "Existing",
      payments: (member.payments || []).map((payment) => ({
        ...payment,
        amount: Number(payment.amount || 0),
        status: (payment.status || "posted") as RecordStatus,
        issues: payment.issues || [],
      })),
    })),
    issues: snapshot.issues || [],
  };
}

function applySnapshot(snapshot: TreasurySnapshot): TreasuryState {
  const clean = normaliseSnapshot(snapshot);
  meta = clean.meta;
  budget = clean.budget;
  issues = clean.issues;
  const state = { transactions: clean.transactions, members: clean.members };
  saveTreasuryData(state);
  return state;
}

export async function syncTreasuryData(): Promise<TreasurySyncResult> {
  try {
    const response = await fetchGoogleSheetsSnapshot<TreasurySnapshot>();
    const state = applySnapshot(response.data);
    return {
      state,
      source: "google-sheets",
      updatedAt: response.updatedAt || new Date().toISOString(),
    };
  } catch (error) {
    return {
      state: loadTreasuryData(),
      source: "sheet-snapshot",
      error: error instanceof Error ? error.message : "Live Google Sheets sync is unavailable.",
    };
  }
}

export async function runTreasuryAction(
  action: TreasuryApiAction,
  payload: Record<string, unknown>,
): Promise<TreasurySyncResult> {
  const response = await postGoogleSheetsAction<TreasurySnapshot>(action, payload);
  if (!response.data) {
    return syncTreasuryData();
  }
  return {
    state: applySnapshot(response.data),
    source: "google-sheets",
    updatedAt: response.updatedAt || new Date().toISOString(),
  };
}

export const postedTransactions = (transactions: Transaction[]) =>
  transactions.filter((record) => record.status === "posted");

export const postedPayments = (members: Member[]) =>
  members.flatMap((member) => member.payments).filter((payment) => payment.status === "posted");

export function calculateActuals({ transactions, members }: TreasuryState) {
  const validTransactions = postedTransactions(transactions);
  const transactionInflows = validTransactions
    .filter((record) => record.type === "inflow")
    .reduce((sum, record) => sum + record.amount, 0);
  const outflows = validTransactions
    .filter((record) => record.type === "outflow")
    .reduce((sum, record) => sum + record.amount, 0);
  const dues = postedPayments(members).reduce((sum, payment) => sum + payment.amount, 0);
  const inflows = transactionInflows + dues;
  return { transactionInflows, dues, inflows, outflows, net: inflows - outflows };
}

export const money = (n: number) =>
  new Intl.NumberFormat("en-BS", {
    style: "currency",
    currency: meta.currency,
    minimumFractionDigits: 2,
  }).format(n);

export const pct = (n: number) => `${Math.round(n)}%`;

export const monthIndex = (date: string | null) => {
  if (!date || date < meta.program_year_start || date > meta.program_year_end) return -1;
  const d = new Date(`${date}T12:00:00`);
  return (d.getMonth() + 6) % 12;
};

export const quarterFor = (date: string | null) => {
  const month = monthIndex(date);
  return month < 0 ? "Outside program year" : `Q${Math.floor(month / 3) + 1}`;
};

export function currentProgramYearPosition(today = new Date()) {
  const start = new Date(`${meta.program_year_start}T00:00:00`);
  const end = new Date(`${meta.program_year_end}T23:59:59`);
  const total = Math.max(1, end.getTime() - start.getTime());
  const elapsed = Math.min(total, Math.max(0, today.getTime() - start.getTime()));
  const iso = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  return {
    elapsedPct: Math.round((elapsed / total) * 100),
    quarter: quarterFor(iso),
  };
}
