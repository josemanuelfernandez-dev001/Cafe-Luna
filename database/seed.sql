-- Datos de prueba para Café Luna
-- Ejecutar después de schema.sql

-- Limpiar datos existentes (opcional)
-- TRUNCATE TABLE movimientos_inventario, historial_pedidos, pedido_items, pedidos, inventario, productos, usuarios CASCADE;

-- Insertar usuarios de prueba
-- Contraseña para todos: password123 (hash bcrypt cost=10)
INSERT INTO usuarios (id, nombre, email, password_hash, rol, activo) VALUES
('11111111-1111-1111-1111-111111111111', 'Admin Principal', 'admin@cafeluna.com', '$2a$10$OsmG5eYMwF5L0ia02GUx6u5QrsdN2IQrM5SLitVXxg5jPVgcI0qmu', 'admin', true),
('22222222-2222-2222-2222-222222222222', 'Carlos Barista', 'carlos@cafeluna.com', '$2a$10$OsmG5eYMwF5L0ia02GUx6u5QrsdN2IQrM5SLitVXxg5jPVgcI0qmu', 'barista', true),
('33333333-3333-3333-3333-333333333333', 'Ana Barista', 'ana@cafeluna.com', '$2a$10$OsmG5eYMwF5L0ia02GUx6u5QrsdN2IQrM5SLitVXxg5jPVgcI0qmu', 'barista', true),
('44444444-4444-4444-4444-444444444444', 'Roberto Cocina', 'roberto@cafeluna.com', '$2a$10$OsmG5eYMwF5L0ia02GUx6u5QrsdN2IQrM5SLitVXxg5jPVgcI0qmu', 'cocina', true),
('55555555-5555-5555-5555-555555555555', 'Laura Mesero', 'laura@cafeluna.com', '$2a$10$OsmG5eYMwF5L0ia02GUx6u5QrsdN2IQrM5SLitVXxg5jPVgcI0qmu', 'mesero', true);

-- Insertar productos de prueba
INSERT INTO productos (id, nombre, descripcion, precio, categoria, disponible) VALUES
-- Bebidas Calientes
('a1111111-1111-1111-1111-111111111111', 'Café Americano', 'Café negro tradicional', 25.00, 'bebida_caliente', true),
('a2222222-2222-2222-2222-222222222222', 'Café Latte', 'Café con leche vaporizada', 35.00, 'bebida_caliente', true),
('a3333333-3333-3333-3333-333333333333', 'Cappuccino', 'Café con espuma de leche', 40.00, 'bebida_caliente', true),
('a4444444-4444-4444-4444-444444444444', 'Mocha', 'Café con chocolate', 45.00, 'bebida_caliente', true),
('a5555555-5555-5555-5555-555555555555', 'Té Chai', 'Té especiado con leche', 30.00, 'bebida_caliente', true),

-- Bebidas Frías
('b1111111-1111-1111-1111-111111111111', 'Frappé de Vainilla', 'Bebida helada de vainilla', 50.00, 'bebida_fria', true),
('b2222222-2222-2222-2222-222222222222', 'Frappé de Caramelo', 'Bebida helada de caramelo', 55.00, 'bebida_fria', true),
('b3333333-3333-3333-3333-333333333333', 'Cold Brew', 'Café preparado en frío', 45.00, 'bebida_fria', true),
('b4444444-4444-4444-4444-444444444444', 'Limonada Natural', 'Limonada fresca', 25.00, 'bebida_fria', true),
('b5555555-5555-5555-5555-555555555555', 'Smoothie de Fresa', 'Batido de fresas', 50.00, 'bebida_fria', true),

-- Alimentos
('c1111111-1111-1111-1111-111111111111', 'Sándwich de Pollo', 'Pan integral con pollo y vegetales', 60.00, 'alimento', true),
('c2222222-2222-2222-2222-222222222222', 'Sándwich Vegetariano', 'Pan con vegetales asados', 55.00, 'alimento', true),
('c3333333-3333-3333-3333-333333333333', 'Wrap de Atún', 'Tortilla con atún y ensalada', 65.00, 'alimento', true),
('c4444444-4444-4444-4444-444444444444', 'Ensalada César', 'Ensalada con aderezo césar', 70.00, 'alimento', true),

