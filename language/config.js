export const LANGUAGE_CONFIG = {
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
  typescript: {
    image: "executor-deno",
    mainFile: "index.ts",
    cmd: "deno run --allow-all index.ts",
  },
  java: {
    image: "executor-java",
    mainFile: "Main.java",
    cmd: 'sh -c "javac Main.java && java Main"',
  },
  kotlin: {
    image: "executor-kotlin",
    mainFile: "index.kt",
    cmd: 'sh -c "kotlinc index.kt -include-runtime -d index.jar && java -jar index.jar"',
  },
};
