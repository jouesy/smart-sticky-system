# Smart Sticky Next 3.0｜智慧便利貼工作台

這是單檔 HTML 版的智慧便利貼工作台，包含：

- 一般便利貼、待辦、回電與個案管理
- Smart Assistant Next 自然語言命令中心
- V10.1 分期試算、提前清償、消費比對與知識問答
- Gemini 話術說明頁與本機優先的 V10.1 路由
- 智慧收件匣 2.0：將一段文字拆成待辦、回電、個案與 V10.1 任務
- 五階段工作流看板、行事曆與客戶／個案中心
- 本機資料快照、JSON 備份與版本復原

## 公開版使用方式

建議開啟 `Smart Sticky Next 3.0_智慧便利貼工作台_公開版.html`。舊版 `Smart Sticky Next_智慧便利貼工作台_公開版.html` 仍保留供回退使用。

若要使用 Gemini，請按右上角 AI 設定並輸入自己的 API Key。公開版沒有內嵌任何 API Key；建議不要勾選「在這台電腦保存金鑰」，也不要把金鑰提交到 GitHub。

金融試算與消費比對會優先使用內建的 V10.1 本機功能。需要文字解釋、摘要或客服話術時，才會使用 Gemini。

## 空耳房 v2.0

`dist/index.html` 是韓・中・日三語同步動態歌詞播放器，支援歌詞空耳、YT Music 優先搜尋、YouTube IFrame 播放器、原生動態歌詞、共用時間軸、逐句跳轉與 Karaoke Highlight。後端入口在 `server/index.js`，提供 `/api/ytmusic/search` 與 `/api/ytmusic/lyrics`；若 YT Music 沒有歌詞，前端才會退回 LRCLIB。成功載入過的歌詞會依 videoId 快取在瀏覽器本機；LRC／SRT／VTT 匯入、手動打點與整首偏移則保留為版本不一致時的備援。

YT Music 歌名搜尋不需要前端 API Key；YouTube Data API Key 只作為 YT Music 搜尋失敗時的備援，Key 只會保存在瀏覽器本機，不應寫入原始碼或提交到 Git。沒有 Key 時仍可直接貼 YouTube URL 或 videoId。系統會先嘗試 YT Music 原生歌詞與時間軸，再以歌名、歌手、版本關鍵字與播放長度匹配 LRCLIB，長度差異過大時不會自動套用歌詞。

## 注意事項

前端與 YT Music 請求已拆開：後端只轉送公開歌曲搜尋／歌詞資料，不把 YT Music Cookie、YouTube Data API Key 或任何登入認證送到瀏覽器。`ytmusicapi` 是非官方 Python 函式庫；本專案的 Worker 以相同的 YT Music Web client 流程提供輕量 API，避免把 Python 套件與認證資料打包進前端。