-- Postres
('d1111111-1111-1111-1111-111111111111', 'Pastel de Chocolate', 'Rebanada de pastel', 45.00, 'postre', true),
('d2222222-2222-2222-2222-222222222222', 'Cheesecake', 'Pay de queso', 50.00, 'postre', true),
('d3333333-3333-3333-3333-333333333333', 'Brownie', 'Brownie de chocolate', 35.00, 'postre', true),

-- Snacks
('e1111111-1111-1111-1111-111111111111', 'Croissant Simple', 'Croissant de mantequilla', 30.00, 'snack', true),
('e2222222-2222-2222-2222-222222222222', 'Muffin de Arándanos', 'Muffin casero', 35.00, 'snack', true),
('e3333333-3333-3333-3333-333333333333', 'Galletas de Avena', 'Pack de 3 galletas', 25.00, 'snack', true);

-- Insertar pedidos de prueba
INSERT INTO pedidos (id, numero_pedido, tipo, estado, total, observaciones, cliente_nombre, usuario_id, created_at) VALUES
('p1111111-1111-1111-1111-111111111111', '131124-001', 'mostrador', 'entregado', 60.00, '', 'Cliente Mostrador', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '2 hours'),
('p2222222-2222-2222-2222-222222222222', '131124-002', 'uber_eats', 'entregado', 120.00, 'Sin cebolla', 'María García', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '1.5 hours'),
('p3333333-3333-3333-3333-333333333333', '131124-003', 'mostrador', 'listo', 75.00, '', 'Juan Pérez', '33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '30 minutes'),
('p4444444-4444-4444-4444-444444444444', '131124-004', 'rappi', 'en_preparacion', 150.00, 'Extra caliente', 'Ana López', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '20 minutes'),
('p5555555-5555-5555-5555-555555555555', '131124-005', 'mostrador', 'pendiente', 45.00, '', 'Carlos Ruiz', '33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '5 minutes'),
('p6666666-6666-6666-6666-666666666666', '131124-006', 'didi_food', 'pendiente', 95.00, '', 'Laura Martínez', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '3 minutes'),
('p7777777-7777-7777-7777-777777777777', '131124-007', 'mostrador', 'en_preparacion', 80.00, 'Sin azúcar', 'Pedro Sánchez', '33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '15 minutes'),
('p8888888-8888-8888-8888-888888888888', '131124-008', 'uber_eats', 'listo', 130.00, '', 'Sofia Torres', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '10 minutes');

-- Insertar items de pedidos
INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
-- Pedido 1
('p1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 1, 35.00, 35.00),
('p1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 1, 30.00, 30.00),
-- Pedido 2
('p2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 2, 60.00, 120.00),
-- Pedido 3
('p3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 1, 40.00, 40.00),
('p3333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111', 1, 45.00, 45.00),
-- Pedido 4
('p4444444-4444-4444-4444-444444444444', 'b2222222-2222-2222-2222-222222222222', 2, 55.00, 110.00),
('p4444444-4444-4444-4444-444444444444', 'a1111111-1111-1111-1111-111111111111', 1, 25.00, 25.00),
-- Pedido 5
('p5555555-5555-5555-5555-555555555555', 'a4444444-4444-4444-4444-444444444444', 1, 45.00, 45.00),
-- Pedido 6
('p6666666-6666-6666-6666-666666666666', 'c4444444-4444-4444-4444-444444444444', 1, 70.00, 70.00),
('p6666666-6666-6666-6666-666666666666', 'b4444444-4444-4444-4444-444444444444', 1, 25.00, 25.00),
-- Pedido 7
('p7777777-7777-7777-7777-777777777777', 'b1111111-1111-1111-1111-111111111111', 1, 50.00, 50.00),
('p7777777-7777-7777-7777-777777777777', 'e2222222-2222-2222-2222-222222222222', 1, 35.00, 35.00),
-- Pedido 8
('p8888888-8888-8888-8888-888888888888', 'c3333333-3333-3333-3333-333333333333', 2, 65.00, 130.00);

-- Insertar historial de pedidos
INSERT INTO historial_pedidos (pedido_id, estado_anterior, estado_nuevo, usuario_id) VALUES
('p1111111-1111-1111-1111-111111111111', NULL, 'pendiente', '22222222-2222-2222-2222-222222222222'),
('p1111111-1111-1111-1111-111111111111', 'pendiente', 'en_preparacion', '22222222-2222-2222-2222-222222222222'),
('p1111111-1111-1111-1111-111111111111', 'en_preparacion', 'listo', '44444444-4444-4444-4444-444444444444'),
('p1111111-1111-1111-1111-111111111111', 'listo', 'entregado', '22222222-2222-2222-2222-222222222222'),
('p2222222-2222-2222-2222-222222222222', NULL, 'pendiente', '22222222-2222-2222-2222-222222222222'),
('p2222222-2222-2222-2222-222222222222', 'pendiente', 'en_preparacion', '44444444-4444-4444-4444-444444444444'),
('p2222222-2222-2222-2222-222222222222', 'en_preparacion', 'listo', '44444444-4444-4444-4444-444444444444'),
('p2222222-2222-2222-2222-222222222222', 'listo', 'entregado', '22222222-2222-2222-2222-222222222222'),
('p3333333-3333-3333-3333-333333333333', NULL, 'pendiente', '33333333-3333-3333-3333-333333333333'),
('p3333333-3333-3333-3333-333333333333', 'pendiente', 'en_preparacion', '44444444-4444-4444-4444-444444444444'),
('p3333333-3333-3333-3333-333333333333', 'en_preparacion', 'listo', '44444444-4444-4444-4444-444444444444');

-- Insertar items de inventario
INSERT INTO inventario (id, nombre, descripcion, unidad_medida, cantidad_actual, stock_minimo) VALUES
('i1111111-1111-1111-1111-111111111111', 'Café en Grano', 'Café arábica premium', 'kg', 50.0, 10.0),
('i2222222-2222-2222-2222-222222222222', 'Leche Entera', 'Leche fresca', 'litros', 30.0, 15.0),
('i3333333-3333-3333-3333-333333333333', 'Azúcar', 'Azúcar refinada', 'kg', 25.0, 5.0),
('i4444444-4444-4444-4444-444444444444', 'Chocolate en Polvo', 'Cacao para bebidas', 'kg', 15.0, 3.0),
('i5555555-5555-5555-5555-555555555555', 'Pan de Sándwich', 'Pan integral', 'paquetes', 20.0, 5.0),
('i6666666-6666-6666-6666-666666666666', 'Pollo Cocido', 'Pechuga de pollo', 'kg', 10.0, 3.0),
('i7777777-7777-7777-7777-777777777777', 'Vasos Desechables', 'Vasos para bebidas', 'paquetes', 100.0, 20.0),
('i8888888-8888-8888-8888-888888888888', 'Tapas para Vasos', 'Tapas plásticas', 'paquetes', 80.0, 20.0);

-- Insertar algunos movimientos de inventario
INSERT INTO movimientos_inventario (inventario_id, tipo_movimiento, cantidad_anterior, cantidad_nueva, observaciones, usuario_id) VALUES
('i1111111-1111-1111-1111-111111111111', 'entrada', 40.0, 50.0, 'Compra mensual', '11111111-1111-1111-1111-111111111111'),
('i2222222-2222-2222-2222-222222222222', 'entrada', 20.0, 30.0, 'Reposición semanal', '11111111-1111-1111-1111-111111111111'),
('i1111111-1111-1111-1111-111111111111', 'salida', 50.0, 45.0, 'Consumo diario', '22222222-2222-2222-2222-222222222222');

-- Las contraseñas ya están correctamente hasheadas en la inserción inicial

-- Mensajes de confirmación
SELECT 'Datos de prueba insertados exitosamente' AS status;
SELECT COUNT(*) AS total_usuarios FROM usuarios;
SELECT COUNT(*) AS total_productos FROM productos;
SELECT COUNT(*) AS total_pedidos FROM pedidos;
SELECT COUNT(*) AS total_inventario FROM inventario;
