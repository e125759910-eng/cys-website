@echo off
chcp 65001 >nul
cls
echo ================================================================
echo           CYS 網站 - 快速部署到生產環境
echo ================================================================
echo.
echo 這將直接部署到生產環境（正式網站）
echo.
echo 注意：請確保已登入 Vercel 帳號
echo.
pause
echo.

echo 正在部署到生產環境...
vercel --prod --yes
if %errorlevel% neq 0 (
    echo.
    echo ❌ 部署失敗！
    echo.
    echo 可能的原因：
    echo 1. 尚未登入 Vercel - 請先執行：vercel login
    echo 2. 項目尚未連結 - 請先執行：vercel link
    echo.
    pause
    exit /b
)

echo.
echo ================================================================
echo ✅ 生產環境部署完成！
echo ================================================================
echo.
echo 您的網站已更新到正式環境
echo.
pause

