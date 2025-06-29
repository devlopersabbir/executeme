"use client";

import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { LANGUAGE_MAP } from "@/constants";
import { Language } from "@/@types";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  height?: string;
  readOnly?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  language,
  height = "300px",
  readOnly = false,
}: CodeEditorProps) {
  const { theme } = useTheme(); // You can still use this for overall app theme logic if needed elsewhere

  const handleEditorChange = (newValue: string | undefined) => {
    onChange(newValue || "");
  };

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 18,
    lineNumbers: "on" as const,
    roundedSelection: false,
    scrollBeyondLastLine: true,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: "on" as const,
    contextmenu: true,
    selectOnLineNumbers: true,
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 3,
    glyphMargin: false,
    folding: true,
    cursorBlinking: "blink" as const,
    cursorStyle: "line" as const,
    renderWhitespace: "selection" as const,
    renderControlCharacters: false,
    fontFamily:
      "'Fira Code', 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
    fontLigatures: true,
    smoothScrolling: true,
    mouseWheelZoom: true,
    readOnly,
    // --- Added for suggestions ---
    quickSuggestions: true, // Enables quick suggestions as you type
    suggestOnTriggerCharacters: true, // Shows suggestions when trigger characters are typed (e.g., '.')
    // --- End Added for suggestions ---
  };

  return (
    <Card className="overflow-hidden bg-gray-900 border-none">
      <CardContent className="p-0">
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
            <span className="text-sm font-medium text-gray-300">
              {language}
            </span>
          </div>
          {/* Language Badge */}
          <Badge
            variant="secondary"
            className="text-xs bg-gray-700 text-gray-200"
          >
            {language.charAt(0).toUpperCase() + language.slice(1)}
          </Badge>
        </div>

        <div className="relative">
          <Editor
            height={height}
            // Ensure the language is correctly mapped for Monaco to provide suggestions
            language={LANGUAGE_MAP[language] || "plaintext"}
            value={value ?? "// Start coding here..."}
            defaultLanguage={LANGUAGE_MAP[language]}
            saveViewState={false}
            onChange={handleEditorChange}
            // Force vs-dark theme for the editor
            theme="vs-dark"
            options={editorOptions}
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
