# （工具名稱）

> 這是 [ed-tool-template](https://github.com/xyzKIWI/ed-tool-template) 產生的骨架。
> 依下方「從模板開新工具」做完後，把本段引用區塊刪掉、填好其餘段落。

一句話說明工具用途。

## 使用方式

（怎麼用：輸入什麼、得到什麼）

## 資料來源與校對

- 資料來源：（教科書版次／官方指引／資料庫名稱與年份）
- 資料最後校對：YYYY-MM-DD
- 校對方式：（例：逐筆對照原始來源人工校對）

## 更新方法

1. 改 `index.html`（或 `data.js`）裡的資料
2. 更新頁尾與本 README 的「資料校對」日期
3. commit + push，GitHub Pages 會自動重新發佈
4. 回 [ed-tools 入口頁](https://github.com/xyzKIWI/ed-tools) 更新該工具卡片的校對日

## 免責聲明

本工具僅供臨床決策輔助參考，不取代臨床判斷、官方仿單與最新指引。使用前請自行核對原始資料來源；作者不對使用結果負責。

## License

MIT

---

## 從模板開新工具（做完就刪這段）

1. GitHub 上按 **Use this template** → 建新 repo（kebab-case 命名）
2. `git clone` 到 `kiwi_cc/`（本地資料夾名 = repo 名）
3. 改 `index.html` 的 ①②③④ 標記處
4. Repo Settings → Pages → Deploy from a branch → main / root
5. `gh repo edit --homepage <Pages網址> --add-topic emergency-medicine --add-topic clinical-tools`
6. 上線後到 [ed-tools](https://github.com/xyzKIWI/ed-tools) 加卡片＋README 表格加一列
