# 📦 Guía de Carga Incremental - 1TB de Datos ARIA
## Sistema de Organización para Subir Datos Gradualmente

---

## 🎯 Situación Actual

Tienes **1 Terabyte (1,000 GB)** de información del proyecto ARIA distribuida en otros dispositivos que necesitas subir poco a poco al repositorio de forma organizada.

---

## 📊 Problema con Git Tradicional

⚠️ **IMPORTANTE**: Git NO está diseñado para manejar archivos muy grandes:
- Límite de GitHub: 100 MB por archivo
- Repositorio recomendado: < 1 GB total
- Tu data: 1,000 GB (1,000 veces el límite recomendado)

---

## ✅ Solución: Estrategia Híbrida

### Opción 1: Git + Git LFS (Para archivos hasta 2GB)
**Git LFS** (Large File Storage) permite manejar archivos grandes:
- Límite: 2 GB por archivo
- Almacenamiento: Separado del repositorio principal
- Costo: Gratis hasta 1 GB de almacenamiento, luego $5/mes por 50 GB

### Opción 2: Almacenamiento en la Nube + Referencias en Git
**Recomendado para 1TB**:
- Subir archivos grandes a: AWS S3, Google Cloud Storage, Cloudflare R2
- Git solo guarda: Referencias, metadatos, código
- Mantiene repositorio Git ligero y rápido

---

## 🗂️ Estructura de Directorios Creada

```
ARIA-interface/
├── 📁 aria-data/                    # Data principal (solo referencias)
│   ├── README.md                    # Inventario de datos
│   ├── backend/                     # Código backend
│   │   ├── api/
│   │   ├── services/
│   │   ├── models/
│   │   └── config/
│   ├── frontend/                    # Código frontend
│   │   ├── src/
│   │   ├── public/
│   │   └── assets/ → [CLOUD]       # Referencia a cloud
│   ├── database/                    # Esquemas y scripts
│   │   ├── schemas/
│   │   ├── migrations/
│   │   └── seeds/
│   ├── ai-models/                   # Modelos de IA (solo configs)
│   │   ├── configs/
│   │   ├── prompts/
│   │   └── weights/ → [CLOUD]      # Modelos grandes en cloud
│   ├── memories/                    # Sistema de memorias
│   │   ├── episodic/               # Memorias episódicas (texto)
│   │   ├── semantic/               # Conocimientos (texto)
│   │   ├── media/ → [CLOUD]        # Fotos/videos en cloud
│   │   └── embeddings/ → [CLOUD]   # Vectores en cloud
│   └── personalities/               # Perfiles de personalidad
│       ├── profiles/               # JSONs de personalidad
│       └── analysis/               # Análisis de texto
│
├── 📁 aria-media-refs/              # Referencias a media en cloud
│   ├── images.manifest.json        # Lista de todas las imágenes
│   ├── videos.manifest.json        # Lista de todos los videos
│   ├── audio.manifest.json         # Lista de todos los audios
│   └── documents.manifest.json     # Lista de documentos
│
├── 📁 upload-staging/               # Área temporal (ignorada por git)
│   ├── batch-01/                   # Primera tanda a procesar
│   ├── batch-02/                   # Segunda tanda
│   └── ...
│
└── 📁 docs/                         # Documentación
    ├── GUIA_CARGA_INCREMENTAL.md  # Este archivo
    ├── INVENTARIO_DATOS.md         # Qué hay en cada dispositivo
    └── UPLOAD_PROGRESS.md          # Progreso de carga
```

---

## 📋 Proceso de Carga Paso a Paso

### PASO 1: Inventariar Tus Datos (Hoy)

Crea un inventario de QUÉ tienes y DÓNDE:

```markdown
## Inventario de Datos ARIA

### Dispositivo 1: [Nombre/Ubicación]
- Tipo de datos: Backend code
- Tamaño aproximado: 50 GB
- Prioridad: Alta
- Formato: JavaScript, Node.js
- Estado: Listo para subir

### Dispositivo 2: [Nombre/Ubicación]
- Tipo de datos: Media (fotos/videos)
- Tamaño aproximado: 500 GB
- Prioridad: Media
- Formato: JPG, MP4, PNG
- Estado: Requiere organización

### Dispositivo 3: [Nombre/Ubicación]
- Tipo de datos: Modelos de IA
- Tamaño aproximado: 300 GB
- Prioridad: Alta
- Formato: .pt, .onnx, .h5
- Estado: Listo

### Dispositivo 4: [Nombre/Ubicación]
- Tipo de datos: Base de datos
- Tamaño aproximado: 100 GB
- Prioridad: Alta
- Formato: SQL dumps, CSV
- Estado: Necesita backup
```

### PASO 2: Decidir Estrategia de Almacenamiento

#### Para Código (< 100 MB cada archivo):
✅ **Subir a Git directamente**
- Backend JavaScript/Python
- Frontend React/HTML/CSS
- Configuraciones JSON
- Scripts SQL

