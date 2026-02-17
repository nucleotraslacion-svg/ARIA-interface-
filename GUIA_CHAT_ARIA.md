# 💬 Guía de Uso - Chat con ARIA

## 🎯 ¿Qué es esto?

Una interfaz de chat funcional para **comunicarte directamente con ARIA** y continuar entrenándola y alimentándola con nueva información.

---

## 🚀 Cómo Usar

### Opción 1: Abrir Directamente (Más Fácil)

1. **Abre el archivo** `chat-aria.html` en tu navegador
   - Doble clic en el archivo
   - O arrastra el archivo a tu navegador
   - O click derecho → Abrir con → Navegador

2. **¡Listo!** Ya puedes chatear con ARIA

### Opción 2: Con Servidor Local (Recomendado)

```bash
# Si tienes Python instalado
python -m http.server 8000

# Si tienes Node.js
npx http-server

# Luego abre en tu navegador
http://localhost:8000/chat-aria.html
```

---

## 💬 Funciones del Chat

### 1. **Conversar con ARIA**
- Escribe cualquier mensaje en el campo de texto
- Presiona Enter o clic en "Enviar"
- ARIA responderá automáticamente
- Todas las conversaciones se guardan automáticamente

### 2. **Añadir Conocimiento** 📚
- Clic en el botón "Añadir Conocimiento"
- Escribe datos, hechos o información que ARIA debe aprender
- Ejemplo: "Python es un lenguaje de programación"
- ARIA guardará esta información en su base de conocimiento

### 3. **Agregar Memoria** 🧠
- Clic en el botón "Agregar Memoria"
- Escribe experiencias o información personal
- Ejemplo: "Mi color favorito es azul"
- ARIA recordará esto en conversaciones futuras

### 4. **Exportar Chat** 💾
- Clic en "Exportar Chat"
- Descarga un archivo JSON con toda la sesión
- Incluye: mensajes, conocimientos, memorias
- Útil para respaldo o análisis

---

## 🎓 Cómo Entrenar a ARIA

### Método 1: Conversación Natural
```
Tú: Hola ARIA, quiero enseñarte sobre astronomía
ARIA: ¡Excelente! Estoy lista para aprender sobre astronomía...

Tú: El sol es una estrella
ARIA: He registrado tu mensaje... ¿Puedes darme más contexto?

Tú: El sol está a 150 millones de kilómetros de la Tierra
ARIA: Interesante que menciones "El sol está a 150 millones..."
```

### Método 2: Conocimiento Estructurado
1. Clic en "📚 Añadir Conocimiento"
2. Escribe información específica
3. ARIA la guardará en su base de conocimiento
4. Puedes añadir múltiples entradas

### Método 3: Memorias Personales
1. Clic en "🧠 Agregar Memoria"
2. Comparte información sobre ti
3. ARIA la recordará en futuras interacciones
4. Personaliza su comportamiento

---

## 📊 Características

### ✅ Lo que hace el chat:

- **Guarda automáticamente** todo en tu navegador (localStorage)
- **Responde en tiempo real** a tus mensajes
- **Aprende de cada conversación** que tienes
- **Mantiene el historial** incluso si cierras el navegador
- **Exporta datos** para respaldo o análisis
- **Cuenta estadísticas** de mensajes y tiempo de sesión

### 🔮 Próximamente:

- Conexión a API de IA real (OpenAI, etc.)
- Búsqueda en la base de conocimiento
- Análisis de sentimientos
- Respuestas más contextuales
- Interfaz de administración

---

## 💡 Consejos de Uso

### Para Mejor Entrenamiento:

1. **Sé específico**: 
   - ❌ "Me gusta la música"
   - ✅ "Mi género musical favorito es el jazz, especialmente Miles Davis"

2. **Proporciona contexto**:
   - ❌ "París es bonita"
   - ✅ "París es la capital de Francia, conocida por la Torre Eiffel"

3. **Usa ambos métodos**:
   - Conversación para contexto general
   - Conocimiento para datos específicos
   - Memorias para información personal

4. **Exporta regularmente**:
   - Haz backups de tus conversaciones
   - Revisa lo que ARIA ha aprendido

---

## 🔧 Solución de Problemas

### No guarda las conversaciones
- Asegúrate de que el navegador permita localStorage
- No uses modo incógnito
- Verifica permisos del navegador

### ARIA no responde
- Refresca la página (F5)
- Verifica la consola del navegador (F12)
- Asegúrate de presionar Enter o Enviar

### Quiero borrar todo
```javascript
// Abre consola del navegador (F12) y escribe:
localStorage.removeItem('ariaChat');
location.reload();
```

---

## 📁 Estructura de Datos

### Formato de Exportación

```json
{
  "sessionInfo": {
    "start": "2026-02-17T10:00:00.000Z",
    "messageCount": 42,
    "exportDate": "2026-02-17T11:00:00.000Z"
  },
  "messages": [
    {
      "text": "Hola ARIA",
      "sender": "user",
      "timestamp": "2026-02-17T10:00:01.000Z"
    },
    {
      "text": "¡Hola! Soy ARIA...",
      "sender": "aria",
      "timestamp": "2026-02-17T10:00:02.000Z"
    }
  ],
  "knowledgeBase": [
    {
      "content": "Python es un lenguaje de programación",
      "timestamp": "2026-02-17T10:05:00.000Z",
      "type": "knowledge"
    }
  ],
  "memories": [
    {
      "content": "Mi color favorito es azul",
      "timestamp": "2026-02-17T10:10:00.000Z",
      "type": "memory"
    }
  ]
}
```

---

## 🔗 Integración con el Sistema ARIA

Este chat es parte del **Sistema Modular LEGO ARIA**:

- **Nivel actual**: Interfaz básica de entrenamiento
- **Compatible con**: Sistema de personalidad, memorias, base de conocimiento
- **Próximo paso**: Integrar con motor de IA completo

### Conectar con Backend (Futuro)

```javascript
// Cuando tengas el backend listo, reemplaza generateARIAResponse con:
async function generateARIAResponse(userMessage) {
    const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
    });
    const data = await response.json();
    return data.reply;
}
```

---

## 📚 Recursos Adicionales

- `CEREBRO_VIRTUAL_ARIA.md` - Arquitectura completa del cerebro de ARIA
- `SISTEMA_MODULAR_LEGO.md` - Sistema modular de componentes
- `PLAN_IMPLEMENTACION_CEREBRO_ARIA.md` - Roadmap de desarrollo

---

## ✨ Comandos Útiles

En el chat, puedes probar:

- "Hola" - Saludo inicial
- "¿Qué puedes hacer?" - Ver capacidades
- "Entrenar" - Instrucciones de entrenamiento
- "Memoria" - Ver cuántas memorias tiene
- "Conocimiento" - Ver base de conocimiento
- "Gracias" - Agradecimiento
- "Adiós" - Despedida

---

## 🎯 Próximos Pasos

1. **Ahora**: Usa el chat para entrenar a ARIA
2. **Hoy**: Añade 5-10 conocimientos o memorias
3. **Esta semana**: Exporta y revisa el progreso
4. **Próximamente**: Integrar con IA real (GPT-4, Claude, etc.)

---

**¡Empieza a chatear con ARIA ahora!** 🚀

Abre `chat-aria.html` y comienza a entrenarla.
