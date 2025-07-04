import { app, shell, BrowserWindow, ipcMain, protocol } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import { existsSync, readFileSync } from "fs";

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: "Execute Me - Code execution Platform",
    darkTheme: true,
    center: true,
    hasShadow: true,
    resizable: true,
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  is.dev && app.commandLine.appendSwitch("ignore-certificate-errors");

  // Register the custom protocol to serve Monaco Editor worker files locally
  protocol.handle("monaco-editor", (request) => {
    const url = request.url.substr("monaco-editor://".length); // e.g., "vs/editor/editor.main.js" or "ts.worker.js"

    let monacoBasePath;
    if (is.dev) {
      // In development, node_modules is usually outside the bundled app path
      // __dirname in main.ts is like dist-electron, so ../../node_modules
      monacoBasePath = join(__dirname, "../../node_modules/monaco-editor/min");
    } else {
      // In a packaged app, node_modules content is often copied to a resources folder
      // or directly into the app.asar. Adjust this path based on your build script.
      // A common pattern is to copy 'node_modules/monaco-editor/min' to 'resources/app.asar/monaco-editor-min'
      // or similar. For simplicity, let's assume it's directly accessible relative to app.getAppPath().
      // If it's copied directly into the root of your packaged app:
      monacoBasePath = join(app.getAppPath(), "node_modules/monaco-editor/min");
      // Or if your build copies it to a specific subfolder like 'assets/monaco':
      // monacoBasePath = join(app.getAppPath(), 'assets', 'monaco');
    }

    const filePath = join(monacoBasePath, url);
    console.log("Serving monaco-editor:// file:", filePath); // Log for debugging

    if (existsSync(filePath)) {
      return new Response(readFileSync(filePath));
    } else {
      console.error("Monaco Editor worker/script file not found:", filePath);
      return new Response("File not found", { status: 404 });
    }
  });
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.executeme");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on("ping", () => console.log("pong"));

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
