@echo off
chcp 65001 >nul
echo ================================================================
echo CYS ^| Change Your Style - 快速啟動
echo ================================================================
echo.
echo 正在檢查 Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未找到 Node.js！請先安裝 Node.js
    echo 下載地址：https://nodejs.org/
    pause
    exit /b
)
echo ✅ Node.js 已安裝
echo.
echo 正在檢查依賴...
if not exist "node_modules" (
    echo 📦 首次運行，正在安裝依賴包...
    echo 這可能需要幾分鐘時間...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 安裝失敗！請檢查網路連線
        pause
        exit /b
    )
    echo ✅ 依賴安裝完成！
) else (
    echo ✅ 依賴已存在
)
echo.
echo ================================================================
echo 🚀 啟動開發伺服器...
echo ================================================================
echo.
echo 瀏覽器將會自動打開 http://localhost:3000
echo 按 Ctrl+C 可停止伺服器
echo.
call npm run dev

