# Smart Sticky Next｜智慧便利貼工作台

這是單檔 HTML 版的智慧便利貼工作台，包含：

- 一般便利貼、待辦、回電與個案管理
- Smart Assistant Next 自然語言命令中心
- V10.1 分期試算、提前清償、消費比對與知識問答
- Gemini 話術說明頁與本機優先的 V10.1 路由

## 公開版使用方式

請開啟 `Smart Sticky Next_智慧便利貼工作台_公開版.html`，再按右上角 AI 設定，輸入自己的 Gemini API Key。公開版沒有內嵌任何 API Key；建議不要勾選「在這台電腦保存金鑰」，也不要把金鑰提交到 GitHub。

金融試算與消費比對會優先使用內建的 V10.1 本機功能。需要文字解釋、摘要或客服話術時，才會使用 Gemini。

## 空耳房 v2.0

`dist/index.html` 是韓・中・日三語同步動態歌詞播放器，支援歌詞空耳、YouTube 歌源、自動尋找 LRCLIB 同步歌詞、共用時間軸、逐句跳轉與 Karaoke Highlight。成功載入過的歌詞會依 videoId 快取在瀏覽器本機；LRC／SRT／VTT 匯入、手動打點與整首偏移則保留為版本不一致時的備援。

YouTube 歌名搜尋需要在頁面內自行設定 YouTube Data API Key；Key 只會保存在瀏覽器本機，不應寫入原始碼或提交到 Git。沒有 Key 時仍可直接貼 YouTube URL 或 videoId；LRCLIB 歌詞查詢不需要另一把 Key。系統會用歌名、歌手、版本關鍵字與播放長度計算匹配度，長度差異過大時不會自動套用歌詞。

## 注意事項

這是純前端單檔應用程式。若要正式部署給多人使用，建議改由後端 Proxy 管理 Gemini API Key，避免在瀏覽器端暴露金鑰。
