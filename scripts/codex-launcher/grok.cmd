@echo off
pwsh.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0grok-launch.ps1" %*
exit /b %errorlevel%
