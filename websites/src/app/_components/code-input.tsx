"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Code2, Play } from "lucide-react";
import LanguageSelection from "./editor-view/language-selection";
import { Button } from "@/components/ui/button";
import { ExecutionResult, Language } from "@/@types";
import { useState, useTransition } from "react";
import { executeCodeAction } from "../_actions/execute";
import { CodeEditor } from "./editor-view/code-editor";
import ResultSection from "./output-view/result-sections";

export default function CodeInput() {
  const [selectedLanguage, setSelectedLanguage] =
    useState<Language>("typescript");
  const [code, setCode] = useState("");
  const [executionResult, setExecutionResult] =
    useState<ExecutionResult | null>(null);
  const [isExecuting, startExecution] = useTransition();

  const executeCode = async () => {
    if (!code.trim()) return;

    startExecution(async () => {
      setExecutionResult({
        status: "running",
        results: {
          output: "",
          responseTime: 0,
        },
        language: selectedLanguage,
      });

      const result = await executeCodeAction({
        language: selectedLanguage,
        code,
      });

      // Use a simple heuristic: if output contains "Error" or has failed response
      const isError = result.output?.toLowerCase().includes("error");

      setExecutionResult({
        status: isError ? "error" : "success",
        results: result,
        language: selectedLanguage,
      });
    });
  };

  return (
    <>
      <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 text-white">
        <CardHeader className="flex justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <Code2 className="w-6 h-6 text-purple-400" />
              Code Editor
            </CardTitle>
            <CardDescription className="text-gray-300">
              Write or upload your code with full syntax highlighting
            </CardDescription>
          </div>
          {/* Language Selection */}
          <LanguageSelection
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <CodeEditor
            value={code}
            onChange={setCode}
            language={selectedLanguage}
            height="310px"
          />

          <Button
            onClick={executeCode}
            disabled={isExecuting || !code.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            size="lg"
          >
            {isExecuting ? (
              <>
                <Clock className="w-5 h-5 mr-2 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Execute Code
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      <ResultSection optional={executionResult} isExecuting={isExecuting} />
    </>
  );
}
