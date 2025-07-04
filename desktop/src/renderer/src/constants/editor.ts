export const codeEditorOptions = {
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
  readOnly: false,
  // --- Added for suggestions ---
  quickSuggestions: true, // Enables quick suggestions as you type
  suggestOnTriggerCharacters: true, // Shows suggestions when trigger characters are typed (e.g., '.')
  // --- End Added for suggestions ---
};

export const outputEditorOptions = {
  ...codeEditorOptions, // Inherit general options
  readOnly: true, // Output should be read-only
  quickSuggestions: false, // No suggestions needed for output
  renderLineHighlight: "none" as const, // No line highlighting for cleaner output
  wordWrap: "on" as const, // Ensure long lines wrap
};
