'use client';

import { Editor } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { LANGUAGE_MAP, SAMPLE_CODE } from '@/constants';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  height?: string;
  readOnly?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  language,
  height = '400px',
  readOnly = false,
}: CodeEditorProps) {
  const { theme } = useTheme();

  const handleEditorChange = (newValue: string | undefined) => {
    onChange(newValue || '');
  };

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on' as const,
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: 'on' as const,
    contextmenu: true,
    selectOnLineNumbers: true,
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 3,
    glyphMargin: false,
    folding: true,
    cursorBlinking: 'blink' as const,
    cursorStyle: 'line' as const,
    renderWhitespace: 'selection' as const,
    renderControlCharacters: false,
    fontFamily:
      "'Fira Code', 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
    fontLigatures: true,
    smoothScrolling: true,
    mouseWheelZoom: true,
    readOnly,
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <span className="text-sm font-medium text-slate-600">
              {language}.
              {LANGUAGE_MAP[language] === 'cpp'
                ? 'cpp'
                : LANGUAGE_MAP[language] === 'python'
                ? 'py'
                : LANGUAGE_MAP[language] === 'javascript'
                ? 'js'
                : LANGUAGE_MAP[language] === 'typescript'
                ? 'ts'
                : LANGUAGE_MAP[language]}
            </span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {language.charAt(0).toUpperCase() + language.slice(1)}
          </Badge>
        </div>

        <div className="relative">
          <Editor
            height={height}
            language={LANGUAGE_MAP[language] || 'plaintext'}
            value={value || SAMPLE_CODE[language] || '// Start coding here...'}
            onChange={handleEditorChange}
            theme={theme === 'dark' ? 'vs-dark' : 'vs'}
            options={editorOptions}
            loading={
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              </div>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
