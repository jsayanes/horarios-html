# 📊 CONFIGURACIÓN GOOGLE SHEETS

## 🎯 **PASO 1: Crear Google Sheet**

### **1.1 Crear el Sheet:**
1. Ve a [sheets.google.com](https://sheets.google.com)
2. **Clic en "Crear"** → **Hoja de cálculo en blanco**
3. **Renombra** la hoja: "Horario Pablo Sayanes"
4. **Renombra la pestaña** de "Hoja 1" a "Horario"

### **1.2 Preparar estructura:**
En la hoja "Horario", agrega estos headers en la fila 1:
```
A1: Hora
B1: Lunes  
C1: Martes
D1: Miércoles
E1: Jueves
F1: Viernes
G1: Docente
H1: Liceo
```

### **1.3 Obtener SHEET_ID:**
1. **Copia la URL** de tu Google Sheet
2. **Formato**: `https://docs.google.com/spreadsheets/d/SHEET_ID_AQUI/edit#gid=0`
3. **Extrae**: La parte entre `/d/` y `/edit` es tu SHEET_ID
4. **Ejemplo**: `1ABC123def456GHI789jkl` 

---

## 🔑 **PASO 2: Configurar API Key**

### **2.1 Crear proyecto en Google Cloud:**
1. Ve a [console.cloud.google.com](https://console.cloud.google.com)
2. **Crear nuevo proyecto** → "Horario-Pablo" 
3. **Seleccionar** el proyecto creado

### **2.2 Habilitar Google Sheets API:**
1. **Menú** → **APIs y servicios** → **Biblioteca**
2. **Buscar**: "Google Sheets API"
3. **Habilitar** la API

### **2.3 Crear API Key:**
1. **APIs y servicios** → **Credenciales**
2. **Crear credenciales** → **Clave de API**
3. **Copiar** la API Key generada
4. **Opcional**: Restringir la API Key → Solo Google Sheets API

---

## ⚙️ **PASO 3: Configurar permisos del Sheet**

### **3.1 Hacer público (OPCIÓN SIMPLE):**
1. **En tu Google Sheet** → **Compartir**
2. **Cambiar** → **Cualquier usuario con el enlace**
3. **Rol**: **Viewer** (o Editor si quieres que otros editen)

### **3.2 O compartir con personas específicas:**
1. **Compartir** → **Agregar personas**
2. **Emails**: director@liceo.com, esposa@gmail.com, etc.
3. **Rol**: **Viewer** para solo lectura

---

## 🔧 **PASO 4: Configurar el código**

### **4.1 Editar script_simple.js:**
```javascript
// REEMPLAZAR estas líneas en script_simple.js:
const GOOGLE_SHEETS_CONFIG = {
    API_KEY: 'tu_api_key_real_aqui',
    SHEET_ID: 'tu_sheet_id_real_aqui', 
    RANGE: 'Horario!A1:H20'
};
```

### **4.2 Ejemplo completo:**
```javascript
const GOOGLE_SHEETS_CONFIG = {
    API_KEY: 'AIzaSyBvOoTr7ABC123def456GHI789jkl_ejemplo',
    SHEET_ID: '1ABC123def456GHI789jklMNO012pqr345STU',
    RANGE: 'Horario!A1:H20'
};
```

---

## 🚀 **PASO 5: Probar funcionamiento**

### **5.1 Subir cambios:**
```bash
git add .
git commit -m "feat: Integración con Google Sheets"
git push
```

### **5.2 Verificar:**
1. **Abre tu web** en Netlify
2. **F12** → **Console** → Buscar mensajes:
   - ✅ "Google Sheets API initialized"
   - ✅ "Data loaded from Google Sheets"
3. **Haz un cambio** → Verifica que aparezca en Google Sheets

---

## 🎯 **RESULTADO FINAL:**

### **✅ Lo que tendrás:**
- **Web funcionando** con drag & drop normal
- **Auto-save** a Google Sheets cada 2 segundos
- **Compartir** simplemente dando el link de tu web
- **Permisos automáticos** por Google Sheets
- **Funciona offline** (sincroniza después)

### **📱 Uso diario:**
- **Tú**: Editas desde cualquier dispositivo → Se guarda automáticamente
- **Otros**: Ven actualizaciones en tiempo real (según permisos)
- **Backup**: Google Sheets como respaldo automático

---

## 🆘 **TROUBLESHOOTING:**

### **❌ "API Key error":**
- Verificar que la API Key esté bien copiada
- Verificar que Google Sheets API esté habilitada

### **❌ "Sheet not found":**
- Verificar SHEET_ID correcto
- Verificar permisos del Sheet (público o compartido)

### **❌ "No data loading":**
- Verificar nombre de hoja: "Horario" 
- Verificar range: "Horario!A1:H20"

**¿Necesitas ayuda con algún paso?** ¡Te guío paso a paso!