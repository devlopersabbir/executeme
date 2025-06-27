const express = require("express");
const fs = require("fs").promises; // Use promise-based fs for async operations
const { exec } = require("child_process");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // For unique identifiers
const Docker = require("dockerode");

const app = express();
app.use(express.json());

const docker = new Docker();
const runDockerContainer = async (image, cmd, tempDir) => {
  return new Promise((resolve, reject) => {
    docker
      .run(
        image,
        cmd,
        null, // Stream output to null or handle it manually
        { HostConfig: { Binds: [`${tempDir}:/app`] }, AutoRemove: true },
        (err, data, container) => {
          if (err) return reject(err);
          resolve(data);
        }
      )
      .on("stream", (stream) => {
        let output = "";
        stream.on("data", (chunk) => (output += chunk.toString()));
        stream.on("end", () => resolve({ output }));
      });
  });
};

// Mapping of language to Docker image and main file name
const LANGUAGE_CONFIG = {
  python: {
    image: "executor-python",
    mainFile: "main.py",
    cmd: "python main.py", // Command to execute the main file
  },
  nodejs: {
    image: "executor-nodejs",
    mainFile: "index.js",
    cmd: "node index.js",
  },
  // Add other languages here
  // java: { image: "executor-java", mainFile: "Main.java", cmd: "java Main" },
  // go: { image: "executor-go", mainFile: "main.go", cmd: "go run main.go" },
};

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

  // Create a unique temporary directory for this execution
  const tempDir = path.join(__dirname, "temp", uuidv4());
  const codeFilePath = path.join(tempDir, langConfig.mainFile);

  try {
    // 1. Create the temporary directory
    await fs.mkdir(tempDir, { recursive: true });

    // 2. Write the user's code to the temporary file
    await fs.writeFile(codeFilePath, code);

    // 3. Prepare and execute the Docker command
    const runCommand = `docker run --rm -v "${tempDir}:/app" ${langConfig.image} ${langConfig.cmd}`;

    console.log("command: ", runCommand);
    // const result = await runDockerContainer(
    //   langConfig.image,
    //   langConfig.cmd.split(" "),
    //   tempDir
    // );
    exec(runCommand, { timeout: 10000 }, (err, out) => {
      if (err) return res.send("err");
      return res.send("scc");
    });
    // await fs.rm(tempDir, { recursive: true, force: true });
    // res.json({ output: result.output });
    // Ensure cleanup even if initial file operations fail
    // fs.rm(tempDir, { recursive: true, force: true })
    //   .then(() =>
    //     console.log(`Cleaned up temp directory after error: ${tempDir}`)
    //   )
    //   .catch((cleanupErr) =>
    //     console.error(`Error cleaning up ${tempDir} after error:`, cleanupErr)
    //   );
    // exec(runCommand, (runErr, runStdout, runStderr) => {
    //   // 4. Clean up the temporary directory regardless of execution outcome
    //   // fs.rm(tempDir, { recursive: true, force: true })
    //   //   .then(() => console.log(`Cleaned up temp directory: ${tempDir}`))
    //   //   .catch((cleanupErr) =>
    //   //     console.error(`Error cleaning up ${tempDir}:`, cleanupErr)
    //   //   );

    //   if (runErr) {
    //     console.error(
    //       `Runtime error for ${language} code in ${tempDir}: ${
    //         runStderr || runErr.message
    //       }`
    //     );
    //     return res.status(500).json({
    //       error: "Runtime error",
    //       details: runStderr || runErr.message,
    //     });
    //   }

    //   res.json({ output: runStdout });
    // });
  } catch (err) {
    console.error(`Error processing request: ${err.message}`);
    // Ensure cleanup even if initial file operations fail
    fs.rm(tempDir, { recursive: true, force: true })
      .then(() =>
        console.log(`Cleaned up temp directory after error: ${tempDir}`)
      )
      .catch((cleanupErr) =>
        console.error(`Error cleaning up ${tempDir} after error:`, cleanupErr)
      );

    return res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Code executor backend listening on port ${PORT}`);
  console.log(
    "Ensure your base Docker images (e.g., 'executor-python', 'executor-nodejs') are pre-built."
  );
});
