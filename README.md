* [English](README.md) | [繁體中文](README-zh-TW.md)

# OpenTicket Hybrid Plugin Registry

Welcome to the **OpenTicket Hybrid Plugin Registry**. This repository serves as the official integration ecosystem for the open-source [OpenTicket](https://github.com/Cyber-Sec-Space/openticket) SecOps platform.

The registry is designed with a **Hybrid Architecture**, allowing users to distribute plugins either via standard NPM packages or by hosting the raw `.tsx` source code directly within this repository.

## 🚀 OpenTicket 0.5.0 Architecture

With the release of OpenTicket 0.5.0, the plugin engine now supports **Bi-directional Synchronization**, allowing plugins to securely listen to and react to webhook events from external systems.
The new architecture requires plugins to use the dual `manifest` and `hooks` structured interface (Check our `github-issues` v1.1.0 plugin for a real-world example).

Additionally, for enterprise compliance, **developer metadata** (`name` and `email`) is now strictly required for all registry entries.

## Registry Architecture

*   **`registry.json`**: The core data registry mapping every validated plugin, maintaining multi-version endpoints.
*   **`schema.json`**: A stringent JSON schema enforcing validation logic, specifically for the `developer` object and `sourceType` properties.
*   **GitHub Actions CI**: Automated schema validation tests are run on every Push and Pull Request.

## Plugin Source Types

### 1. NPM (`sourceType: "npm"`)
Distribute compiled modules using the official node package manager.
* Set `"sourceType": "npm"` inside your version block in `registry.json`.
* The `"packageName"` parameter is strictly required.

### 2. Registry Hosted (`sourceType: "registry"`)
Distribute lightweight logic scripts straight from this repository.
* Set `"sourceType": "registry"`.
* Code MUST be placed precisely at: `/plugins/{id}/{version}/index.tsx`.

## How to Submit a Plugin

The OpenTicket community relies on collective plugins! 

1.  **Fork this Repository**: Start by forking the registry.
2.  **Define Metadata**: Append your plugin into `registry.json`. You **must** provide the `developer` block detailing your name and email.
3.  **Include the Source**: If using `"registry"`, place your `.tsx` code in `/plugins/<your-plugin-id>/<version>/index.tsx`.
4.  **Local Testing**:
    ```bash
    npm install -g ajv-cli
    ajv validate -s schema.json -d registry.json
    ```
5.  **Submit a PR**: Open a Pull Request completing the check sheet.

Thanks for contributing!
