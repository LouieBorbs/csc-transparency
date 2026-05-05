@echo off
title CSC Attendance System
color 0A
echo ========================================
echo      CSC ATTENDANCE SYSTEM
echo ========================================
echo.
echo Starting backend server...
echo.

REM Start Node.js server in a new window
start "Node.js Server" cmd /k "node server.js"

echo Waiting for server to be ready...
:wait
timeout /t 1 /nobreak > nul
curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 goto wait

echo.
echo ========================================
echo Server is running! Opening browser...
echo ========================================
echo.

REM Open default browser
start http://localhost:3000

echo.
echo The server is running in the "Node.js Server" window.
echo Close that window to stop the server.
echo.
pause
