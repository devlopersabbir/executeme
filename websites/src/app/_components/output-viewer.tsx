"use client";

import { Editor } from "@monaco-editor/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Terminal } from "lucide-react";
import { Language, Status } from "@/@types";
import { outputEditorOptions } from "@/constants"; // Assuming editorOptions are general

interface OutputViewerProps {
  output: string;
  language: Language; // Keep this, useful for potential syntax highlighting of error logs if needed
  executionTime?: number;
  status: Status;
}

export function OutputViewer({
  output,
  executionTime,
  status,
}: OutputViewerProps) {
  const copyOutput = () => {
    try {
      navigator.clipboard.writeText(output);
      console.log("Output copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: "text/plain" });
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
    <Card className="overflow-hidden bg-gray-900 border-none p-0">
      <CardContent className="p-0">
        {/* Top bar for output controls - now dark */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-gray-400" />{" "}
            {/* Adjusted icon color */}
            <span className="text-sm font-medium text-gray-300">
              Output
            </span>{" "}
            {/* Adjusted text color */}
            {executionTime !== undefined && ( // Check for undefined instead of truthiness to allow 0ms
              <Badge
                variant="outline"
                className="text-xs bg-gray-700 text-gray-200 border-gray-600"
              >
                {executionTime.toFixed(0)}ms
              </Badge>
            )}
            <Badge
              variant={
                status === "success"
                  ? "default"
                  : status === "error"
                  ? "destructive"
                  : "secondary"
              }
              className="text-xs"
            >
              {status}
            </Badge>
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyOutput}
              disabled={!output}
              className="text-gray-400 hover:text-white hover:bg-gray-700" // Dark theme specific hover
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadOutput}
              disabled={!output}
              className="text-gray-400 hover:text-white hover:bg-gray-700" // Dark theme specific hover
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <Editor
            height="300px"
            // Output is usually plain text, so explicitly set to 'plaintext'
            language={"plaintext"}
            value={output}
            // Always set to vs-dark for a consistent dark output view
            theme="vs-dark"
            options={outputEditorOptions} // Use the tailored options for output viewer
          />
        </div>
      </CardContent>
    </Card>
  );
}
