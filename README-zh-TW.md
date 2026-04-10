* [English](README.md) | [繁體中文](README-zh-TW.md)

# OpenTicket Hybrid Plugin Registry (混合型外掛註冊表)

歡迎來到 **OpenTicket 混合型外掛註冊表 (Hybrid Plugin Registry)**。這個儲存庫是開源資安維運 (SecOps) 平台 [OpenTicket](https://github.com/Cyber-Sec-Space/openticket) 的官方外掛整合生態系。

本註冊表採用**混合架構 (Hybrid Architecture)**，允許使用者透過標準 NPM 套件系統發布外掛，或是直接將原始 `.tsx` 程式碼託管於此儲存庫中進行散佈。

## 🚀 OpenTicket 0.5.0 引擎架構

隨著 OpenTicket 0.5.0 的發布，外掛引擎帶來了全面升級：
1.  **雙向同步 (Bi-directional Sync)**：現在外掛支援全新的生命週期（如 `onIncidentResolved`, `onWebhookReceived` 等），您可以透過處理回傳的 Webhook 做到真正的雙向狀態連動（請參考我們的 `github-issues` 1.1.0 官方範例）。
2.  **Zero-Trust OAuth 授權牆 (`requestedPermissions`)**：為了防止供應鏈攻擊，所有的外掛版本現在必須在 `registry.json` 中宣告 `requestedPermissions` 權限陣列 (例如 `["VIEW_INCIDENTS_ALL", "ADD_COMMENTS"]`)。OpenTicket 主平台在下載外掛前，會透過此欄位生成「雙層授權同意視窗」供管理員審核。
3.  **供應鏈檔案雜湊認證 (`integritySha256`)**：若您選擇將原始碼靜態託管於本註冊庫 (`sourceType: "registry"`)，您必須使用隨附的 `scripts/hash.js` 為您的 `index.tsx` 產生並綁定 SHA256 驗證碼，阻絕任何中間人 (MITM) 代碼竄改。
4.  **嚴格開發者揭露**：提升開源企業級實踐的安全性，現在每一筆外掛在 `registry.json` 中都必須定義 `developer` (開發人員) 物件與 `repositoryUrl` (原始碼追溯位置)。
5.  **結構化外掛定義**：外掛程式碼現在要求嚴格區分 `manifest` 與 `hooks` 等物件模組來增加擴充性。

## 架構說明

*   **`registry.json`**: 核心資料註冊表，用來定義及映射生態系中每一個通過驗證的外掛與歷史版本。
*   **`schema.json`**: 嚴格的 JSON Schema 規則檔，用以強制執行對於開發者資訊與來源類型變數的審查邏輯。
*   **GitHub Actions CI**: 自動化驗證管道。發起的 PR 會自動經由架構對錯的死角清查，阻絕錯誤配置。

## 外掛來源類型 (Source Types)

### 1. NPM 套件 (`sourceType: "npm"`)
使用官方 Node 套件管理服務 (NPM) 來發布您的模組。
* 在 `registry.json` 將特定版本 `"sourceType"` 設為 `"npm"`。
* 嚴格要求填寫 `"packageName"`（外部載入位置）。

### 2. 註冊表直接託管 (`sourceType: "registry"`)
直接透過本儲存庫散佈輕量級的邏輯腳本。OpenTicket 會在執行時期直接安全注入依賴模組。
* 將特定版本 `"sourceType"` 設為 `"registry"`。
* 原始程式碼檔**必須嚴格地**放置於此儲存庫內的特定路徑：`/plugins/{id}/{version}/index.tsx`。

## 如何提交外掛

如果您有客製化的資安整合工具，請遵循以下步驟貢獻給生態系：

1.  **Fork 儲存庫**: 點擊右上角 Fork 鈕。
2.  **註冊定義檔**: 在 `registry.json` 中加上您的外掛，記得必須加上合規的 `developer` 物件資訊。
3.  **撰寫程式碼**: 依照 `manifest/hooks` 新架構放入 `/plugins/<你的外掛id>/<version>/index.tsx` 中。
4.  **本機驗證與雜湊產生**:
    * 產生完整性簽證（當 `sourceType: "registry"` 時）：
      ```bash
      node scripts/hash.js plugins/<你的外掛id>/<version>/index.tsx
      # 並將輸出的 integritySha256 值填入 registry.json
      ```
    * 執行 Schema 檢查：
      ```bash
      npm install -g ajv-cli
      ajv validate -s schema.json -d registry.json
      ```
5.  **提交 PR**: 發起一筆 Pull Request 回主儲存庫。

感謝您為開源社群的貢獻！
