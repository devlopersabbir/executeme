import { contextBridge, ipcRenderer } from "electron";
// import { electronAPI } from "@electron-toolkit/preload";
import { Input } from "@shared/types";
import { ApplicationInterface } from "./preload";

const applicationApi: ApplicationInterface = {
  // electron: electronAPI,

  api: {
    getMonacoBasePath: () => "monaco-editor://vs",
    executeCode: (payload: Input) => ipcRenderer.invoke("executecode:post", payload)
  }
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("applicationApi", applicationApi);
  } catch (error) {
    console.error("Failed to expose API:", error);
  }
} else {
  window.applicationApi = applicationApi;
}
