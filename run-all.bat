@echo off
setlocal
cd /d "%~dp0"

echo ========================================================
echo           Starting ShopEase Microservices System
echo ========================================================

echo [1/4] Starting Product Service on port 8081...
start "Product Service (Port 8081)" /D "%~dp0product-service" cmd /k "mvnw.cmd spring-boot:run"

echo [2/4] Starting Order Service on port 8082...
start "Order Service (Port 8082)" /D "%~dp0order-service" cmd /k "mvnw.cmd spring-boot:run"

echo [3/4] Starting API Gateway on port 8080...
start "API Gateway (Port 8080)" /D "%~dp0api-gateway" cmd /k "mvnw.cmd spring-boot:run"

echo [4/4] Starting Frontend on port 5173...
start "Frontend (Port 5173)" /D "%~dp0frontend" cmd /k "npm run dev"

echo ========================================================
echo All 4 services have been launched in separate windows!
echo - Product Service: http://localhost:8081
echo - Order Service:   http://localhost:8082
echo - API Gateway:     http://localhost:8080
echo - Frontend:        http://localhost:5173
echo ========================================================
endlocal
