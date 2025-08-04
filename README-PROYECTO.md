# 📅 Sistema de Horarios Semanal

**Sistema interactivo de horarios con drag & drop, campos editables y persistencia local.**

## 🚀 Características
- **🖱️ Drag & Drop**: Mueve materias entre horarios libremente
- **📝 Campos Editables**: Nombre del docente, liceo, turno y ciudad
- **💾 Tres Niveles de Guardado**:
  - Temporal (sesión actual)
  - Permanente (reemplaza por defecto) 
  - Reseteo (vuelve al original)
- **🎨 Personalización**: Cambiar colores y textos de materias
- **📱 Responsive**: Funciona en móviles y tablets

## 🛠️ Tecnologías
- **HTML5** + **CSS3** + **JavaScript** (Vanilla)
- **Bootstrap 5.3** para estilos
- **localStorage** para persistencia
- **Drag and Drop API** nativa

## 📁 Archivos Principales
- `index.html` - Página principal del horario
- `script_simple.js` - Toda la lógica de drag & drop y persistencia
- `style.css` - Estilos personalizados y responsive
- `vercel.json` - Configuración para deployment

## 🎯 Uso
1. **Editar datos**: Haz clic en nombre del docente, liceo, turno o ciudad
2. **Arrastrar materias**: Desde el banco hacia la grilla o entre celdas
3. **Cambiar colores**: Clic derecho en cualquier materia
4. **Personalizar**: Doble clic en botón "Personalizar"
5. **Guardar**: Usa los botones según tu necesidad

## 💾 Botones de Control
- **📝 Guardar Temporal**: Guarda sin afectar el por defecto
- **💾 Hacer Permanente**: Convierte en el nuevo por defecto
- **🔄 Resetear**: Vuelve al estado por defecto original

## 📱 Compatibilidad
- ✅ Chrome, Firefox, Safari, Edge
- ✅ Móviles iOS y Android  
- ✅ Tablets
- ✅ Cualquier servidor web estático