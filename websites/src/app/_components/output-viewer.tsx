'use client';

import { Editor } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Terminal } from 'lucide-react';
import { Language, Status } from '@/@types';
import { editorOptions } from '@/constants/editor';

interface OutputViewerProps {
  output: string;
  language: Language;
  executionTime?: number;
  status: Status;
}

export function OutputViewer({
  output,
  language,
  executionTime,
  status,
}: OutputViewerProps) {
  const { theme } = useTheme();

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    // toast({
    //   title: 'Copied to clipboard',
    //   description: 'Output has been copied to your clipboard.',
    // });
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `executeme_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-600">Output</span>
            {executionTime && (
              <Badge variant="outline" className="text-xs">
                {executionTime.toFixed(0)}ms
              </Badge>
            )}
            <Badge
              variant={
                status === 'success'
                  ? 'default'
                  : status === 'error'
                  ? 'destructive'
                  : 'secondary'
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
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadOutput}
              disabled={!output}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <Editor
            height="300px"
            language={'plaintext'}
            value={
              output ||
              `No ${language} output yet. Execute your code to see results here.`
            }
            theme={
              status === 'error' ? 'vs' : theme === 'dark' ? 'vs-dark' : 'vs'
            }
            options={editorOptions}
          />
        </div>
      </CardContent>
    </Card>
  );
}
