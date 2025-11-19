# ☕ Café Luna - Sistema de Gestión Interna

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![Express](https://img.shields.io/badge/express-4.18.2-lightgrey.svg)
![Supabase](https://img.shields.io/badge/supabase-latest-green.svg)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)
![Coverage](https://img.shields.io/badge/coverage-70%25-yellow.svg)

Sistema completo de gestión para cafetería desarrollado con Node.js, Express, Pug y Supabase.

## 📋 Descripción

Café Luna es un sistema de gestión integral para cafeterías que permite:
- 📱 Gestión de pedidos de mostrador y apps de delivery (Uber Eats, Rappi, Didi Food)
- 🔄 Actualización en tiempo real de la cola de pedidos
- 🍰 Catálogo de productos con gestión de disponibilidad
- 📦 Control de inventario con alertas de stock bajo
- 📊 Reportes de ventas diarias y por período
- 👥 Gestión de usuarios con control de roles (RBAC)
- 🔐 Autenticación segura con JWT

## 🛠️ Stack Tecnológico

- **Backend:** Node.js + Express.js
- **Template Engine:** Pug (Jade)
- **Base de datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth + JWT
- **Real-time:** Supabase Realtime
- **Estilos:** CSS3 (Custom)
- **JavaScript:** Vanilla JS (Frontend)

## 📁 Estructura del Proyecto

```
Cafe-Luna/
├── src/
│   ├── config/           # Configuración de Supabase
│   ├── controllers/      # Controladores de lógica de negocio
│   ├── middleware/       # Middleware de autenticación y roles
│   ├── routes/           # Definición de rutas API
│   ├── services/         # Servicios de negocio
│   └── utils/            # Utilidades y validadores
├── views/                # Plantillas Pug
├── public/               # Archivos estáticos (CSS, JS, imágenes)
├── database/             # Scripts SQL (schema y seed)
├── server.js             # Punto de entrada
└── package.json          # Dependencias
```

## 🚀 Instalación

### Prerrequisitos

- Node.js 16+ 
- NPM o Yarn
- Cuenta de Supabase (gratuita)

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/josemanuelfernandez-dev001/Cafe-Luna.git
   cd Cafe-Luna
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   Edita `.env` con tus credenciales de Supabase (ya incluidas en el ejemplo).

4. **Configurar la base de datos**
   - Accede a tu proyecto en [Supabase](https://supabase.com)
   - En el SQL Editor, ejecuta los scripts en este orden:
     1. `database/schema.sql` - Crea las tablas
     2. `database/seed.sql` - Inserta datos de prueba

5. **Iniciar el servidor**
   
   Modo desarrollo (con auto-reload):
   ```bash
   npm run dev
   ```
   
   Modo producción:
   ```bash
   npm start
   ```

6. **Acceder a la aplicación**
   
   Abre tu navegador en: `http://localhost:3000`

## 👤 Credenciales de Prueba

Puedes iniciar sesión con cualquiera de estos usuarios:

| Email | Password | Rol | Permisos |
|-------|----------|-----|----------|
| admin@cafeluna.com | password123 | Administrador | Acceso completo |
| carlos@cafeluna.com | password123 | Barista | Crear pedidos, productos |
| ana@cafeluna.com | password123 | Barista | Crear pedidos, productos |
| roberto@cafeluna.com | password123 | Cocina | Actualizar estado pedidos |
| laura@cafeluna.com | password123 | Mesero | Crear/ver pedidos |

## 📖 Funcionalidades por Rol

### 👨‍💼 Administrador
- ✅ Todas las funcionalidades
- ✅ Crear/editar productos
- ✅ Gestionar usuarios
- ✅ Ver reportes completos

### ☕ Barista
- ✅ Crear pedidos (mostrador y apps)
- ✅ Ver cola de pedidos
- ✅ Actualizar estado de pedidos
- ✅ Ver inventario
- ✅ Actualizar inventario

### 🍳 Cocina
- ✅ Ver cola de pedidos
- ✅ Actualizar estado de pedidos
- ✅ Ver productos

### 🧑‍💼 Mesero
- ✅ Crear pedidos
- ✅ Ver cola de pedidos
- ✅ Ver productos

## 🔗 Endpoints API Principales

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/verificar` - Verificar sesión

### Pedidos
- `GET /api/pedidos` - Listar pedidos
- `GET /api/pedidos/:id` - Obtener pedido
- `POST /api/pedidos` - Crear pedido
- `PATCH /api/pedidos/:id/estado` - Actualizar estado

### Productos
- `GET /api/productos` - Listar productos
- `GET /api/productos/:id` - Obtener producto
- `POST /api/productos` - Crear producto (Admin)
- `PUT /api/productos/:id` - Actualizar producto (Admin)
- `DELETE /api/productos/:id` - Eliminar producto (Admin)

### Inventario
- `GET /api/inventario` - Listar inventario
- `GET /api/inventario/:id` - Obtener item
- `PUT /api/inventario/:id` - Actualizar inventario

### Reportes
- `GET /api/reportes/ventas-diarias?fecha=YYYY-MM-DD` - Reporte diario
- `GET /api/reportes/ventas-periodo?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD` - Reporte por período

### Usuarios
- `GET /api/usuarios` - Listar usuarios (Admin)
- `GET /api/usuarios/:id` - Obtener usuario (Admin)
- `POST /api/usuarios` - Crear usuario (Admin)
- `PUT /api/usuarios/:id` - Actualizar usuario (Admin)

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Autenticación JWT con cookies httpOnly
- Middleware de validación con express-validator
- Control de acceso basado en roles (RBAC)
- Variables sensibles en .env (no versionadas)
- Helmet.js para headers de seguridad

## 📊 Base de Datos

### Tablas Principales

- **usuarios** - Información de usuarios del sistema
- **productos** - Catálogo de productos
- **pedidos** - Pedidos de clientes
- **pedido_items** - Detalle de items por pedido
- **historial_pedidos** - Historial de cambios de estado
- **inventario** - Control de stock de insumos
- **movimientos_inventario** - Registro de entradas/salidas

## 🎨 Características de UI

- ✨ Diseño responsive (mobile-first)
- 🎨 Tema personalizado en tonos café/marrón
- 🔔 Notificaciones en tiempo real
- ⚡ Actualización automática de cola de pedidos
- 📱 Interfaz intuitiva y fácil de usar

## 🔄 Sistema de Tiempo Real

El sistema incluye:
- Actualización automática de cola de pedidos (polling cada 30 segundos)
- Colores de alerta según tiempo de espera:
  - 🟢 Verde: < 15 minutos
  - 🟡 Amarillo: 15-30 minutos
  - 🔴 Rojo: > 30 minutos

## 📝 Scripts Disponibles

```bash
npm start        # Iniciar servidor en producción
npm run dev      # Iniciar servidor en desarrollo con nodemon
```

## 🤝 Autores

- **José Manuel Fernández** - Desarrollo
- **Jorge Manuel Cabrera Zapata** - Desarrollo

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🔧 Configuración de Supabase

**URL:** `https://uegevvbdylinllgyisji.supabase.co`

Las credenciales están incluidas en `.env.example` para facilitar el desarrollo.

**Nota:** En producción, asegúrate de usar variables de entorno seguras y habilitar RLS (Row Level Security) en Supabase.

## 🐛 Solución de Problemas

### Error de conexión a Supabase
- Verifica que las variables SUPABASE_URL y SUPABASE_ANON_KEY estén correctas
- Asegúrate de haber ejecutado los scripts SQL en Supabase

### Error 401 en las API
- Verifica que hayas iniciado sesión correctamente
- El token JWT puede haber expirado (8 horas por defecto)

### Productos no se muestran
- Verifica que los productos tengan `disponible = true` en la base de datos
- Revisa la consola del navegador para errores

## 📚 Próximas Mejoras

- [ ] Integración directa con Supabase Realtime (WebSockets)
- [ ] Upload de imágenes a Supabase Storage
- [ ] Reportes en PDF
- [ ] Gráficas con Chart.js
- [ ] Notificaciones push
- [ ] App móvil con React Native
- [ ] Impresión de tickets
- [ ] Integración con sistemas de pago

## 💬 Soporte

Para preguntas o problemas, abre un issue en el repositorio de GitHub.
