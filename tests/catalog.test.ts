import { describe, expect, it } from "vitest";
import { GOAL_TEMPLATES, SOFTWARE_TOOLS } from "../src/lib/catalog";

describe("Catalog Data Knowledge Base", () => {
  it("contains valid software tools with complete attributes", () => {
    expect(SOFTWARE_TOOLS.length).toBeGreaterThan(15);
    for (const tool of SOFTWARE_TOOLS) {
      expect(tool.id).toBeTruthy();
      expect(tool.name).toBeTruthy();
      expect(tool.category).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.avgMonthlyPrice).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(tool.commonIntegrations)).toBe(true);
      expect(Array.isArray(tool.capabilities)).toBe(true);
    }
  });

  it("contains valid goal templates with step definitions", () => {
    expect(GOAL_TEMPLATES.length).toBeGreaterThanOrEqual(4);
    for (const goal of GOAL_TEMPLATES) {
      expect(goal.id).toBeTruthy();
      expect(goal.name).toBeTruthy();
      expect(goal.stepTemplates.length).toBeGreaterThan(0);

      for (const step of goal.stepTemplates) {
        expect(step.stepNumber).toBeGreaterThan(0);
        expect(step.title).toBeTruthy();
        expect(step.defaultToolId).toBeTruthy();
        const defaultTool = SOFTWARE_TOOLS.find(
          (t) => t.id === step.defaultToolId,
        );
        expect(defaultTool).toBeDefined();
      }
    }
  });
});
