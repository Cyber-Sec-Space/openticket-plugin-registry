* [English](README.md) | [繁體中文](README-zh-TW.md)

# OpenTicket Hybrid Plugin Registry (混合型外掛註冊表)

歡迎來到 **OpenTicket 混合型外掛註冊表 (Hybrid Plugin Registry)**。這個儲存庫是開源資安維運 (SecOps) 平台 [OpenTicket](https://github.com/Cyber-Sec-Space/openticket) 的官方外掛整合生態系。

本註冊表採用**混合架構 (Hybrid Architecture)**，允許使用者透過標準 NPM 套件系統發布外掛，或是直接將原始 `.tsx` 程式碼託管於此儲存庫中進行散佈。

## 架構說明

*   **`registry.json`**: 核心資料註冊表。一個靜態的 JSON 陣列，用來定義及映射生態系中每一個通過驗證的外掛（包含支援的各種版本資訊）。
*   **`schema.json`**: 嚴格的 JSON Schema 規則檔，用以強制執行驗證邏輯，特別是針對外掛多版本 (`versions`) 與來源類型 (`sourceType`) 的規範。
*   **GitHub Actions CI**: 自動化的驗證管道。任何人發起 Push 或 Pull Request 時皆會自動執行 JSON 結構及 Schema 驗證測試，藉此阻擋結構無效或配置錯誤的外掛。

## 外掛來源類型 (Source Types)

### 1. NPM 套件 (`sourceType: "npm"`)
使用官方 Node 套件管理服務 (NPM) 來發布您的模組。
* 在 `registry.json` 針對特定版本設定您的外掛定義。
* 將特定版本的 `"sourceType"` 設為 `"npm"`。
* 嚴格要求必須填寫 `"packageName"` 參數（範例： `"@your-org/openticket-plugin"`）。

### 2. 註冊表直接託管 (`sourceType: "registry"`)
直接透過本儲存庫散佈輕量級的邏輯腳本。OpenTicket 會在執行時期直接載入該 `.tsx` 腳本的邏輯。
* 在 `registry.json` 針對特定版本設定您的外掛定義。
* 將特定版本的 `"sourceType"` 設為 `"registry"`。（這時不該定義 `packageName`）。
* 您的原始程式碼檔**必須嚴格地**放置於此儲存庫內的特定路徑：`/plugins/{id}/{version}/index.tsx`。

## 如何提交外掛

OpenTicket 社群的強大來自於大家共同貢獻外掛！請遵循以下步驟來將您的服務整合進生態系：

1.  **Fork 儲存庫**: 點擊右上角的 Fork 按鈕。
2.  **定義 Metadata**: 在 `registry.json` 中加上您的外掛物件，確保具有獨特的 `id`（kebab-case 格式）以及支援版本的 `sourceType` 等宣告。
3.  **放入原始碼（若適用）**: 如果您採用 `"registry"` 託管模式，請依據規範建立目錄結構 `/plugins/<你的外掛id>/<version>/index.tsx`，並將程式碼置於其中。
4.  **本機驗證（非強制，但強烈建議）**:
    您可以利用 `ajv-cli` 在本地端即時測試您的改動是否符合規範：
    ```bash
    npm install -g ajv-cli
    ajv validate -s schema.json -d registry.json
    ```
5.  **提交 PR**: 發起一筆 Pull Request 回主儲存庫，並確實勾選與完成自動帶入的檢查清單 (Checklist)。

感謝您為開源社群的貢獻！
