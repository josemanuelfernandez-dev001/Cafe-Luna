-- Schema para Café Luna - Sistema de Gestión Interna
-- PostgreSQL / Supabase

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'barista', 'cocina', 'mesero')),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
    categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('bebida_caliente', 'bebida_fria', 'alimento', 'postre', 'snack')),
    imagen_url TEXT,
    disponible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_pedido VARCHAR(20) UNIQUE NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('mostrador', 'uber_eats', 'rappi', 'didi_food')),
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado')),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    observaciones TEXT,
    cliente_nombre VARCHAR(100),
    cliente_telefono VARCHAR(20),
    direccion TEXT,
    numero_externo VARCHAR(50),
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de items de pedido
CREATE TABLE IF NOT EXISTS pedido_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id UUID NOT NULL REFERENCES productos(id),
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10, 2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de historial de pedidos
CREATE TABLE IF NOT EXISTS historial_pedidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20) NOT NULL,
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de inventario
CREATE TABLE IF NOT EXISTS inventario (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    unidad_medida VARCHAR(20) NOT NULL,
    cantidad_actual DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (cantidad_actual >= 0),
    stock_minimo DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (stock_minimo >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de movimientos de inventario
CREATE TABLE IF NOT EXISTS movimientos_inventario (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventario_id UUID NOT NULL REFERENCES inventario(id) ON DELETE CASCADE,
    tipo_movimiento VARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('entrada', 'salida', 'ajuste')),
    cantidad_anterior DECIMAL(10, 2) NOT NULL,
    cantidad_nueva DECIMAL(10, 2) NOT NULL,
    observaciones TEXT,
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_tipo ON pedidos(tipo);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos(created_at);
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pedido_items_pedido ON pedido_items(pedido_id);
CREATE INDEX IF NOT EXISTS idx_pedido_items_producto ON pedido_items(producto_id);
CREATE INDEX IF NOT EXISTS idx_historial_pedido ON historial_pedidos(pedido_id);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_disponible ON productos(disponible);
CREATE INDEX IF NOT EXISTS idx_movimientos_inventario ON movimientos_inventario(inventario_id);
CREATE INDEX IF NOT EXISTS idx_inventario_stock ON inventario(cantidad_actual, stock_minimo);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON pedidos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventario_updated_at BEFORE UPDATE ON inventario
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_inventario ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (ajustar según necesidades)
-- Permitir lectura a usuarios autenticados
CREATE POLICY "Permitir lectura a usuarios autenticados" ON usuarios
    FOR SELECT USING (true);

CREATE POLICY "Permitir lectura a usuarios autenticados" ON productos
    FOR SELECT USING (true);

CREATE POLICY "Permitir lectura a usuarios autenticados" ON pedidos
    FOR SELECT USING (true);

CREATE POLICY "Permitir lectura a usuarios autenticados" ON pedido_items
    FOR SELECT USING (true);

CREATE POLICY "Permitir lectura a usuarios autenticados" ON inventario
    FOR SELECT USING (true);

-- Políticas de escritura (más restrictivas)
CREATE POLICY "Permitir inserción de pedidos" ON pedidos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir actualización de pedidos" ON pedidos
    FOR UPDATE USING (true);

CREATE POLICY "Permitir inserción de pedido_items" ON pedido_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir inserción de historial" ON historial_pedidos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir inserción de movimientos" ON movimientos_inventario
    FOR INSERT WITH CHECK (true);

-- Comentarios para documentación
COMMENT ON TABLE usuarios IS 'Usuarios del sistema (admin, barista, cocina, mesero)';
COMMENT ON TABLE productos IS 'Catálogo de productos de la cafetería';
COMMENT ON TABLE pedidos IS 'Pedidos de clientes (mostrador y apps externas)';
COMMENT ON TABLE pedido_items IS 'Detalle de items por pedido';
COMMENT ON TABLE historial_pedidos IS 'Historial de cambios de estado de pedidos';
COMMENT ON TABLE inventario IS 'Control de inventario de insumos';
COMMENT ON TABLE movimientos_inventario IS 'Registro de entradas/salidas de inventario';
