"use client";

import { useState } from "react";
import type { StackWorkflow } from "@/lib/types";
import { exportStackToJSON, generateShareableStateUrl } from "@/lib/export";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Copy, Check, Share2, FileCode } from "lucide-react";

interface StackExportModalProps {
  workflow: StackWorkflow;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StackExportModal({
  workflow,
  isOpen,
  onOpenChange,
}: StackExportModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const jsonContent = exportStackToJSON(workflow);
  const shareableState = generateShareableStateUrl(workflow);
  const shareableUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}?stack=${shareableState}`
      : `?stack=${shareableState}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonContent);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workflow.goal.id}-stack-spec.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Share2 className="h-5 w-5 text-primary" /> Export & Share Software
            Stack
          </DialogTitle>
          <DialogDescription className="text-xs">
            Export complete software stack specifications for{" "}
            {workflow.goal.name} or share custom state link.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Shareable State Link */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold">Shareable Stack URL</div>
            <div className="flex gap-2">
              <Input
                readOnly
                value={shareableUrl}
                className="text-xs font-mono"
              />
              <Button
                size="sm"
                onClick={handleCopyLink}
                className="gap-1 min-w-24"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Encodes goal, existing tools, and custom negotiated price
              overrides.
            </p>
          </div>

          {/* JSON Export */}
          <div className="space-y-1.5 pt-2 border-t">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold flex items-center gap-1.5">
                <FileCode className="h-4 w-4 text-primary" /> Stack
                Specification (JSON)
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyJson}
                className="text-[11px] h-6 px-2"
              >
                {copiedJson ? "Copied JSON" : "Copy JSON"}
              </Button>
            </div>
            <textarea
              readOnly
              value={jsonContent}
              rows={6}
              className="w-full text-[11px] font-mono p-2.5 rounded-md border bg-muted/50 resize-none focus:outline-hidden"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button size="sm" onClick={handleDownloadJson} className="gap-1.5">
              <Download className="h-4 w-4" /> Download JSON Spec
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
