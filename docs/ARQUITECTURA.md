# 🏗️ Documentación de Arquitectura - Café Luna

## Índice
1. [Visión General](#visión-general)
2. [Arquitectura de Alto Nivel](#arquitectura-de-alto-nivel)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Componentes Principales](#componentes-principales)
5. [Flujo de Datos](#flujo-de-datos)
6. [Patrones de Diseño](#patrones-de-diseño)
7. [Seguridad](#seguridad)
8. [Base de Datos](#base-de-datos)

---

## Visión General

Café Luna es un sistema de gestión integral para cafeterías construido siguiendo una arquitectura **MVC (Model-View-Controller)** con **separación de responsabilidades** y **servicios reutilizables**.

### Tecnologías Core
- **Backend**: Node.js + Express.js
- **Template Engine**: Pug
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: JWT + Sessions
- **Real-time**: Supabase Realtime
- **Testing**: Jest + Supertest

---

## Arquitectura de Alto Nivel

```
┌─────────────┐
│   Cliente   │
│  (Browser)  │
└──────┬──────┘
       │
       │ HTTP/HTTPS
       │
┌──────▼──────────────────────────────────┐
│         Express.js Server               │
│  ┌────────────────────────────────┐    │
│  │      Middleware Stack          │    │
│  │  - Helmet (Security)           │    │
│  │  - CORS                         │    │
│  │  - Body Parser                  │    │
│  │  - Cookie Parser                │    │
│  │  - Session Management           │    │
│  │  - Auth Middleware              │    │
│  │  - Role-Based Access Control    │    │
│  └────────────────────────────────┘    │
│                                         │
│  ┌────────────────────────────────┐    │
│  │         Routes Layer           │    │
│  │  /api/auth                     │    │
│  │  /api/pedidos                  │    │
│  │  /api/productos                │    │
│  │  /api/inventario               │    │
│  │  /api/reportes                 │    │
│  │  /api/usuarios                 │    │
│  └────────────────────────────────┘    │
│                                         │
│  ┌────────────────────────────────┐    │
│  │      Controllers Layer         │    │
│  │  - Business Logic              │    │
│  │  - Request Validation          │    │
│  │  - Response Formatting         │    │
│  └────────────────────────────────┘    │
│                                         │
│  ┌────────────────────────────────┐    │
│  │       Services Layer           │    │
│  │  - Complex Business Logic      │    │
│  │  - Data Transformation         │    │
│  │  - External Integrations       │    │
│  └────────────────────────────────┘    │
│                                         │
│  ┌────────────────────────────────┐    │
│  │      Views Layer (Pug)         │    │
│  │  - Server-side Rendering       │    │
│  │  - Template Composition        │    │
│  └────────────────────────────────┘    │
└─────────────┬───────────────────────────┘
              │
              │ REST API / SQL
              │
┌─────────────▼───────────────┐
│     Supabase (Backend)      │
│  ┌─────────────────────┐    │
│  │   PostgreSQL DB     │    │
│  │  - usuarios         │    │
│  │  - productos        │    │
│  │  - pedidos          │    │
│  │  - inventario       │    │
│  └─────────────────────┘    │
│                              │
│  ┌─────────────────────┐    │
│  │   Realtime Engine   │    │
│  │  - WebSocket        │    │
│  │  - Change Streams   │    │
│  └─────────────────────┘    │
│                              │
│  ┌─────────────────────┐    │
│  │   Auth Service      │    │
│  │  - User Management  │    │
│  └─────────────────────┘    │
└──────────────────────────────┘
```

---

## Estructura del Proyecto

```
Cafe-Luna/
├── src/
│   ├── app.js                    # Configuración de Express
│   ├── config/                   # Configuración
│   │   └── supabase.js          # Cliente Supabase
│   ├── controllers/              # Controladores (lógica de negocio)
│   │   ├── auth.controller.js
│   │   ├── pedidos.controller.js
│   │   ├── productos.controller.js
│   │   ├── inventario.controller.js
│   │   ├── reportes.controller.js
│   │   └── usuarios.controller.js
│   ├── middleware/               # Middleware personalizado
│   │   ├── auth.middleware.js   # Verificación JWT
│   │   ├── roles.middleware.js  # Control de acceso
│   │   └── error.middleware.js  # Manejo de errores
│   ├── routes/                   # Definición de rutas
│   │   ├── auth.routes.js
│   │   ├── pedidos.routes.js
│   │   ├── productos.routes.js
│   │   ├── inventario.routes.js
│   │   ├── reportes.routes.js
│   │   └── usuarios.routes.js
│   ├── services/                 # Servicios de negocio
│   │   ├── pedidos.service.js
│   │   ├── productos.service.js
│   │   └── inventario.service.js
│   ├── utils/                    # Utilidades
│   │   ├── pedidos.util.js
│   │   └── validators.js
│   └── tests/                    # Tests unitarios
│       ├── auth.test.js
│       ├── pedidos.test.js
│       ├── productos.test.js
│       ├── inventario.test.js
│       └── usuarios.test.js
├── views/                        # Plantillas Pug
│   ├── layout.pug               # Layout base
│   ├── login.pug
│   ├── dashboard.pug
│   ├── pedidos/
│   ├── productos/
│   ├── inventario/
│   └── usuarios/
├── public/                       # Archivos estáticos
│   ├── css/                     # Estilos
│   ├── js/                      # JavaScript frontend
│   │   ├── auth.js
│   │   ├── pedidos.js
│   │   ├── productos.js
│   │   ├── inventario.js
│   │   ├── usuarios.js
│   │   ├── reportes.js
│   │   ├── realtime.js
│   │   └── utils.js            # Utilidades (loading, toast, etc.)
│   └── images/
├── database/                     # Scripts de base de datos
│   ├── schema.sql               # Esquema de tablas
│   ├── seed.sql                 # Datos de prueba
│   └── indexes.sql              # Índices de optimización
├── docs/                         # Documentación
│   ├── API.md
│   ├── ARQUITECTURA.md
│   └── MANUAL_USUARIO.md
├── server.js                     # Punto de entrada
├── package.json
└── jest.config.js               # Configuración de tests
```

---

## Componentes Principales

### 1. Express Application (src/app.js)

Configura el servidor Express con todos los middlewares necesarios:
- **Seguridad**: Helmet para headers HTTP seguros
- **CORS**: Permite peticiones cross-origin
- **Parsers**: JSON y URL-encoded bodies
- **Sessions**: Gestión de sesiones de usuario
- **Static Files**: Servir archivos públicos

### 2. Controllers

**Responsabilidad**: Manejar requests HTTP y coordinar la lógica de negocio.

Ejemplo (pedidos.controller.js):
```javascript
const crearPedido = async (req, res) => {
  // 1. Validar datos de entrada
  // 2. Llamar servicios de negocio
  // 3. Interactuar con la base de datos
  // 4. Formatear y enviar respuesta
};
```

### 3. Services

**Responsabilidad**: Encapsular lógica de negocio compleja y reutilizable.

- `pedidos.service.js`: Lógica de creación y gestión de pedidos
- `productos.service.js`: Gestión de catálogo de productos
- `inventario.service.js`: Control de stock e inventario

### 4. Middleware

#### auth.middleware.js
- Verifica tokens JWT
- Extrae información del usuario
- Protege rutas privadas

#### roles.middleware.js
- Implementa RBAC (Role-Based Access Control)
- Define permisos por rol:
  - **admin**: Acceso completo
  - **barista**: Crear pedidos, gestionar inventario
  - **cocina**: Ver y actualizar pedidos
  - **mesero**: Crear y ver pedidos

#### error.middleware.js
- Manejo centralizado de errores
- Sanitización de logs
- Respuestas consistentes de error

### 5. Utils

**Utilidades reutilizables**:
- `pedidos.util.js`: Generación de números de pedido, cálculo de totales, validación de estados
- `validators.js`: Validadores personalizados con express-validator

---

## Flujo de Datos

### Ejemplo: Crear un Pedido

```
1. Cliente → POST /api/pedidos
   ↓
2. Express Router → pedidos.routes.js
   ↓
3. Middleware Chain:
   - verificarToken (autenticación)
   - verificarRol(['admin', 'barista'])
   - express-validator (validación)
   ↓
4. Controller → pedidos.controller.js
   - Extrae datos del request
   - Valida disponibilidad de productos
   ↓
5. Service → pedidos.service.js (opcional)
   - Lógica de negocio compleja
   ↓
6. Utils → pedidos.util.js
   - Genera número de pedido
   - Calcula total
   ↓
7. Database → Supabase
   - Insert pedido
   - Insert pedido_items
   - Insert historial_pedidos
   ↓
8. Response → Cliente
   - JSON con pedido creado
```

---

## Patrones de Diseño

### 1. MVC (Model-View-Controller)
- **Model**: Representado por Supabase (PostgreSQL)
- **View**: Templates Pug
- **Controller**: Controllers en src/controllers/

### 2. Service Layer Pattern
Capa intermedia entre controllers y base de datos para lógica de negocio compleja.

### 3. Middleware Pattern
Pipeline de funciones que procesan requests antes de llegar a los controllers.

### 4. Repository Pattern (Implícito)
Supabase client actúa como repository abstrayendo queries SQL.

### 5. Dependency Injection
Configuración y servicios inyectados en controllers.

---

## Seguridad

### Capas de Seguridad

1. **Helmet.js**
   - Headers HTTP seguros
   - XSS Protection
   - Content Security Policy

2. **Autenticación JWT**
   - Tokens firmados con secret
   - Expiración en 8 horas
   - Almacenados en cookies httpOnly

3. **Autorización RBAC**
   - Control granular por rol
   - Validación en cada endpoint

4. **Validación de Datos**
   - express-validator en todos los endpoints
   - Sanitización de inputs
   - Prevención de SQL injection

5. **Password Hashing**
   - bcryptjs con salt rounds
   - Nunca se almacenan passwords en texto plano

6. **Session Management**
   - express-session con secret
   - Cookies seguras en producción
   - Regeneración de session ID

7. **Error Handling**
   - No exponer stack traces en producción
   - Log sanitization
   - Mensajes de error genéricos

---

## Base de Datos

### Modelo de Datos

#### Tablas Principales

**usuarios**
- Autenticación y control de acceso
- Roles: admin, barista, cocina, mesero

**productos**
- Catálogo de bebidas y comida
- Categorías, precios, disponibilidad

**pedidos**
- Registro de órdenes
- Estados: pendiente, en_preparacion, listo, entregado, cancelado
- Tipos: mostrador, uber_eats, rappi, didi_food

**pedido_items**
- Detalle de productos por pedido
- Relación many-to-many entre pedidos y productos

**inventario**
- Control de stock de insumos
- Alertas de stock bajo

**movimientos_inventario**
- Historial de entradas/salidas
- Trazabilidad completa

**historial_pedidos**
- Auditoría de cambios de estado
- Quién y cuándo cambió el estado

### Optimizaciones

- **Índices**: Definidos en `database/indexes.sql`
  - Búsquedas por estado, fecha, categoría
  - Full-text search en productos
  - Índices parciales para queries específicos

- **Realtime**: Suscripción a cambios en pedidos
- **Transactions**: Operaciones atómicas
- **Foreign Keys**: Integridad referencial

---

## Escalabilidad

### Consideraciones de Escalabilidad

1. **Horizontal Scaling**
   - Stateless API permite múltiples instancias
   - Load balancer para distribuir tráfico

2. **Database Optimization**
   - Índices estratégicos
   - Connection pooling
   - Query optimization

3. **Caching** (Futuro)
   - Redis para sesiones
   - Cache de productos frecuentes

4. **CDN** (Futuro)
   - Archivos estáticos en CDN
   - Imágenes optimizadas

---

## Testing

### Estrategia de Testing

1. **Unit Tests**
   - Controllers individuales
   - Utils y helpers
   - Coverage > 70%

2. **Integration Tests**
   - Flujos completos de API
   - Mocking de Supabase

3. **E2E Tests** (Futuro)
   - Playwright para testing de UI
   - Flujos críticos de usuario

---

## Monitoreo y Logging

### Logging
- Console logs con niveles (error, warn, info)
- Sanitización de logs sensibles
- Timestamps en formato ISO

### Métricas Clave
- Response time por endpoint
- Error rate
- Throughput (requests/segundo)
- Database query performance

---

## Deployment

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas de despliegue.

### Ambientes

1. **Development**
   - Local con nodemon
   - Variables de entorno en .env

2. **Staging** (Futuro)
   - Testing en ambiente productivo
   - Validación pre-release

3. **Production**
   - NODE_ENV=production
   - HTTPS obligatorio
   - RLS habilitado en Supabase

---

## Mantenimiento

### Tareas Periódicas
- Actualizar dependencias (npm audit)
- Revisar logs de errores
- Optimizar queries lentas
- Backup de base de datos

### Mejoras Futuras
- [ ] Integración con Stripe/PayPal
- [ ] Notificaciones push
- [ ] App móvil (React Native)
- [ ] Reportes en PDF
- [ ] Sistema de recompensas
- [ ] Integración con impresoras de tickets

---

## Referencias

- [Express.js Documentation](https://expressjs.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Pug Template Engine](https://pugjs.org/)
- [JWT Authentication](https://jwt.io/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Última actualización**: Noviembre 2025  
**Versión**: 1.0
