"use client";

import { useState } from "react";
import type { StackWorkflow } from "@/lib/types";
import { calculateStackCost } from "@/lib/cost-calculator";
import { detectRedundancies } from "@/lib/redundancy";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DollarSign,
  AlertTriangle,
  TrendingDown,
  Layers,
  Edit3,
  CheckCircle2,
} from "lucide-react";

interface CostCalculatorViewProps {
  workflow: StackWorkflow;
  onWorkflowChange: (newWorkflow: StackWorkflow) => void;
}

export function CostCalculatorView({
  workflow,
  onWorkflowChange,
}: CostCalculatorViewProps) {
  const costSummary = calculateStackCost(workflow);
  const redundancies = detectRedundancies(workflow);

  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  const [customPriceInput, setCustomPriceInput] = useState<string>("");

  const handleStartEditPrice = (toolId: string, currentPrice: number) => {
    setEditingToolId(toolId);
    setCustomPriceInput(currentPrice.toString());
  };

  const handleSavePrice = (toolId: string) => {
    const parsed = Number.parseFloat(customPriceInput);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      const updatedCustomPrices = {
        ...workflow.customPrices,
        [toolId]: parsed,
      };
      onWorkflowChange({
        ...workflow,
        customPrices: updatedCustomPrices,
      });
    }
    setEditingToolId(null);
  };

  const totalPotentialSavings = redundancies.reduce(
    (acc, r) => acc + r.potentialMonthlySavings,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Top Cost Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/20 bg-card">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium">
              Total Monthly Stack Cost
            </CardDescription>
            <CardTitle className="text-2xl font-bold font-mono text-primary flex items-center">
              <DollarSign className="h-5 w-5 -mr-1" />
              {costSummary.totalMonthlyCost}
              <span className="text-xs text-muted-foreground font-normal ml-1">
                /mo
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
            Estimated total software investment
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium">
              Annualized Stack Investment
            </CardDescription>
            <CardTitle className="text-2xl font-bold font-mono text-foreground flex items-center">
              <DollarSign className="h-5 w-5 -mr-1" />
              {costSummary.totalAnnualCost}
              <span className="text-xs text-muted-foreground font-normal ml-1">
                /yr
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
            12-month budget projection
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium">
              Existing vs New Stack Breakdown
            </CardDescription>
            <CardTitle className="text-lg font-bold font-mono flex items-center gap-1">
              <span className="text-emerald-600 dark:text-emerald-400">
                ${costSummary.existingMonthlyCost}
              </span>
              <span className="text-muted-foreground font-normal text-xs">
                /
              </span>
              <span className="text-primary">
                ${costSummary.newRecommendedMonthlyCost}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
            Owned tools / Recommended additions
          </CardContent>
        </Card>

        <Card
          className={`border-2 ${redundancies.length > 0 ? "border-amber-500/50 bg-amber-500/5" : "border-emerald-500/50 bg-emerald-500/5"}`}
        >
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium">
              Redundancy Savings Opportunity
            </CardDescription>
            <CardTitle
              className={`text-2xl font-bold font-mono flex items-center ${redundancies.length > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}
            >
              <DollarSign className="h-5 w-5 -mr-1" />
              {totalPotentialSavings}
              <span className="text-xs text-muted-foreground font-normal ml-1">
                /mo
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
            {redundancies.length > 0
              ? `${redundancies.length} category overlaps detected`
              : "Optimized — 0 redundancies"}
          </CardContent>
        </Card>
      </div>

      {/* Redundancy Alerts Panel */}
      {redundancies.length > 0 && (
        <Card className="border-amber-500/40 bg-amber-500/10 dark:bg-amber-950/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <CardTitle className="text-base text-amber-900 dark:text-amber-200">
                Redundant Software & Overlapping Functionality Identified (
                {redundancies.length})
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-amber-800 dark:text-amber-300">
              The calculator detected multiple subscriptions within identical
              product categories. Consolidating tools reduces cost and workflow
              fragmentation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {redundancies.map((alert) => (
              <div
                key={alert.category}
                className="p-3 bg-background/80 rounded-lg border border-amber-500/30 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-foreground flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-amber-500" />{" "}
                    {alert.category}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-amber-500 text-amber-600 font-mono"
                  >
                    Save up to ${alert.potentialMonthlySavings}/mo
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {alert.recommendation}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tool Cost Breakdown Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                Per-Tool Cost Breakdown & Custom Negotiated Pricing
              </CardTitle>
              <CardDescription className="text-xs">
                Override default market pricing with your custom contracted or
                negotiated subscription rates.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              {costSummary.toolBreakdown.length} Unique Tools
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="divide-y border rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-2 p-3 bg-muted/50 font-bold text-xs text-muted-foreground">
              <div className="col-span-4">Software Tool</div>
              <div className="col-span-3">Category</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-3 text-right">Monthly Cost</div>
            </div>

            {costSummary.toolBreakdown.map(
              ({ tool, effectiveMonthlyPrice, isCustomPrice, isExisting }) => {
                const isEditing = editingToolId === tool.id;

                return (
                  <div
                    key={tool.id}
                    className="grid grid-cols-12 gap-2 p-3 items-center text-xs hover:bg-muted/20"
                  >
                    <div className="col-span-4 font-bold flex items-center gap-1.5">
                      {tool.name}
                      {isCustomPrice && (
                        <Badge
                          variant="outline"
                          className="text-[9px] py-0 px-1 border-primary text-primary"
                        >
                          Custom Rate
                        </Badge>
                      )}
                    </div>

                    <div className="col-span-3 text-muted-foreground truncate">
                      {tool.category}
                    </div>

                    <div className="col-span-2 text-center">
                      {isExisting ? (
                        <Badge
                          variant="secondary"
                          className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        >
                          Owned
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          Recommended
                        </Badge>
                      )}
                    </div>

                    <div className="col-span-3 text-right flex items-center justify-end gap-2 font-mono">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={customPriceInput}
                            onChange={(e) =>
                              setCustomPriceInput(e.target.value)
                            }
                            className="w-20 h-7 text-xs font-mono"
                          />
                          <Button
                            size="sm"
                            className="h-7 text-[10px] px-2"
                            onClick={() => handleSavePrice(tool.id)}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="font-bold text-sm">
                            ${effectiveMonthlyPrice}/mo
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            title="Override Price"
                            onClick={() =>
                              handleStartEditPrice(
                                tool.id,
                                effectiveMonthlyPrice,
                              )
                            }
                          >
                            <Edit3 className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
