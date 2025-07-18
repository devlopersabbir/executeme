import fileSystem from "fs";
import express from "express";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promisify } from "util";
import cors from "cors";
import { LANGUAGE_CONFIG } from "./language/config.js";
import { exec as executeProcess } from "child_process";
import { allowOrigins } from "./origin/index.js";
import { extractError } from "./utils/index.js";
import http from "http";
import { Server as SocketServer } from "socket.io";
import NodeCache from "node-cache";

const exec = promisify(executeProcess);
const fs = fileSystem.promises;
dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: allowOrigins,
  })
);
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: allowOrigins,
    methods: ["GET", "POST"],
  },
  pingTimeout: 60000, // 60 seconds
  pingInterval: 25000, // 25 seconds
  connectTimeout: 45000, // 45 seconds
});

const cache = new NodeCache({
  stdTTL: 60 * 60, // Cache TTL of 1 hour
});
/** socket setup to display all current active users length */
io.on("connection", (socket) => {
  const coders = cache.get("active_coders");
  console.log(coders);
  if (!cache.has(socket.id)) {
    coders
      ? cache.set("active_coders", [...coders, socket.id])
      : cache.set("active_coders", [socket.id]);
  }
  emitActiveCoder();
  socket.on("disconnect", () => {
    const coders = cache.get("active_coders");
    if (coders) {
      cache.set(
        "active_coders",
        coders.filter((coder) => coder !== socket.id)
      );
    }

    emitActiveCoder();
  });
});

/* which will be passed from docker-compose.yaml */
const HOST_PROJECT_ROOT = process.env.HOST_PROJECT_ROOT;
/** Project root directory */
const directory_name = process.cwd();

app.post("/run", async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res
      .status(400)
      .json({ error: "Code and language are required in the request body." });
  }

  const langConfig = LANGUAGE_CONFIG[language];

  if (!langConfig)
    return res.status(400).json({ error: `Unsupported language: ${language}` });

  /* Generate a unique name for the temporary directory */
  const tempDirName = uuidv4();
  /* This is the path *inside the nodejs-server container* where the code will be written */
  const tempDirInsideNodeServer = path.join(
    directory_name,
    "temp",
    tempDirName
  );
  /* code file path where our code will be store */
  const codeFilePath = path.join(tempDirInsideNodeServer, langConfig.mainFile);

  /** 1. This is the absolute path **on the host machine** that corresponds to tempDirInsideNodeServer.
  2. We use HOST_PROJECT_ROOT environment variable to construct this absolute path.
  */
  if (!HOST_PROJECT_ROOT) {
    console.error(
      "HOST_PROJECT_ROOT environment variable is not set. Volume mounts might fail."
    );
    return res.status(500).json({
      error: "Server configuration error",
      details:
        "HOST_PROJECT_ROOT environment variable is missing. Please ensure it's set in docker-compose.yaml",
      isDeveloper: true,
    });
  }
  const hostVolumePath = path.join(HOST_PROJECT_ROOT, "temp", tempDirName);
  console.log("host: ", hostVolumePath);

  try {
    // 1. Create the temporary directory inside the nodejs-server container
    // (This directory will also appear on the host due to the volume mount configured in docker-compose.yaml)
    await fs.mkdir(tempDirInsideNodeServer, { recursive: true });

    // 2. Write the user's code to the temporary file
    await fs.writeFile(codeFilePath, code);

    // 3. Prepare and execute the Docker command
    // The -v flag uses the hostVolumePath (absolute path on host) as the source,
    // and mounts it to '/app' inside the executor container.
    const runCommand = `docker run --rm --memory=512m --cpus=0.5 -v "${hostVolumePath}:/app" ${langConfig.image} ${langConfig.cmd}`;

    console.log(`[Executor] Attempting to run command: ${runCommand}`);

    const { stdout, stderr } = await exec(runCommand);

    if (stderr) {
      return res.status(500).json({
        error: "Runtime error",
        details: extractError(stderr), // TODO: need to set a extractor
      });
    }
    return res.status(200).json({
      output: stdout,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Internal Server error",
      details: extractError(err.message), // TODO: need to set a extractor
    });
  } finally {
    await fs.rm(tempDirInsideNodeServer, { recursive: true, force: true });
  }
});

app.get(["/", "/index", "/index.html"], (_, res) => {
  res.sendFile(path.join(process.cwd(), "./", "views", "index.html"));
});
app.use((req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(process.cwd(), "./", "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});
function emitActiveCoder() {
  const activeUsers = cache.get("active_coders");
  io.emit("active_coders", activeUsers);
}
const PORT = process.env.PORT || 9091;
server.listen(PORT, () => {
  console.log(`Code executor backend listening on port ${PORT}`);
});
