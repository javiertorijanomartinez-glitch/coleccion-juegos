@echo off
title Piano Web - Servidor Local con Soporte MIDI
cd /d "%~dp0"
echo ===================================================
echo   INICIANDO PIANO CON SOPORTE MIDI COMPLETO
echo ===================================================
echo.
echo NOTA IMPORTANTE:
echo Los navegadores bloquean el acceso al teclado USB/MIDI 
echo si abres el archivo directamente como "file://".
echo.
echo Este script inicia el servidor local en http://localhost:5173
echo para que Google Chrome o Edge permitan conectar tu piano al 100%%.
echo.
echo Si tienes Yousician, FL Studio o Synthesia abiertos, 
echo CIERRALOS antes de conectar para no bloquear el puerto USB en Windows.
echo.
echo Iniciando servidor...
start "" "http://localhost:5173"
call npm run dev
