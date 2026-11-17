# 摸魚研究所

高二數學學習及休閒釣魚遊戲。現有 3 個地點、76 款收藏品；目前保留 8 道示範題，正式題庫稍後加入。

## GitHub Pages 發佈

將此資料夾內的所有檔案和 assets 資料夾放在儲存庫根目錄。在 Settings → Pages 選 Deploy from a branch，再選 main 和 /(root)，儲存後使用 GitHub 顯示的網站網址。無需安裝套件或執行伺服器。

## 之後更換題庫

編輯 questions.js。題目格式見 QUESTION_BANK.md；上傳更新 questions.js 和題目圖片後，GitHub Pages 會重新發佈。請保留現有題目 id 的唯一性。

## 進度與使用

目前沒有登入或雲端存檔，進度與設定只保存在玩家所用瀏覽器的 localStorage。不同裝置、瀏覽器或網址不會自動共用進度；本機 localhost 與 GitHub Pages 亦屬不同存檔。正式學生使用時請固定網站網址，避免使用私密瀏覽，清除網站資料會移除進度。排行榜暫未開啟。

## 檔案

index.html：遊戲入口；style.css：版面；core.js：規則與魚種；art.js：圖片與場景；app.js：互動與存檔；math-entry.js：分數及根號輸入；questions.js：題庫；assets/：圖片與音效。

音效來源與個別授權見 assets/audio-v4/CREDITS.md。圖片、角色、原創內容及第三方素材權利屬各自權利人；此儲存庫未另行授予整體素材的再使用授權。
