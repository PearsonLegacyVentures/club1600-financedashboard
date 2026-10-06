import { describe, expect, it } from "vitest";
import {
  budget,
  calculateActuals,
  issues,
  loadTreasuryData,
  meta,
  postedPayments,
} from "@/services/treasuryDataService";

describe("Club 1600 treasury data layer", () => {
  it("loads the approved 2026/2027 budget from the Google Sheet snapshot", () => {
    expect(budget).toHaveLength(51);
    expect(meta.approved_budgeted_inflows).toBe(69_413);
    expect(meta.approved_budgeted_outflows).toBe(69_413);
    expect(issues).toHaveLength(10);
  });

  it("loads the current Google Sheet snapshot into the treasury app", () => {
    localStorage.clear();
    const state = loadTreasuryData();

    expect(state.members).toHaveLength(91);
    expect(state.transactions).toHaveLength(121);
    expect(postedPayments(state.members)).toHaveLength(79);

    const actuals = calculateActuals(state);
    expect(actuals.transactionInflows).toBeCloseTo(14_782, 2);
    expect(actuals.dues).toBeCloseTo(18_945, 2);
    expect(actuals.inflows).toBeCloseTo(33_727, 2);
    expect(actuals.outflows).toBeCloseTo(19_689.86, 2);
    expect(actuals.net).toBeCloseTo(14_037.14, 2);
  });

  it("excludes source records marked needs_review from live totals", () => {
    localStorage.clear();
    const state = loadTreasuryData();
    expect(state.transactions.filter((record) => record.status === "needs_review")).toHaveLength(5);
    expect(state.members.flatMap((member) => member.payments).filter((payment) => payment.status === "needs_review")).toHaveLength(5);
  });
});
