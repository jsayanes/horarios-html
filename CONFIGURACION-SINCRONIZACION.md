# 🌐 Configuración de Sincronización Entre Dispositivos

Tu aplicación de horarios ahora puede sincronizarse entre dispositivos. Aquí tienes **3 opciones** desde la más fácil hasta la más robusta:

## 🎯 Opción 1: Compartir por URL (MÁS FÁCIL) ⭐⭐⭐

**Ventajas**: Inmediato, sin configuración adicional
**Desventajas**: Manual, requiere compartir link

### Cómo Usarlo:
1. Modifica tu horario
2. Haz clic en "🔗 Generar Link de Compartir" 
3. Copia el link generado
4. Ábrelo en cualquier dispositivo

---

## 🎯 Opción 2: Google Sheets (RECOMENDADO) ⭐⭐

**Ventajas**: Automático, gratis, respaldo en la nube
**Desventajas**: Requiere configuración inicial

### Pasos de Configuración:

#### 1. Crear Google Sheet
1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja llamada "Horarios Escolares"
3. En la primera hoja, nómbrala "Horario"
4. Copia el ID de la URL (la parte entre `/d/` y `/edit`)

#### 2. Obtener API Key
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la "Google Sheets API"
4. Ve a "Credenciales" → "Crear credenciales" → "Clave de API"
5. Copia la clave generada

#### 3. Configurar en tu App
```javascript
// En script_simple.js, línea 6-13:
const GOOGLE_SHEETS_CONFIG = {
    API_KEY: 'TU_CLAVE_API_AQUI',
    SHEET_ID: 'TU_SHEET_ID_AQUI',
    RANGE: 'Horario!A1:H20'
};

const ENABLE_GOOGLE_SHEETS = true; // Cambiar a true
```

#### 4. Hacer tu Sheet Público
1. En Google Sheets, haz clic en "Compartir"
2. Cambia a "Cualquier persona con el enlace puede ver"
3. ¡Listo! Ahora se sincroniza automáticamente

---

## 🎯 Opción 3: Firebase (MÁS ROBUSTA) ⭐

**Ventajas**: Tiempo real, muy robusta, escalable
**Desventajas**: Más compleja de configurar

### Configuración Firebase:
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un nuevo proyecto
3. Habilita "Realtime Database"
4. Copia la configuración del proyecto

---

## 🚀 ¿Cuál Elegir?

### Para Uso Personal/Familiar: **Opción 1** (URL)
- Perfecto si usas 2-3 dispositivos ocasionalmente
- Sin configuración adicional

### Para Uso Regular: **Opción 2** (Google Sheets)
- Ideal para uso diario entre múltiples dispositivos
- Respaldo automático en la nube

### Para Uso Profesional: **Opción 3** (Firebase)
- Para múltiples usuarios simultáneos
- Sincronización en tiempo real

---

## 📝 Próximos Pasos

1. **Elige una opción** según tus necesidades
2. **Sigue la guía** correspondiente
3. **Prueba** desde dos dispositivos diferentes
4. **¡Disfruta** de la sincronización automática!

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas con cualquier configuración, avísame y te ayudo paso a paso.