#### Para Archivos Medianos (100 MB - 2 GB):
✅ **Usar Git LFS**
- Modelos de IA pequeños
- Bases de datos comprimidas
- Archivos de configuración grandes

#### Para Archivos Grandes (> 2 GB):
✅ **Subir a Cloud Storage**
- Videos (pueden ser GB cada uno)
- Modelos de IA grandes
- Backups de bases de datos
- Colecciones de imágenes

### PASO 3: Configurar Cloud Storage (Recomendado)

#### Opción A: Cloudflare R2 (Económico)
```bash
# No tiene costos de egreso
# $0.015 GB/mes de almacenamiento
# 1 TB = $15/mes
```

#### Opción B: AWS S3
```bash
# $0.023 GB/mes
# 1 TB = $23/mes
```

#### Opción C: Google Cloud Storage
```bash
# $0.020 GB/mes
# 1 TB = $20/mes
```

### PASO 4: Orden de Carga Recomendado

#### Semana 1-2: Código y Configuraciones
```
Prioridad 1 - Código Esencial (Git)
├── Backend API (Node.js/Python)
├── Frontend (React)
├── Esquemas de base de datos
└── Configuraciones de IA

Tamaño estimado: 1-5 GB
Tiempo: 2-4 horas de upload
```

#### Semana 3-4: Datos Estructurados
```
Prioridad 2 - Bases de Datos (Git LFS o Cloud)
├── Dumps SQL comprimidos
├── Archivos CSV de memorias
├── JSONs de personalidades
└── Embeddings de texto

Tamaño estimado: 50-100 GB
Tiempo: 1-2 días de upload
```

#### Mes 2: Media Esencial
```
Prioridad 3 - Media Crítico (Cloud)
├── Fotos de perfil
├── Videos cortos importantes
├── Audios de voz
└── Documentos esenciales

Tamaño estimado: 100-200 GB
Tiempo: 3-5 días de upload
```

#### Mes 3-4: Media Complementario
```
Prioridad 4 - Media Adicional (Cloud)
├── Fotos secundarias
├── Videos largos
├── Backups antiguos
└── Media de baja prioridad

Tamaño estimado: 600-800 GB
Tiempo: 1-2 semanas de upload
```

---

## 🛠️ Comandos y Herramientas

### Configurar Git LFS (Una sola vez)

```bash
# Instalar Git LFS
git lfs install

# Configurar tipos de archivos para LFS
git lfs track "*.psd"
git lfs track "*.zip"
git lfs track "*.mp4"
git lfs track "*.avi"
git lfs track "*.pt"      # PyTorch models
git lfs track "*.h5"      # Keras models
git lfs track "*.onnx"    # ONNX models
git lfs track "*.pkl"     # Pickle files
git lfs track "*.db"      # Databases
git lfs track "*.sql.gz"  # Compressed SQL

# Guardar configuración
git add .gitattributes
git commit -m "Configure Git LFS for large files"
```

### Subir Código (Git Normal)

```bash
# Navegar a la carpeta del proyecto
cd /ruta/a/tu/proyecto/aria

# Copiar archivos de código
cp -r /dispositivo/backend/* ./aria-data/backend/
cp -r /dispositivo/frontend/* ./aria-data/frontend/

# Agregar a Git
git add aria-data/backend/
git add aria-data/frontend/

# Commit
git commit -m "Add backend and frontend code - Batch 1"

# Push
git push origin main
```

### Subir Archivos LFS

```bash
# Copiar archivos grandes (< 2GB)
cp /dispositivo/modelo.pt ./aria-data/ai-models/weights/

# Git LFS los maneja automáticamente
git add aria-data/ai-models/weights/modelo.pt
git commit -m "Add AI model - modelo.pt"
git push origin main
```

### Subir a Cloud Storage (AWS S3 Ejemplo)

```bash
# Instalar AWS CLI
# pip install awscli

# Configurar credenciales
aws configure

# Subir carpeta completa
aws s3 sync /dispositivo/media/ s3://aria-media-bucket/media/ \
  --storage-class STANDARD_IA

# Crear manifest en el repositorio
echo '{
  "bucket": "aria-media-bucket",
  "prefix": "media/",
  "total_files": 12580,
  "total_size_gb": 456.7,
  "last_updated": "2026-02-17"
}' > aria-media-refs/images.manifest.json

git add aria-media-refs/images.manifest.json
git commit -m "Add reference to 456GB of media in S3"
git push
```

---

## 📊 Sistema de Seguimiento

### Plantilla de Progreso

Crea un archivo `UPLOAD_PROGRESS.md`:

