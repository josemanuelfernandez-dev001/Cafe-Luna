-- ================================================
-- ÍNDICES PARA OPTIMIZACIÓN DE CONSULTAS
-- Café Luna - Sistema de Gestión Interna
-- ================================================

-- TABLA: usuarios
-- Índice para búsqueda por email (usado en login)
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- Índice para filtrado por rol
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);

-- Índice para usuarios activos (consultas frecuentes)
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo) WHERE activo = true;

-- ================================================
-- TABLA: productos
-- ================================================

-- Índice para búsqueda por categoría (usado en filtros)
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);

-- Índice para productos disponibles (consultas muy frecuentes)
CREATE INDEX IF NOT EXISTS idx_productos_disponible ON productos(disponible) WHERE disponible = true;

-- Índice para búsqueda por nombre (usado en búsquedas)
CREATE INDEX IF NOT EXISTS idx_productos_nombre ON productos USING gin(to_tsvector('spanish', nombre));

-- Índice compuesto para filtrado por categoría y disponibilidad
CREATE INDEX IF NOT EXISTS idx_productos_categoria_disponible ON productos(categoria, disponible);

-- ================================================
-- TABLA: pedidos
-- ================================================

-- Índice para búsqueda por estado (usado en cola de pedidos)
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);

-- Índice para búsqueda por tipo (mostrador, uber_eats, etc.)
CREATE INDEX IF NOT EXISTS idx_pedidos_tipo ON pedidos(tipo);

-- Índice para búsqueda por fecha (reportes diarios)
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos(created_at DESC);

-- Índice para búsqueda por usuario
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario_id ON pedidos(usuario_id);

-- Índice compuesto para filtrado por estado y fecha (consulta más común)
CREATE INDEX IF NOT EXISTS idx_pedidos_estado_fecha ON pedidos(estado, created_at DESC);

-- Índice para número de pedido (búsqueda única)
CREATE INDEX IF NOT EXISTS idx_pedidos_numero ON pedidos(numero_pedido);

-- ================================================
-- TABLA: pedido_items
-- ================================================

-- Índice para relación con pedidos (JOIN frecuente)
CREATE INDEX IF NOT EXISTS idx_pedido_items_pedido_id ON pedido_items(pedido_id);

-- Índice para relación con productos (JOIN frecuente)
CREATE INDEX IF NOT EXISTS idx_pedido_items_producto_id ON pedido_items(producto_id);

-- ================================================
-- TABLA: inventario
-- ================================================

-- Índice para búsqueda por nombre
CREATE INDEX IF NOT EXISTS idx_inventario_nombre ON inventario(nombre);

-- Índice para items con stock bajo (alertas)
-- Solo indexa items donde cantidad < minimo
CREATE INDEX IF NOT EXISTS idx_inventario_alerta 
ON inventario(cantidad, minimo) 
WHERE cantidad < minimo;

-- ================================================
-- TABLA: movimientos_inventario
-- ================================================

-- Índice para búsqueda por item de inventario
CREATE INDEX IF NOT EXISTS idx_movimientos_inventario_id ON movimientos_inventario(inventario_id);

-- Índice para búsqueda por fecha
CREATE INDEX IF NOT EXISTS idx_movimientos_created_at ON movimientos_inventario(created_at DESC);

-- Índice para búsqueda por tipo de movimiento
CREATE INDEX IF NOT EXISTS idx_movimientos_tipo ON movimientos_inventario(tipo_movimiento);

-- ================================================
-- TABLA: historial_pedidos
-- ================================================

-- Índice para búsqueda por pedido (consulta frecuente)
CREATE INDEX IF NOT EXISTS idx_historial_pedido_id ON historial_pedidos(pedido_id);

-- Índice para búsqueda por fecha
CREATE INDEX IF NOT EXISTS idx_historial_created_at ON historial_pedidos(created_at DESC);

-- Índice para búsqueda por usuario que realizó el cambio
CREATE INDEX IF NOT EXISTS idx_historial_usuario_id ON historial_pedidos(usuario_id);

-- ================================================
-- ANÁLISIS DE TABLAS
-- ================================================

-- Ejecutar ANALYZE para actualizar las estadísticas de las tablas
-- Esto ayuda al planificador de consultas a tomar mejores decisiones
ANALYZE usuarios;
ANALYZE productos;
ANALYZE pedidos;
ANALYZE pedido_items;
ANALYZE inventario;
ANALYZE movimientos_inventario;
ANALYZE historial_pedidos;

-- ================================================
-- COMENTARIOS SOBRE LOS ÍNDICES
-- ================================================

-- Notas de rendimiento:
-- 1. Los índices en columnas booleanas (disponible, activo) son útiles con WHERE clause
-- 2. Los índices parciales (WHERE clause) ahorran espacio y son más rápidos
-- 3. Los índices compuestos deben ordenarse por: igualdad primero, luego rangos
-- 4. GIN indexes para búsqueda de texto completo en español
-- 5. Los índices DESC son útiles para ORDER BY con ordenamiento descendente

-- Monitoreo de índices:
-- Para ver el uso de índices:
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
-- FROM pg_stat_user_indexes
-- ORDER BY idx_scan DESC;

-- Para ver índices no utilizados:
-- SELECT schemaname, tablename, indexname
-- FROM pg_stat_user_indexes
-- WHERE idx_scan = 0
-- AND indexrelname NOT LIKE 'pg_toast%';
