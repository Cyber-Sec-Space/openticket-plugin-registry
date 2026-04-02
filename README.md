# OpenTicket Hybrid Plugin Registry

Welcome to the **OpenTicket Hybrid Plugin Registry**. This repository serves as the official integration ecosystem for the open-source [OpenTicket](https://github.com/Cyber-Sec-Space/openticket) SecOps platform.

The registry is designed with a **Hybrid Architecture**, allowing users to distribute plugins either via standard NPM packages or by hosting the raw `.tsx` source code directly within this repository.

## Architecture

*   **`registry.json`**: The core data registry. A static JSON array mapping every validated plugin in our ecosystem.
*   **`schema.json`**: A stringent JSON schema enforcing validation logic, particularly regarding the `sourceType` property.
*   **GitHub Actions CI**: Automated JSON structure and schema validation tests run on every Push and Pull Request block misconfigured plugins.

## Plugin Source Types

### 1. NPM (`sourceType: "npm"`)
Distribute compiled modules using the official node package manager.
* Setup your plugin object in `registry.json`.
* Set `"sourceType": "npm"`.
* The `"packageName"` object parameter is strictly required (e.g. `"@your-org/openticket-plugin"`).

### 2. Registry Hosted (`sourceType: "registry"`)
Distribute lightweight logic scripts straight from this repository. OpenTicket accesses the `.tsx` execution logic at runtime.
* Setup your plugin object in `registry.json`.
* Set `"sourceType": "registry"`. (`packageName` should not be defined).
* The raw source code MUST be placed precisely at: `/plugins/{id}/{version}/index.tsx` inside this repository.

## How to Submit a Plugin

The OpenTicket community relies on collective plugins! Follow the steps below to integrate your service.

1.  **Fork this Repository**: Start by forking the registry.
2.  **Define the Metadata**: Append your object definition into `registry.json` with the correct `id` and `sourceType`.
3.  **Include the Source (If applicable)**: If using `"registry"`, create the directory path `/plugins/<your-plugin-id>/<version>/index.tsx` and place your code there.
4.  **Local Testing (Optional but Recommended)**:
    ```bash
    npm install -g ajv-cli
    ajv validate -s schema.json -d registry.json
    ```
5.  **Submit a PR**: Open a Pull Request completing the check sheet.

Thanks for contributing!
