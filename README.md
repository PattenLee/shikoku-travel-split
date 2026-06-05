# 四國旅行費用分攤 Web App

一個簡潔好用的網頁版費用分攤應用，專為 4 人旅行團隊設計。

## 功能特性

- **消費記錄管理**：輕鬆新增、編輯和刪除消費記錄
- **多幣別支持**：支援日幣（¥）和台幣（NT$）切換
- **自動結算**：實時計算每人應付/應收金額
- **結算建議**：自動生成最優結算方案
- **本地存儲**：所有數據存儲在瀏覽器本地，無需服務器
- **深色模式**：自動適應系統深色模式設置
- **繁體中文**：完整的繁體中文界面

## 快速開始

### 開發環境

```bash
# 安裝依賴
pnpm install

# 啟動開發服務器
pnpm dev

# 構建生產版本
pnpm build
```

### 使用方法

1. **首頁**：查看成員狀態和總消費金額
2. **新增消費**：記錄消費項目、金額、付款人和分攤對象
3. **查看結算**：查看詳細結算信息和消費記錄
4. **設置**：調整匯率和管理數據

## 技術棧

- React 19
- TypeScript
- Vite
- CSS3（自定義設計系統）
- localStorage（本地數據存儲）

## 項目結構

```
src/
├── pages/              # 頁面組件
│   ├── HomePage.tsx
│   ├── AddExpensePage.tsx
│   ├── SettlementPage.tsx
│   └── SettingsPage.tsx
├── context/            # React Context
│   └── ExpenseContext.tsx
├── utils/              # 工具函數
│   └── expenseUtils.ts
├── types.ts            # TypeScript 類型定義
├── App.tsx             # 主應用組件
├── App.css             # 全局樣式
└── main.tsx            # 入口文件
```

## 數據存儲

應用使用瀏覽器的 localStorage 存儲所有數據。數據包括：

- 消費記錄列表
- 成員信息
- 當前幣別設置
- 匯率設置

## 部署

### 靜態部署

構建的應用可以部署到任何靜態網站托管服務：

```bash
# 生成生產構建
pnpm build

# dist 文件夾包含所有靜態文件，可直接上傳到服務器
```

支持的托管平台：
- Vercel
- Netlify
- GitHub Pages
- 任何支持靜態文件的 Web 服務器

## 許可證

MIT
