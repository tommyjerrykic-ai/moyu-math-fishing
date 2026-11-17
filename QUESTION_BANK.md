# 題庫更換說明

編輯 questions.js 的 QUESTIONS 陣列，保留檔案開頭的數學排版輔助函數及結尾匯出部分。目前 8 題屬示範題，之後可加入正式題庫。

- id：不重複的題目代號。
- type：choice（選擇題）或 fill（數值填充題）。
- prompt：題目，可用 HTML、MathML、SVG 或圖片。
- diagram：可選 cube 或 axes，亦可省略。
- answerDisplay：正確答案的閱讀形式。
- explanation：解釋及步驟。
- choice 需要四個 options 及 answer（A=0，B=1，C=2，D=3）。
- fill 的 answer 是數值，例如 -1、0.5、Math.sqrt(2)。學生可透過畫面鍵盤輸入直觀的分數與根號。

分數使用 MathML 的 mfrac，根式用 msqrt，向量箭號可用現有 v()。題目圖片建議放 assets/questions/，在題目內用相對網址，例如 &lt;img src="assets/questions/q01.png" alt="立體幾何圖"&gt;。不要使用 C:/ 等本機路徑或以 / 開頭的網站絕對路徑。

更新題目不會清除已釣獲收藏；避免更動 app.js 的儲存鍵或清除 localStorage。
