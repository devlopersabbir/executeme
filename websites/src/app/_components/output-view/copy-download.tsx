"use client";

import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { ExecutionProps } from "./result-sections";
import { toast } from "sonner";

export default function CopyDownload({ executionResult }: ExecutionProps) {
  const copyOutput = () => {
    try {
      navigator.clipboard.writeText(executionResult.results.output);
      toast.success("Output is perfectly copy to your clipboard", {
        action: {
          label: "Undo",
          onClick: () => navigator.clipboard.writeText(""),
        },
      });
    } catch {
      toast.error("Failed to copy text", {
        description: `Please try again or copy manually.`,
        action: {
          label: "Retry",
          onClick: copyOutput,
        },
      });
    }
  };
  const downloadOutput = () => {
    const blob = new Blob([executionResult.results.output], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `executeme_output_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={copyOutput}
        disabled={!executionResult.results.output}
        className="text-gray-400 hover:text-white hover:bg-gray-700"
      >
        <Copy className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={downloadOutput}
        disabled={!executionResult.results.output}
        className="text-gray-400 hover:text-white hover:bg-gray-700"
      >
        <Download className="w-4 h-4" />
      </Button>
    </div>
  );
}
