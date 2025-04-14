# Dependency Documentation for the CCTV Project

This documentation outlines the dependencies required for the **CCTV** project, which includes a Tauri (React TS frontend with Rust backend) and Python component.

## Project Overview

The project is a combination of:

- **Frontend**: React with TypeScript, using Vite as the build tool.
- **Backend**: Rust-based API (Tauri).
- **Python**: Small utility scripts for video processing and file management.

The dependencies in this document are essential for running and building the project, ensuring that you can reproduce the environment in the future.

## **1. Frontend Dependencies**

### **Dependencies**

These are the runtime dependencies needed for the frontend.

- **`@emotion/react`**: A library for writing CSS styles with JavaScript.

  - Version: `^11.14.0`

- **`@emotion/styled`**: A styled component library that works with Emotion.

  - Version: `^11.14.0`

- **`@ffmpeg-installer/ffmpeg`**: FFmpeg binaries packaged for Node.js, used for video processing.

  - Version: `^1.1.0`

- **`@mui/material`**: Material UI for React, a component library with Material Design.

  - Version: `^6.4.6`

- **`fluent-ffmpeg`**: A library to interact with FFmpeg programmatically in JavaScript.

  - Version: `^2.1.3`

- **`i18next`**: Internationalization library for JavaScript, useful for multilingual support.

  - Version: `^24.2.2`

- **`i18next-browser-languagedetector`**: Language detector for i18next in the browser.

  - Version: `^8.0.4`

- **`luxon`**: A powerful DateTime library for JavaScript.

  - Version: `^3.5.0`

- **`react`**: React library for building user interfaces.

  - Version: `^19.0.0`

- **`react-dom`**: React package for DOM-specific methods.

  - Version: `^19.0.0`

- **`react-i18next`**: Integration of i18next with React for translations.

  - Version: `^15.4.1`

- **`react-router-dom`**: Declarative routing for React.
  - Version: `^7.2.0`

### **Dev Dependencies**

These are development dependencies needed for building and testing the frontend.

- **`@eslint/js`**: ESLint configuration for JavaScript.

  - Version: `^9.21.0`

- **`@tauri-apps/cli`**: Command-line interface for Tauri, required for building the Rust backend.

  - Version: `^2.3.1`

- **`@types/luxon`**: TypeScript type definitions for Luxon.

  - Version: `^3.4.2`

- **`@types/node`**: TypeScript type definitions for Node.js.

  - Version: `^22.13.9`

- **`@types/react`**: TypeScript type definitions for React.

  - Version: `^19.0.10`

- **`@types/react-dom`**: TypeScript type definitions for React DOM.

  - Version: `^19.0.4`

- **`@typescript-eslint/eslint-plugin`**: ESLint plugin for TypeScript code.

  - Version: `5.50.0`

- **`@typescript-eslint/parser`**: TypeScript parser for ESLint.

  - Version: `5.50.0`

- **`@vitejs/plugin-react`**: Vite plugin for React support.

  - Version: `^4.3.4`

- **`eslint`**: Linter for JavaScript and TypeScript.

  - Version: `^8.57.1`

- **`eslint-config-airbnb-base`**: Airbnb base ESLint configuration.

  - Version: `^15.0.0`

- **`eslint-config-prettier`**: Disables conflicting rules between Prettier and ESLint.

  - Version: `^8.6.0`

- **`eslint-import-resolver-alias`**: Resolve aliases in imports for ESLint.

  - Version: `^1.1.2`

- **`eslint-import-resolver-typescript`**: Resolve TypeScript imports for ESLint.

  - Version: `^3.5.5`

- **`eslint-plugin-css-modules`**: ESLint plugin for CSS modules.

  - Version: `^2.12.0`

- **`eslint-plugin-import`**: ESLint plugin for managing import/export syntax.

  - Version: `^2.27.5`

- **`eslint-plugin-prettier`**: Prettier integration with ESLint.

  - Version: `4.2.1`

- **`eslint-plugin-react`**: React-specific ESLint rules.

  - Version: `^7.37.4`

- **`eslint-plugin-react-hooks`**: React hooks specific ESLint rules.

  - Version: `^5.2.0`

- **`eslint-plugin-react-refresh`**: ESLint plugin for React Fast Refresh.

  - Version: `^0.4.19`

- **`globals`**: Provides global variables for the environment.

  - Version: `^15.15.0`

- **`markdownlint-cli2`**: CLI for linting markdown files.

  - Version: `^0.17.2`

- **`npm-check`**: CLI tool to check and update npm dependencies.

  - Version: `^6.0.1`

- **`prettier`**: Code formatter to enforce consistent style.

  - Version: `^3.5.3`

- **`ts-unused-exports`**: Tool to detect unused exports in TypeScript.

  - Version: `^9.0.4`

- **`typescript`**: TypeScript language and compiler.

  - Version: `^5.8.2`

- **`typescript-eslint`**: TypeScript ESLint parser and plugin.

  - Version: `^8.26.0`

- **`vite`**: Build tool and development server.
  - Version: `^6.2.0`

## **2. Python Dependencies**

While Python is not a core part of this project, the script for generating video thumbnails depends on a few key Python libraries.

- **`ffmpeg-python`**: A wrapper for FFmpeg to handle video processing.

  - Install via: `pip install ffmpeg-python`

- **`os` and `subprocess`**: These are Python standard libraries used for file manipulation and executing external commands.

## **3. How to Reproduce the Environment**

1. **Frontend (React + TypeScript)**:

   - Run `npm install` to install the necessary dependencies.
   - To start the development server: `npm run dev`.
   - To build the frontend: `npm run build`.

2. **Backend (Tauri + Rust)**:

   - Ensure that Rust is installed (`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`).
   - Use Tauri to build the Rust backend (`npm run tauri`).

3. **Python (Video Processing)**:

   - Install Python and the necessary libraries: `pip install ffmpeg-python`.
   - The Python scripts are located in the `/scripts` directory.

4. **General Setup**:

   - Make sure that the project’s dependencies are installed in the appropriate directories and that all environment variables and configurations are set up properly.

5. **VSCode Recommendations**:
   - Recommended extensions for VSCode include:
     - ESLint
     - Prettier
     - Tauri Support
     - Python

## **4. Additional Notes**

- **Environment Setup**: Ensure you have Node.js, npm, Rust, Python, and FFmpeg installed and properly configured in your system.
- **Version Control**: Keep track of the versions of each dependency, as updates could introduce breaking changes. You can lock dependencies with `npm-lock` or `yarn.lock` files.
- **Cross-Platform Support**: Some dependencies, like FFmpeg, may require additional installation steps on Windows or other OS.

By following these instructions and ensuring you have the proper dependencies, you should be able to successfully reproduce and work within the project environment.
