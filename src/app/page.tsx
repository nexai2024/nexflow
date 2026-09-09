"use client";

import { useEffect, useState } from "react";
import { GOAL_TEMPLATES } from "@/lib/catalog";
import { generateWorkflow } from "@/lib/engine";
import { parseShareableStateUrl } from "@/lib/export";
import type { StackWorkflow } from "@/lib/types";
import { WorkflowBuilder } from "@/components/workflow-builder";
import { VisualMapper } from "@/components/visual-mapper";
import { CostCalculatorView } from "@/components/cost-calculator-view";
import { PresetsLibrary } from "@/components/presets-library";
import { StackExportModal } from "@/components/stack-export-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  Workflow,
  DollarSign,
  Share2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function Home() {
  const [workflow, setWorkflow] = useState<StackWorkflow>(() =>
    generateWorkflow(GOAL_TEMPLATES[0].id, []),
  );
  const [activeTab, setActiveTab] = useState<string>("builder");
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Restore state from URL query parameter if present
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const stackQuery = urlParams.get("stack");
    if (stackQuery) {
      const parsed = parseShareableStateUrl(stackQuery);
      if (parsed?.goalId) {
        const restored = generateWorkflow(
          parsed.goalId,
          parsed.existingToolIds || [],
          parsed.customPrices || {},
        );
        setWorkflow(restored);
      }
    }
  }, []);

  const handleSelectGoalFromPresets = (goalId: string) => {
    const updated = generateWorkflow(
      goalId,
      workflow.existingToolIds,
      workflow.customPrices,
    );
    setWorkflow(updated);
    setActiveTab("builder");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header Bar */}
      <header className="border-b bg-card/80 backdrop-blur-xs sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-lg shadow-sm">
              N
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight leading-none flex items-center gap-2">
                NexFlow{" "}
                <Badge
                  variant="secondary"
                  className="text-[10px] font-mono font-normal"
                >
                  v1.0
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                AI-Powered Software Stack Builder & Workflow Integration Mapper
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs"
              onClick={() => setIsExportOpen(true)}
            >
              <Share2 className="h-3.5 w-3.5 text-primary" /> Export Stack
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Navigation Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="builder" className="text-xs gap-1.5">
              <Workflow className="h-3.5 w-3.5" /> Builder
            </TabsTrigger>
            <TabsTrigger value="visual" className="text-xs gap-1.5">
              <Layers className="h-3.5 w-3.5" /> Integration Map
            </TabsTrigger>
            <TabsTrigger value="cost" className="text-xs gap-1.5">
              <DollarSign className="h-3.5 w-3.5" /> Cost & Redundancy
            </TabsTrigger>
            <TabsTrigger value="presets" className="text-xs gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Presets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder">
            <WorkflowBuilder
              workflow={workflow}
              onWorkflowChange={setWorkflow}
            />
          </TabsContent>

          <TabsContent value="visual">
            <VisualMapper workflow={workflow} onWorkflowChange={setWorkflow} />
          </TabsContent>

          <TabsContent value="cost">
            <CostCalculatorView
              workflow={workflow}
              onWorkflowChange={setWorkflow}
            />
          </TabsContent>

          <TabsContent value="presets">
            <PresetsLibrary onSelectGoal={handleSelectGoalFromPresets} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Export Modal */}
      <StackExportModal
        workflow={workflow}
        isOpen={isExportOpen}
        onOpenChange={setIsExportOpen}
      />

      {/* Footer */}
      <footer className="border-t py-6 bg-card text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>
              NexFlow Local-First Architecture — 100% Client-Side Privacy &
              Deterministic Stack Generation
            </span>
          </div>
          <div>© 2026 NexFlow Stack Builder</div>
        </div>
      </footer>
    </div>
  );
}
