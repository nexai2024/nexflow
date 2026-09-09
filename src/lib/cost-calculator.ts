import type { CostSummary, SoftwareTool, StackWorkflow } from "./types";

export function calculateStackCost(workflow: StackWorkflow): CostSummary {
  let totalMonthlyCost = 0;
  let existingMonthlyCost = 0;
  let newRecommendedMonthlyCost = 0;

  const toolMap = new Map<
    string,
    { tool: SoftwareTool; isExisting: boolean }
  >();

  for (const step of workflow.steps) {
    const tool = step.recommendedTool;
    const isExisting =
      step.isExistingTool || workflow.existingToolIds.includes(tool.id);
    toolMap.set(tool.id, { tool, isExisting });
  }

  const toolBreakdown = Array.from(toolMap.values()).map(
    ({ tool, isExisting }) => {
      const hasCustomPrice =
        workflow.customPrices &&
        typeof workflow.customPrices[tool.id] === "number";
      const effectiveMonthlyPrice = hasCustomPrice
        ? (workflow.customPrices[tool.id] as number)
        : tool.avgMonthlyPrice;

      totalMonthlyCost += effectiveMonthlyPrice;
      if (isExisting) {
        existingMonthlyCost += effectiveMonthlyPrice;
      } else {
        newRecommendedMonthlyCost += effectiveMonthlyPrice;
      }

      return {
        tool,
        effectiveMonthlyPrice,
        isCustomPrice: hasCustomPrice,
        isExisting,
      };
    },
  );

  const totalAnnualCost = totalMonthlyCost * 12;

  return {
    totalMonthlyCost,
    totalAnnualCost,
    existingMonthlyCost,
    newRecommendedMonthlyCost,
    potentialSavings: 0, // Computed alongside redundancy engine
    toolBreakdown,
  };
}
