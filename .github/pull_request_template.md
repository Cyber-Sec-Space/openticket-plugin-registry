## OpenTicket Hybrid Plugin Submission

Thank you for contributing to the OpenTicket Plugin Registry! Please ensure your pull request adheres to the correct architectural checklist depending on your `sourceType`.

### 📋 Registry JSON Checklist (Required for All)
- [ ] My plugin definition has been added to `registry.json`.
- [ ] My plugin's `id` is globally unique and formatted in `kebab-case`.
- [ ] I have declared a `sourceType` (either `"npm"` or `"registry"`).
- [ ] I have verified the JSON syntax is valid and passes `schema.json` via local or CI tests.
- [ ] I have included the correct `configSchema` detailing all required environment variables.

### 📦 NPM Distribution (`sourceType: "npm"`)
*If applicable:*
- [ ] I have provided the definitive publish name within the `"packageName"` parameter.
- [ ] The referenced NPM package is permanently available to the public.

### 🗃️ Raw File Hosting (`sourceType: "registry"`)
*If applicable:*
- [ ] I have created the folder structure strictly mapping to `/plugins/{id}/{version}/index.tsx`.
- [ ] My `index.tsx` file executes securely, exporting a valid `OpenTicketPlugin` object interface.

### 📝 Plugin Summary
*   **Plugin Name:** 
*   **Source Type:**
*   **Purpose:**

### 🔒 Security Acknowledgement
- [ ] I confirm that this plugin does not execute destructive payloads, maliciously exfiltrate platform state, or exploit dependencies.
