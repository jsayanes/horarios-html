# 🌐 Configuración de Variables de Entorno en Netlify

## 🚨 IMPORTANTE: Configuración de Seguridad

Para que Firebase funcione correctamente en producción, necesitas configurar las variables de entorno en Netlify Dashboard.

## 📋 Pasos para Configurar

### 1. 🔐 Acceder a Netlify Dashboard
1. Ve a [netlify.com](https://netlify.com)
2. Inicia sesión en tu cuenta
3. Selecciona tu sitio: **horariosliceo**

### 2. ⚙️ Configurar Variables de Entorno
1. Ve a **Site settings** → **Environment variables**
2. Haz clic en **Add variable**
3. Agrega las siguientes variables:

```bash
FIREBASE_API_KEY = AIzaSyAz3a1CupLRuk7nMzKYSL9PKhjvMDfM0SU
FIREBASE_AUTH_DOMAIN = horarios-netlify.firebaseapp.com
FIREBASE_PROJECT_ID = horarios-netlify
FIREBASE_STORAGE_BUCKET = horarios-netlify.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID = 87586753693
FIREBASE_APP_ID = 1:87586753693:web:eaa78274062ed52da05874
```

### 3. 🔄 Redeploy
1. Después de agregar las variables, haz clic en **Deploy settings**
2. **Trigger deploy** → **Deploy site**
3. O simplemente haz un nuevo push a GitHub

## 🧪 Verificar Funcionamiento

### En Producción:
1. Abre: https://horariosliceo.netlify.app/
2. Presiona **F12** → **Console**
3. Busca estos mensajes:
   - ✅ `🔧 Firebase config loaded`
   - ✅ `🔥 Initializing Firestore...`
   - ✅ `✅ Firestore initialized successfully`

### Errores Comunes:
- ❌ `Firebase: Error (auth/api-key-not-valid)` → Verificar API_KEY
- ❌ `Firebase: Error (auth/project-not-found)` → Verificar PROJECT_ID
- ❌ `Firestore: Missing or insufficient permissions` → Configurar reglas de Firestore

## 🔒 Configurar Reglas de Firestore

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto: **horarios-netlify**
3. Ve a **Firestore Database** → **Rules**
4. Reemplaza con estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /horarios/{document} {
      // Permitir lectura y escritura pública (para demo)
      allow read, write: if true;
      
      // Para mayor seguridad, usar autenticación:
      // allow read, write: if request.auth != null;
    }
  }
}
```

5. **Publish** las reglas

## ✅ Lista de Verificación

- [ ] Variables de entorno configuradas en Netlify
- [ ] Reglas de Firestore configuradas
- [ ] Sitio redesplegado
- [ ] Prueba de sincronización funcionando
- [ ] Console sin errores de Firebase

## 🆘 Troubleshooting

### Si Firebase no se conecta:
1. Verificar que todas las variables estén configuradas
2. Verificar que las reglas de Firestore permitan acceso
3. Verificar en la consola de Firebase que el proyecto esté activo

### Si las variables no se cargan:
1. Verificar que los nombres coincidan exactamente
2. Redeploy del sitio después de agregar variables
3. Limpiar caché del navegador

## 📞 Soporte

Si tienes problemas:
1. Revisar la consola del navegador (F12)
2. Verificar logs en Netlify Dashboard
3. Contactar soporte si persisten los errores