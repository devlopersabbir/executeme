import { contextBridge, ipcRenderer } from "electron";

// Expose a function to the renderer to get Monaco's base path
// This is crucial for @monaco-editor/react to know where to load its *main* scripts from
contextBridge.exposeInMainWorld("monacoConfig", {
  getMonacoBasePath: () => {
    // This is correct. The renderer will ask for 'monaco-editor://vs'
    // and your main process protocol handler will resolve it to the local path.
    return `monaco-editor://vs`;
  }
});

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", {
      ipcRenderer: {
        send: (channel: string, args?: any[]) => ipcRenderer.send(channel, args),
        on: (channel: string, listener: (...args: any[]) => void) => {
          ipcRenderer.on(channel, listener);
          return () => ipcRenderer.removeListener(channel, listener);
        }
      }
    });
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
}
