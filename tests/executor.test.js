import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execPromise = promisify(exec);

const SERVER_URL = "http://localhost:9091"; /** local server url */

// Store the child process for docker-compose up
let dockerComposeProcess;

// --- Global Setup and Teardown ---
// These hooks run once before all tests and once after all tests in this file.
beforeAll(async () => {
  console.log("\n--- Setting up Docker Compose for tests ---");
  try {
    // Build all images (if not already built) and start services in detached mode
    // --force-recreate ensures fresh containers from potentially updated images
    // --build ensures images are rebuilt if Dockerfiles/context changed
    await execPromise("docker-compose up -d --build --force-recreate", {
      cwd: path.resolve(process.cwd(), "../"),
    });
    console.log("Docker Compose services started.");

    // Give the server a moment to fully start up and be ready to accept connections
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
    console.log("Server should be ready.");
  } catch (error) {
    console.error(
      "Failed to start Docker Compose services:",
      error.stdout || error.stderr || error.message
    );
    throw error; // Fail the test suite if setup fails
  }
}, 60000); // 60 seconds timeout for beforeAll hook

afterAll(async () => {
  console.log("\n--- Tearing down Docker Compose after tests ---");
  try {
    // Stop and remove all services, networks, and volumes created by docker-compose up
    await execPromise("docker-compose down --volumes --remove-orphans", {
      cwd: path.resolve(__dirname, "../"),
    });
    console.log("Docker Compose services stopped and removed.");
  } catch (error) {
    console.error(
      "Failed to stop Docker Compose services:",
      error.stdout || error.stderr || error.message
    );
    // Even if teardown fails, we want to report test results, but log the error
  }
});

