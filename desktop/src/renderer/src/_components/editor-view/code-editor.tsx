import { Editor } from "@monaco-editor/react";
import { Card, CardContent } from "@renderer/components/ui/card";
import { Badge } from "@renderer/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Language } from "@renderer/@types";
import { codeEditorOptions } from "@renderer/constants";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  height?: string;
  readOnly?: boolean;
}

export function CodeEditor({ value, onChange, language, height = "300px" }: CodeEditorProps) {
  const handleEditorChange = (newValue: string | undefined) => {
    onChange(newValue || "");
  };

  return (
    <Card className="bg-gray-900 border-none p-0 w-full max-w-full overflow-x-hidden">
      <CardContent className="p-0 w-full overflow-x-hidden">
        {/* Top bar for editor controls - now dark */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {/* Traffic light dots - adjusted colors for dark theme */}
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            {/* Language display - adjusted text color */}
            <span className="text-sm font-medium text-gray-300">{language}</span>
          </div>
          {/* Language Badge */}
          <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-200">
            {language.charAt(0).toUpperCase() + language.slice(1)}
          </Badge>
        </div>

        <div className="relative w-full overflow-x-hidden">
          <Editor
            height={height}
            width={"100%"}
            // Ensure the language is correctly mapped for Monaco to provide suggestions
            className="w-full"
            language={language}
            value={value ?? "// Start coding here..."}
            defaultLanguage={language}
            saveViewState={true}
            onChange={handleEditorChange}
            // Force vs-dark theme for the editor
            theme="vs-dark"
            options={codeEditorOptions}
            loading={
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
