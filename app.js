const express = require('express');
const fs = require('fs').promises; // Use promise-based fs for async operations
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // For unique identifiers
const dotenv = require('dotenv'); // For loading environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Mapping of language to Docker image and main file name
const LANGUAGE_CONFIG = {
  python: {
    image: 'executor-python',
    mainFile: 'main.py',
    cmd: 'python main.py', // Command to execute the main file
  },
  nodejs: {
    image: 'executor-nodejs',
    mainFile: 'index.js',
    cmd: 'node index.js',
  },
  java: {
    image: 'executor-java',
    mainFile: 'Main.java', // User will send Main.java
    cmd: 'sh -c "javac Main.java && java Main"', // Compile and then run
  },
};

// Get the host's project root path from environment variable,
// which will be passed from docker-compose.yml
const HOST_PROJECT_ROOT = process.env.HOST_PROJECT_ROOT;

app.post('/run', async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res
      .status(400)
      .json({ error: 'Code and language are required in the request body.' });
  }

  const langConfig = LANGUAGE_CONFIG[language];
  if (!langConfig)
    return res.status(400).json({ error: `Unsupported language: ${language}` });

  // Generate a unique name for the temporary directory
  const tempDirName = uuidv4();
  // This is the path *inside the nodejs-server container* where the code will be written
  const tempDirInsideNodeServer = path.join(__dirname, 'temp', tempDirName);
  const codeFilePath = path.join(tempDirInsideNodeServer, langConfig.mainFile);

  // This is the absolute path *on the host machine* that corresponds to tempDirInsideNodeServer.
  // We use HOST_PROJECT_ROOT environment variable to construct this absolute path.
  if (!HOST_PROJECT_ROOT) {
    console.error(
      'HOST_PROJECT_ROOT environment variable is not set. Volume mounts might fail.'
    );
    return res.status(500).json({
      error: 'Server configuration error',
      details:
        "HOST_PROJECT_ROOT environment variable is missing. Please ensure it's set in docker-compose.yml.",
    });
  }
  const hostVolumePath = path.join(HOST_PROJECT_ROOT, 'temp', tempDirName);

  console.log(`[Executor] Request for ${language} received.`);
  console.log(
    `[Executor] tempDirInsideNodeServer (inside Node.js container): ${tempDirInsideNodeServer}`
  );
  console.log(
    `[Executor] codeFilePath (inside Node.js container): ${codeFilePath}`
  );
  console.log(`[Executor] HOST_PROJECT_ROOT (from env): ${HOST_PROJECT_ROOT}`);
  console.log(
    `[Executor] hostVolumePath (for host Docker daemon): ${hostVolumePath}`
  );

  try {
    // 1. Create the temporary directory inside the nodejs-server container
    // (This directory will also appear on the host due to the volume mount configured in docker-compose.yml)
    await fs.mkdir(tempDirInsideNodeServer, { recursive: true });
    console.log(
      `[Executor] Created temp directory: ${tempDirInsideNodeServer}`
    );

    // 2. Write the user's code to the temporary file
    await fs.writeFile(codeFilePath, code);
    console.log(`[Executor] Wrote code to: ${codeFilePath}`);

    // 3. Prepare and execute the Docker command
    // The -v flag uses the hostVolumePath (absolute path on host) as the source,
    // and mounts it to '/app' inside the executor container.
    const runCommand = `docker run --rm --memory=256m --cpus=0.5 -v "${hostVolumePath}:/app" ${langConfig.image} ${langConfig.cmd}`;

    console.log(`[Executor] Attempting to run command: ${runCommand}`);

    const { stdout, stderr } = await exec(runCommand);

    if (stderr) {
      console.error(
        `[Executor] Runtime error for ${language} code in ${tempDirInsideNodeServer}: ${stderr}`
      );
      return res.status(500).json({
        error: 'Runtime error',
        details: stderr,
      });
    }
    return res.status(200).json({
      output: stdout,
    });
  } catch (err) {
    console.error(`[Executor] Error processing request: ${err.message}`);
    return res.status(500).json({
      error: 'Server error',
      details: err.message,
    });
  } finally {
    // Ensure cleanup happens whether the execution was successful or an error occurred.
    // This is a more robust way to ensure temp files are removed.
    try {
      await fs.rm(tempDirInsideNodeServer, { recursive: true, force: true });
      console.log(
        `[Executor] Cleaned up temp directory: ${tempDirInsideNodeServer}`
      );
    } catch (cleanupErr) {
      console.error(
        `[Executor] Error cleaning up ${tempDirInsideNodeServer}:`,
        cleanupErr
      );
    }
  }
});

// Use PORT from environment variables, or default to 6000
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Code executor backend listening on port ${PORT}`);
  console.log(
    "Ensure your base Docker images (e.g., 'executor-python', 'executor-nodejs', 'executor-java') are pre-built."
  );
});
