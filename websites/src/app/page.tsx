"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, FileText, Clock, Code2, Github } from "lucide-react"; // Import Github icon
import { SUPPORTED_LANGUAGES } from "@/constants/language";
import { CodeEditor } from "./_components/code-editor";
import { OutputViewer } from "./_components/output-viewer";
import { executeCodeAction } from "./_actions/execute";
import { ExecutionResult, Language } from "@/@types";

export default function ExecuteMePlatform() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("python");
  const [code, setCode] = useState("");
  const [executionResult, setExecutionResult] =
    useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeCode = async () => {
    if (!code.trim()) return;

    setIsExecuting(true);
    setExecutionResult({
      status: "running",
      output: "",
      executionTime: 0,
      language: selectedLanguage,
    });
    try {
      const data = await executeCodeAction({
        language: selectedLanguage,
        code,
      });
      setExecutionResult({
        status: "success",
        output: data.output,
        executionTime: data.responseTime,
        language: selectedLanguage,
      });
    } catch (err) {
      setExecutionResult({
        status: "error",
        output: "error is here",
        executionTime: 0,
        language: selectedLanguage,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-0 left-0 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8 p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20">
          <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Execute
            </span>{" "}
            Me
          </h1>
          <p className="text-xl text-gray-200 mb-6 font-light drop-shadow-md">
            Run code in any programming language,{" "}
            <span className="font-semibold text-white">instantly</span> and{" "}
            <span className="font-semibold text-white">securely</span>.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {SUPPORTED_LANGUAGES.slice(0, 6).map((lang) => (
              <Badge
                key={lang.value}
                variant="outline"
                className="text-sm px-4 py-1.5 bg-white/20 text-white border-white/30 backdrop-blur-sm"
              >
                {lang.label}
              </Badge>
            ))}
            <Badge
              variant="outline"
              className="text-sm px-4 py-1.5 bg-white/20 text-white border-white/30 backdrop-blur-sm"
            >
              +{SUPPORTED_LANGUAGES.length - 6} more
            </Badge>
          </div>

          {/* GitHub Icon and Link */}
          <div className="mt-8">
            <a
              href="https://github.com/devlopersabbir/executeme"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              <Github className="w-6 h-6" />
              <span className="font-medium">Star on GitHub</span>
            </a>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Code Input Section */}
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
              <div className="space-y-2">
                <Select
                  value={selectedLanguage}
                  onValueChange={(e) => setSelectedLanguage(e as Language)}
                >
                  <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white border-gray-700">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem
                        key={lang.value}
                        value={lang.value}
                        className="hover:bg-gray-700"
                      >
                        {lang.label} ({lang.extension})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeEditor
                value={code}
                onChange={setCode}
                language={selectedLanguage}
                height="262px"
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

          {/* Results Section */}
          <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="w-6 h-6 text-pink-400" />
                Execution Results
              </CardTitle>
              <CardDescription className="text-gray-300">
                Output and execution details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!executionResult ? (
                <div className="text-center py-12 text-gray-400">
                  <Play className="w-14 h-14 mx-auto mb-4 opacity-50 text-purple-300" />
                  <p className="text-lg">
                    Execute your code to see results here
                  </p>
                </div>
              ) : (
                <OutputViewer
                  output={executionResult.output}
                  language={executionResult.language}
                  executionTime={executionResult.executionTime}
                  status={executionResult.status}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-400 space-y-4">
          <p>
            Developed with ❤️ by{" "}
            <a
              href="https://devlopersabbir.github.io/executeme/" // Link to your documentation/about page
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline font-medium"
            >
              Sabbir Hossain Shuvo
            </a>
          </p>
          {/* Buy Me A Coffee Button */}
          <div>
            <a
              href="https://buymeacoffee.com/devlopersabbir"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-full transition-colors duration-200 shadow-md"
            >
              <img
                src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg" // Official BMC logo
                alt="Buy Me A Coffee"
                className="h-5 w-5"
              />
              <span>Buy Me A Coffee</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
