// conceptual-server.js (Node.js - NOT RUNNABLE HERE)
const express = require("express");
const { exec } = require("child_process"); // For running shell commands (like Docker commands)
const fs = require("fs/promises"); // For file system operations
const path = require("path");
const crypto = require("crypto"); // For generating unique IDs

const app = express();
app.use(express.json()); // To parse JSON request bodies

const CODE_DIR = path.join(__dirname, "temp_code"); // Temporary directory for user code

// Ensure the temporary directory exists
fs.mkdir(CODE_DIR, { recursive: true }).catch(console.error);

app.post("/run", async (req, res) => {
  const { code } = req.body;

  // Escape double quotes for shell
  const escapedCode = code.replace(/"/g, '\\"').replace(/\n/g, "; "); // use ; to separate lines

  const command = `docker run --rm python:3.11 python -c "${escapedCode}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution Error: ${error.message}`);
      return res.status(500).send(`Error: ${error.message}`);
    }

    if (stderr) {
      console.error(`Stderr: ${stderr}`);
    }

    return res.send(stdout || stderr);
  });
});

app.post("/execute-code", async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required." });
  }

  const requestId = crypto.randomBytes(16).toString("hex");
  const fileName = `main.${getFileExtension(language)}`;
  const filePath = path.join(CODE_DIR, requestId, fileName);
  const containerName = `code-executor-${requestId}`;

  try {
    // 1. Create a unique directory for this request
    await fs.mkdir(path.join(CODE_DIR, requestId), { recursive: true });

    // 2. Write the user's code to a temporary file
    await fs.writeFile(filePath, code);

    // 3. Determine Docker image and execution command based on language
    let dockerImage;
    let command;
    let fileMountPath = `/usr/src/app/${fileName}`; // Path inside the container

    switch (language.toLowerCase()) {
      case "javascript":
      case "node":
        dockerImage = "node:18-alpine";
        command = `node ${fileMountPath}`;
        break;
      case "python":
        dockerImage = "python:3.9-slim";
        command = `python3 ${fileMountPath}`;
        break;
      case "java":
        dockerImage = "openjdk:17-jdk-slim";
        // Compile and then run
        command = `javac ${fileMountPath} && java -cp /usr/src/app Main`;
        // Assumes main class is 'Main' and file is 'Main.java'
        // This would need more robust handling for arbitrary Java filenames/classes
        break;
      case "cpp":
      case "c++":
        dockerImage = "gcc:latest";
        command = `g++ ${fileMountPath} -o /usr/src/app/a.out && /usr/src/app/a.out`;
        break;
      default:
        return res
          .status(400)
          .json({ error: `Unsupported language: ${language}` });
    }

    // 4. Construct the Docker run command
    // - rm: remove container after exit
    // - name: assign a name for easier management/debugging
    // - v: mount the host's temp_code directory into the container
    // - w: set working directory inside container
    // - e: environment variables (optional)
    // --network none: Disable network access for security
    // --memory=50m: Limit memory to 50MB
    // --cpus="0.5": Limit CPU to 0.5 core
    // --ulimit nofile=1024:1024: Limit open files
    const normalizePathForDocker = (windowsPath) =>
      windowsPath.replace(/\\/g, "/").replace("C:", "/c");

    const mountPath = normalizePathForDocker(path.join(CODE_DIR, requestId));

    const dockerRunCommand = `docker run --rm --name ${containerName} \
      -v ${mountPath}:/usr/src/app \
      -w /usr/src/app \
      --network none \
      --memory=50m \
      --cpus="0.5" \
      --ulimit nofile=1024:1024 \
      ${dockerImage} /bin/sh -c "${command}"`;

    console.log(`Executing Docker command: ${dockerRunCommand}`);

    // 5. Execute the Docker command
    // Use exec with a timeout to prevent infinite loops
    const timeoutMs = 5000; // 5 seconds timeout
    const { stdout, stderr } = await new Promise((resolve, reject) => {
      const child = exec(
        dockerRunCommand,
        { timeout: timeoutMs },
        (error, stdout, stderr) => {
          if (error && error.killed && error.signal === "SIGTERM") {
            reject(
              new Error(
                `Execution timed out after ${timeoutMs / 1000} seconds.`
              )
            );
          } else if (error) {
            reject(error);
          } else {
            resolve({ stdout, stderr });
          }
        }
      );

      // Optional: Log child process ID for debugging
      // console.log(`Child process PID: ${child.pid}`);
    });

    // 6. Send the output back to the client
    res.json({
      output: stdout.trim(),
      error: stderr.trim(),
    });
  } catch (err) {
    console.error(`Error executing code for request ${requestId}:`, err);
    res.status(500).json({
      error:
        err.message ||
        "An internal server error occurred during code execution.",
    });
  } finally {
    // 7. Clean up: Remove the temporary code directory
    try {
      await fs.rm(path.join(CODE_DIR, requestId), {
        recursive: true,
        force: true,
      });
      console.log(`Cleaned up directory: ${path.join(CODE_DIR, requestId)}`);
    } catch (cleanupErr) {
      console.error(
        `Error during cleanup for request ${requestId}:`,
        cleanupErr
      );
    }
  }
});

function getFileExtension(language) {
  switch (language.toLowerCase()) {
    case "javascript":
    case "node":
      return "js";
    case "python":
      return "py";
    case "java":
      return "java";
    case "c++":
    case "cpp":
      return "cpp";
    default:
      return "txt"; // Fallback
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Code executor backend listening on port ${PORT}`);
});
