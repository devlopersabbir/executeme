'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, Play, FileText, Clock, Code2 } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/constants/language';
import { CodeEditor } from './_components/code-editor';
import { OutputViewer } from './_components/output-viewer';
import { executeCodeAction } from './_actions/execute';
import { ExecutionResult, Language } from '@/@types';

export default function ExecuteMePlatform() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('python');
  const [code, setCode] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [executionResult, setExecutionResult] =
    useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeCode = async () => {
    if (!code.trim()) {
      return;
    }

    setIsExecuting(true);
    setExecutionResult({
      status: 'running',
      output: '',
      executionTime: 0,
      language: selectedLanguage,
    });
    try {
      const data = await executeCodeAction({
        language: selectedLanguage,
        code,
      });
      setExecutionResult({
        status: 'success',
        output: data.output,
        executionTime: data.responseTime,
        language: selectedLanguage,
      });
    } catch (err) {
      setExecutionResult({
        status: 'error',
        output: 'error is here',
        executionTime: 0,
        language: selectedLanguage,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Execute Me</h1>
          <p className="text-lg text-slate-600 mb-4">
            Run code in any programming language, instantly
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {SUPPORTED_LANGUAGES.slice(0, 6).map((lang) => (
              <Badge key={lang.value} variant="secondary" className="text-xs">
                {lang.label}
              </Badge>
            ))}
            <Badge variant="outline" className="text-xs">
              +{SUPPORTED_LANGUAGES.length - 6} more
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Code Input Section */}
          <Card className="h-fit">
            <CardHeader className="flex justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="w-5 h-5" />
                  Code Editor
                </CardTitle>
                <CardDescription>
                  Write or upload your code with full syntax highlighting
                </CardDescription>
              </div>
              {/* Language Selection */}
              <div className="space-y-2">
                <Select
                  value={selectedLanguage}
                  onValueChange={(e) => setSelectedLanguage(e as Language)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
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
                height="300px"
              />

              <Button
                onClick={executeCode}
                disabled={isExecuting || !code.trim()}
                className="w-full"
                size="lg"
              >
                {isExecuting ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Execute Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Execution Results
              </CardTitle>
              <CardDescription>Output and execution details</CardDescription>
            </CardHeader>
            <CardContent>
              {!executionResult ? (
                <div className="text-center py-12 text-slate-500">
                  <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Execute your code to see results here</p>
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
        <div className="text-center mt-12 text-sm text-slate-500">
          <p>
            Execute Me - Run code in {SUPPORTED_LANGUAGES.length}+ programming
            languages
          </p>
        </div>
      </div>
    </div>
  );
}
