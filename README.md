* [English](README.md) | [繁體中文](README-zh-TW.md)

# OpenTicket Hybrid Plugin Registry

Welcome to the **OpenTicket Hybrid Plugin Registry**. This repository serves as the official integration ecosystem for the open-source [OpenTicket](https://github.com/Cyber-Sec-Space/openticket) SecOps platform.

The registry is designed with a **Hybrid Architecture**, allowing users to distribute plugins either via standard NPM packages or by hosting the raw `.tsx` source code directly within this repository.

## 🚀 OpenTicket 0.5.0 Architecture

1. **Bi-directional Synchronization**: The plugin engine now supports lifecycle hooks allowing plugins to securely listen to and react to webhook events from exterior systems.
2. **Zero-Trust OAuth Authorization (`requestedPermissions`)**: To prevent supply-chain vulnerabilities, plugins must define a `requestedPermissions` array within `registry.json` (e.g., `["VIEW_INCIDENTS_ALL", "ADD_COMMENTS"]`). The central OpenTicket platform enforces this by spawning a secure Dual-Layer Consent Modal, requiring Admins to manually verify the permissions prior to downloading your code.
3. **Supply Chain File Integrity (`integritySha256`)**: If your plugin is hosted within this repository (`sourceType: "registry"`), you are fully required to execute `scripts/hash.js` against your codebase. This generates an unbreakable SHA256 hash required in the JSON schema, preventing Man-in-the-Middle (MITM) tampering. 
4. **Strict Publisher Disclosure**: For enterprise compliance, explicit `developer` objects and a `repositoryUrl` mapping to the source code are now fundamentally required.
5. **Structured Module Definitions**: Code must be separated explicitly into `manifest` and `hooks` objects.
6. **Native TypeScript Support**: A centralized `tsconfig.json` and strict type definitions for `@openticket/core` (via `types/openticket-core.d.ts`) are now bundled to give developers strongly-typed intellisense and safer integrations built right into your IDE.

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
4.  **Local Integrity Hash & Validation**:
    * Generate Supply Chain Signature (If `sourceType: "registry"`):
      ```bash
      node scripts/hash.js plugins/<your-plugin-id>/<version>/index.tsx
      # Insert the output hash straight into registry.json as "integritySha256"
      ```
    * Validate Registry Schema:
      ```bash
      npm install -g ajv-cli
      ajv validate -s schema.json -d registry.json
      ```
5.  **Submit a PR**: Open a Pull Request completing the check sheet.

Thanks for contributing!
