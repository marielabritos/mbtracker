@echo off
title MBTracker - Frontend (React + Vite)
cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo Instalando dependencias de Node.js...
    call npm.cmd install
)
echo.
echo Iniciando Servidor Frontend...
echo.
call npm.cmd run dev
pause
