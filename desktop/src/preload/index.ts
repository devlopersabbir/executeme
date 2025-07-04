import { contextBridge, ipcRenderer } from "electron";

// Custom APIs for renderer
const api = {};

// Expose a function to the renderer to get Monaco's base path
// This is crucial for @monaco-editor/react to know where to load its *main* scripts from
contextBridge.exposeInMainWorld("monacoConfig", {
  getMonacoBasePath: () => {
    // This path should point to the 'min/vs' directory of your monaco-editor installation.
    // It needs to be accessible from the renderer process.
    // In a packaged app, node_modules is often bundled, so we adjust the path.
    // You might need to adjust `../node_modules/monaco-editor/min/vs` based on your project's build output structure.
    return `monaco-editor://vs`; // Use your custom protocol for the base path too
  }
});

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", {
      ipcRenderer: {
        send: (channel: string, args?: any[]) => ipcRenderer.send(channel, args),
        on: (channel: string, listener: (...args: any[]) => void) => {
          ipcRenderer.on(channel, listener);
          // Return a cleanup function for `on` listeners
          return () => ipcRenderer.removeListener(channel, listener);
        }
      }
    });
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = {
    ipcRenderer: {
      send: (channel, args) => ipcRenderer.send(channel, args),
      on: (channel, listener) => ipcRenderer.on(channel, listener)
    }
  };
  // @ts-ignore (define in dts)
  window.api = api;
}
