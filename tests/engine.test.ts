import { describe, expect, it } from "vitest";
import { GOAL_TEMPLATES, SOFTWARE_TOOLS } from "../src/lib/catalog";
import {
  addCustomStep,
  generateWorkflow,
  getToolById,
  searchTools,
  swapStepTool,
} from "../src/lib/engine";

describe("Workflow Recommendation Engine", () => {
  it("retrieves tools by id and searches by query", () => {
    const shopify = getToolById("shopify");
    expect(shopify).toBeDefined();
    expect(shopify?.name).toBe("Shopify");

    const searchResults = searchTools("payment");
    expect(
      searchResults.some((t) => t.id === "stripe" || t.id === "paypal"),
    ).toBe(true);
  });

  it("generates a multi-step workflow from a goal template", () => {
    const goal = GOAL_TEMPLATES[0]; // Podcast launch
    const workflow = generateWorkflow(goal.id, []);

    expect(workflow.goal.id).toBe(goal.id);
    expect(workflow.steps.length).toBe(goal.stepTemplates.length);
    expect(workflow.steps[0].recommendedTool).toBeDefined();
    expect(workflow.steps[0].selectedToolId).toBe(
      workflow.steps[0].recommendedTool.id,
    );
  });

  it("prioritizes user existing tools if available in matching category", () => {
    const goal = GOAL_TEMPLATES[1]; // E-commerce store (uses Shopify by default for step 1)
    const existingTools = ["woocommerce"]; // User already owns WooCommerce

    const workflow = generateWorkflow(goal.id, existingTools);
    const step1 = workflow.steps[0];

    expect(step1.recommendedTool.id).toBe("woocommerce");
    expect(step1.isExistingTool).toBe(true);
    expect(step1.notes).toContain("already use WooCommerce");
  });

  it("allows swapping a tool in a workflow step", () => {
    const goal = GOAL_TEMPLATES[0];
    const workflow = generateWorkflow(goal.id, []);
    const step1Id = workflow.steps[0].id;

    const updatedWorkflow = swapStepTool(workflow, step1Id, "descript");
    expect(updatedWorkflow.steps[0].selectedToolId).toBe("descript");
    expect(updatedWorkflow.steps[0].recommendedTool.name).toBe("Descript");
  });

  it("allows adding a custom step to the workflow", () => {
    const goal = GOAL_TEMPLATES[0];
    const initialWorkflow = generateWorkflow(goal.id, []);
    const initialCount = initialWorkflow.steps.length;

    const updatedWorkflow = addCustomStep(
      initialWorkflow,
      "Social Media Scheduling",
      "Automate social post queues",
      "canva",
    );

    expect(updatedWorkflow.steps.length).toBe(initialCount + 1);
    const lastStep = updatedWorkflow.steps[updatedWorkflow.steps.length - 1];
    expect(lastStep.title).toBe("Social Media Scheduling");
    expect(lastStep.recommendedTool.id).toBe("canva");
  });
});
