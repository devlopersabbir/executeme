import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // globalSetup: './tests/globalSetup.js',
    // globalTeardown: './tests/globalTeardown.js',
    // Timeout for individual tests (in milliseconds)
    testTimeout: 30000, // 30 seconds for each test
    hookTimeout: 60000, // 60 seconds for beforeAll/afterAll hooks
    // Exclude your temporary directories from test discovery
    exclude: ["**/node_modules/**", "**/dist/**", "**/temp/**"],
  },
});
