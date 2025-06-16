@echo off
echo Starting Hardhat Local Node...
echo.

cd /d "%~dp0"

start "Hardhat Node" cmd /k "npx hardhat node"

timeout /t 5 /nobreak > nul

echo.
echo Deploying contracts...
npx hardhat run scripts/deploy-lauchpad.js --network localhost

echo.
echo Starting frontend server...
cd frontend
start "Frontend Server" cmd /k "npx http-server . -p 3000 -c-1"

echo.
echo ===============================================
echo Local blockchain: http://localhost:8545
echo Frontend: http://localhost:3000
echo ===============================================
echo.
echo Press any key to stop all services...
pause > nul

taskkill /f /im node.exe > nul 2>&1
echo All services stopped.
