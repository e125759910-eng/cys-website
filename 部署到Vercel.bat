@echo off
chcp 65001 >nul
echo ================================================================
echo Vercel 部署脚本
echo ================================================================
echo.

echo [步骤 1/3] 登录 Vercel...
echo 注意：这会在浏览器中打开登录页面
echo.
vercel login
if %errorlevel% neq 0 (
    echo.
    echo ❌ 登录失败！请检查网络连接或手动访问 https://vercel.com/login
    pause
    exit /b
)
echo.
echo ✅ 登录成功！
echo.

echo [步骤 2/3] 首次部署（配置项目）...
echo 注意：首次部署会询问一些配置问题
echo.
vercel
if %errorlevel% neq 0 (
    echo.
    echo ❌ 部署失败！
    pause
    exit /b
)
echo.
echo ✅ 首次部署完成！
echo.

echo [步骤 3/3] 部署到生产环境...
echo.
vercel --prod
if %errorlevel% neq 0 (
    echo.
    echo ❌ 生产环境部署失败！
    pause
    exit /b
)
echo.
echo ================================================================
echo ✅ 部署完成！
echo ================================================================
echo.
echo 下一步：
echo 1. 在 Vercel Dashboard 创建 KV 数据库
echo 2. 设置环境变量（ADMIN_USERNAME, ADMIN_PASSWORD）
echo 3. 重新部署以应用环境变量
echo.
pause


