"use client";

import { useState } from "react";
import { SoftwareTool, type StackWorkflow, type WorkflowStep } from "@/lib/types";
import { swapStepTool } from "@/lib/engine";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  CheckCircle2,
  Link2,
  ExternalLink,
  Zap,
  AlertCircle,
  Info,
} from "lucide-react";

interface VisualMapperProps {
  workflow: StackWorkflow;
  onWorkflowChange: (newWorkflow: StackWorkflow) => void;
}

export function VisualMapper({
  workflow,
  onWorkflowChange,
}: VisualMapperProps) {
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);

  if (!workflow || workflow.steps.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed">
        <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
        <CardTitle className="text-lg">No Workflow Steps Found</CardTitle>
        <CardDescription>
          Select a business goal to generate a visual workflow diagram.
        </CardDescription>
      </Card>
    );
  }

  const checkIntegration = (stepA: WorkflowStep, stepB: WorkflowStep) => {
    const toolA = stepA.recommendedTool;
    const toolB = stepB.recommendedTool;

    const direct =
      toolA.commonIntegrations.some(
        (i) =>
          i.toLowerCase().includes(toolB.id) ||
          i.toLowerCase().includes(toolB.name.toLowerCase()),
      ) ||
      toolB.commonIntegrations.some(
        (i) =>
          i.toLowerCase().includes(toolA.id) ||
          i.toLowerCase().includes(toolA.name.toLowerCase()),
      );

    if (direct) {
      return {
        type: "direct",
        label: "Native Integration",
        color:
          "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
      };
    }

    const usesAutomationTool =
      toolA.category.includes("Automation") ||
      toolB.category.includes("Automation");
    if (usesAutomationTool) {
      return {
        type: "ipaas",
        label: "Automated iPaaS Sync",
        color:
          "border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
      };
    }

    return {
      type: "zapier",
      label: "Supported via Zapier / Webhooks",
      color:
        "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    };
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-muted/20">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" /> Visual Toolchain &
                Integration Map
              </CardTitle>
              <CardDescription>
                Interactive flow of data and tool connections for{" "}
                {workflow.goal.name}. Click any tool node to view integration
                specs.
              </CardDescription>
            </div>
            <div className="flex gap-2 text-xs">
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
              >
                Native Sync
              </Badge>
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300"
              >
                Zapier / Webhook
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {/* Visual Diagram Node Container */}
          <div className="flex flex-col space-y-4 items-center">
            {workflow.steps.map((step, index) => {
              const tool = step.recommendedTool;
              const isLast = index === workflow.steps.length - 1;
              const nextStep = !isLast ? workflow.steps[index + 1] : null;
              const conn = nextStep ? checkIntegration(step, nextStep) : null;

              return (
                <div
                  key={step.id}
                  className="w-full flex flex-col items-center"
                >
                  {/* Node Card */}
                  <div
                    tabIndex={0}
                    role="button"
                    aria-label={`Inspect ${tool.name} for step ${step.stepNumber}: ${step.title}`}
                    onClick={() => setSelectedStep(step)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedStep(step);
                      }
                    }}
                    className="w-full max-w-2xl bg-card border rounded-xl p-4 shadow-xs transition-all hover:border-primary hover:shadow-md cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary font-bold text-sm">
                          {step.stepNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base">{tool.name}</h4>
                            {step.isExistingTool && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              >
                                Existing Tool
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground font-medium">
                            {step.title}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          ${tool.avgMonthlyPrice}/mo
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          {tool.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-muted-foreground border-t pt-2 flex items-center justify-between">
                      <span className="truncate max-w-xs">
                        {tool.description}
                      </span>
                      <span className="text-primary font-medium flex items-center gap-1 hover:underline text-[11px]">
                        Inspect Specs <Info className="h-3 w-3" />
                      </span>
                    </div>
                  </div>

                  {/* Connector Arrow */}
                  {conn && (
                    <div className="flex flex-col items-center my-2 group">
                      <div className="h-4 w-0.5 bg-border group-hover:bg-primary transition-colors" />
                      <Badge
                        variant="outline"
                        className={`text-[10px] py-0.5 px-2.5 font-mono shadow-2xs border ${conn.color}`}
                      >
                        <Zap className="h-3 w-3 mr-1 inline-block" />{" "}
                        {conn.label}
                      </Badge>
                      <div className="h-4 w-0.5 bg-border group-hover:bg-primary transition-colors" />
                      <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detail Specs Dialog */}
      {selectedStep && (
        <Dialog
          open={!!selectedStep}
          onOpenChange={(open) => !open && setSelectedStep(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="font-mono text-xs">
                  Step {selectedStep.stepNumber}
                </Badge>
                <Badge variant="outline">
                  {selectedStep.recommendedTool.category}
                </Badge>
              </div>
              <DialogTitle className="text-2xl mt-1">
                {selectedStep.recommendedTool.name}
              </DialogTitle>
              <DialogDescription>
                {selectedStep.recommendedTool.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/40 rounded-lg">
                <div>
                  <div className="text-xs text-muted-foreground">
                    Estimated Pricing
                  </div>
                  <div className="font-bold text-base font-mono">
                    ${selectedStep.recommendedTool.avgMonthlyPrice}/mo
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {selectedStep.recommendedTool.pricingTierSummary}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Ownership Status
                  </div>
                  <div className="font-medium mt-1">
                    {selectedStep.isExistingTool ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5" /> In Your
                        Existing Stack
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        Recommended New Addition
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold text-xs mb-1.5">
                  Core Capabilities
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStep.recommendedTool.capabilities.map((cap) => (
                    <Badge
                      key={cap}
                      variant="secondary"
                      className="text-[11px] font-mono"
                    >
                      {cap}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold text-xs mb-1.5">
                  Native Integration Connectors
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStep.recommendedTool.commonIntegrations.map(
                    (integ) => (
                      <Badge
                        key={integ}
                        variant="outline"
                        className="text-[11px]"
                      >
                        {integ}
                      </Badge>
                    ),
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center border-t">
                <a
                  href={selectedStep.recommendedTool.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                >
                  Visit Official Website <ExternalLink className="h-3 w-3" />
                </a>
                <Button size="sm" onClick={() => setSelectedStep(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
