import type { StackWorkflow } from "./types";
import { calculateStackCost } from "./cost-calculator";

export function exportStackToJSON(workflow: StackWorkflow): string {
  const cost = calculateStackCost(workflow);
  const data = {
    exportedAt: new Date().toISOString(),
    goal: workflow.goal.name,
    category: workflow.goal.category,
    totalMonthlyCost: cost.totalMonthlyCost,
    totalAnnualCost: cost.totalAnnualCost,
    existingMonthlyCost: cost.existingMonthlyCost,
    newRecommendedMonthlyCost: cost.newRecommendedMonthlyCost,
    steps: workflow.steps.map((s) => ({
      stepNumber: s.stepNumber,
      title: s.title,
      tool: s.recommendedTool.name,
      category: s.recommendedTool.category,
      monthlyPrice: s.recommendedTool.avgMonthlyPrice,
      isExisting: s.isExistingTool,
      website: s.recommendedTool.websiteUrl,
    })),
  };
  return JSON.stringify(data, null, 2);
}

export function generateShareableStateUrl(workflow: StackWorkflow): string {
  const stateObj = {
    g: workflow.goal.id,
    e: workflow.existingToolIds,
    cp: workflow.customPrices,
  };

  try {
    const encoded = btoa(JSON.stringify(stateObj));
    return encoded;
  } catch (_e) {
    return "";
  }
}

export function parseShareableStateUrl(encodedState: string): {
  goalId?: string;
  existingToolIds?: string[];
  customPrices?: Record<string, number>;
} | null {
  try {
    const decoded = atob(encodedState);
    const parsed = JSON.parse(decoded);
    return {
      goalId: parsed.g,
      existingToolIds: Array.isArray(parsed.e) ? parsed.e : [],
      customPrices: typeof parsed.cp === "object" ? parsed.cp : {},
    };
  } catch (_e) {
    return null;
  }
}
