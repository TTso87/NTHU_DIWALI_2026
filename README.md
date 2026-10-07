# 排燈節網站：GitHub 網頁上傳專用修正版

這個版本刻意將所有必要檔案放在同一層，和目前儲存庫的結構一致。

## 更新方式

1. 解壓縮下載的 ZIP。
2. 開啟 https://github.com/chaosansan33-code/NTHU_DIWALI_2026/upload/main 。
3. 將解壓後的所有檔案一起拖進 GitHub 上傳畫面。請上傳檔案，不是 ZIP 本身。
4. 按 Commit changes 提交到 main，等待目前的 GitHub Pages 部署完成。
5. 回到 https://chaosansan33-code.github.io/NTHU_DIWALI_2026/ ，按 Ctrl+Shift+R 強制重新載入。

不用刪除儲存庫，也不用改 Pages 設定；同名檔案會以這次上傳的版本更新。

## 這次修正

網站原先要讀 data/content.json、data/map.json、assets/hero.jpg 與 assets/favicon.svg，但上傳後全部在根目錄，所以內容與圖片載入失敗。此版本所有路徑已改為根目錄。

另外加入明確且持續顯示的錯誤提示，指出缺少哪個檔案。地圖底圖失敗不會阻止人物故事與遊戲啟動。

## 之後替換內容

開啟 editor.html 編輯、預覽並匯出 content.json，將它放回儲存庫根目錄，覆蓋同名檔案。此版本不需要 data 或 assets 資料夾。圖片可直接放同一層，再於編輯頁填寫檔名，例如 my-photo.jpg。

目前尚未設定真正共享的公開留言；Demo 留言仍只儲存於各自瀏覽器。原本的互動與虛構示例標示均保留。
