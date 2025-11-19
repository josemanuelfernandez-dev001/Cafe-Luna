# 🚀 Guía de Despliegue - Café Luna

## Índice
1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de Supabase](#configuración-de-supabase)
3. [Despliegue en Desarrollo](#despliegue-en-desarrollo)
4. [Despliegue en Producción](#despliegue-en-producción)
5. [Variables de Entorno](#variables-de-entorno)
6. [Opciones de Hosting](#opciones-de-hosting)
7. [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)
8. [Troubleshooting](#troubleshooting)

---

## Requisitos Previos

### Software Necesario
- **Node.js**: v16.0.0 o superior
- **npm** o **yarn**: Última versión
- **Git**: Para control de versiones
- **PostgreSQL**: (Opcional, si no usas Supabase)

### Cuentas Requeridas
- [Supabase](https://supabase.com) - Base de datos y backend
- [Heroku](https://heroku.com) / [Railway](https://railway.app) / [Render](https://render.com) - Hosting (opcional)
- [Cloudflare](https://cloudflare.com) - CDN y DNS (opcional)

---

## Configuración de Supabase

### 1. Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Click en "New Project"
4. Completa los datos:
   - **Name**: cafe-luna
   - **Database Password**: Guarda esta contraseña
   - **Region**: Selecciona la más cercana a tus usuarios
5. Espera 2-3 minutos a que el proyecto se configure

### 2. Ejecutar Scripts SQL

En el dashboard de Supabase:

1. Ve a **SQL Editor**
2. Ejecuta los scripts en este orden:

**Paso 1: Schema**
```bash
# Copia y pega el contenido de database/schema.sql
```

**Paso 2: Seed (Datos de Prueba)**
```bash
# Copia y pega el contenido de database/seed.sql
```

**Paso 3: Índices (Optimización)**
```bash
# Copia y pega el contenido de database/indexes.sql
```

### 3. Configurar Row Level Security (RLS)

**Importante para Producción**

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_pedidos ENABLE ROW LEVEL SECURITY;

-- Política para permitir acceso solo a usuarios autenticados
-- (El sistema usa service_role_key que bypassa RLS)
CREATE POLICY "Allow authenticated access" ON usuarios
  FOR ALL USING (true);
```

### 4. Obtener Credenciales

En el dashboard:
1. Ve a **Settings** → **API**
2. Copia:
   - **URL**: `https://[tu-proyecto].supabase.co`
   - **anon/public key**: Para desarrollo
   - **service_role key**: Para backend (¡Nunca exponer!)

---

## Despliegue en Desarrollo

### 1. Clonar Repositorio

```bash
git clone https://github.com/josemanuelfernandez-dev001/Cafe-Luna.git
cd Cafe-Luna
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env`:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
# Node Environment
NODE_ENV=development

# Server Configuration
PORT=3000

# Supabase Configuration
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# JWT Configuration
JWT_SECRET=tu-secret-super-seguro-aqui-cambialo
JWT_EXPIRES_IN=8h

# Session Configuration
SESSION_SECRET=otro-secret-para-sessions-cambialo-tambien
```

### 4. Iniciar Servidor de Desarrollo

```bash
# Con auto-reload
npm run dev

# O modo normal
npm start
```

### 5. Verificar Instalación

Abre el navegador en: `http://localhost:3000`

Credenciales de prueba:
- Email: `admin@cafeluna.com`
- Password: `password123`

---

## Despliegue en Producción

### Preparación

1. **Actualizar Variables de Entorno**

```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-prod
JWT_SECRET=secret-ultra-seguro-generado-aleatoriamente
SESSION_SECRET=otro-secret-seguro-para-sessions
```

2. **Generar Secrets Seguros**

```bash
# Usar OpenSSL para generar secrets aleatorios
openssl rand -base64 32
```

### Opción 1: Heroku

#### Paso 1: Crear App

```bash
heroku login
heroku create cafe-luna-app
```

#### Paso 2: Configurar Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set SUPABASE_URL=https://tu-proyecto.supabase.co
heroku config:set SUPABASE_SERVICE_ROLE_KEY=tu-key
heroku config:set JWT_SECRET=tu-secret
heroku config:set SESSION_SECRET=otro-secret
```

#### Paso 3: Deploy

```bash
git push heroku main
```

#### Paso 4: Abrir App

```bash
heroku open
```

### Opción 2: Railway

#### Paso 1: Crear Proyecto

1. Ve a [railway.app](https://railway.app)
2. Click en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Autoriza y selecciona tu repositorio

#### Paso 2: Configurar Variables

En el dashboard de Railway, añade las variables:
- `NODE_ENV=production`
- `SUPABASE_URL=...`
- `SUPABASE_SERVICE_ROLE_KEY=...`
- `JWT_SECRET=...`
- `SESSION_SECRET=...`

#### Paso 3: Deploy Automático

Railway detectará el `package.json` y hará deploy automáticamente.

### Opción 3: Render

#### Paso 1: Crear Web Service

1. Ve a [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Conecta tu repositorio de GitHub

#### Paso 2: Configuración

- **Name**: cafe-luna
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`

#### Paso 3: Variables de Entorno

Añade en el panel de Environment:
```
NODE_ENV=production
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=...
SESSION_SECRET=...
```

#### Paso 4: Deploy

Click en "Create Web Service"

### Opción 4: VPS (DigitalOcean, Linode, AWS EC2)

#### Paso 1: Preparar Servidor

```bash
# SSH al servidor
ssh user@tu-servidor.com

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 (Process Manager)
sudo npm install -g pm2
```

#### Paso 2: Clonar y Configurar

```bash
git clone https://github.com/tu-usuario/Cafe-Luna.git
cd Cafe-Luna
npm install --production

# Crear .env con variables de producción
nano .env
```

#### Paso 3: Iniciar con PM2

```bash
pm2 start server.js --name cafe-luna
pm2 save
pm2 startup
```

#### Paso 4: Configurar Nginx (Reverse Proxy)

```bash
sudo apt-get install nginx

# Configurar Nginx
sudo nano /etc/nginx/sites-available/cafe-luna
```

Contenido:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/cafe-luna /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Paso 5: SSL con Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

---

## Variables de Entorno

### Variables Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NODE_ENV` | Ambiente de ejecución | `production` |
| `PORT` | Puerto del servidor | `3000` |
| `SUPABASE_URL` | URL de Supabase | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Key de servicio | `eyJhbGc...` |
| `JWT_SECRET` | Secret para JWT | `random-32-chars` |
| `SESSION_SECRET` | Secret para sessions | `another-random-32` |

### Variables Opcionales

| Variable | Descripción | Default |
|----------|-------------|---------|
| `JWT_EXPIRES_IN` | Tiempo de expiración JWT | `8h` |
| `SESSION_MAX_AGE` | Duración de sesión (ms) | `28800000` |

---

## Monitoreo y Mantenimiento

### Logs

**En Heroku:**
```bash
heroku logs --tail
```

**Con PM2:**
```bash
pm2 logs cafe-luna
```

### Métricas

**Supabase Dashboard:**
- Database size
- API requests
- Active connections

**PM2 Monitoring:**
```bash
pm2 monit
```

### Backups

**Base de Datos (Supabase):**
1. Dashboard → Database → Backups
2. Configurar backups automáticos
3. O manual: SQL Editor → Export

**Código:**
```bash
git push origin main
# GitHub actúa como backup
```

### Actualizaciones

```bash
# Pull últimos cambios
git pull origin main

# Instalar dependencias
npm install

# Reiniciar aplicación
pm2 restart cafe-luna
# o en Heroku:
git push heroku main
```

---

## Troubleshooting

### Error: "Cannot connect to Supabase"

**Solución:**
1. Verifica que `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` sean correctos
2. Revisa que el proyecto de Supabase esté activo
3. Comprueba la conectividad a internet

### Error: "Port already in use"

**Solución:**
```bash
# Encontrar proceso usando el puerto
lsof -i :3000
# Matar proceso
kill -9 [PID]
```

### Error: "Session secret not set"

**Solución:**
```bash
# Añadir SESSION_SECRET al .env
SESSION_SECRET=tu-secret-aqui
```

### Error 401 en las APIs

**Solución:**
1. Token JWT expirado → Hacer login nuevamente
2. Cookie no enviada → Verificar configuración de cookies
3. Middleware de auth fallando → Revisar logs

### Base de datos lenta

**Solución:**
1. Ejecutar `database/indexes.sql`
2. Revisar queries en Supabase Dashboard
3. Optimizar queries N+1
4. Considerar añadir caching

### Memory leaks

**Solución:**
```bash
# Monitorear memoria con PM2
pm2 monit

# Reiniciar automáticamente si excede límite
pm2 start server.js --max-memory-restart 500M
```

---

## Checklist Pre-Deploy

- [ ] Variables de entorno configuradas
- [ ] Secrets generados aleatoriamente
- [ ] Base de datos creada y migrada
- [ ] Índices aplicados
- [ ] RLS configurado (producción)
- [ ] Tests pasando
- [ ] Logs configurados
- [ ] Backups habilitados
- [ ] SSL configurado (HTTPS)
- [ ] Dominio configurado
- [ ] Monitoreo activo

---

## Recursos Adicionales

- [Supabase Docs](https://supabase.com/docs)
- [Heroku Node.js Guide](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Let's Encrypt](https://letsencrypt.org/)

---

**Última actualización**: Noviembre 2025  
**Versión**: 1.0
