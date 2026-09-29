import { describe, it, expect } from "vitest";
import { computeScore, TIE_ORDER } from "@/lib/scoring";
import { questions } from "@/config/questions";

describe("Scoring Engine (lib/scoring.ts)", () => {
  it("computes 100 total and 'The Social Natural' when all answers are max (3)", () => {
    const allMax: Record<string, string> = {};
    for (const q of questions) {
      const topOption = q.options.find((o) => o.score === 3)!;
      allMax[q.id] = topOption.id;
    }

    const result = computeScore(allMax);
    expect(result.total).toBe(100);
    expect(result.profile).toBe("The Social Natural");
    expect(result.dimensions.approach).toBe(20);
    expect(result.dimensions.conversation).toBe(20);
    expect(result.dimensions.social).toBe(20);
    expect(result.dimensions.resilience).toBe(20);
    expect(result.dimensions.presentation).toBe(20);
  });

  it("computes 0 total and 'The Hesitant' when all answers are minimum (0)", () => {
    const allZero: Record<string, string> = {};
    for (const q of questions) {
      const lowOption = q.options.find((o) => o.score === 0)!;
      allZero[q.id] = lowOption.id;
    }

    const result = computeScore(allZero);
    expect(result.total).toBe(0);
    expect(result.profile).toBe("The Hesitant");
    expect(result.dimensions.approach).toBe(0);
    expect(result.dimensions.conversation).toBe(0);
    expect(result.dimensions.social).toBe(0);
    expect(result.dimensions.resilience).toBe(0);
    expect(result.dimensions.presentation).toBe(0);
  });

  it("resolves tie-breaking according to TIE_ORDER priority", () => {
    // When all dimensions are equal, the tie break order is:
    // approach -> resilience -> conversation -> social -> presentation
    const allTwos: Record<string, string> = {};
    for (const q of questions) {
      const opt = q.options.find((o) => o.score === 2)!;
      allTwos[q.id] = opt.id;
    }

    const result = computeScore(allTwos);
    expect(result.primaryWeakness).toBe("approach");
    expect(result.secondaryWeakness).toBe("resilience");
    expect(result.reportKey).toBe("approach__resilience");
  });

  it("gracefully handles partial or invalid answers without throwing", () => {
    const result = computeScore({ q1: "a" });
    expect(result).toBeDefined();
    expect(result.total).toBeGreaterThanOrEqual(0);

    const answersWithInvalid: Record<string, string> = { q1: "invalid_id_not_found" };
    const invalidResult = computeScore(answersWithInvalid);
    expect(invalidResult).toBeDefined();
    expect(invalidResult.total).toBe(50); // fallback 10 per dimension * 5
  });

  it("correctly identifies primary and secondary weaknesses for 5 hand-crafted test personas", () => {
    // Helper to build answers where specified dimension has score `dimScore` and others have 3
    const buildPersona = (overrides: Record<string, number>): Record<string, string> => {
      const ans: Record<string, string> = {};
      for (const q of questions) {
        const targetScore = overrides[q.dimension] !== undefined ? overrides[q.dimension] : 3;
        const opt = q.options.find((o) => o.score === targetScore) || q.options[0];
        ans[q.id] = opt.id;
      }
      return ans;
    };

    // Persona 1: Weak approach (0) and weak resilience (1), strong others (3)
    const p1 = computeScore(buildPersona({ approach: 0, resilience: 1 }));
    expect(p1.primaryWeakness).toBe("approach");
    expect(p1.secondaryWeakness).toBe("resilience");
    expect(p1.reportKey).toBe("approach__resilience");

    // Persona 2: Weak conversation (0) and weak social (1), strong others (3)
    const p2 = computeScore(buildPersona({ conversation: 0, social: 1 }));
    expect(p2.primaryWeakness).toBe("conversation");
    expect(p2.secondaryWeakness).toBe("social");
    expect(p2.reportKey).toBe("conversation__social");

    // Persona 3: Weak presentation (0) and weak approach (1)
    const p3 = computeScore(buildPersona({ presentation: 0, approach: 1 }));
    expect(p3.primaryWeakness).toBe("presentation");
    expect(p3.secondaryWeakness).toBe("approach");
    expect(p3.reportKey).toBe("presentation__approach");

    // Persona 4: Weak resilience (0) and weak conversation (1)
    const p4 = computeScore(buildPersona({ resilience: 0, conversation: 1 }));
    expect(p4.primaryWeakness).toBe("resilience");
    expect(p4.secondaryWeakness).toBe("conversation");
    expect(p4.reportKey).toBe("resilience__conversation");

    // Persona 5: Weak social (0) and weak presentation (1)
    const p5 = computeScore(buildPersona({ social: 0, presentation: 1 }));
    expect(p5.primaryWeakness).toBe("social");
    expect(p5.secondaryWeakness).toBe("presentation");
    expect(p5.reportKey).toBe("social__presentation");
  });
});
