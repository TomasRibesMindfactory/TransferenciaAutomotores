# 🐳 Guía de Docker para Transferencia de Automotor

## 📋 Resumen de Cambios

### Credenciales Actualizadas
- **Usuario anterior**: `sa` / `Nicolas..8`
- **Usuario nuevo**: `sa` / `TransferApp2024!`

### Archivos Creados/Modificados
- ✅ `docker-compose.yml` - Orquestación completa (app + db)
- ✅ `docker-compose.dev.yml` - Solo base de datos para desarrollo
- ✅ `Dockerfile` - Imagen de la aplicación NestJS
- ✅ `.env` - Variables de entorno
- ✅ `.dockerignore` - Archivos excluidos del build
- ✅ `src/app.module.ts` - Configuración con variables de entorno
- ✅ `package.json` - Scripts adicionales para Docker

## 🚀 Comandos Rápidos

### Solo Base de Datos (Desarrollo Local)
```bash
# Iniciar SQL Server en Docker
npm run docker:db

# Detener base de datos
npm run docker:db:stop
```

### Aplicación Completa
```bash
# Construir y ejecutar todo
npm run docker:build
npm run docker:up

# Ver logs de la aplicación
npm run docker:logs

# Detener todo
npm run docker:down
```

## 🔧 Configuración de Base de Datos

### Credenciales por Defecto
```
Servidor: localhost,1433
Usuario: sa
Contraseña: TransferApp2024!
Base de datos: TransferenciaAutomotor
```

### Conexión desde Cliente Externo
Puedes conectarte usando cualquier cliente SQL (SSMS, Azure Data Studio, etc.) con:
- **Host**: `localhost`
- **Puerto**: `1433`
- **Usuario**: `sa`
- **Contraseña**: `TransferApp2024!`

## 📁 Estructura de Archivos Docker

```
📦 Proyecto
├── 🐳 docker-compose.yml          # Producción (app + db)
├── 🐳 docker-compose.dev.yml      # Solo DB para desarrollo
├── 🐳 Dockerfile                  # Imagen de la aplicación
├── 🔧 .env                        # Variables de entorno
├── 📝 .dockerignore               # Archivos excluidos
└── 📋 package.json                # Scripts Docker añadidos
```

## 🌍 Variables de Entorno

El archivo `.env` contiene:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=TransferApp2024!
DB_DATABASE=TransferenciaAutomotor

# Application Configuration
NODE_ENV=development
PORT=3000
```

## 🔄 Flujos de Trabajo

### Desarrollo Local (Solo DB en Docker)
1. `npm run docker:db` - Iniciar base de datos
2. `npm install` - Instalar dependencias
3. `npm run start:dev` - Ejecutar app en modo desarrollo

### Producción/Testing (Todo en Docker)
1. `npm run docker:build` - Construir imágenes
2. `npm run docker:up` - Iniciar servicios
3. `npm run docker:logs` - Monitorear logs

### Limpieza
```bash
# Detener y eliminar contenedores
npm run docker:down

# Eliminar también los volúmenes (¡CUIDADO! Borra datos)
docker-compose down -v

# Limpiar imágenes no utilizadas
docker system prune
```

## 🐛 Troubleshooting

### La aplicación no puede conectar a la DB
- Verifica que el contenedor de DB esté corriendo: `docker ps`
- Revisa los logs: `docker-compose logs db`
- Asegúrate de que el puerto 1433 no esté ocupado

### Errores de permisos en Windows
- Ejecuta PowerShell como administrador
- Verifica que Docker Desktop esté corriendo

### La aplicación no refleja cambios
- En desarrollo: usa `npm run start:dev` fuera de Docker
- En Docker: reconstruye con `npm run docker:build`

## 📊 Monitoreo

### Ver logs en tiempo real
```bash
# Logs de la aplicación
docker-compose logs -f app

# Logs de la base de datos
docker-compose logs -f db

# Logs de todos los servicios
docker-compose logs -f
```

### Estado de los contenedores
```bash
# Ver contenedores corriendo
docker ps

# Ver uso de recursos
docker stats
```

## 🔒 Seguridad

⚠️ **Importante**: Las credenciales en este setup son para desarrollo local. En producción:

1. Usa variables de entorno seguras
2. No commitees credenciales al repositorio
3. Implementa secretos de Docker/Kubernetes
4. Cambia las contraseñas por defecto
