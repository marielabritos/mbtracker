@echo off
title Iniciar MBTracker
echo ==============================================
echo       INICIANDO PLATAFORMA MBTRACKER
echo ==============================================
echo.
echo 1. Abriendo Servidor Backend (Python FastAPI en puerto 8080)...
start "MBTracker Backend API" cmd /k "cd /d "%~dp0backend" && python run.py"

echo 2. Abriendo Servidor Frontend (React Vite)...
start "MBTracker Frontend" cmd /k "cd /d "%~dp0frontend" && npm.cmd run dev"

echo.
echo Servidores iniciados en segundo plano.
echo Abre tu navegador en: http://localhost:5174 (o http://localhost:5173)
echo.
timeout /t 3 >nul
start http://localhost:5174
exit
