import { app, shell, BrowserWindow, ipcMain, protocol } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import { existsSync, readFileSync } from "fs";
import dotenv from "dotenv";
import { handleExecuteCode } from "./lib/execute-code";
dotenv.config();

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

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(() => {
  is.dev && app.commandLine.appendSwitch("ignore-certificate-errors");
  // Register the custom protocol to serve Monaco Editor worker files locally
  ipcMain.handle("executecode:post", handleExecuteCode);
  protocol.handle("monaco-editor", (request) => {
    const url = request.url.substr("monaco-editor://".length);

    let monacoBasePath;
    if (is.dev) {
      monacoBasePath = join(__dirname, "../../node_modules/monaco-editor/min");
    } else {
      monacoBasePath = join(app.getAppPath(), "node_modules/monaco-editor/min");
    }
    const filePath = join(monacoBasePath, url);
    if (existsSync(filePath)) {
      return new Response(readFileSync(filePath));
    } else {
      console.error("Monaco Editor file not found:", filePath);
      return new Response("File not found", { status: 404 });
    }
  });

  electronApp.setAppUserModelId("com.executeme");
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

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
