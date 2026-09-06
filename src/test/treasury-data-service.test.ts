import { describe, expect, it } from "vitest";
import { budget, calculateActuals, issues, loadTreasuryData, meta, postedPayments } from "@/services/treasuryDataService";
import { validateTemporaryCredentials } from "@/services/temporaryAuthService";

describe("Club 1600 treasury source data", () => {
  const state = loadTreasuryData();

  it("loads every supplied source record", () => {
    expect(budget).toHaveLength(51);
    expect(state.members).toHaveLength(68);
    expect(state.transactions).toHaveLength(63);
    expect(state.members.flatMap(member => member.payments)).toHaveLength(65);
    expect(issues).toHaveLength(14);
  });

  it("calculates actuals from posted records and counts dues once", () => {
    const actuals = calculateActuals(state);
    expect(postedPayments(state.members)).toHaveLength(61);
    expect(actuals.transactionInflows).toBe(13_782);
    expect(actuals.dues).toBe(14_845);
    expect(actuals.inflows).toBe(28_627);
    expect(actuals.outflows).toBeCloseTo(7_567.55, 2);
    expect(actuals.net).toBeCloseTo(21_059.45, 2);
  });

  it("excludes review records and keeps approved budget balanced", () => {
    expect(state.transactions.filter(record => record.status === "needs_review")).toHaveLength(7);
    expect(state.members.flatMap(member => member.payments).filter(payment => payment.status === "needs_review")).toHaveLength(4);
    expect(meta.approved_budgeted_inflows).toBe(69_413);
    expect(meta.approved_budgeted_outflows).toBe(69_413);
  });

  it("accepts only the temporary treasurer credentials", () => {
    expect(validateTemporaryCredentials("treasurer", "1600")).toBe(true);
    expect(validateTemporaryCredentials("treasurer", "wrong")).toBe(false);
    expect(validateTemporaryCredentials("other", "1600")).toBe(false);
  });
});
