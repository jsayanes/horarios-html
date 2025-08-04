# 📅 Sistema de Horario Interactivo

Un horario semanal interactivo con funcionalidad drag and drop creado con HTML, CSS, JavaScript y Bootstrap.

## 🚀 Características Principales

### ✨ Funcionalidades Implementadas

- **🎯 Drag and Drop**: Arrastra materias entre celdas del horario
- **🗂️ Banco de Materias**: Materias adicionales disponibles para agregar
- **🔄 Resetear Horario**: Vuelve al estado original con un clic
- **📱 Diseño Responsivo**: Se adapta a diferentes tamaños de pantalla
- **🎨 Colores Codificados**: Cada materia tiene su color distintivo
- **✅ Validaciones**: Previene conflictos de horarios
- **💫 Animaciones**: Efectos visuales suaves durante las interacciones

### 🎨 Sistema de Colores

- **🟠 Naranja**: Materias 9°4
- **🔴 Rojo**: Materias 8°2  
- **🟢 Verde**: Materias 8°3
- **🟣 Morado**: Materias 9°1
- **🔵 Azul**: Materias 8°1
- **🟡 Amarillo**: Materias 9°3
- **🟦 Cian**: Materias 9°2

## 📁 Estructura del Proyecto

```
📦 Horarios HTML/
├── 📄 index.html     # Estructura HTML principal
├── 🎨 style.css      # Estilos y diseño
├── ⚡ script.js      # Funcionalidad JavaScript
└── 📖 README.md      # Esta documentación
```

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con flexbox y grid
- **JavaScript ES6+**: Lógica interactiva y drag & drop
- **Bootstrap 5**: Framework CSS para diseño responsivo
- **Drag and Drop API**: API nativa del navegador

## 🎮 Cómo Usar

### 🖱️ Operaciones Básicas

1. **Mover Materias**: 
   - Haz clic y arrastra cualquier materia a una celda vacía
   - Suelta para colocar la materia en la nueva posición

2. **Agregar Materias**:
   - Arrastra materias desde el "Banco de Materias" al horario
   - Las materias adicionales están disponibles en la parte inferior

3. **Quitar Materias**:
   - Arrastra materias desde el horario de vuelta al banco
   - Esto las removerá del horario

4. **Resetear Todo**:
   - Haz clic en "🗂️ Resetear Horario"
   - Confirma la acción para volver al estado original

### ⚠️ Validaciones

- **No Conflictos**: No puedes colocar dos materias en la misma celda
- **Validación Visual**: Las celdas cambian de color durante el arrastre:
  - 🟢 Verde: Ubicación válida
  - 🔴 Rojo: Ubicación inválida

## 🔧 Funcionalidades Técnicas

### 💻 JavaScript

El archivo `script.js` incluye:

```javascript
// Funciones principales
- initializeDragAndDrop()    // Configura eventos drag & drop
- saveOriginalSchedule()     // Guarda estado inicial
- performDrop()              // Ejecuta el movimiento
- resetToOriginalSchedule()  // Restaura horario original
- showNotification()         // Sistema de notificaciones
```

### 🎨 CSS

El archivo `style.css` incluye:

```css
/* Características principales */
- Diseño responsivo con media queries
- Animaciones CSS suaves
- Sistema de colores consistente
- Efectos hover y drag states
- Soporte para impresión
```

### 🏗️ HTML

El archivo `index.html` incluye:

```html
<!-- Elementos principales -->
- Tabla del horario con data attributes
- Banco de materias interactivo
- Botón de reset funcional
- Integration con Bootstrap
```

## 📱 Responsive Design

El horario se adapta automáticamente a:

- **💻 Escritorio**: Vista completa con todas las funcionalidades
- **📱 Tablet**: Tabla adaptada con scroll horizontal
- **📱 Móvil**: Versión compacta optimizada para touch

## 🎯 Próximas Mejoras

Funcionalidades que podrías agregar:

- **💾 Persistencia**: Guardar horarios en localStorage
- **📤 Exportar**: Generar PDF o imagen del horario
- **👥 Múltiples Profesores**: Sistema para varios horarios
- **🔍 Búsqueda**: Filtrar materias por código
- **📊 Estadísticas**: Análisis de carga horaria
- **🌙 Modo Oscuro**: Tema dark/light

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Las materias no se mueven**:
   - Verifica que JavaScript esté habilitado
   - Abre la consola del navegador (F12) para ver errores

2. **Estilos no se aplican**:
   - Confirma que `style.css` esté en la misma carpeta
   - Verifica la conexión a internet para Bootstrap

3. **Botón resetear no funciona**:
   - Asegúrate de que `script.js` se cargó correctamente
   - Revisa la consola por errores de JavaScript

## 📚 Conceptos de Programación Aprendidos

### 🔧 JavaScript

- **Event Listeners**: Manejo de eventos del DOM
- **Drag & Drop API**: API nativa del navegador
- **DOM Manipulation**: Modificar elementos HTML dinámicamente
- **Data Attributes**: Usar atributos personalizados
- **CSS Classes**: Agregar/quitar clases dinámicamente
- **Local Storage**: (Para futuras implementaciones)

### 🎨 CSS

- **Flexbox**: Layout flexible para componentes
- **Grid**: Sistema de rejilla para la tabla
- **Media Queries**: Diseño responsivo
- **Animations**: Transiciones y efectos visuales
- **Pseudo-classes**: Estados hover, active, etc.

### 🏗️ HTML

- **Semantic HTML**: Estructura clara y accesible
- **Data Attributes**: Almacenar datos personalizados
- **Table Structure**: Tablas bien estructuradas
- **Bootstrap Classes**: Framework CSS moderno

## 🎓 Ejercicios de Práctica

1. **Agregar nueva materia**: Crea una función para agregar materias personalizadas
2. **Cambiar colores**: Modifica el sistema de colores en CSS
3. **Validaciones**: Agrega reglas de negocio más complejas
4. **Persistencia**: Implementa guardado en localStorage
5. **Exportar**: Crea función para generar imagen del horario

## 📞 Soporte

Si tienes preguntas sobre el código o quieres agregar nuevas funcionalidades, ¡pregunta! Estoy aquí para ayudarte a entender cada parte del sistema.

---

*¡Feliz programación! 🚀*