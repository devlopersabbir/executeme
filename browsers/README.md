# Code Execution Engine

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
