# 離家以後，我們一起點燈｜Light Across Home

清華排燈節（Diwali）互動數位展覽網站。純靜態網頁（HTML + CSS + 原生 JavaScript 模組），放在 GitHub Pages；留言板資料存在 Supabase。

## 檔案結構

```
index.html            展覽首頁
editor.html           策展內容編輯頁（編輯 data/content.json 用）
assets/               圖片（hero.jpg、favicon.svg；新照片也放這裡）
data/
  content.json        展覽文字內容：人物故事、文化卡片、問答題、示例留言
  map.json            印度地圖底圖資料（Natural Earth）
css/styles.css        全站樣式
js/
  config.js           ★ Supabase 連線設定（唯一需要填的設定檔）
  lib/                共用小工具：DOM、瀏覽器儲存、內容讀取與檢查
  comments/           留言板：api.js（跟 Supabase 溝通）、board.js（留言 / 檢舉介面）
  app/                首頁各區塊：main.js（進入點）、map.js、stories.js、culture.js、wall.js …
  games/              互動工坊六個遊戲，一個遊戲一個檔案
  editor/editor.js    策展編輯頁
supabase/
  schema.sql          資料表、權限、留言 / 檢舉函式（貼到 Supabase SQL Editor 執行）
  functions/report-notify/index.ts   有人檢舉時寄 Gmail 通知的 Edge Function
docs/
  SETUP-SUPABASE.md   ★ 留言板設定步驟
  MODERATION.md       刪除 / 隱藏留言的方法
```

## 留言板

- 首頁「04 點燈留言」和每個人物展間的「想對 ○○ 說的話」共用同一套程式（`js/comments/`）。
- 留言即時公開；每則留言有「檢舉」，檢舉會寄 Gmail 給管理員，管理員到 Supabase 後台刪除。
- 第一次設定請照 **[docs/SETUP-SUPABASE.md](docs/SETUP-SUPABASE.md)**。
- `js/config.js` 留空時，留言板自動停用並顯示示例留言，網站其他功能照常。

## 更新展覽內容

1. 打開網站底部「策展內容編輯」（`editor.html`）。
2. 修改後按「儲存並預覽草稿」確認，再按「匯出網站內容」下載 `content.json`。
3. 用下載的檔案取代 repo 裡的 **`data/content.json`**，commit 後網站就會更新。
4. 照片上傳到 `assets/`，在編輯頁填 `assets/檔名.jpg`。

## 部署（GitHub Pages）

Repo 的 **Settings → Pages → Build and deployment**：Source 選 **Deploy from a branch**，Branch 選 `main`、資料夾 `/ (root)`。之後每次 push 到 `main` 就會自動更新。

> 用 GitHub 網頁上傳檔案時，請先進入對應資料夾再上傳（例如進 `data/` 再上傳 `content.json`），不要把所有檔案丟在最外層。

## 本機預覽

ES 模組不能用雙擊 `index.html` 開啟，需要一個簡單的伺服器：

```bash
python3 -m http.server 8080
# 打開 http://localhost:8080
```