```markdown
# Progreso de Carga ARIA - 1TB

Iniciado: 2026-02-17
Meta: 1,000 GB

## Estado General
- ✅ Completado: 0 GB (0%)
- 🔄 En proceso: 0 GB (0%)
- ⏳ Pendiente: 1,000 GB (100%)

## Por Categoría

### 1. Código Backend
- Total: 5 GB
- ✅ Completado: 0 GB
- 📁 Ubicación Git: aria-data/backend/
- 📅 Última actualización: -

### 2. Código Frontend
- Total: 3 GB
- ✅ Completado: 0 GB
- 📁 Ubicación Git: aria-data/frontend/
- 📅 Última actualización: -

### 3. Base de Datos
- Total: 50 GB
- ✅ Completado: 0 GB
- 📁 Ubicación: Git LFS + Cloud
- 📅 Última actualización: -

### 4. Modelos IA
- Total: 300 GB
- ✅ Completado: 0 GB
- 📁 Ubicación Cloud: s3://aria-models/
- 📅 Última actualización: -

### 5. Media (Fotos)
- Total: 200 GB
- ✅ Completado: 0 GB
- 📁 Ubicación Cloud: s3://aria-media/images/
- 📅 Última actualización: -

### 6. Media (Videos)
- Total: 400 GB
- ✅ Completado: 0 GB
- 📁 Ubicación Cloud: s3://aria-media/videos/
- 📅 Última actualización: -

### 7. Otros
- Total: 42 GB
- ✅ Completado: 0 GB
- 📁 Ubicación: Mixta
- 📅 Última actualización: -

## Changelog

### 2026-02-17
- Creación de estructura de directorios
- Configuración de Git LFS
- Inicio de inventario
```

---

## ⚡ Consejos para Carga Eficiente

### 1. Comprime Antes de Subir
```bash
# Comprimir bases de datos
gzip backup.sql          # SQL → SQL.GZ (10x más pequeño)

# Comprimir logs
tar -czf logs.tar.gz logs/

# Comprimir código (si tiene mucho node_modules)
tar --exclude='node_modules' -czf backend.tar.gz backend/
```

### 2. Usa Conexión Estable
- Conecta por cable ethernet (no WiFi)
- Usa horarios de menor tráfico (noche/madrugada)
- Considera dividir en chunks si tu internet es lento

### 3. Verifica Integridad
```bash
# Generar checksum antes de subir
sha256sum archivo.zip > archivo.zip.sha256

# Verificar después de descargar
sha256sum -c archivo.zip.sha256
```

### 4. Upload Paralelo (Cloud)
```bash
# AWS S3 con múltiples hilos
aws s3 sync /local/path s3://bucket/path \
  --storage-class STANDARD_IA \
  --max-concurrent-requests 20
```

---

## 🚨 Errores Comunes y Soluciones

### Error: "File exceeds GitHub's 100MB limit"
**Solución**: Usar Git LFS o subir a cloud

```bash
# Si ya hiciste commit del archivo grande
git rm --cached archivo-grande.zip
git lfs track "*.zip"
git add .gitattributes
git add archivo-grande.zip
git commit -m "Move large file to LFS"
```

### Error: "Repository too large"
**Solución**: Limpiar historial y mover a LFS

```bash
# Usar BFG Repo Cleaner
java -jar bfg.jar --strip-blobs-bigger-than 100M
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Error: "Out of bandwidth" (Git LFS)
**Solución**: Esperar próximo mes o pagar extra

GitHub LFS: 1 GB gratis/mes
Si necesitas más: $5/mes por 50 GB

---

## 📈 Estimación de Tiempos

Con conexión de **10 Mbps upload**:

| Tamaño | Tiempo Estimado |
|--------|-----------------|
| 1 GB | ~15 minutos |
| 10 GB | ~2.5 horas |
| 50 GB | ~12 horas |
| 100 GB | ~24 horas |
| 500 GB | ~5 días |
| 1 TB | ~10 días |

**Con 100 Mbps**: Dividir tiempos por 10
**Con 1 Gbps**: Dividir tiempos por 100

---

## ✅ Checklist de Inicio

Antes de empezar a subir:

- [ ] He hecho inventario completo de mis datos
- [ ] He decidido qué va a Git, Git LFS o Cloud
- [ ] He configurado Git LFS (si lo necesito)
- [ ] He creado cuenta en servicio cloud (si lo necesito)
- [ ] He creado estructura de directorios
- [ ] He creado archivo de progreso
- [ ] Tengo backups de todo (por si acaso)
- [ ] Tengo conexión estable
- [ ] He leído toda esta guía

---

## 🆘 ¿Necesitas Ayuda?

1. **Para código**: Sube a Git normal
2. **Para archivos < 2GB**: Usa Git LFS
3. **Para archivos > 2GB**: Usa Cloud Storage
4. **Duda sobre qué hacer**: Pregunta antes de subir

---

## 📞 Próximos Pasos

1. **HOY**: Completa el inventario (qué tienes y dónde)
2. **MAÑANA**: Decide estrategia (Git/LFS/Cloud)
3. **ESTA SEMANA**: Sube el código primero
4. **PRÓXIMAS SEMANAS**: Sube datos gradualmente

---

**Recuerda**: No hay prisa. Es mejor subir poco a poco de forma organizada que todo de golpe y crear un caos. ¡Tienes tiempo! 🚀

---

**Última actualización**: 2026-02-17  
**Versión**: 1.0
