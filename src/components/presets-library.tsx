"use client";

import { GOAL_TEMPLATES } from "@/lib/catalog";
import { BusinessGoal } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Layers } from "lucide-react";

interface PresetsLibraryProps {
  onSelectGoal: (goalId: string) => void;
}

export function PresetsLibrary({ onSelectGoal }: PresetsLibraryProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold tracking-tight">
          Curated Goal Presets & Quick Launch Templates
        </h3>
        <p className="text-xs text-muted-foreground">
          Instantly generate optimized toolchains and integration maps for
          common business objectives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GOAL_TEMPLATES.map((goal) => (
          <Card
            key={goal.id}
            className="transition-all hover:border-primary/50 hover:shadow-md"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px]">
                  {goal.category}
                </Badge>
                <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  ~${goal.estimatedTotalMonthlyCost}/mo
                </div>
              </div>
              <CardTitle className="text-base mt-1">{goal.name}</CardTitle>
              <CardDescription className="text-xs line-clamp-2">
                {goal.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0 space-y-3">
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="font-semibold text-[11px] text-foreground flex items-center gap-1">
                  <Layers className="h-3 w-3 text-primary" /> Key Stack Steps (
                  {goal.stepTemplates.length}):
                </div>
                <div className="flex flex-wrap gap-1">
                  {goal.stepTemplates.map((step) => (
                    <Badge
                      key={step.stepNumber}
                      variant="secondary"
                      className="text-[10px] font-normal"
                    >
                      {step.title}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                size="sm"
                className="w-full text-xs gap-1.5 mt-2"
                onClick={() => onSelectGoal(goal.id)}
              >
                Launch This Workflow Stack{" "}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
