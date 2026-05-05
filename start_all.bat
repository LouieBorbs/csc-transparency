@echo off
echo ========================================
echo  CSC Attendance System - Starting...
echo ========================================
echo.

REM Kill any existing node processes on port 3000
echo Checking for existing server on port 3000...
netstat -ano | findstr :3000 > nul
if %errorlevel% equ 0 (
    echo Found process on port 3000. Stopping it...
    taskkill /F /IM node.exe > nul 2>&1
    timeout /t 2 /nobreak > nul
)

REM Start the Node.js server
echo Starting backend server on http://localhost:3000
start "CSC Backend Server" cmd /k "node server.js"

REM Wait for server to be ready
echo Waiting for server to start...
:waitloop
timeout /t 1 /nobreak > nul
curl -s http://localhost:3000 > nul 2>&1
if %errorlevel% neq 0 goto waitloop

echo.
echo ========================================
echo  Server is ready!
echo  Opening browser...
echo ========================================
echo.

REM Open browser to the application
start http://localhost:3000

echo.
echo Done! The server is running in a separate window.
echo Close that window to stop the server.
pause
