# OpenTicket Plugin Registry

Welcome to the **OpenTicket Plugin Registry**. This repository serves as the official, zero-cost, static JSON registry for the open-source [OpenTicket](https://github.com/Cyber-Sec-Space/openticket) SecOps platform.

By hosting our plugin ecosystem here, the main OpenTicket application can dynamically fetch available plugins directly via GitHub Pages or raw Git CDN, avoiding the need for a dedicated backend service.

## Architecture

*   **`registry.json`**: The core database. A static JSON array containing the metadata for all approved OpenTicket plugins.
*   **`schema.json`**: A JSON schema strictly defining the structure of `registry.json`. This ensures data integrity and prevents malformed submissions.
*   **GitHub Actions CI**: An automated `validate.yml` workflow run by `ajv-cli` validates any modifications to the registry on Pull Request to ensure structural correctness.

## Integration with OpenTicket Server

The OpenTicket Hook Engine polls this registry periodically to discover available plugins and their requisite configuration schemas. All plugin executions are handled securely within sandbox environments on the host application instance, maintaining high security standards.

## How to Submit a Plugin

The OpenTicket community is encouraged to develop and submit their own plugins to the registry!

1.  **Fork this Repository**: Click the 'Fork' button at the top right of this page.
2.  **Add Your Plugin**: Open `registry.json` and append your plugin's metadata object to the array. Ensure your plugin defines all required fields including its `id` (kebab-case), `version`, `icon` (Lucide icon name), and `configSchema`.
3.  **Validate Locally (Optional)**: You can use `ajv-cli` to test your changes locally:
    ```bash
    npm install -g ajv-cli
    ajv validate -s schema.json -d registry.json
    ```
4.  **Create a Pull Request**: Submit a Pull Request against our `main` branch. 
5.  **Pass Automated Checks**: Our CI pipeline will automatically lint and validate your JSON modifications.
6.  **Review**: Our maintainers will review the PR. Once approved, it will be mapped into the central ecosystem!
