# Contributing to Workspace

Thank you for your interest in contributing to Workspace! We welcome your help in improving our project, fixing bugs, adding new features, and enhancing our documentation. By contributing, you help us create a robust, scalable, and maintainable scraping framework.

---

## Table of Contents

- [Contributing to Workspace](#contributing-to-workspace)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Requesting Features](#requesting-features)
  - [Pull Request Process](#pull-request-process)
  - [Development Setup](#development-setup)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Building the Project](#building-the-project)
  - [Coding Guidelines](#coding-guidelines)
  - [Documentation](#documentation)
  - [Questions](#questions)
  - [License](#license)

---

## Code of Conduct

We strive to create a welcoming and inclusive environment for everyone. Please review our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

---

## How to Contribute

There are many ways to contribute to Workspace:

- **Bug Reports:** Identify and report issues or unexpected behaviors.
- **Feature Requests:** Suggest enhancements or new features.
- **Code Contributions:** Submit patches, new features, or improvements.
- **Documentation:** Improve or add documentation and examples.
- **Testing:** Write tests and help improve our test coverage.

Your contributions are appreciated, whether it's a simple typo fix or a significant feature addition.

---

## Reporting Bugs

Before reporting a bug:

1. **Search** the issue tracker to ensure it hasn't already been reported.
2. **Provide a clear title** and description.
3. **Include detailed steps** to reproduce the bug.
4. **Explain the expected vs. actual behavior.**
5. **Attach logs or screenshots** if applicable.

Please open a new issue on GitHub with this information.

---

## Requesting Features

If you have an idea for a new feature:

1. **Check the issue tracker** to see if it has been suggested already.
2. **Describe the feature** and its benefits in detail.
3. **Include use cases** and explain how the feature would improve the project.
4. **Discuss potential impacts** on existing functionality.

Feature requests can be submitted as GitHub issues.

---

## Pull Request Process

1. **Fork the Repository:** Click on the "Fork" button at the top-right of the repository.
2. **Create a New Branch:** Create your feature or bugfix branch from the `main` branch.
3. **Write Clear Commit Messages:** Each commit message should be concise and descriptive.
4. **Follow Coding Guidelines:** Ensure your code adheres to our TypeScript, ESLint, and project conventions.
5. **Run Tests:** Make sure all tests pass by running `pnpm make test` before submitting.
6. **Submit a Pull Request:** Open a PR against the `main` branch with a clear description of your changes and link to any related issues.

Our team will review your pull request and provide feedback.

---

## Development Setup

### Prerequisites

- Node.js (v22.14 or later)
- pnpm
- Python (v3.12 or later)
- Docker

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/mend3/workspace.git
cd workspace

make up TARGET="<docker_service_name>"
```

### Building the Project

Compile using Docker:

```bash
make build
```

---

## Coding Guidelines

- **Language & Style:**  
  The project is written in TypeScript with strict type safety enabled. Follow our ESLint and Prettier configurations to ensure code consistency.

- **Modularity:**  
  Write modular, reusable, and well-documented code. Break down complex logic into smaller, testable functions.

- **Documentation:**  
  Use JSDoc-style comments to document functions, classes, and public APIs. Ensure that changes are reflected in the documentation.

- **Testing:**  
  Write unit tests for new features and bug fixes. Ensure full coverage of critical code paths.

- **Commit Messages:**  
  Write descriptive commit messages that explain the "why" behind your changes.

---

Please add new tests for any features or bug fixes you implement.

---

## Documentation

- **README:**  
  The main README provides an overview of the project. Update it if you add significant new features.
- **Code Comments:**  
  Ensure your code is well-commented, especially for complex logic.
- **API Documentation:**  
  Use inline JSDoc comments to describe public methods and classes.

---

## Questions

If you have any questions or need assistance, please open an issue on GitHub or join our community chat if available.

---

## License

This project is licensed under the MIT License. By contributing, you agree that your contributions will be licensed under the MIT License.

---

Happy coding, and thank you for helping to make Workspace even better!
