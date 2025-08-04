@echo off
echo 🚀 Deploying to GitHub and Netlify...
echo.

REM Agregar todos los archivos
git add .

REM Hacer commit con timestamp
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
for /f "tokens=1-2 delims=/:" %%a in ("%TIME%") do (set mytime=%%a%%b)
git commit -m "Actualizar horarios con sincronizacion entre dispositivos - %mydate%_%mytime%"

REM Hacer push
git push origin main

echo.
echo ✅ ¡Deployment completado!
echo 📱 Tu app estará disponible en: https://horariosliceo.netlify.app/ 
echo 🔄 Netlify se actualizará automáticamente en 1-2 minutos
echo.
pause