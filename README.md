# Code Executor Backend

A robust and secure backend service for executing user-submitted code in isolated Docker containers. This project provides an API endpoint to receive code snippets in various programming languages and runs them within dedicated, resource-limited Docker environments, returning the execution output.

## ✨ Features

- **Multi-Language Support:** Execute code written in Python, Node.js, and Java out-of-the-box. Easily extensible to support more languages.

- **Docker Isolation:** Each code execution runs in its own ephemeral Docker container, ensuring process isolation and preventing interference between different code submissions.

- **Resource Limiting:** Configurable memory and CPU limits for each execution to prevent resource exhaustion from malicious or inefficient code.

- **API-Driven:** Simple RESTful API endpoint for seamless integration with frontend applications or other services.

- **Temporary File Handling:** Manages temporary directories and files for each execution, ensuring clean-up after completion.

## 🚀 Technologies Used

- **Node.js:** The primary backend language, utilizing Express.js for the API.

- **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.

- **Docker:** Containerization platform used for isolating code execution environments.

- **Python:** Supported language for code execution.

- **Java (OpenJDK):** Supported language for code execution.

- **uuid:** For generating unique identifiers for temporary execution directories.

## 📋 Prerequisites

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

### Support the Project:

If `executeme` helps you or your project, consider showing your support. Your contributions help maintain and improve this tool for the entire developer community!

- **Sponsor on GitHub:** [https://github.com/sponsors/devlopersabbir](https://github.com/sponsors/devlopersabbir)
- **Buy Me a Coffee:** [https://buymeacoffee.com/devlopersabbir](https://buymeacoffee.com/devlopersabbir)

## 🏁 Conclusion

`executeme` offers a powerful, secure, and flexible solution for executing code in a sandboxed environment. By leveraging Docker, it provides the isolation needed for production use cases while remaining easy to integrate and extend. Give it a try for your next project that requires dynamic code execution!