// --- Helper function to send code execution requests ---
async function executeCode(language, code) {
  const response = await fetch(`${SERVER_URL}/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, language }),
  });
  return response.json();
}

// --- Test Suite for Code Executor ---
describe("Code Executor Battle Tests", () => {
  // Test basic "Hello World" for each supported language
  it("should execute basic Python code successfully", async () => {
    const result = await executeCode("python", 'print("Hello from Python!")');
    expect(result.output).toBe("Hello from Python!\n");
    expect(result.error).toBeUndefined();
  });

  it("should execute basic Node.js code successfully", async () => {
    const result = await executeCode(
      "nodejs",
      'console.log("Hello from Node.js!");'
    );
    expect(result.output).toBe("Hello from Node.js!\n");
    expect(result.error).toBeUndefined();
  });

  it("should execute basic TypeScript (Deno) code successfully", async () => {
    const result = await executeCode(
      "typescript",
      'console.log("Hello from Deno/TypeScript!");'
    );
    expect(result.output).toBe("Hello from Deno/TypeScript!\n");
    expect(result.error).toBeUndefined();
  });

  it("should execute basic Java code successfully", async () => {
    const result = await executeCode(
      "java",
      'public class Main { public static void main(String[] args) { System.out.println("Hello from Java!"); } }'
    );
    expect(result.output).toBe("Hello from Java!\n");
    expect(result.error).toBeUndefined();
  });

  it("should execute basic Kotlin code successfully", async () => {
    const result = await executeCode(
      "kotlin",
      'fun main() { println("Hello from Kotlin!") }'
    );
    expect(result.output).toBe("Hello from Kotlin!\n");
    expect(result.error).toBeUndefined();
  });

  // Test cases for syntax errors
  it("should return error for Python syntax error", async () => {
    const result = await executeCode("python", 'print("Hello'); // Missing closing quote
    expect(result.error).toBeDefined();
    expect(result.error).toContain("SyntaxError");
    expect(result.output).toBeUndefined();
  });

  it("should return error for Java compilation error", async () => {
    const result = await executeCode(
      "java",
      'public class Main { public static void main(String[] args) { System.out.println("Hello from Java!" } }'
    ); // Missing parenthesis
    expect(result.error).toBeDefined();
    expect(result.error).toContain("compilation failed"); // Or similar message from javac
    expect(result.output).toBeUndefined();
  });

  it("should return error for Kotlin compilation error", async () => {
    const result = await executeCode(
      "kotlin",
      'fun main() { println("Hello from Kotlin!" }'
    ); // Missing parenthesis
    expect(result.error).toBeDefined();
    expect(result.error).toContain("error:"); // Or similar message from kotlinc
    expect(result.output).toBeUndefined();
  });

  // Test cases for runtime errors
  it("should return error for Python runtime error (division by zero)", async () => {
    const result = await executeCode("python", "print(1/0)");
    expect(result.error).toBeDefined();
    expect(result.error).toContain("ZeroDivisionError");
    expect(result.output).toBeUndefined();
  });

  it("should return error for Java runtime error (division by zero)", async () => {
    const result = await executeCode(
      "java",
      "public class Main { public static void main(String[] args) { System.out.println(1/0); } }"
    );
    expect(result.error).toBeDefined();
    expect(result.error).toContain("java.lang.ArithmeticException: / by zero");
    expect(result.output).toBeUndefined();
  });

  // Test resource limits (these might vary based on Docker daemon config)
  // The Docker `--memory` and `--cpus` limits are handled by Docker itself.
  // We can send code that *attempts* to exceed them and check for errors.
  it("should handle large output (e.g., 1MB string)", async () => {
    const largeString = "a".repeat(1024 * 1024); // 1 MB string
    const result = await executeCode(
      "nodejs",
      `console.log('${largeString}');`
    );
    expect(result.output.length).toBeGreaterThan(1024 * 1024); // Output should be roughly 1MB + newline
    expect(result.error).toBeUndefined();
  }, 15000); // Give more time for large output

  it("should handle code that attempts to consume too much memory (Python)", async () => {
    // This script tries to allocate a very large list.
    // Docker's --memory=256m should ideally kill it.
    const code = `
import sys
# Try to allocate 500MB, which should exceed 256MB limit
try:
    large_list = [0] * (500 * 1024 * 1024 // sys.getsizeof(0))
    print("Allocated large list (should not happen)")
except MemoryError:
    print("MemoryError caught in script")
except Exception as e:
    print(f"Other error: {e}")
`;
    const result = await executeCode("python", code);
    // Expecting a Docker-level error or a specific memory error message
    // The exact error message depends on how Docker kills the container and what stderr it returns.
    expect(result.error).toBeDefined();
    expect(result.error).toContain("out of memory") ||
      expect(result.error).toContain("MemoryError") ||
      expect(result.error).toContain("OOM");
    expect(result.output).toBeUndefined();
  }, 20000); // Increased timeout for potential OOM kill

  it("should handle code that attempts to run too long (infinite loop in Node.js)", async () => {
    // This script runs an infinite loop. Docker's default timeout (if any) or CPU limit
    // should eventually terminate it. Your `exec` call might also have a default timeout.
    const code = `
let i = 0;
while (true) {
  i++;
  // Prevent console spam but keep it busy
  if (i % 1000000 === 0) {
    console.log('Still looping...');
  }
}
`;
    const result = await executeCode("nodejs", code);
    // Expecting a timeout error from Docker or the child_process.exec
    expect(result.error).toBeDefined();
    // The error message could be 'Command failed', 'timed out', or related to Docker stopping the container
    expect(result.error).toMatch(
      /command failed|timed out|killed|exit status 137/i
    );
    // Output might contain partial logs if it ran for a bit
  }, 30000); // Increased timeout for potential long-running process before termination

  // Test concurrency: Send multiple requests simultaneously
  it("should handle multiple concurrent requests", async () => {
    const numRequests = 10;
    const pythonCode =
      'import time\nimport random\ntime.sleep(random.uniform(0.1, 0.5))\nprint("Concurrent Python done!")';
    const javaCode =
      'public class Main { public static void main(String[] args) { try { Thread.sleep((long)(Math.random() * 400 + 100)); } catch (Exception e) {} System.out.println("Concurrent Java done!"); } }';
    const kotlinCode =
      'import kotlin.random.Random\nimport kotlinx.coroutines.*\nfun main() = runBlocking { delay(Random.nextLong(100, 500)); println("Concurrent Kotlin done!") }';

    const requests = [];
    for (let i = 0; i < numRequests; i++) {
      requests.push(executeCode("python", pythonCode));
      requests.push(executeCode("java", javaCode));
      requests.push(executeCode("kotlin", kotlinCode));
    }

    const results = await Promise.all(requests);

    results.forEach((result) => {
      expect(result.output).toBeDefined();
      expect(result.output).toMatch(/Concurrent (Python|Java|Kotlin) done!\n/);
      expect(result.error).toBeUndefined();
    });
  }, 60000); // Increased timeout for concurrent tests
});
