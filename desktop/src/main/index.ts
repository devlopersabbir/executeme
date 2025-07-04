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
    const url = request.url.substr("monaco-editor://".length);

    let monacoBasePath;
    if (is.dev) {
      // Adjust this path based on your dev setup relative to dist-electron/main/index.js
      monacoBasePath = join(__dirname, "../../node_modules/monaco-editor/min");
    } else {
      // Adjust this path based on where 'monaco-editor/min' is copied in your packaged app.
      // Common paths:
      // If monaco-editor/min is copied to the root of your packaged app:
      monacoBasePath = join(app.getAppPath(), "node_modules/monaco-editor/min");
      // If it's copied to a specific asset folder like 'assets/monaco':
      // monacoBasePath = join(app.getAppPath(), 'assets', 'monaco');
    }

    const filePath = join(monacoBasePath, url);
    console.log("Serving monaco-editor:// file:", filePath); // Keep this for debugging!

    if (existsSync(filePath)) {
      return new Response(readFileSync(filePath));
    } else {
      console.error("Monaco Editor file not found:", filePath);
      // It's crucial to return a proper 404 or an empty response for missing files.
      // Returning a null or undefined can cause issues.
      return new Response("File not found", { status: 404 });
    }
  });
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.executeme");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on("ping", () => console.log("pong"));

  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
