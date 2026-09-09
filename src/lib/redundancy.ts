import type {
  RedundancyAlert,
  SoftwareCategory,
  SoftwareTool,
  StackWorkflow,
} from "./types";
import { getToolById } from "./engine";

export function detectRedundancies(workflow: StackWorkflow): RedundancyAlert[] {
  const alerts: RedundancyAlert[] = [];

  // Gather all unique tools across existing stack and workflow steps
  const allToolsMap = new Map<string, SoftwareTool>();

  for (const id of workflow.existingToolIds) {
    const t = getToolById(id);
    if (t) allToolsMap.set(t.id, t);
  }

  for (const step of workflow.steps) {
    const t = step.recommendedTool;
    allToolsMap.set(t.id, t);
  }

  // Group tools by category
  const categoryGroups = new Map<SoftwareCategory, SoftwareTool[]>();

  for (const tool of allToolsMap.values()) {
    const current = categoryGroups.get(tool.category) || [];
    categoryGroups.set(tool.category, [...current, tool]);
  }

  // Detect any category with >= 2 tools
  for (const [category, tools] of categoryGroups.entries()) {
    if (tools.length >= 2) {
      // Calculate potential savings if user consolidates to a single primary tool
      const sortedByPrice = [...tools].sort(
        (a, b) => b.avgMonthlyPrice - a.avgMonthlyPrice,
      );
      const duplicateTools = sortedByPrice.slice(1);
      const potentialMonthlySavings = duplicateTools.reduce((acc, t) => {
        const customPrice = workflow.customPrices?.[t.id];
        return (
          acc +
          (typeof customPrice === "number" ? customPrice : t.avgMonthlyPrice)
        );
      }, 0);

      const toolNames = tools.map((t) => t.name).join(" and ");
      alerts.push({
        category,
        tools,
        potentialMonthlySavings,
        recommendation: `You are currently paying for multiple tools in ${category} (${toolNames}). Consolidating to ${sortedByPrice[0].name} could save up to $${potentialMonthlySavings}/mo ($${potentialMonthlySavings * 12}/yr).`,
      });
    }
  }

  return alerts;
}
