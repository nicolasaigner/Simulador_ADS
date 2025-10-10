@echo off
echo ====================================
echo  Simulador ADS - API Server
echo ====================================
echo.
echo Iniciando servidor...
echo.
cd /d "%~dp0"
node src/server.js
pause

