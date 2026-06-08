@echo off
REM Recruitment Platform Setup Script for Windows

cls
echo ==================================
echo ^)^)^) Recruitment Platform Setup
echo ==================================
echo.

REM Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo.❌ Docker is not installed.
    echo   Please download from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo ✅ Docker found
echo.

REM Check if docker-compose is installed
where docker-compose >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed.
    pause
    exit /b 1
)

echo ✅ Docker Compose found
echo.

echo 📋 Starting services...
echo ==================================
echo.

REM Start docker compose
docker-compose up -d

if %errorlevel% equ 0 (
    echo.
    echo ✅ Services started successfully!
    echo.
    echo 📍 Access URLs:
    echo    Frontend:       http://localhost:3000
    echo    Backend API:    http://localhost:5000
    echo    API Docs:       http://localhost:5000/swagger
    echo    Database:       localhost:1433
    echo.
    echo 💡 Tips:
    echo    - Check logs: docker-compose logs -f
    echo    - Stop services: docker-compose down
    echo.
    echo 📚 Documentation:
    echo    - Setup: INSTALLATION.md
    echo    - Development: DEVELOPMENT.md
    echo.
    echo Happy coding! 🎉
) else (
    echo.
    echo ❌ Failed to start services.
    echo   Please check if Docker Desktop is running.
)

pause
