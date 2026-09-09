import { describe, expect, it } from "vitest";
import { GOAL_TEMPLATES } from "../src/lib/catalog";
import { generateWorkflow } from "../src/lib/engine";

describe("VisualMapper Flow Logic", () => {
  it("generates workflow steps suitable for visual diagram mapping", () => {
    const workflow = generateWorkflow(GOAL_TEMPLATES[0].id, []);
    expect(workflow.steps.length).toBeGreaterThan(0);
    for (const step of workflow.steps) {
      expect(step.recommendedTool.name).toBeTruthy();
      expect(step.recommendedTool.category).toBeTruthy();
    }
  });
});
