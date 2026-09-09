import { GOAL_TEMPLATES, SOFTWARE_TOOLS } from "./catalog";
import type {
  BusinessGoal,
  SoftwareTool,
  StackWorkflow,
  WorkflowStep,
} from "./types";

export function getToolById(id: string): SoftwareTool | undefined {
  return SOFTWARE_TOOLS.find((t) => t.id.toLowerCase() === id.toLowerCase());
}

export function searchTools(query: string): SoftwareTool[] {
  if (!query.trim()) return SOFTWARE_TOOLS;
  const q = query.toLowerCase();
  return SOFTWARE_TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.capabilities.some((c) => c.toLowerCase().includes(q)),
  );
}

export function generateWorkflow(
  goalOrId: string | BusinessGoal,
  existingToolIds: string[] = [],
  customPrices: Record<string, number> = {},
): StackWorkflow {
  const goal =
    typeof goalOrId === "string"
      ? GOAL_TEMPLATES.find((g) => g.id === goalOrId) || GOAL_TEMPLATES[0]
      : goalOrId;

  const steps: WorkflowStep[] = goal.stepTemplates.map((template) => {
    // 1. Check if any existing tool matches the preferred category or capability
    const matchingExistingTool = existingToolIds
      .map((id) => getToolById(id))
      .filter((t): t is SoftwareTool => t !== undefined)
      .find((t) => t.category === template.preferredCategory);

    // 2. Default recommended tool
    const defaultTool =
      getToolById(template.defaultToolId) || SOFTWARE_TOOLS[0];

    const recommendedTool = matchingExistingTool || defaultTool;
    const isExistingTool = existingToolIds.includes(recommendedTool.id);

    // 3. Alternative tools in the same category or explicit alternative ids
    const alternativeTools = SOFTWARE_TOOLS.filter(
      (t) =>
        t.id !== recommendedTool.id &&
        (template.alternativeToolIds.includes(t.id) ||
          t.category === template.preferredCategory),
    );

    let notes = `Recommended based on ${template.preferredCategory} suitability.`;
    if (matchingExistingTool) {
      notes = `Selected because you already use ${matchingExistingTool.name} for ${template.preferredCategory}.`;
    }

    return {
      id: `step-${template.stepNumber}-${goal.id}`,
      stepNumber: template.stepNumber,
      title: template.title,
      description: template.description,
      recommendedTool,
      alternativeTools,
      selectedToolId: recommendedTool.id,
      isExistingTool,
      notes,
    };
  });

  return {
    id: `wf-${Date.now()}`,
    goal,
    steps,
    existingToolIds,
    customPrices,
    createdAt: new Date().toISOString(),
  };
}

export function swapStepTool(
  workflow: StackWorkflow,
  stepId: string,
  newToolId: string,
): StackWorkflow {
  const newTool = getToolById(newToolId);
  if (!newTool) return workflow;

  const updatedSteps = workflow.steps.map((step) => {
    if (step.id !== stepId) return step;

    const isExistingTool = workflow.existingToolIds.includes(newToolId);
    const updatedAlternatives = SOFTWARE_TOOLS.filter(
      (t) => t.id !== newTool.id && t.category === newTool.category,
    );

    return {
      ...step,
      recommendedTool: newTool,
      selectedToolId: newTool.id,
      isExistingTool,
      alternativeTools: updatedAlternatives,
      notes: `Customized: User selected ${newTool.name}.`,
    };
  });

  return {
    ...workflow,
    steps: updatedSteps,
  };
}

export function addCustomStep(
  workflow: StackWorkflow,
  title: string,
  description: string,
  toolId: string,
): StackWorkflow {
  const tool = getToolById(toolId) || SOFTWARE_TOOLS[0];
  const newStepNumber = workflow.steps.length + 1;

  const newStep: WorkflowStep = {
    id: `step-${newStepNumber}-custom-${Date.now()}`,
    stepNumber: newStepNumber,
    title: title || `Step ${newStepNumber}`,
    description: description || `Custom workflow step using ${tool.name}`,
    recommendedTool: tool,
    alternativeTools: SOFTWARE_TOOLS.filter(
      (t) => t.id !== tool.id && t.category === tool.category,
    ),
    selectedToolId: tool.id,
    isExistingTool: workflow.existingToolIds.includes(tool.id),
    notes: "Custom added step.",
  };

  return {
    ...workflow,
    steps: [...workflow.steps, newStep],
  };
}
