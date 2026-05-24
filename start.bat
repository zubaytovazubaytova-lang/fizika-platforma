@echo off
title Fizika AI Platform
color 0A
echo.
echo  ========================================
echo   Fizika AI Platform - Ishga tushirish
echo  ========================================
echo.

cd /d "%~dp0"

echo  [1/2] Backend ishga tushirilmoqda (auto-restart yoqilgan)...
start "Django Backend" cmd /k "C:\Users\user\Desktop\fizika-platform\run-backend.bat"

timeout /t 2 /nobreak >nul

echo  [2/2] Frontend ishga tushirilmoqda...
start "Next.js Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo  ========================================
echo   Tayyor! Brauzerda oching:
echo   http://localhost:3000
echo  ========================================
echo.
pause
