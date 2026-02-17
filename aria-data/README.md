# 📦 Área de Datos ARIA

Esta carpeta contiene la estructura principal para el sistema ARIA.

## Estructura

```
aria-data/
├── backend/         # Código del servidor (API, servicios, lógica)
├── frontend/        # Código de la interfaz de usuario
├── database/        # Esquemas, migraciones, scripts SQL
├── ai-models/       # Configuraciones y modelos de IA
├── memories/        # Sistema de memorias del avatar
└── personalities/   # Perfiles de personalidad
```

## ⚠️ Nota Importante

Esta carpeta está preparada para recibir datos gradualmente:

1. **Código (< 100MB)**: Se sube directamente a Git
2. **Archivos medianos (100MB - 2GB)**: Usan Git LFS
3. **Archivos grandes (> 2GB)**: Referencias a Cloud Storage

Ver `GUIA_CARGA_INCREMENTAL.md` para más detalles.

## Estado Actual

- ✅ Estructura creada
- ⏳ Esperando datos de otros dispositivos
- 📊 Total previsto: ~1 TB

## Próximo Paso

1. Completa el inventario en `INVENTARIO_DATOS.md`
2. Decide qué subir primero
3. Sigue la guía de carga incremental
