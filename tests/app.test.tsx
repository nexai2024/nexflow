import { describe, expect, it } from "vitest";
import { GOAL_TEMPLATES } from "../src/lib/catalog";
import { generateWorkflow } from "../src/lib/engine";
import {
  exportStackToJSON,
  generateShareableStateUrl,
  parseShareableStateUrl,
} from "../src/lib/export";

describe("Stack Export & State Url Parser", () => {
  it("exports valid stack JSON with expected attributes", () => {
    const workflow = generateWorkflow(GOAL_TEMPLATES[0].id, []);
    const jsonString = exportStackToJSON(workflow);

    expect(jsonString).toBeTruthy();
    const parsed = JSON.parse(jsonString);
    expect(parsed.goal).toBe(workflow.goal.name);
    expect(parsed.totalMonthlyCost).toBeGreaterThan(0);
    expect(parsed.steps.length).toBe(workflow.steps.length);
  });

  it("encodes and restores shareable url state correctly", () => {
    const workflow = generateWorkflow(GOAL_TEMPLATES[0].id, ["descript"], {
      descript: 15,
    });
    const encoded = generateShareableStateUrl(workflow);

    expect(encoded).toBeTruthy();
    const restored = parseShareableStateUrl(encoded);

    expect(restored).not.toBeNull();
    expect(restored?.goalId).toBe(GOAL_TEMPLATES[0].id);
    expect(restored?.existingToolIds).toContain("descript");
    expect(restored?.customPrices?.descript).toBe(15);
  });
});
