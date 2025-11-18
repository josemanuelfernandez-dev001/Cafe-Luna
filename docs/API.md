# 📖 API Documentation - Café Luna

## Base URL
```
http://localhost:3000/api
```

## Autenticación

Todas las rutas API (excepto `/api/auth/login`) requieren autenticación mediante JWT. El token debe ser enviado de dos formas:
- Cookie `token` (httpOnly) - automático después del login
- Header `Authorization: Bearer <token>`

---

## 🔐 Autenticación

### Login
Iniciar sesión en el sistema.

**Endpoint:** `POST /api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "admin@cafeluna.com",
  "password": "password123"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Login exitoso",
  "user": {
    "id": "uuid",
    "email": "admin@cafeluna.com",
    "nombre": "Admin",
    "rol": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**
- `401` - Credenciales inválidas
- `500` - Error del servidor

---

### Logout
Cerrar sesión y destruir token.

**Endpoint:** `POST /api/auth/logout`

**Respuesta exitosa (200):**
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

---

### Verificar Sesión
Verificar si la sesión actual es válida.

**Endpoint:** `GET /api/auth/verificar`

**Respuesta exitosa (200):**
```json
{
  "authenticated": true,
  "user": {
    "id": "uuid",
    "email": "admin@cafeluna.com",
    "nombre": "Admin",
    "rol": "admin"
  }
}
```

**Error (401):**
```json
{
  "authenticated": false
}
```

---

## 📋 Pedidos

### Listar Pedidos
Obtener lista de pedidos con filtros opcionales.

**Endpoint:** `GET /api/pedidos`

**Permisos:** Todos los roles autenticados

**Query Parameters:**
- `estado` (opcional): `pendiente`, `en_preparacion`, `listo`, `entregado`, `cancelado`
- `tipo` (opcional): `mostrador`, `uber_eats`, `rappi`, `didi_food`
- `fecha` (opcional): Formato `YYYY-MM-DD` (ej: `2025-01-15`)

**Ejemplos:**
```
GET /api/pedidos
GET /api/pedidos?estado=pendiente
GET /api/pedidos?fecha=2025-01-15
GET /api/pedidos?estado=en_preparacion&tipo=uber_eats
```

**Respuesta exitosa (200):**
```json
{
  "pedidos": [
    {
      "id": "uuid",
      "numero_pedido": "181125-001",
      "tipo": "mostrador",
      "estado": "pendiente",
      "total": "125.50",
      "observaciones": "Sin cebolla",
      "cliente_nombre": "Juan Pérez",
      "cliente_telefono": "5551234567",
      "direccion": null,
      "numero_externo": null,
      "created_at": "2025-11-18T10:30:00Z",
      "updated_at": "2025-11-18T10:30:00Z",
      "usuario": {
        "nombre": "Carlos Barista",
        "email": "carlos@cafeluna.com"
      },
      "items": [
        {
          "id": "uuid",
          "cantidad": 2,
          "precio_unitario": "45.00",
          "subtotal": "90.00",
          "producto": {
            "nombre": "Latte Grande",
            "categoria": "bebidas_calientes"
          }
        }
      ]
    }
  ]
}
```

---

### Obtener Pedido
Obtener detalle de un pedido específico.

**Endpoint:** `GET /api/pedidos/:id`

**Permisos:** Todos los roles autenticados

**Respuesta exitosa (200):**
```json
{
  "pedido": {
    "id": "uuid",
    "numero_pedido": "181125-001",
    "tipo": "mostrador",
    "estado": "pendiente",
    "total": "125.50",
    "observaciones": "Sin cebolla",
    "created_at": "2025-11-18T10:30:00Z",
    "usuario": {
      "nombre": "Carlos Barista",
      "email": "carlos@cafeluna.com"
    },
    "items": [...],
    "historial": [
      {
        "estado_anterior": null,
        "estado_nuevo": "pendiente",
        "created_at": "2025-11-18T10:30:00Z",
        "usuario": {
          "nombre": "Carlos Barista"
        }
      }
    ]
  }
}
```

**Errores:**
- `404` - Pedido no encontrado
- `500` - Error del servidor

---

### Crear Pedido
Crear un nuevo pedido.

**Endpoint:** `POST /api/pedidos`

**Permisos:** `admin`, `barista`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**
```json
{
  "tipo": "mostrador",
  "items": [
    {
      "producto_id": "uuid",
      "cantidad": 2
    },
    {
      "producto_id": "uuid",
      "cantidad": 1
    }
  ],
  "observaciones": "Sin azúcar",
  "cliente_nombre": "María García",
  "cliente_telefono": "5559876543",
  "direccion": null,
  "numero_externo": null
}
```

**Campos requeridos:**
- `tipo`: Tipo de pedido
- `items`: Array de items (mínimo 1)
  - `producto_id`: UUID del producto
  - `cantidad`: Cantidad (mínimo 1)

**Campos opcionales:**
- `observaciones`
- `cliente_nombre`
- `cliente_telefono`
- `direccion` (requerido para delivery)
- `numero_externo` (número de referencia de apps)

**Respuesta exitosa (201):**
```json
{
  "message": "Pedido creado exitosamente",
  "pedido": {
    "id": "uuid",
    "numero_pedido": "181125-002",
    "tipo": "mostrador",
    "estado": "pendiente",
    "total": "150.00",
    "items": [...]
  }
}
```

**Errores:**
- `400` - Productos no disponibles o datos inválidos
- `403` - Sin permisos
- `500` - Error del servidor

---

### Actualizar Estado de Pedido
Cambiar el estado de un pedido.

**Endpoint:** `PATCH /api/pedidos/:id/estado`

**Permisos:** `admin`, `barista`, `cocina`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**
```json
{
  "estado": "en_preparacion"
}
```

**Estados válidos:**
- `pendiente` → `en_preparacion`, `cancelado`
- `en_preparacion` → `listo`, `cancelado`
- `listo` → `entregado`, `cancelado`
- `entregado` → (estado final)
- `cancelado` → (estado final)

**Respuesta exitosa (200):**
```json
{
  "message": "Estado actualizado exitosamente",
  "pedido": {
    "id": "uuid",
    "numero_pedido": "181125-002",
    "estado": "en_preparacion",
    "updated_at": "2025-11-18T10:35:00Z"
  }
}
```

**Errores:**
- `400` - Transición de estado inválida
- `403` - Sin permisos
- `404` - Pedido no encontrado
- `500` - Error del servidor

---

## 🍰 Productos

### Listar Productos
Obtener lista de productos con filtros opcionales.

**Endpoint:** `GET /api/productos`

**Permisos:** Todos los roles autenticados

**Query Parameters:**
- `categoria` (opcional): `bebidas_calientes`, `bebidas_frias`, `postres`, `comida`, `snacks`
- `disponible` (opcional): `true` o `false`
- `busqueda` (opcional): Búsqueda por nombre (case-insensitive)

**Ejemplos:**
```
GET /api/productos
GET /api/productos?disponible=true
GET /api/productos?categoria=bebidas_calientes
GET /api/productos?busqueda=latte
```

**Respuesta exitosa (200):**
```json
{
  "productos": [
    {
      "id": "uuid",
      "nombre": "Latte Grande",
      "descripcion": "Café con leche vaporizada",
      "precio": "45.00",
      "categoria": "bebidas_calientes",
      "imagen_url": null,
      "disponible": true,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### Obtener Producto
Obtener detalle de un producto específico.

**Endpoint:** `GET /api/productos/:id`

**Permisos:** Todos los roles autenticados

**Respuesta exitosa (200):**
```json
{
  "producto": {
    "id": "uuid",
    "nombre": "Latte Grande",
    "descripcion": "Café con leche vaporizada",
    "precio": "45.00",
    "categoria": "bebidas_calientes",
    "imagen_url": null,
    "disponible": true
  }
}
```

**Errores:**
- `404` - Producto no encontrado

---

### Crear Producto
Crear un nuevo producto.

**Endpoint:** `POST /api/productos`

**Permisos:** `admin` únicamente

**Body:**
```json
{
  "nombre": "Capuchino Doble",
  "descripcion": "Espresso doble con espuma de leche",
  "precio": 55.00,
  "categoria": "bebidas_calientes",
  "imagen_url": null,
  "disponible": true
}
```

**Campos requeridos:**
- `nombre`
- `precio`
- `categoria`

**Respuesta exitosa (201):**
```json
{
  "message": "Producto creado exitosamente",
  "producto": {
    "id": "uuid",
    "nombre": "Capuchino Doble",
    "precio": "55.00",
    ...
  }
}
```

**Errores:**
- `403` - Sin permisos (solo admin)
- `500` - Error del servidor

---

### Actualizar Producto
Actualizar un producto existente.

**Endpoint:** `PUT /api/productos/:id`

**Permisos:** `admin` únicamente

**Body (todos los campos opcionales):**
```json
{
  "nombre": "Capuchino Doble Grande",
  "precio": 60.00,
  "disponible": false
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Producto actualizado exitosamente",
  "producto": {...}
}
```

**Errores:**
- `403` - Sin permisos
- `404` - Producto no encontrado
- `500` - Error del servidor

---

### Eliminar Producto
Eliminar un producto.

**Endpoint:** `DELETE /api/productos/:id`

**Permisos:** `admin` únicamente

**Respuesta exitosa (200):**
```json
{
  "message": "Producto eliminado exitosamente"
}
```

**Errores:**
- `403` - Sin permisos
- `500` - Error del servidor

---

## 📊 Reportes

### Reporte de Ventas Diarias
Obtener reporte detallado de ventas de un día específico.

**Endpoint:** `GET /api/reportes/ventas-diarias`

**Permisos:** Todos los roles autenticados

**Query Parameters:**
- `fecha` (requerido): Formato `YYYY-MM-DD`

**Ejemplo:**
```
GET /api/reportes/ventas-diarias?fecha=2025-01-15
```

**Respuesta exitosa (200):**
```json
{
  "fecha": "2025-01-15",
  "metricas": {
    "total_ventas": 2450.50,
    "cantidad_pedidos": 28,
    "ticket_promedio": 87.52
  },
  "por_origen": {
    "mostrador": {
      "cantidad": 15,
      "total": 1200.00
    },
    "uber_eats": {
      "cantidad": 8,
      "total": 850.50
    },
    "rappi": {
      "cantidad": 5,
      "total": 400.00
    }
  },
  "por_categoria": {
    "bebidas_calientes": {
      "cantidad": 45,
      "total": 1350.00
    },
    "postres": {
      "cantidad": 20,
      "total": 800.00
    }
  },
  "top_productos": [
    {
      "nombre": "Latte Grande",
      "cantidad": 18,
      "total": 810.00
    },
    {
      "nombre": "Capuchino",
      "cantidad": 15,
      "total": 675.00
    }
  ],
  "pedidos": [...]
}
```

**Nota:** Solo se consideran pedidos con estado `listo` o `entregado`.

**Errores:**
- `400` - Fecha no proporcionada
- `500` - Error del servidor

---

### Reporte de Ventas por Período
Obtener resumen de ventas entre dos fechas.

**Endpoint:** `GET /api/reportes/ventas-periodo`

**Permisos:** Todos los roles autenticados

**Query Parameters:**
- `fecha_inicio` (requerido): Formato `YYYY-MM-DD`
- `fecha_fin` (requerido): Formato `YYYY-MM-DD`

**Ejemplo:**
```
GET /api/reportes/ventas-periodo?fecha_inicio=2025-01-01&fecha_fin=2025-01-31
```

**Respuesta exitosa (200):**
```json
{
  "fecha_inicio": "2025-01-01",
  "fecha_fin": "2025-01-31",
  "total_ventas": 45670.50,
  "cantidad_pedidos": 523,
  "ticket_promedio": 87.34
}
```

**Errores:**
- `400` - Fechas no proporcionadas
- `500` - Error del servidor

---

## 👥 Usuarios

### Listar Usuarios
Obtener lista de todos los usuarios.

**Endpoint:** `GET /api/usuarios`

**Permisos:** `admin` únicamente

**Respuesta exitosa (200):**
```json
{
  "usuarios": [
    {
      "id": "uuid",
      "email": "admin@cafeluna.com",
      "nombre": "Admin",
      "rol": "admin",
      "activo": true,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### Obtener Usuario
Obtener detalle de un usuario específico.

**Endpoint:** `GET /api/usuarios/:id`

**Permisos:** `admin` únicamente

---

### Crear Usuario
Crear un nuevo usuario.

**Endpoint:** `POST /api/usuarios`

**Permisos:** `admin` únicamente

**Body:**
```json
{
  "email": "nuevo@cafeluna.com",
  "password": "password123",
  "nombre": "Nuevo Usuario",
  "rol": "barista"
}
```

---

### Actualizar Usuario
Actualizar un usuario existente.

**Endpoint:** `PUT /api/usuarios/:id`

**Permisos:** `admin` únicamente

---

## 📦 Inventario

### Listar Inventario
Obtener lista de items de inventario.

**Endpoint:** `GET /api/inventario`

**Permisos:** Todos los roles autenticados

**Query Parameters:**
- `alerta` (opcional): `true` - solo items con stock bajo

---

### Obtener Item de Inventario
Obtener detalle de un item específico.

**Endpoint:** `GET /api/inventario/:id`

**Permisos:** Todos los roles autenticados

---

### Actualizar Inventario
Actualizar cantidad de un item.

**Endpoint:** `PUT /api/inventario/:id`

**Permisos:** `admin`, `barista`

**Body:**
```json
{
  "cantidad": 50,
  "tipo_movimiento": "entrada",
  "observaciones": "Compra semanal"
}
```

---

## 🔒 Control de Acceso (RBAC)

### Roles y Permisos

| Recurso | Admin | Barista | Cocina | Mesero |
|---------|-------|---------|--------|--------|
| Ver pedidos | ✅ | ✅ | ✅ | ✅ |
| Crear pedidos | ✅ | ✅ | ❌ | ✅ |
| Actualizar estado pedidos | ✅ | ✅ | ✅ | ❌ |
| Ver productos | ✅ | ✅ | ✅ | ✅ |
| CRUD productos | ✅ | ❌ | ❌ | ❌ |
| Ver inventario | ✅ | ✅ | ✅ | ❌ |
| Actualizar inventario | ✅ | ✅ | ❌ | ❌ |
| Ver reportes | ✅ | ✅ | ✅ | ✅ |
| Gestionar usuarios | ✅ | ❌ | ❌ | ❌ |

---

## ⚠️ Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## 🔔 Realtime (Supabase)

El sistema incluye actualizaciones en tiempo real mediante Supabase Realtime para la tabla `pedidos`.

**Suscripción (Frontend):**
```javascript
const channel = supabase
  .channel('pedidos_changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'pedidos' },
    (payload) => {
      console.log('Cambio detectado:', payload);
      // Recargar datos
    }
  )
  .subscribe();
```

**Eventos:**
- `INSERT` - Nuevo pedido creado
- `UPDATE` - Pedido actualizado (cambio de estado)
- `DELETE` - Pedido eliminado (raro)

---

## 📝 Notas Importantes

1. **Tokens JWT:** Expiran en 8 horas. Después de eso, el usuario debe hacer login nuevamente.

2. **Número de Pedido:** Se genera automáticamente en formato `DDMMYY-XXX` donde XXX es secuencial por día.

3. **Transiciones de Estado:** Las transiciones de estado de pedidos están validadas. Ver endpoint de actualización de estado para reglas específicas.

4. **Validaciones:** Todos los endpoints incluyen validación de datos usando express-validator.

5. **Seguridad:** 
   - Contraseñas hasheadas con bcrypt
   - Headers de seguridad con Helmet
   - CORS configurado
   - Cookies httpOnly

6. **Rate Limiting:** No implementado en esta versión. Considerar agregar en producción.

---

## 🧪 Testing

Puedes probar la API usando:
- **cURL**
- **Postman**
- **Thunder Client** (VS Code extension)
- **Insomnia**

**Ejemplo con cURL:**
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cafeluna.com","password":"password123"}'

# Listar pedidos (reemplazar TOKEN)
curl -X GET http://localhost:3000/api/pedidos \
  -H "Authorization: Bearer TOKEN"
```

---

**Versión:** 1.0  
**Última actualización:** Noviembre 2025
