import { describe, expect, it } from "vitest";
import {
  budget,
  calculateActuals,
  issues,
  loadTreasuryData,
  meta,
  postedPayments,
} from "@/services/treasuryDataService";
import { validateTemporaryCredentials } from "@/services/temporaryAuthService";

describe("Club 1600 treasury data layer", () => {
  it("keeps the approved budget available as a non-sensitive fallback", () => {
    expect(budget).toHaveLength(51);
    expect(meta.approved_budgeted_inflows).toBe(69_413);
    expect(meta.approved_budgeted_outflows).toBe(69_413);
    expect(issues).toHaveLength(0);
  });

  it("does not bundle member or transaction records into the public client", () => {
    localStorage.clear();
    const state = loadTreasuryData();
    expect(state.members).toHaveLength(0);
    expect(state.transactions).toHaveLength(0);
    expect(postedPayments(state.members)).toHaveLength(0);
    expect(calculateActuals(state)).toEqual({
      transactionInflows: 0,
      dues: 0,
      inflows: 0,
      outflows: 0,
      net: 0,
    });
  });

  it("retains the requested local development credentials", () => {
    expect(validateTemporaryCredentials("amar", "100in100")).toBe(true);
    expect(validateTemporaryCredentials("amar", "wrong")).toBe(false);
    expect(validateTemporaryCredentials("other", "100in100")).toBe(false);
  });
});
