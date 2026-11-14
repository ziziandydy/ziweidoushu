// 審核通過前不顯示廣告版位（空白版位只會留下「廣告」字樣的空框）。
// 通過後改成 true 即可恢復所有版位；網站驗證靠 layout 裡的 AdSense 指令碼與 ads.txt，不受這裡影響。
// 獨立成一般模組：伺服器元件從 "use client" 檔案匯入常數只會拿到參照，不是實際的值。
export const ADS_ENABLED = false;
