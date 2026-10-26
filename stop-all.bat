@echo off
echo ========================================================
echo           Stopping ShopEase Microservices System
echo ========================================================

for %%p in (8080 8081 8082 5173) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr /r ":%%p[ ]" 2^>nul') do (
        echo Stopping PID %%a on port %%p...
        taskkill /F /PID %%a >nul 2>&1
    )
)

echo All services on ports 8080, 8081, 8082, 5173 stopped.
