<h1 align="center">🚀 ExecuteMe – Run Code Instantly and Securely</h1>

**[ExecuteMe](https://executeme.vercel.app)** is a powerful and minimalistic online code execution platform that allows developers to write, run, and test code in multiple programming languages instantly and securely — all within the browser.

Whether you're experimenting with a new idea or teaching code, ExecuteMe gives you a real-time, sandboxed environment that works out of the box.

## ✨ Features
- **⚡ Instant Code Execution** – Run your code in real-time with just one click
- **🔒 Secure Sandbox** – Ensures your code runs in a safe, isolated environment
- **🧠 Multi-language Support** – Supports a growing list of languages including:
  - 🐍 Python
  - 🟨 JavaScript
  - 🟦 TypeScript
  - ☕ Java
  - 💙 Kotlin
- **🎨 Full Syntax Highlighting** – Modern and readable code editor with theme support
- **🖥️ Responsive UI** – Works smoothly across all devices
- **🌐 Live User Activity** – Shows active coders in real-time
- **💾 Open Source** – Freely available to use, modify, and contribute

## 🛠️ Built With
- **⚛️ NextJs** – For frontend and tailwindcss for designing user interface
- **🧰 Monaco Editor** – Powerful web-based code editor (from VS Code)
- **🌍 Node.js + Express** – Backend service for execution management
- **🔄 Docker** – Containerized code execution
- **📡 Socket.IO** – Real-time connection to track active users
- **📁 NodeCache** – In-memory cache for managing live sessions
- **🔐 Custom Docker Images** – Tailored environments per language

## 🧩 Architecture & Execution Challenges
Designing ExecuteMe required solving real-world challenges in scalability, isolation, and memory/resource management:

## ⚙️ On-Demand Container Execution
- 📦 Each execution triggers a **new Docker container**, isolated per language and user
- 🧾 Code is saved temporarily in a unique `UUID` directory (e.g., `/temp/<uuid>`)
- 🧼 After execution, both the **container and the temporary code directory** are destroyed automatically
- ✅ Ensures **complete statelessness** and no leftover data between runs

## 🧠 Memory & CPU Management
- 🧠 Containers are limited via flags:
  --memory=512m and --cpus=0.5
- 🔁 Ensures no user can overuse system resources
- 🧹 Automatic cleanup after every run helps maintain low disk and memory usage

## 🔁 Concurrent Execution Handling
- ⏱️ Uses `async/await` and `promisify(exec)` to avoid blocking the event loop
- ⚡ Handles **multiple user requests at the same time**, spawning separate containers for each
- 🛠️ Every language is handled via its own custom-built Docker image (`executor-python`, `executor-java`, etc.)

## 🔒 Security Isolation
- 🔐 Code runs in **completely sandboxed containers** with:
  - No access to host machine
  - No persistent file system or shared memory
- 🚫 Containers are removed after use with --rm to prevent abuse
- ✅ Each language has its own minimal, locked-down Docker image

## 👥 Real-Time User Tracking
- 📡 `Socket.IO + NodeCache` manage user connections in real-time
- 👀 Displays current active users to the frontend
- ♻️ Cleans up cache on disconnect to prevent stale connections

## 📋 Prerequisites - For contribution
Before you get started, ensure you have the following installed on your system:

- [**Docker**](https://docs.docker.com/get-docker/): Docker Engine and Docker Compose (Docker Desktop includes both).

- [**Node.js**](https://nodejs.org/en/download/) (LTS version, e.g., 20.x or higher)

- [**npm**](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (comes with Node.js)

## 🧑‍💻 Contributing & Supporting

`executeme` is a fully open-source project, and contributions are highly encouraged! Whether it's adding new language support, improving performance, fixing bugs, or enhancing documentation, your input is valuable.

### How to Contribute:

1.  Fork the [GitHub repository](https://github.com/devlopersabbir/executeme).
2.  Clone your fork.
3.  Create a new branch for your feature or bug fix.
4.  Make your changes, write tests, and ensure code quality.
5.  Open a Pull Request with a clear description of your work.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.

### Support the Project:

If `executeme` helps you or your project, consider showing your support. Your contributions help maintain and improve this tool for the entire developer community!

- **Sponsor on GitHub:** [https://github.com/sponsors/devlopersabbir](https://github.com/sponsors/devlopersabbir)
- **Buy Me a Coffee:** [https://buymeacoffee.com/devlopersabbir](https://buymeacoffee.com/devlopersabbir)

### Specially Thanks 💕
<a href="https://github.com/devlopersabbir/executeme/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=devlopersabbir/executeme" />
</a>

Made with [contrib.rocks](https://contrib.rocks).
