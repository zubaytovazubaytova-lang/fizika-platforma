@echo off
title Django Backend - Fizika Platform
color 0A
cd /d "C:\Users\user\Desktop\fizika-platform\backend"

:loop
echo.
echo  [%time%] Django server ishga tushirilmoqda...
echo  ----------------------------------------
C:\Users\user\AppData\Local\Programs\Python\Python312\python.exe manage.py runserver --settings=config.settings.dev
echo.
echo  ----------------------------------------
echo  [%time%] Server to'xtadi.
echo  3 soniyadan keyin avtomatik qayta ishga tushadi...
echo  Butunlay yopish uchun: Ctrl+C bosing
echo  ----------------------------------------
timeout /t 3 /nobreak >nul
goto loop
