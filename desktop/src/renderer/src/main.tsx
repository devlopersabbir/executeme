import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./assets/main.css";
import BaseProvider from "./components/shared/providers/base-provider";
import { loader } from "@monaco-editor/react";

// Get the base path for Monaco from the preload script
// @ts-ignore
const monacoBasePath = window.monacoConfig.getMonacoBasePath();

// Configure the monaco-editor/react loader to use your custom protocol
loader.config({
  paths: {
    vs: monacoBasePath
  }
});

// This part is for the workers, which you already had mostly correct
window.MonacoEnvironment = {
  getWorkerUrl: (_moduleId, label) => {
    const workerFilenameMap: { [key: string]: string } = {
      json: "json.worker.js",
      css: "css.worker.js",
      scss: "css.worker.js",
      less: "css.worker.js",
      html: "html.worker.js",
      handlebars: "html.worker.js",
      razor: "html.worker.js",
      typescript: "ts.worker.js",
      javascript: "ts.worker.js"
    };
    const workerFile = workerFilenameMap[label] || "editor.worker.js";
    return `monaco-editor://${workerFile}`;
  }
};
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BaseProvider>
      <App />
    </BaseProvider>
  </StrictMode>
);
