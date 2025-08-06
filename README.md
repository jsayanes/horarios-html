# 📚 Horarios Escolares - Sistema Avanzado de Gestión

Una aplicación web moderna para crear, gestionar y sincronizar horarios escolares entre múltiples dispositivos.

## 🌟 Características Principales

### ✨ **Gestión de Horarios**
- 🎯 Drag & Drop intuitivo
- 🎨 Personalización de colores
- ✏️ Campos editables (profesor, liceo, turno, ciudad)
- 📚 Banco de materias extensible

### 🔄 **Sincronización Entre Dispositivos**
- 🔗 **Compartir por URL** - Genera links para sincronizar instantáneamente
- 📱 **Multi-dispositivo** - Accede desde móvil, tablet, PC
- 🌐 **100% Online** - Funciona desde cualquier navegador

### 💾 **Persistencia Avanzada**
- 🗃️ **Archivos binarios optimizados** - 60-70% más pequeños que JSON
- 💾 **Auto-backup** - Respaldo automático cada 30 segundos
- 📄 **Múltiples formatos** - JSON legible y binario optimizado
- 🏠 **Trabajo offline** - Funciona sin conexión

## 🚀 Demo en Vivo

👉 **[https://horariosliceo.netlify.app/](https://horariosliceo.netlify.app/)**

### 🧪 Modo Testing
Para verificar funcionamiento: [https://horariosliceo.netlify.app/?debug=1](https://horariosliceo.netlify.app/?debug=1)

## 📱 Cómo Sincronizar Entre Dispositivos

### Método 1: Link de Compartir (MÁS FÁCIL)
1. Modifica tu horario
2. Haz clic en **"🔗 Generar Link para Compartir"**
3. Se copia automáticamente al portapapeles
4. Abre el link en cualquier otro dispositivo
5. ¡Los cambios aparecen instantáneamente!

### Método 2: Firebase Firestore (TIEMPO REAL) ⭐ NUEVO
- **Sincronización automática** en tiempo real
- **Sin configuración** para usuarios finales  
- **Indicador visual** de estado de conexión
- Ver guía en `CONFIGURACION-NETLIFY.md`

### Método 3: Google Sheets (AUTOMÁTICO)
Ver guía completa en `CONFIGURACION-SINCRONIZACION.md`

## 🛠️ Instalación Local

```bash
# Clonar repositorio
git clone [tu-repo-url]
cd horarios-html

# Iniciar servidor local
python -m http.server 8000

# Abrir en navegador
http://localhost:8000
```

## 📂 Estructura del Proyecto

```
📁 Horarios HTML/
├── 📄 index.html           # Interfaz principal
├── 🎨 style.css            # Estilos
├── 🔧 script_simple.js     # Lógica de aplicación
├── 📋 CONFIGURACION-SINCRONIZACION.md
├── 🚀 deploy-github.bat    # Script de deployment (Windows)
├── 🚀 deploy-github.sh     # Script de deployment (Linux/Mac)
└── 📖 README.md            # Este archivo
```

## 🔧 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Framework CSS**: Bootstrap 5.3
- **Persistencia**: LocalStorage + Archivos binarios + Firebase Firestore
- **Deployment**: GitHub + Netlify
- **Sincronización**: URL encoding + Base64 + Tiempo real (Firebase)
- **Seguridad**: Variables de entorno + Configuración modular

## 📊 Características Técnicas

### 🗃️ **Formato Binario Personalizado**
- Magic Number: `0x484F5241` ("HORA")
- Versionado para compatibilidad futura
- Compresión optimizada para horarios escolares
- Validación robusta de integridad

### 🌐 **Sistema de URLs**
- Compresión automática de datos
- Codificación Base64 para compatibilidad
- Limpieza automática de URLs
- Soporte para navegadores antiguos

## 🎯 Casos de Uso

- 👨‍🏫 **Profesores** - Gestionar horarios de múltiples grupos
- 🏫 **Colegios** - Coordinación entre docentes
- 👨‍👩‍👧‍👦 **Familias** - Compartir horarios entre padres
- 📱 **Estudiantes** - Acceso desde cualquier dispositivo

## 🔒 Seguridad y Configuración

### ⚙️ Variables de Entorno (IMPORTANTE)
Para usar Firebase en producción, configura las variables de entorno en Netlify:
- Ver guía completa: `CONFIGURACION-NETLIFY.md`
- Variables requeridas: `FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`, etc.

### 🧪 Testing de Producción
Verifica que todo funcione correctamente:
```
https://horariosliceo.netlify.app/?debug=1
```
- Abre la consola (F12) para ver resultados de las pruebas
- Todas las pruebas deben pasar para funcionamiento óptimo

## 🔄 Desarrollo y Deployment

### Subir cambios a GitHub:
```bash
# Windows
./deploy-github.bat

# Linux/Mac
chmod +x deploy-github.sh
./deploy-github.sh
```

### Netlify se actualiza automáticamente desde GitHub

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 🆘 Soporte

¿Problemas o preguntas?
- 📧 Abre un Issue en GitHub
- 📖 Revisa `CONFIGURACION-SINCRONIZACION.md`
- 🔍 Consulta la consola del navegador (F12)

---

**Desarrollado con ❤️ para facilitar la gestión de horarios escolares**