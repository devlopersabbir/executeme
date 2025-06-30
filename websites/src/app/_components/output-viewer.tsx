import { Editor } from "@monaco-editor/react";
import { Card, CardContent } from "@/components/ui/card";
import { outputEditorOptions } from "@/constants";
import { ExecutionProps } from "./output-view/result-sections";
import CopyDownload from "./output-view/copy-download";
import OutputHeader from "./output-view/output-header";

export function OutputViewer({ executionResult }: ExecutionProps) {
  return (
    <Card className="overflow-hidden bg-gray-900 border-none p-0 w-full">
      <CardContent className="p-0">
        {/* Top bar for output controls - now dark */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
          <OutputHeader executionResult={executionResult} />
          <CopyDownload executionResult={executionResult} />
        </div>

        <div className="relative">
          <Editor
            height="300px"
            // Output is usually plain text, so explicitly set to 'plaintext'
            language={"plaintext"}
            value={executionResult.results.output}
            // Always set to vs-dark for a consistent dark output view
            theme="vs-dark"
            options={outputEditorOptions} // Use the tailored options for output viewer
          />
        </div>
      </CardContent>
    </Card>
  );
}
