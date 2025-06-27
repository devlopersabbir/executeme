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
