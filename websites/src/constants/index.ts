export * from "./editor";
export const LANGUAGE_MAP = {
  python: "python",
  javascript: "nodejs",
  typescript: "typescript",
  java: "java",
  //   cpp: 'cpp',
  //   c: 'c',
  //   go: 'go',
  //   rust: 'rust',
  //   php: 'php',
  //   ruby: 'ruby',
  //   html: 'html',
  //   css: 'css',
  //   json: 'json',
  //   xml: 'xml',
  //   sql: 'sql',
} as const;

export const SAMPLE_CODE: Record<string, string> = {
  python: `# Welcome to Execute Me - Python
  def hello_world():
      print("Hello, World!")
      return 42
  
  # Your code here
  result = hello_world()
  print(f"Result: {result}")`,

  javascript: `// Welcome to Execute Me - JavaScript
  function helloWorld() {
      console.log("Hello, World!");
      return 42;
  }
  
  // Your code here
  const result = helloWorld();
  console.log(\`Result: \${result}\`);`,

  typescript: `// Welcome to Execute Me - TypeScript
  function helloWorld(): number {
      console.log("Hello, World!");
      return 42;
  }
  
  // Your code here
  const result: number = helloWorld();
  console.log(\`Result: \${result}\`);`,

  java: `// Welcome to Execute Me - Java
  public class Main {
      public static void main(String[] args) {
          System.out.println("Hello, World!");
          int result = 42;
          System.out.println("Result: " + result);
      }
  }`,

  cpp: `// Welcome to Execute Me - C++
  #include <iostream>
  using namespace std;
  
  int main() {
      cout << "Hello, World!" << endl;
      int result = 42;
      cout << "Result: " << result << endl;
      return 0;
  }`,

  c: `// Welcome to Execute Me - C
  #include <stdio.h>
  
  int main() {
      printf("Hello, World!\\n");
      int result = 42;
      printf("Result: %d\\n", result);
      return 0;
  }`,

  go: `// Welcome to Execute Me - Go
  package main
  
  import "fmt"
  
  func main() {
      fmt.Println("Hello, World!")
      result := 42
      fmt.Printf("Result: %d\\n", result)
  }`,

  rust: `// Welcome to Execute Me - Rust
  fn main() {
      println!("Hello, World!");
      let result = 42;
      println!("Result: {}", result);
  }`,

  php: `<?php
  // Welcome to Execute Me - PHP
  echo "Hello, World!\\n";
  $result = 42;
  echo "Result: " . $result . "\\n";
  ?>`,

  ruby: `# Welcome to Execute Me - Ruby
  puts "Hello, World!"
  result = 42
  puts "Result: #{result}"`,
};
