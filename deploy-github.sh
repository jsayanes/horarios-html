#!/bin/bash

echo "🚀 Deploying to GitHub and Netlify..."
echo

# Agregar todos los archivos
git add .

# Hacer commit con timestamp
timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
git commit -m "Actualizar horarios con sincronizacion entre dispositivos - $timestamp"

# Hacer push
git push origin main

echo
echo "✅ ¡Deployment completado!"
echo "📱 Tu app estará disponible en: https://horariosliceo.netlify.app/"
echo "🔄 Netlify se actualizará automáticamente en 1-2 minutos"
echo