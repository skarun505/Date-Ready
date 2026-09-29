import { describe, it, expect } from "vitest";
import { DIMENSIONS, Dimension } from "@/config/dimensions";
import { selectReport } from "@/lib/report-selector";
import { ScoreResult } from "@/lib/scoring";
import { bridges } from "@/config/report-content/bridges";

describe("Report Selector & 20 Combinations (lib/report-selector.ts)", () => {
  it("resolves all 20 ordered pairs of (primaryWeakness, secondaryWeakness) without missing blocks", () => {
    let combinationCount = 0;

    for (const primary of DIMENSIONS) {
      for (const secondary of DIMENSIONS) {
        if (primary === secondary) continue;

        combinationCount++;
        const key = `${primary}__${secondary}`;

        // Verify the bridge exists in the 20 bridges table
        expect(bridges[key]).toBeDefined();
        expect(bridges[key].length).toBeGreaterThan(20);

        // Construct mock score result for this pair
        const mockScoreResult: ScoreResult = {
          dimensions: {
            approach: 14,
            conversation: 14,
            social: 14,
            resilience: 14,
            presentation: 14,
          },
          rawDimensions: { approach: 0, conversation: 0, social: 0, resilience: 0, presentation: 0 },
          maxDimensions: { approach: 0, conversation: 0, social: 0, resilience: 0, presentation: 0 },
          total: 70,
          profile: "The Confident",
          primaryWeakness: primary,
          secondaryWeakness: secondary,
          strengths: DIMENSIONS.filter((d) => d !== primary && d !== secondary).slice(0, 2),
          reportKey: key,
          totalAnswered: 12,
        };

        const report = selectReport(mockScoreResult);

        // Assert report key and integrity
        expect(report.reportKey).toBe(key);
        expect(report.primary.title).toBeDefined();
        expect(report.primary.whatItLooksLike).toBeDefined();
        expect(report.primary.exercises).toHaveLength(3);
        expect(report.primary.plan7day).toHaveLength(7);

        // Assert secondary block integrity
        expect(report.secondary.title).toBeDefined();
        expect(report.secondary.exercise.name).toBeDefined();
        expect(report.secondary.keyTip).toBeDefined();

        // Assert bridge & strengths
        expect(report.bridge).toBe(bridges[key]);
        expect(report.strengths).toHaveLength(2);
        expect(report.profile.name).toBe("The Confident");
      }
    }

    expect(combinationCount).toBe(20);
  });
});
