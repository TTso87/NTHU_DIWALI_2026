# 離家以後，我們一起點燈 · Light Across Home

可直接部署到 GitHub Pages 的沉浸式排燈節數位策展 Demo。純 HTML、CSS、JavaScript，不需要安裝套件或打包。

## 已完成

- 氛圍首頁、真實地理資料的印度故事地圖、城市光點與主題篩選。
- 六個明確標示為虛構的示範人物；可持續新增。
- 人物展間：引言、文章、YouTube／MP4、音訊、封面、相簿、記憶抽屜、個人留言與收藏。
- 六種互動：Rangoli 幾何上色與 SVG 下載、六組配對翻牌、可編輯問答、五關光音記憶、故事尋光、明信片 PNG 下載。
- 留言主題篩選、本機新增與刪除；giscus 公開討論區整合開關。
- 策展內容編輯頁：新增／移除人物、編輯座標與文字、圖片嵌入、JSON 匯入匯出、草稿預覽。
- 手機排版、鍵盤操作、原生對話框、減少動態偏好。

## 預覽

在此資料夾啟動一般靜態網站伺服器，例如：

```sh
python -m http.server 4173
```

瀏覽 `http://localhost:4173`。不能直接雙擊 index.html：瀏覽器會限制本機檔案的資料讀取。

## 放上 GitHub

1. 將此資料夾「內部所有檔案」放入指定儲存庫，讓 `index.html` 位於儲存庫根目錄。
2. 最簡單：在 Settings → Pages → Build and deployment 選 **Deploy from a branch**，選 main 分支、`/(root)`，儲存。
3. 或使用隨附的 `.github/workflows/pages.yml`：選 **GitHub Actions** 作為 Pages Source，推送到 main 後自動部署。兩種方式擇一。
4. 等待部署完成，再使用 GitHub 顯示的正式 Pages 網址。此交付本身尚未建立儲存庫或公開發布。

官方說明：https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

所有網站路徑皆為相對路徑，支援 `https://帳號.github.io/儲存庫名稱/`。人物使用 `#story/人物id` 深層連結，重新整理不會造成 Pages 404。

## 如何替換你的內容

1. 在網站底部點「策展內容編輯」，或開啟 `editor.html`。
2. 先編輯展覽名稱與首頁，再逐一修改人物；新增人物時座標使用「經度、緯度」。
3. 圖片可填 `assets/my-photo.jpg`，並將檔案一起放入 assets。也能選圖片直接嵌入內容檔；大量照片建議用檔案路徑，避免瀏覽器儲存額度不足。
4. 訪談影片填 YouTube 分享連結或 `assets/interview.mp4`。音訊同理。建議先為影片製作字幕；本版不自動產生或翻譯字幕。
5. 點「儲存並預覽草稿」：只在此裝置預覽，不會改變公開網站。
6. 點「匯出網站內容」，將下载的 `content.json` 替換到 GitHub 的 `data/content.json`。有新媒體檔時一併上傳。
7. 等候 Pages 更新，再檢查公開版。草稿預覽有 `?preview=1`；正式觀展網址不應包含此參數。

請保持已上線人物的 `id` 不變，它會連到故事網址、收藏與公開討論串。編輯頁不是登入後台；任何訪客都能編輯自己的本機草稿，但無法因此改動 GitHub 或公開網站。不要在內容檔放密碼或私人資料。

`data/content.json` 集中存放網站內容，`data/map.json` 是地圖底圖。主要版面在 `index.html`，樣式在 `styles.css`。

## 留言：Demo 與正式公開的差別

目前的留言、收藏、遊戲進度都保存在各自瀏覽器的 localStorage，不跨裝置、不會傳給其他觀眾，也沒有管理員審核後台。虛構範例留言有明確標記。

已預留 giscus 整合，用 GitHub Discussions 儲存真正共享的留言：

1. 在要使用的公開 GitHub 儲存庫啟用 Discussions。
2. 按 https://giscus.app/zh-TW 的說明安裝 giscus App 到該儲存庫，選擇合適的討論分類。
3. 取得 repo、repoId、category、categoryId，在編輯頁「公開留言設定」填入並勾選啟用。
4. 匯出並部署內容檔。網站將在總留言區及各人物頁顯示獨立公開留言串。

giscus 訪客需登入 GitHub；討論管理在 GitHub 進行。本版本沒有匿名共享留言、上傳留言照片或「先審核再公開」。若需要，正式版須另接資料庫與管理者權限。公開留言整合尚未設定與端到端驗證。

## 真實素材上線前

- 逐篇替換虛構人物、引言與示意文字，取得本人對姓名、照片、影片及公開範圍的確認。
- 取消該人物「虛構示例」勾選；更新「關於展覽」說明與文化卡片。
- 本版為繁體中文介面搭配英文展區標題，尚非完整中英文切換版本。
- 人物可填任何經緯度；本展底圖以印度及鄰近地區為範圍。
- 若人物家鄉重疊，可從右側人物清單進入；本版未實作同點聚合。
- 完成真實影片字幕、圖片替代說明、文化內容與翻譯審閱。
- 在正式網域驗證影片、圖片、公開留言、手機操作及分享網址。

## 30 天上線安排

| 時間 | 工作與完成條件 |
|---|---|
| 第 1–3 天 | 確認此 Demo 風格、GitHub 網址、招募與採訪同意方式；完成一位人物的真實樣板 |
| 第 4–12 天 | 採訪、照片與錄音蒐集；同步整理逐字稿與人物故事 |
| 第 13–19 天 | 剪輯字幕、文化審閱、雙語內容製作；替換示例並依訪談調整遊戲 |
| 第 20–24 天 | 確認公開留言方案並串接；完成手機與無障礙檢查 |
| 第 25–27 天 | 邀請受訪者與同學試用、確認公開內容、修正問題 |
| 第 28–30 天 | 正式部署、QR 碼、備份、維護分工与成果紀錄 |

## 素材與授權記錄

- `assets/hero.jpg`：本專案使用 imagegen 生成的氛圍影像，不是真實排燈節現場紀錄。
- `data/map.json`：Natural Earth 1:110m 國界資料，擷取印度及鄰近國家。公有領域：https://www.naturalearthdata.com/about/terms-of-use/ 。原始資料：https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson 。邊界依資料來源呈現，僅供家鄉定位。
- 字型：Google Fonts 的 Noto Sans TC、Noto Serif TC；離線時使用系統字型。
- 遊戲音效：瀏覽器即時合成，並非傳統音樂。
- 示意人物、引言、留言：為版型示範而創作，非真實採訪。

## 實作備註

不需要任何密鑰。輸入內容以文字逃逸呈現，媒體只接受 HTTP(S) 或受限圖片 data URL。瀏覽器儲存失敗會提示。對話框關閉會停止音訊、影片和遊戲計時；iframe 僅使用 YouTube 隱私增強嵌入網址。部署工作流只發布必要的公開網站檔案。
