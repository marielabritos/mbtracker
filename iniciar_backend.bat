@echo off
title MBTracker - Backend API (FastAPI)
cd /d "%~dp0backend"
echo Iniciando Servidor Backend en http://localhost:8080 ...
echo Documentacion Swagger en http://localhost:8080/docs
echo.
python run.py
pause
