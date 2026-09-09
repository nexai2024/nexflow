import { describe, expect, it } from "vitest";
import { GOAL_TEMPLATES } from "../src/lib/catalog";
import { calculateStackCost } from "../src/lib/cost-calculator";
import { generateWorkflow } from "../src/lib/engine";
import { detectRedundancies } from "../src/lib/redundancy";

describe("Cost Calculator & Redundancy Engine", () => {
  it("calculates monthly and annual stack costs correctly", () => {
    const workflow = generateWorkflow(GOAL_TEMPLATES[0].id, []);
    const costSummary = calculateStackCost(workflow);

    expect(costSummary.totalMonthlyCost).toBeGreaterThan(0);
    expect(costSummary.totalAnnualCost).toBe(costSummary.totalMonthlyCost * 12);
    expect(costSummary.toolBreakdown.length).toBeGreaterThan(0);
  });

  it("respects custom negotiated price overrides", () => {
    const workflow = generateWorkflow(GOAL_TEMPLATES[0].id, []);
    const firstToolId = workflow.steps[0].recommendedTool.id;

    const customWorkflow = {
      ...workflow,
      customPrices: {
        [firstToolId]: 5, // Override to $5/mo
      },
    };

    const costSummary = calculateStackCost(customWorkflow);
    const item = costSummary.toolBreakdown.find(
      (b) => b.tool.id === firstToolId,
    );

    expect(item?.effectiveMonthlyPrice).toBe(5);
    expect(item?.isCustomPrice).toBe(true);
  });

  it("detects redundant tools in identical product categories", () => {
    // User already owns Descript, but goal adds Buzzsprout AND Descript in audio category
    const goal = GOAL_TEMPLATES[0]; // Podcast launch
    const existingToolIds = ["descript", "buzzsprout"];

    const workflow = generateWorkflow(goal.id, existingToolIds);
    const redundancies = detectRedundancies(workflow);

    expect(redundancies.length).toBeGreaterThan(0);
    const audioRedundancy = redundancies.find(
      (r) => r.category === "Audio Editing & Hosting",
    );
    expect(audioRedundancy).toBeDefined();
    expect(audioRedundancy?.tools.length).toBeGreaterThanOrEqual(2);
    expect(audioRedundancy?.potentialMonthlySavings).toBeGreaterThan(0);
  });
});
