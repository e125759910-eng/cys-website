@echo off
chcp 65001 >nul
echo ================================================================
echo 修复 PowerShell 执行策略
echo ================================================================
echo.
echo 这将允许在 PowerShell 中运行 npm 命令
echo.
echo 注意：需要以管理员身份运行此脚本
echo.
pause
echo.
echo 正在设置执行策略...
powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"
echo.
echo ✅ 执行策略已设置完成！
echo.
echo 现在可以在 PowerShell 中运行 npm 命令了
echo.
pause

