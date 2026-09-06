import { describe, expect, it } from "vitest";
import { budget, monthIndex, quarterFor } from "../lib/treasury";

describe("Club 1600 program-year calculations", () => {
  it("keeps July through June in fiscal order using full dates", () => {
    expect(monthIndex("2026-07-01")).toBe(0);
    expect(monthIndex("2027-06-30")).toBe(11);
    expect(monthIndex("2026-06-30")).toBe(-1);
  });

  it("derives Club 1600 quarters from dates", () => {
    expect(quarterFor("2026-09-30")).toBe("Q1");
    expect(quarterFor("2026-10-01")).toBe("Q2");
    expect(quarterFor("2027-01-01")).toBe("Q3");
    expect(quarterFor("2027-06-30")).toBe("Q4");
    expect(quarterFor("2026-06-30")).toBe("Outside program year");
  });

  it("contains a balanced approved budget", () => {
    const sum = (type: "inflow" | "outflow") => budget.filter(line => line.type === type).reduce((total, line) => total + line.amount, 0);
    expect(sum("inflow")).toBe(69_413);
    expect(sum("outflow")).toBe(69_413);
    expect(budget).toHaveLength(51);
  });
});
