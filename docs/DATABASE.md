# 🗄️ Documentación de Base de Datos - Café Luna

## Índice
1. [Visión General](#visión-general)
2. [Esquema de Tablas](#esquema-de-tablas)
3. [Relaciones](#relaciones)
4. [Índices](#índices)
5. [Triggers y Funciones](#triggers-y-funciones)
6. [Queries Comunes](#queries-comunes)
7. [Optimización](#optimización)

---

## Visión General

La base de datos de Café Luna está diseñada en PostgreSQL (a través de Supabase) y sigue principios de normalización para garantizar integridad de datos y eficiencia en consultas.

### Características
- **Motor**: PostgreSQL 15+
- **Hosting**: Supabase
- **Total de Tablas**: 7 tablas principales
- **Índices**: 20+ índices de optimización
- **Relaciones**: 8 foreign keys
- **Auditoría**: Timestamps automáticos (created_at, updated_at)

---

## Esquema de Tablas

### 1. usuarios

Almacena información de los usuarios del sistema con control de acceso.

```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL CHECK (rol IN ('admin', 'barista', 'cocina', 'mesero')),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos Clave**:
- `id`: UUID generado automáticamente
- `email`: Email único para login
- `password_hash`: Password hasheado con bcrypt
- `rol`: Rol del usuario (RBAC)
- `activo`: Estado del usuario

**Índices**:
- Primary key en `id`
- Unique index en `email`
- Index en `rol`
- Partial index en `activo` (solo TRUE)

---

### 2. productos

Catálogo de productos disponibles en la cafetería.

```sql
CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN (
    'bebidas_calientes', 'bebidas_frias', 'postres', 'comida', 'snacks'
  )),
  imagen_url TEXT,
  disponible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos Clave**:
- `precio`: Decimal con 2 decimales
- `categoria`: Categoría del producto (ENUM)
- `disponible`: Si está disponible para venta

**Índices**:
- Primary key en `id`
- Index en `categoria`
- Partial index en `disponible` (solo TRUE)
- GIN index en `nombre` para full-text search
- Composite index en `(categoria, disponible)`

---

### 3. pedidos

Registro de todos los pedidos realizados.

```sql
CREATE TABLE pedidos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_pedido VARCHAR(50) UNIQUE NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN (
    'mostrador', 'uber_eats', 'rappi', 'didi_food'
  )),
  estado VARCHAR(50) NOT NULL DEFAULT 'pendiente' CHECK (estado IN (
    'pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado'
  )),
  total DECIMAL(10, 2) NOT NULL,
  observaciones TEXT,
  cliente_nombre VARCHAR(255),
  cliente_telefono VARCHAR(20),
  direccion TEXT,
  numero_externo VARCHAR(100),
  usuario_id UUID REFERENCES usuarios(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos Clave**:
- `numero_pedido`: Formato DDMMYY-XXX (único)
- `tipo`: Origen del pedido
- `estado`: Estado actual del pedido
- `numero_externo`: ID de referencia de apps de delivery
- `usuario_id`: Usuario que creó el pedido

**Índices**:
- Primary key en `id`
- Unique index en `numero_pedido`
- Index en `estado`
- Index en `tipo`
- Index en `created_at` (DESC)
- Index en `usuario_id`
- Composite index en `(estado, created_at)`

---

### 4. pedido_items

Detalle de productos en cada pedido (relación many-to-many).

```sql
CREATE TABLE pedido_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos Clave**:
- `pedido_id`: Referencia al pedido
- `producto_id`: Referencia al producto
- `precio_unitario`: Precio al momento de la orden
- `subtotal`: Calculado (cantidad * precio_unitario)

**Índices**:
- Primary key en `id`
- Index en `pedido_id`
- Index en `producto_id`

**Cascade**: Al eliminar un pedido, se eliminan sus items

---

### 5. inventario

Control de stock de insumos.

```sql
CREATE TABLE inventario (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  cantidad DECIMAL(10, 2) NOT NULL DEFAULT 0,
  unidad VARCHAR(50) NOT NULL,
  minimo DECIMAL(10, 2) NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos Clave**:
- `cantidad`: Stock actual
- `unidad`: kg, litros, unidades, etc.
- `minimo`: Cantidad mínima recomendada

**Índices**:
- Primary key en `id`
- Index en `nombre`
- Partial index en `(cantidad, minimo)` WHERE cantidad < minimo (alertas)

---

### 6. movimientos_inventario

Historial de entradas y salidas de inventario.

```sql
CREATE TABLE movimientos_inventario (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventario_id UUID REFERENCES inventario(id),
  tipo_movimiento VARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('entrada', 'salida')),
  cantidad DECIMAL(10, 2) NOT NULL,
  cantidad_anterior DECIMAL(10, 2) NOT NULL,
  cantidad_nueva DECIMAL(10, 2) NOT NULL,
  observaciones TEXT,
  usuario_id UUID REFERENCES usuarios(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos Clave**:
- `tipo_movimiento`: entrada o salida
- `cantidad_anterior`: Stock antes del movimiento
- `cantidad_nueva`: Stock después del movimiento
- `usuario_id`: Quién realizó el movimiento

**Índices**:
- Primary key en `id`
- Index en `inventario_id`
- Index en `created_at` (DESC)
- Index en `tipo_movimiento`

---

### 7. historial_pedidos

Auditoría de cambios de estado de pedidos.

```sql
CREATE TABLE historial_pedidos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  estado_anterior VARCHAR(50),
  estado_nuevo VARCHAR(50) NOT NULL,
  usuario_id UUID REFERENCES usuarios(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos Clave**:
- `estado_anterior`: Estado antes del cambio (NULL para primer estado)
- `estado_nuevo`: Estado después del cambio
- `usuario_id`: Quién realizó el cambio

**Índices**:
- Primary key en `id`
- Index en `pedido_id`
- Index en `created_at` (DESC)
- Index en `usuario_id`

---

## Relaciones

### Diagrama ER (Texto)

```
usuarios (1) ─────── (N) pedidos
                      │
                      ├─── (N) pedido_items ─── (1) productos
                      │
                      └─── (N) historial_pedidos

inventario (1) ─────── (N) movimientos_inventario ─── (1) usuarios
```

### Foreign Keys

1. `pedidos.usuario_id` → `usuarios.id`
2. `pedido_items.pedido_id` → `pedidos.id` (CASCADE)
3. `pedido_items.producto_id` → `productos.id`
4. `historial_pedidos.pedido_id` → `pedidos.id` (CASCADE)
5. `historial_pedidos.usuario_id` → `usuarios.id`
6. `movimientos_inventario.inventario_id` → `inventario.id`
7. `movimientos_inventario.usuario_id` → `usuarios.id`

---

## Índices

### Estrategia de Indexación

Los índices se diseñaron basándose en:
1. Queries más frecuentes del sistema
2. Columnas usadas en WHERE y JOIN
3. Columnas usadas en ORDER BY

### Lista Completa de Índices

Ver `database/indexes.sql` para la definición completa de todos los índices.

**Tipos de Índices Utilizados**:
- **B-Tree**: Índices estándar para búsquedas y rangos
- **GIN**: Full-text search en nombres de productos
- **Partial**: Índices condicionales (ej: solo productos disponibles)
- **Composite**: Índices multi-columna (ej: estado + fecha)

---

## Triggers y Funciones

### Actualización Automática de Timestamps

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a tablas relevantes
CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_productos_updated_at
  BEFORE UPDATE ON productos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ... (similar para otras tablas)
```

---

## Queries Comunes

### 1. Obtener Pedidos del Día con Items

```sql
SELECT 
  p.id,
  p.numero_pedido,
  p.tipo,
  p.estado,
  p.total,
  p.created_at,
  u.nombre AS usuario_nombre,
  json_agg(
    json_build_object(
      'producto_nombre', prod.nombre,
      'cantidad', pi.cantidad,
      'precio_unitario', pi.precio_unitario,
      'subtotal', pi.subtotal
    )
  ) AS items
FROM pedidos p
LEFT JOIN usuarios u ON p.usuario_id = u.id
LEFT JOIN pedido_items pi ON pi.pedido_id = p.id
LEFT JOIN productos prod ON pi.producto_id = prod.id
WHERE DATE(p.created_at) = CURRENT_DATE
GROUP BY p.id, u.nombre
ORDER BY p.created_at DESC;
```

### 2. Items de Inventario con Stock Bajo

```sql
SELECT 
  id,
  nombre,
  cantidad,
  unidad,
  minimo,
  (minimo - cantidad) AS faltante
FROM inventario
WHERE cantidad < minimo
ORDER BY (minimo - cantidad) DESC;
```

### 3. Top 10 Productos Más Vendidos

```sql
SELECT 
  prod.nombre,
  COUNT(pi.id) AS veces_ordenado,
  SUM(pi.cantidad) AS total_vendido,
  SUM(pi.subtotal) AS total_ventas
FROM pedido_items pi
JOIN productos prod ON pi.producto_id = prod.id
JOIN pedidos p ON pi.pedido_id = p.id
WHERE p.estado IN ('listo', 'entregado')
  AND DATE(p.created_at) >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY prod.id, prod.nombre
ORDER BY total_ventas DESC
LIMIT 10;
```

### 4. Reporte de Ventas Diarias

```sql
SELECT 
  DATE(created_at) AS fecha,
  COUNT(*) AS total_pedidos,
  SUM(total) AS total_ventas,
  AVG(total) AS ticket_promedio,
  COUNT(*) FILTER (WHERE tipo = 'mostrador') AS pedidos_mostrador,
  COUNT(*) FILTER (WHERE tipo = 'uber_eats') AS pedidos_uber,
  COUNT(*) FILTER (WHERE tipo = 'rappi') AS pedidos_rappi,
  COUNT(*) FILTER (WHERE tipo = 'didi_food') AS pedidos_didi
FROM pedidos
WHERE estado IN ('listo', 'entregado')
  AND DATE(created_at) = CURRENT_DATE
GROUP BY DATE(created_at);
```

### 5. Historial de Cambios de un Pedido

```sql
SELECT 
  hp.estado_anterior,
  hp.estado_nuevo,
  hp.created_at,
  u.nombre AS usuario_nombre
FROM historial_pedidos hp
LEFT JOIN usuarios u ON hp.usuario_id = u.id
WHERE hp.pedido_id = 'uuid-del-pedido'
ORDER BY hp.created_at ASC;
```

---

## Optimización

### Mejores Prácticas Implementadas

1. **Índices Estratégicos**
   - Índices en columnas de JOIN
   - Índices en columnas de WHERE
   - Índices compuestos para queries específicos

2. **Normalización**
   - Eliminación de redundancia
   - Foreign keys para integridad referencial
   - Separación lógica de datos

3. **Tipos de Datos Apropiados**
   - UUID para IDs (mejor para replicación)
   - DECIMAL para dinero (precisión exacta)
   - TIMESTAMP WITH TIME ZONE (manejo de zonas horarias)

4. **Constraints**
   - CHECK constraints para valores válidos
   - UNIQUE constraints para unicidad
   - NOT NULL donde sea aplicable

5. **Cascadas Inteligentes**
   - CASCADE en pedido_items (al eliminar pedido)
   - CASCADE en historial_pedidos (al eliminar pedido)
   - NO CASCADE en referencias a usuarios (preservar historial)

### Monitoreo de Performance

#### Ver Queries Lentas
```sql
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

#### Ver Uso de Índices
```sql
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

#### Ver Índices No Utilizados
```sql
SELECT 
  schemaname,
  tablename,
  indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexrelname NOT LIKE 'pg_toast%';
```

---

## Backup y Recuperación

### Backup Manual (Supabase)
1. Dashboard → Database → Backups
2. Click en "Create Backup"
3. Esperar confirmación

### Backup Automático
- Supabase realiza backups automáticos diarios
- Retención de 7 días en plan gratuito
- 30 días en plan Pro

### Restauración
1. Dashboard → Database → Backups
2. Seleccionar backup deseado
3. Click en "Restore"
4. Confirmar acción (¡DESTRUCTIVO!)

---

## Migraciones

### Esquema Inicial
```bash
# Ejecutar en SQL Editor de Supabase
psql < database/schema.sql
```

### Datos de Prueba
```bash
psql < database/seed.sql
```

### Índices de Optimización
```bash
psql < database/indexes.sql
```

### Orden de Ejecución
1. schema.sql (estructura)
2. seed.sql (datos iniciales)
3. indexes.sql (optimización)

---

## Consideraciones de Seguridad

### Row Level Security (RLS)

**Recomendación para Producción**:
```sql
-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
-- ... (todas las tablas)

-- Políticas de ejemplo
CREATE POLICY "Users can view their own data"
  ON usuarios
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON usuarios
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );
```

**Nota**: El sistema actual usa `service_role_key` que bypassa RLS. En producción, considerar implementar RLS completo.

---

## Escalabilidad

### Consideraciones Futuras

1. **Particionamiento de Tablas**
   - Particionar `pedidos` por fecha
   - Particionar `historial_pedidos` por fecha
   - Particionar `movimientos_inventario` por fecha

2. **Archivado de Datos Históricos**
   - Mover pedidos antiguos a tabla de archivo
   - Mantener solo últimos 12 meses en tablas activas

3. **Read Replicas**
   - Configurar réplicas de lectura
   - Separar queries de reportes

4. **Connection Pooling**
   - Usar PgBouncer o similar
   - Limitar conexiones activas

---

**Versión**: 1.0  
**Última actualización**: Noviembre 2025  
**Motor de BD**: PostgreSQL 15+ (Supabase)
