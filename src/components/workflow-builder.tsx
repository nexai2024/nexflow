"use client";

import { useState } from "react";
import { GOAL_TEMPLATES, SOFTWARE_TOOLS } from "@/lib/catalog";
import { BusinessGoal, SoftwareTool, type StackWorkflow } from "@/lib/types";
import { addCustomStep, generateWorkflow, swapStepTool } from "@/lib/engine";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Plus,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface WorkflowBuilderProps {
  workflow: StackWorkflow;
  onWorkflowChange: (newWorkflow: StackWorkflow) => void;
}

export function WorkflowBuilder({
  workflow,
  onWorkflowChange,
}: WorkflowBuilderProps) {
  const [selectedGoalId, setSelectedGoalId] = useState<string>(
    workflow.goal.id,
  );
  const [existingToolIds, setExistingToolIds] = useState<string[]>(
    workflow.existingToolIds,
  );
  const [isAddStepOpen, setIsAddStepOpen] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState("");
  const [newStepDesc, setNewStepDesc] = useState("");
  const [newStepToolId, setNewStepToolId] = useState(SOFTWARE_TOOLS[0].id);

  const handleGoalChange = (goalId: string) => {
    setSelectedGoalId(goalId);
    const updated = generateWorkflow(
      goalId,
      existingToolIds,
      workflow.customPrices,
    );
    onWorkflowChange(updated);
  };

  const handleExistingToolToggle = (toolId: string) => {
    const nextExisting = existingToolIds.includes(toolId)
      ? existingToolIds.filter((id) => id !== toolId)
      : [...existingToolIds, toolId];

    setExistingToolIds(nextExisting);
    const updated = generateWorkflow(
      selectedGoalId,
      nextExisting,
      workflow.customPrices,
    );
    onWorkflowChange(updated);
  };

  const handleToolSwap = (stepId: string, toolId: string) => {
    const updated = swapStepTool(workflow, stepId, toolId);
    onWorkflowChange(updated);
  };

  const handleAddCustomStep = () => {
    if (!newStepTitle.trim()) return;
    const updated = addCustomStep(
      workflow,
      newStepTitle,
      newStepDesc,
      newStepToolId,
    );
    onWorkflowChange(updated);
    setNewStepTitle("");
    setNewStepDesc("");
    setIsAddStepOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Goal & Stack Input Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-background via-muted/30 to-background shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">
                Workflow Goal & Existing Stack Configuration
              </CardTitle>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {workflow.steps.length} Steps Active
            </Badge>
          </div>
          <CardDescription>
            Select your target business goal and check any tools you currently
            pay for or use. The engine will tailor compatibility and flag
            redundancies.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Goal Selector */}
            <div className="space-y-2">
              <Label className="font-semibold text-sm">
                Target Business Objective
              </Label>
              <Select value={selectedGoalId} onValueChange={handleGoalChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select business goal" />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_TEMPLATES.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.name} ({goal.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {workflow.goal.description}
              </p>
            </div>

            {/* Existing Tools Selector */}
            <div className="space-y-2">
              <Label className="font-semibold text-sm">
                Your Existing Tech Stack ({existingToolIds.length} Selected)
              </Label>
              <div className="max-h-36 overflow-y-auto border rounded-md p-3 space-y-2 bg-background/50">
                {SOFTWARE_TOOLS.map((tool) => {
                  const isChecked = existingToolIds.includes(tool.id);
                  return (
                    <div
                      key={tool.id}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <Checkbox
                        id={`existing-${tool.id}`}
                        checked={isChecked}
                        onCheckedChange={() =>
                          handleExistingToolToggle(tool.id)
                        }
                      />
                      <label
                        htmlFor={`existing-${tool.id}`}
                        className="flex-1 text-xs font-medium leading-none cursor-pointer flex justify-between items-center"
                      >
                        <span>{tool.name}</span>
                        <span className="text-muted-foreground text-[10px]">
                          {tool.category}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Workflow Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight">
              Tailored Workflow & Recommended Toolchain
            </h3>
            <p className="text-xs text-muted-foreground">
              Step-by-step software tools mapped for {workflow.goal.name}
            </p>
          </div>

          <Dialog open={isAddStepOpen} onOpenChange={setIsAddStepOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Plus className="h-4 w-4" /> Add Custom Step
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Workflow Step</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label>Step Title</Label>
                  <Input
                    placeholder="e.g. Social Media Scheduling"
                    value={newStepTitle}
                    onChange={(e) => setNewStepTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Step Description</Label>
                  <Input
                    placeholder="Describe what this step accomplishes..."
                    value={newStepDesc}
                    onChange={(e) => setNewStepDesc(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Recommended Tool</Label>
                  <Select
                    value={newStepToolId}
                    onValueChange={setNewStepToolId}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SOFTWARE_TOOLS.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name} ({t.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddCustomStep} className="w-full">
                  Add Step To Workflow
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {workflow.steps.map((step) => {
            const currentTool = step.recommendedTool;

            return (
              <Card
                key={step.id}
                className="relative overflow-hidden transition-all hover:border-primary/40"
              >
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono text-xs">
                        Step {step.stepNumber}
                      </Badge>
                      <h4 className="font-semibold text-base">{step.title}</h4>
                      {step.isExistingTool && (
                        <Badge
                          variant="default"
                          className="bg-emerald-600 text-white gap-1 text-[11px]"
                        >
                          <CheckCircle2 className="h-3 w-3" /> Already Owned
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                    <p className="text-[11px] text-primary/80 italic">
                      {step.notes}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4">
                    <div className="text-right space-y-0.5">
                      <div className="font-bold text-sm flex items-center justify-end gap-1.5">
                        {currentTool.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {currentTool.category}
                      </div>
                      <div className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
                        ${currentTool.avgMonthlyPrice}/mo
                      </div>
                    </div>

                    {/* Swap Tool Dropdown */}
                    <Select
                      value={currentTool.id}
                      onValueChange={(val) => handleToolSwap(step.id, val)}
                    >
                      <SelectTrigger className="w-28 text-xs h-8">
                        <RefreshCw className="h-3 w-3 mr-1" /> Swap
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={currentTool.id}>
                          {currentTool.name} (Current)
                        </SelectItem>
                        {step.alternativeTools.map((alt) => (
                          <SelectItem key={alt.id} value={alt.id}>
                            {alt.name} (${alt.avgMonthlyPrice}/mo)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
