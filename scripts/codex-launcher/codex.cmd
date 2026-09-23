@echo off
pwsh.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0codex-launch.ps1" %*
exit /b %errorlevel%
