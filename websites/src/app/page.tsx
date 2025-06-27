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
import { Language } from '@/@types';

interface ExecutionResult {
  status: 'success' | 'error' | 'running';
  output: string;
  executionTime: number;
  language: string;
}

export default function ExecuteMePlatform() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('python');
  const [code, setCode] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [executionResult, setExecutionResult] =
    useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
      };
      reader.readAsText(file);

      // Auto-detect language from file extension
      const extension = file.name.split('.').pop();
      const detectedLanguage = SUPPORTED_LANGUAGES.find(
        (lang) => lang.extension === `.${extension}`
      );
      if (detectedLanguage) {
        setSelectedLanguage(detectedLanguage.value as Language);
      }
    }
  };

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

  const copyOutput = () => {
    if (executionResult?.output) {
      navigator.clipboard.writeText(executionResult.output);
    }
  };

  const downloadOutput = () => {
    if (executionResult?.output) {
      const blob = new Blob([executionResult.output], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `output_${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                Code Editor
              </CardTitle>
              <CardDescription>
                Write or upload your code with full syntax highlighting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Language Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Programming Language
                </label>
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

              <Tabs defaultValue="editor" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="editor">Code Editor</TabsTrigger>
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                </TabsList>

                <TabsContent value="editor" className="space-y-4">
                  <CodeEditor
                    value={code}
                    onChange={setCode}
                    language={selectedLanguage}
                    height="500px"
                  />
                </TabsContent>

                <TabsContent value="upload" className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">
                        Drop your code file here or click to browse
                      </p>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept={SUPPORTED_LANGUAGES.map(
                          (l) => l.extension
                        ).join(',')}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button
                        variant="outline"
                        onClick={() =>
                          document.getElementById('file-upload')?.click()
                        }
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>

                  {uploadedFile && (
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium">
                        {uploadedFile.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </Badge>
                    </div>
                  )}

                  {code && (
                    <CodeEditor
                      value={code}
                      onChange={setCode}
                      language={selectedLanguage}
                      height="400px"
                    />
                  )}
                </TabsContent>
              </Tabs>

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
