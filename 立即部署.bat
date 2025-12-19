@echo off
chcp 65001 >nul
cls
echo ================================================================
echo           CYS 網站 - Vercel 部署工具
echo ================================================================
echo.
echo 這將幫您將網站部署到 Vercel
echo.
echo 注意事項：
echo 1. 首次部署需要在瀏覽器中登入 Vercel 帳號
echo 2. 如果還沒有 Vercel 帳號，請先到 https://vercel.com 註冊
echo 3. 部署過程中會詢問一些配置問題，請按照提示回答
echo.
echo ================================================================
pause
echo.

echo [1/3] 正在檢查 Vercel CLI...
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  未找到 Vercel CLI，正在安裝...
    call npm install -g vercel
    if %errorlevel% neq 0 (
        echo.
        echo ❌ 安裝失敗！請手動執行：npm install -g vercel
        pause
        exit /b
    )
    echo ✅ Vercel CLI 安裝成功！
) else (
    echo ✅ Vercel CLI 已安裝
)
echo.

echo [2/3] 登入 Vercel...
echo 注意：這會在瀏覽器中打開登入頁面
echo 如果瀏覽器沒有自動打開，請訪問：https://vercel.com/login
echo.
vercel login
if %errorlevel% neq 0 (
    echo.
    echo ❌ 登入失敗！
    echo 請確保：
    echo - 已連接網路
    echo - 已在瀏覽器中完成登入
    pause
    exit /b
)
echo.
echo ✅ 登入成功！
echo.

echo [3/3] 開始部署...
echo.
echo 部署過程中會詢問以下問題：
echo - Set up and deploy? (Y/n) → 輸入 Y
echo - Link to existing project? (y/N) → 如果是新項目，輸入 N
echo - What's your project's name? → 輸入項目名稱（例如：cys-website）
echo - In which directory is your code located? → 直接按 Enter
echo - Want to override the settings? → 輸入 N
echo.
pause
echo.

echo 正在部署到預覽環境...
vercel
if %errorlevel% neq 0 (
    echo.
    echo ❌ 部署失敗！請檢查錯誤訊息
    pause
    exit /b
)

echo.
echo ================================================================
echo ✅ 預覽環境部署完成！
echo ================================================================
echo.

choice /C YN /M "是否部署到生產環境 (Y/N)?"

if errorlevel 2 goto :end
if errorlevel 1 goto :deploy_prod

:deploy_prod
echo.
echo 正在部署到生產環境...
vercel --prod
if %errorlevel% neq 0 (
    echo.
    echo ❌ 生產環境部署失敗！
    pause
    exit /b
)
echo.
echo ✅ 生產環境部署完成！
echo.

:end
echo.
echo ================================================================
echo              部署完成！
echo ================================================================
echo.
echo 📝 下一步重要配置：
echo.
echo 1. 創建 KV 數據庫：
echo    - 訪問 Vercel Dashboard: https://vercel.com/dashboard
echo    - 選擇您的項目
echo    - 點擊 "Storage" → "Create Database"
echo    - 選擇 "KV" 類型，命名為 cys-warranties
echo.
echo 2. 設置環境變量：
echo    - 項目設置 → "Environment Variables"
echo    - 添加 ADMIN_USERNAME = admin
echo    - 添加 ADMIN_PASSWORD = 您的密碼
echo.
echo 3. 重新部署以應用環境變量：
echo    - 在 Deployments 頁面點擊最新部署的 "..." → "Redeploy"
echo.
echo 詳細說明請查看：README-VERCEL-DEPLOY.md
echo.
pause


