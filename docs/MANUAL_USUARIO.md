# 📘 Manual de Usuario - Café Luna

## Índice
1. [Introducción](#introducción)
2. [Inicio de Sesión](#inicio-de-sesión)
3. [Dashboard](#dashboard)
4. [Gestión de Pedidos](#gestión-de-pedidos)
5. [Gestión de Productos](#gestión-de-productos)
6. [Control de Inventario](#control-de-inventario)
7. [Reportes](#reportes)
8. [Gestión de Usuarios](#gestión-de-usuarios)
9. [Permisos por Rol](#permisos-por-rol)
10. [Preguntas Frecuentes](#preguntas-frecuentes)
11. [Solución de Problemas](#solución-de-problemas)

---

## Introducción

Bienvenido al sistema de gestión Café Luna. Este manual le guiará paso a paso en el uso de todas las funcionalidades del sistema.

### ¿Qué es Café Luna?

Café Luna es un sistema integral de gestión para cafeterías que permite:
- ✅ Gestionar pedidos de mostrador y apps de delivery
- ✅ Mantener control de inventario en tiempo real
- ✅ Generar reportes de ventas
- ✅ Administrar productos y personal
- ✅ Visualizar cola de pedidos en tiempo real

### Requisitos del Sistema

- **Navegador**: Chrome, Firefox, Safari o Edge (última versión)
- **Resolución**: Mínimo 1024x768 px
- **Conexión**: Internet estable

---

## Inicio de Sesión

### Paso 1: Acceder al Sistema

1. Abre tu navegador web
2. Ingresa a la URL: `http://localhost:3000` (o la URL de producción)
3. Verás la pantalla de inicio de sesión

### Paso 2: Ingresar Credenciales

1. Ingresa tu **correo electrónico** corporativo
2. Ingresa tu **contraseña**
3. Haz click en el botón **"Iniciar Sesión"**

### Credenciales de Prueba

| Rol | Email | Password |
|-----|-------|----------|
| Administrador | admin@cafeluna.com | password123 |
| Barista | carlos@cafeluna.com | password123 |
| Cocina | roberto@cafeluna.com | password123 |
| Mesero | laura@cafeluna.com | password123 |

### ¿Olvidaste tu Contraseña?

Contacta al administrador del sistema para restablecer tu contraseña.

---

## Dashboard

Al iniciar sesión exitosamente, serás redirigido al **Dashboard** (panel principal).

### Elementos del Dashboard

1. **Barra de Navegación Superior**
   - Logo de Café Luna
   - Nombre del usuario activo
   - Botón de cerrar sesión

2. **Menú Lateral**
   - Dashboard (Inicio)
   - Crear Pedido
   - Cola de Pedidos
   - Productos
   - Inventario
   - Reportes
   - Usuarios (Solo Administradores)

3. **Área Principal**
   - Estadísticas rápidas
   - Accesos directos a funciones principales

### Navegación

- **Click** en cualquier opción del menú para acceder a esa sección
- **Hover** sobre opciones para ver descripciones
- **Cerrar Sesión**: Click en el ícono de usuario → Cerrar Sesión

---

## Gestión de Pedidos

### Crear un Nuevo Pedido

#### Paso 1: Acceder al Formulario

1. Click en **"Crear Pedido"** en el menú lateral
2. Se abrirá el formulario de nuevo pedido

#### Paso 2: Seleccionar Tipo de Pedido

Selecciona el tipo de pedido:
- **Mostrador**: Cliente en el local
- **Uber Eats**: Pedido desde Uber Eats
- **Rappi**: Pedido desde Rappi
- **Didi Food**: Pedido desde Didi Food

#### Paso 3: Agregar Productos

1. En la sección **"Productos"**, verás el catálogo disponible
2. Puedes filtrar por categoría:
   - Bebidas Calientes
   - Bebidas Frías
   - Postres
   - Comida
   - Snacks
3. Click en el botón **"+"** para agregar un producto
4. Usa **"-"** para disminuir cantidad o eliminar

#### Paso 4: Información del Cliente (Opcional)

- **Nombre del Cliente**: Ingresa el nombre
- **Teléfono**: Número de contacto
- **Observaciones**: Notas especiales (ej: "Sin azúcar", "Sin cebolla")

#### Paso 5: Información de Delivery (Solo apps)

Para pedidos de apps de delivery:
- **Número Externo**: ID del pedido en la app (ej: #ABC123)
- **Dirección**: Dirección de entrega

#### Paso 6: Confirmar Pedido

1. Revisa el **resumen del pedido** en el panel derecho
2. Verifica el **total** a pagar
3. Click en **"Crear Pedido"**
4. Verás una notificación de éxito
5. El sistema genera automáticamente un **número de pedido**

### Ver Cola de Pedidos

#### Acceder a la Cola

1. Click en **"Cola de Pedidos"** en el menú
2. Verás todos los pedidos activos

#### Información de Cada Pedido

Cada tarjeta de pedido muestra:
- **Número de Pedido**: Formato DDMMYY-XXX
- **Tipo**: Ícono que indica el origen
- **Tiempo de Espera**: Color según urgencia
  - 🟢 Verde: < 15 minutos
  - 🟡 Amarillo: 15-30 minutos
  - 🔴 Rojo: > 30 minutos
- **Estado Actual**: Pendiente, En Preparación, Listo
- **Items**: Lista de productos

#### Cambiar Estado de Pedido

1. Busca el pedido en la cola
2. Click en el botón del estado deseado:
   - **Tomar Pedido**: Cambia a "En Preparación"
   - **Marcar Listo**: Cambia a "Listo"
   - **Entregar**: Cambia a "Entregado"
3. El cambio se refleja inmediatamente

#### Filtrar Pedidos

Usa los filtros en la parte superior:
- **Por Estado**: Todos, Pendiente, En Preparación, Listo
- **Por Tipo**: Todos, Mostrador, Apps de delivery
- **Por Fecha**: Selecciona una fecha específica

### Actualización Automática

La cola se actualiza automáticamente cada 30 segundos para mostrar nuevos pedidos y cambios de estado.

---

## Gestión de Productos

*Nota: Solo disponible para rol Administrador*

### Ver Catálogo de Productos

1. Click en **"Productos"** en el menú
2. Verás la lista completa de productos

#### Filtros Disponibles

- **Categoría**: Filtrar por tipo de producto
- **Disponibilidad**: Solo disponibles / Todos
- **Búsqueda**: Buscar por nombre

### Crear Nuevo Producto

#### Paso 1: Abrir Formulario

1. En la página de productos, click en **"Nuevo Producto"**
2. Se abrirá el formulario de creación

#### Paso 2: Completar Información

Campos requeridos:
- **Nombre**: Nombre del producto (ej: "Latte Grande")
- **Descripción**: Descripción breve
- **Precio**: Precio en pesos mexicanos (ej: 45.00)
- **Categoría**: Selecciona una categoría

Campos opcionales:
- **Imagen URL**: URL de la imagen del producto
- **Disponible**: Marcar si está disponible para venta

#### Paso 3: Guardar

1. Click en **"Guardar Producto"**
2. El producto aparecerá en el catálogo

### Editar Producto

1. En la lista de productos, click en el botón **"Editar"**
2. Modifica los campos necesarios
3. Click en **"Guardar Cambios"**

### Marcar Producto como No Disponible

1. Click en el toggle **"Disponible"** junto al producto
2. El producto se marcará como no disponible
3. No aparecerá en el formulario de crear pedido

### Eliminar Producto

1. Click en el botón **"Eliminar"** (ícono de papelera)
2. Confirma la acción en el diálogo
3. El producto será eliminado permanentemente

---

## Control de Inventario

### Ver Inventario

1. Click en **"Inventario"** en el menú
2. Verás la lista de todos los insumos

#### Información Mostrada

Para cada item:
- **Nombre del Insumo**: Ej: "Café en grano"
- **Cantidad Actual**: Stock disponible
- **Unidad**: kg, litros, unidades, etc.
- **Mínimo**: Cantidad mínima recomendada
- **Estado**: Indicador visual (verde/rojo)

### Alertas de Stock Bajo

Los items con stock bajo se muestran con:
- ⚠️ Ícono de alerta
- Fondo rojo claro
- Cantidad resaltada

#### Filtrar por Alertas

1. Click en el toggle **"Solo Alertas"**
2. Se mostrarán únicamente los items con stock bajo

### Actualizar Inventario

#### Entrada de Mercancía

1. Click en **"Actualizar"** en el item deseado
2. Selecciona **"Entrada"**
3. Ingresa la **cantidad** recibida
4. Añade **observaciones** (ej: "Compra semanal")
5. Click en **"Guardar"**

#### Salida de Mercancía

1. Click en **"Actualizar"**
2. Selecciona **"Salida"**
3. Ingresa la **cantidad** utilizada
4. Añade **observaciones** (ej: "Uso diario")
5. Click en **"Guardar"**

### Historial de Movimientos

1. Click en **"Ver Historial"** en un item
2. Verás todos los movimientos de ese insumo:
   - Fecha y hora
   - Tipo (Entrada/Salida)
   - Cantidad
   - Usuario que realizó el movimiento
   - Observaciones

---

## Reportes

### Reporte de Ventas Diarias

#### Generar Reporte

1. Click en **"Reportes"** → **"Ventas Diarias"**
2. Selecciona la **fecha** deseada
3. Click en **"Generar Reporte"**

#### Información del Reporte

El reporte muestra:

**Métricas Generales:**
- Total de ventas del día ($)
- Cantidad de pedidos
- Ticket promedio

**Ventas por Origen:**
- Mostrador
- Uber Eats
- Rappi
- Didi Food

**Ventas por Categoría:**
- Bebidas Calientes
- Bebidas Frías
- Postres
- Comida
- Snacks

**Top Productos:**
- Los 10 productos más vendidos
- Cantidad vendida
- Total en ventas

**Lista de Pedidos:**
- Detalle de cada pedido del día

### Reporte por Período

1. Click en **"Reportes"** → **"Por Período"**
2. Selecciona **Fecha Inicio**
3. Selecciona **Fecha Fin**
4. Click en **"Generar Reporte"**

#### Información del Reporte

- Total de ventas del período
- Cantidad de pedidos
- Ticket promedio
- Gráfica de tendencia (si disponible)

---

## Gestión de Usuarios

*Nota: Solo disponible para rol Administrador*

### Ver Lista de Usuarios

1. Click en **"Usuarios"** en el menú
2. Verás todos los usuarios del sistema

#### Información Mostrada

- Nombre completo
- Email
- Rol
- Estado (Activo/Inactivo)
- Fecha de creación

### Crear Nuevo Usuario

#### Paso 1: Abrir Formulario

1. Click en **"Nuevo Usuario"**
2. Se abrirá el formulario de creación

#### Paso 2: Completar Información

Campos requeridos:
- **Email**: Email corporativo único
- **Contraseña**: Mínimo 8 caracteres
- **Nombre Completo**: Nombre del empleado
- **Rol**: Selecciona el rol apropiado

#### Paso 3: Guardar

1. Click en **"Crear Usuario"**
2. El usuario podrá iniciar sesión inmediatamente

### Editar Usuario

1. Click en el botón **"Editar"** junto al usuario
2. Modifica los campos necesarios
3. **Cambiar Contraseña**: Ingresa nueva contraseña (opcional)
4. Click en **"Guardar Cambios"**

### Desactivar Usuario

1. Click en el toggle **"Activo"** junto al usuario
2. El usuario no podrá iniciar sesión
3. Sus datos se conservan en el sistema

---

## Permisos por Rol

### Administrador

**Acceso Completo**
- ✅ Crear, editar y eliminar productos
- ✅ Crear y gestionar pedidos
- ✅ Actualizar inventario
- ✅ Ver y generar reportes
- ✅ Gestionar usuarios (crear, editar, desactivar)
- ✅ Cambiar estados de pedidos

### Barista

**Operaciones Principales**
- ✅ Crear pedidos (mostrador y apps)
- ✅ Ver cola de pedidos
- ✅ Cambiar estados de pedidos
- ✅ Ver catálogo de productos
- ✅ Ver y actualizar inventario
- ✅ Ver reportes
- ❌ Gestionar productos
- ❌ Gestionar usuarios

### Cocina

**Producción**
- ✅ Ver cola de pedidos
- ✅ Cambiar estados de pedidos (En Preparación → Listo)
- ✅ Ver productos
- ✅ Ver inventario
- ❌ Crear pedidos
- ❌ Actualizar inventario
- ❌ Gestionar productos
- ❌ Gestionar usuarios

### Mesero

**Atención al Cliente**
- ✅ Crear pedidos de mostrador
- ✅ Ver cola de pedidos
- ✅ Ver productos
- ✅ Ver reportes
- ❌ Cambiar estados de pedidos
- ❌ Ver/actualizar inventario
- ❌ Gestionar productos
- ❌ Gestionar usuarios

---

## Preguntas Frecuentes

### ¿Cómo cambio mi contraseña?

Contacta al administrador del sistema para que restablezca tu contraseña.

### ¿Por qué no puedo ver el menú de Usuarios?

El menú de Usuarios solo está disponible para el rol Administrador.

### ¿Puedo cancelar un pedido?

Sí, cambia el estado del pedido a "Cancelado" desde la cola de pedidos.

### ¿Cómo sé si un producto está agotado?

Los productos no disponibles aparecen con un indicador visual y no se pueden agregar a nuevos pedidos.

### ¿Se pueden hacer pedidos sin productos disponibles?

No, el sistema valida la disponibilidad antes de crear el pedido.

### ¿Cuánto tiempo permanezco conectado?

Las sesiones expiran después de 8 horas de inactividad por seguridad.

### ¿Puedo usar el sistema en mi teléfono móvil?

Sí, el sistema es responsive y se adapta a dispositivos móviles.

### ¿Los cambios se sincronizan automáticamente?

Sí, la cola de pedidos se actualiza automáticamente cada 30 segundos.

---

## Solución de Problemas

### No puedo iniciar sesión

**Posibles causas:**
- Email o contraseña incorrectos
- Usuario desactivado
- Sesión no cerrada correctamente

**Solución:**
1. Verifica tus credenciales
2. Contacta al administrador si el problema persiste
3. Limpia el caché del navegador

### Los pedidos no se muestran en la cola

**Solución:**
1. Recarga la página (F5)
2. Verifica los filtros aplicados
3. Comprueba tu conexión a internet

### Error al crear pedido

**Posibles causas:**
- Productos no disponibles
- Campos requeridos vacíos
- Problema de conexión

**Solución:**
1. Verifica que todos los productos estén disponibles
2. Completa todos los campos requeridos
3. Intenta nuevamente

### Error al actualizar inventario

**Solución:**
1. Verifica que la cantidad sea válida (positiva)
2. Asegúrate de seleccionar tipo de movimiento
3. Recarga la página e intenta nuevamente

### La página se ve mal o desconfigurada

**Solución:**
1. Limpia el caché del navegador (Ctrl + F5)
2. Actualiza tu navegador a la última versión
3. Prueba en modo incógnito

### Notificaciones no aparecen

**Solución:**
1. Verifica que no estés bloqueando JavaScript
2. Revisa la configuración de notificaciones del navegador
3. Recarga la página

---

## Soporte Técnico

### Contacto

- **Email**: soporte@cafeluna.com
- **Teléfono**: (55) 1234-5678
- **Horario**: Lunes a Viernes, 9:00 - 18:00 hrs

### Reportar un Error

Al reportar un error, incluye:
1. Descripción del problema
2. Pasos para reproducir
3. Navegador y versión
4. Captura de pantalla (si es posible)
5. Mensajes de error

---

## Actualizaciones del Manual

Este manual se actualiza periódicamente. Verifica siempre que estés usando la última versión.

**Última actualización**: Noviembre 2025  
**Versión**: 1.0

---

¡Gracias por usar Café Luna! ☕
