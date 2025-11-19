# 🎬 Script de Video Demo - Café Luna (10 minutos)

## Información del Video

- **Duración**: 10 minutos
- **Formato**: Screencast + narración
- **Resolución**: 1920x1080 (Full HD)
- **Software sugerido**: OBS Studio, Loom, o Camtasia

---

## [00:00 - 00:30] Introducción

### Visual
- Mostrar logo de Café Luna
- Transición a pantalla de título

### Narración
> "Hola, bienvenidos a la demostración de Café Luna, un sistema integral de gestión para cafeterías. Mi nombre es [Tu Nombre] y en los próximos 10 minutos les mostraré cómo Café Luna puede transformar la operación de una cafetería moderna."

> "Café Luna resuelve un problema real: la gestión caótica de pedidos provenientes de múltiples fuentes como mostrador, Uber Eats, Rappi y Didi Food. Con nuestro sistema, todo se centraliza en una sola plataforma."

---

## [00:30 - 01:30] Contexto y Problema

### Visual
- Mostrar slides o imágenes ilustrativas del problema
- Gráficos de errores comunes sin sistema

### Narración
> "Imaginen una cafetería ocupada durante la hora pico. Los pedidos llegan del mostrador, simultáneamente suenan las notificaciones de Uber Eats, Rappi y Didi Food. El personal debe hacer malabarismo entre tablets, papeles y aplicaciones diferentes."

> "Los problemas son predecibles: pedidos perdidos, tiempos de espera excesivos, control de inventario deficiente, y falta de visibilidad sobre el negocio."

> "Café Luna elimina esta complejidad. Veamos cómo."

---

## [01:30 - 02:30] Login y Dashboard

### Visual
- Navegar a http://localhost:3000
- Mostrar página de login

### Narración
> "Comenzamos en la página de inicio de sesión. El sistema soporta 4 roles diferentes: Administrador, Barista, Cocina y Mesero. Cada rol tiene permisos específicos según sus responsabilidades."

### Acciones
1. Escribir email: admin@cafeluna.com
2. Escribir password: password123
3. Click en "Iniciar Sesión"

### Narración (continuación)
> "La autenticación es robusta, usando JWT tokens con bcrypt para el hash de passwords. Las cookies son httpOnly para prevenir ataques XSS."

> "Una vez dentro, vemos el dashboard principal con accesos rápidos a todas las funcionalidades. La interfaz es limpia, intuitiva y completamente responsive."

---

## [02:30 - 04:30] Crear Pedido (Demo Completa)

### Visual
- Click en "Crear Pedido" en el menú

### Narración
> "La función principal de Café Luna es la gestión de pedidos. Permítanme crearles un pedido completo."

### Acciones y Narración

**Paso 1: Seleccionar Tipo**
> "Primero seleccionamos el tipo de pedido. Tenemos Mostrador para clientes en el local, y las tres apps de delivery principales."

- Seleccionar "Mostrador"

**Paso 2: Agregar Productos**
> "El catálogo de productos se organiza por categorías: Bebidas Calientes, Bebidas Frías, Postres, Comida y Snacks. Puedo filtrar rápidamente."

- Filtrar por "Bebidas Calientes"
- Click en "+" en "Latte Grande" (2 veces)
- Click en "+" en "Capuchino" (1 vez)
- Cambiar a "Postres"
- Click en "+" en "Brownie de Chocolate"

**Paso 3: Información del Cliente**
> "Añadimos la información del cliente. Esto es opcional pero útil para el historial."

- Escribir nombre: "María García"
- Escribir teléfono: "5559876543"
- Escribir observaciones: "Sin azúcar en el Latte"

**Paso 4: Confirmar**
> "El sistema calcula automáticamente el total. Vemos el resumen en tiempo real en el panel derecho."

- Mostrar panel de resumen
- Click en "Crear Pedido"

> "¡Listo! El pedido se crea en menos de un segundo. El sistema genera automáticamente un número de pedido único en formato DDMMYY-XXX."

- Mostrar notificación de éxito con número de pedido

---

## [04:30 - 06:30] Cola de Pedidos y Estados

### Visual
- Click en "Cola de Pedidos" en el menú

### Narración
> "Ahora pasamos a la cola de pedidos, el corazón operativo de Café Luna. Aquí es donde el equipo visualiza y gestiona todos los pedidos activos."

### Mostrar Características

**Visualización**
> "Observen cómo cada pedido se muestra como una tarjeta con información clave: número de pedido, tipo de origen, tiempo de espera, y los productos."

**Sistema de Colores**
> "Café Luna usa un sistema inteligente de colores basado en tiempo de espera. Verde significa que el pedido tiene menos de 15 minutos, amarillo entre 15 y 30 minutos, y rojo más de 30 minutos. Esto ayuda a priorizar."

**Cambio de Estado**
> "Cambiemos el estado de nuestro pedido. Los estados fluyen naturalmente: Pendiente, En Preparación, Listo, y finalmente Entregado."

### Acciones
1. Localizar el pedido recién creado
2. Click en "Tomar Pedido" → Estado cambia a "En Preparación"
3. Esperar 2 segundos
4. Click en "Marcar Listo" → Estado cambia a "Listo"
5. Click en "Entregar" → Estado cambia a "Entregado"

### Narración (continuación)
> "Cada cambio de estado se registra en el historial con fecha, hora y usuario. Esto proporciona trazabilidad completa."

**Actualización Automática**
> "La cola se actualiza automáticamente cada 30 segundos. Si otro usuario crea un pedido, aparecerá aquí sin necesidad de refrescar la página manualmente."

---

## [06:30 - 07:30] Control de Inventario

### Visual
- Click en "Inventario" en el menú

### Narración
> "El control de inventario es crítico para cualquier cafetería. Café Luna lo hace simple y visual."

### Mostrar Características
> "Vemos todos los insumos con su cantidad actual, unidad de medida, y cantidad mínima recomendada."

> "Los items con stock bajo se destacan con un indicador de alerta. Esto permite reaccionar proactivamente antes de quedarse sin insumos."

### Acciones - Actualizar Inventario
1. Click en "Actualizar" en "Café en grano"
2. Seleccionar "Entrada"
3. Escribir cantidad: 50
4. Escribir observaciones: "Compra semanal - Proveedor XYZ"
5. Click en "Guardar"

### Narración (continuación)
> "Registramos una entrada de 50 kilos de café. El sistema actualiza la cantidad automáticamente y registra el movimiento en el historial."

> "Cada movimiento queda documentado: quién lo hizo, cuándo, qué cantidad, y por qué. Trazabilidad total."

- Click en "Ver Historial" para mostrar el registro

---

## [07:30 - 08:30] Reportes

### Visual
- Click en "Reportes" → "Ventas Diarias"

### Narración
> "Los reportes convierten datos en inteligencia de negocio. Café Luna genera reportes instantáneos con métricas clave."

### Acciones
1. Seleccionar fecha de hoy
2. Click en "Generar Reporte"

### Narración (continuación)
> "En segundos tenemos un reporte completo del día. Vemos el total de ventas en pesos, cantidad de pedidos, y el ticket promedio."

> "Desglose por origen: cuánto vendimos en mostrador versus apps de delivery. Esto ayuda a entender qué canales son más rentables."

- Scroll para mostrar más métricas

> "También tenemos ventas por categoría de producto: cuánto vendimos en bebidas calientes, frías, postres, etc."

> "Y lo más útil: el top 10 de productos más vendidos. Esto informa decisiones de compra y menú."

- Mostrar la tabla de top productos

> "Para análisis más amplios, podemos generar reportes por período, seleccionando un rango de fechas."

---

## [08:30 - 09:00] Gestión de Usuarios (Admin)

### Visual
- Click en "Usuarios" en el menú

### Narración
> "Como administrador, puedo gestionar todo el equipo desde el sistema."

### Mostrar Características
> "Vemos la lista de todos los usuarios con su rol y estado. Cada rol tiene permisos específicos."

> "Puedo crear nuevos usuarios, editar sus datos, cambiar su rol, o desactivarlos temporalmente."

### Acciones
1. Mostrar lista de usuarios
2. Click en un usuario para ver detalles
3. Volver a la lista

### Narración (continuación)
> "El sistema de roles es flexible. El administrador tiene acceso completo, el barista puede crear pedidos y gestionar inventario, cocina solo ve y actualiza pedidos, y el mesero crea pedidos pero no modifica inventario."

---

## [09:00 - 09:40] Tecnología y Calidad

### Visual
- Mostrar código brevemente o diagrama de arquitectura
- Alternar entre diferentes archivos/documentación

### Narración
> "Café Luna está construido con tecnologías modernas y probadas. Node.js y Express en el backend, Pug para las vistas, y Supabase como base de datos PostgreSQL."

> "La seguridad es primordial: passwords hasheados con bcrypt, autenticación JWT, cookies httpOnly, validación en todos los endpoints, y control de acceso basado en roles."

> "Hemos implementado 128 tests unitarios con Jest, alcanzando 70% de cobertura de código. Esto garantiza que cada cambio futuro no rompe funcionalidad existente."

> "La base de datos está optimizada con 20 índices estratégicos para consultas rápidas."

> "Y lo más importante: todo está documentado. Más de 100 páginas de documentación técnica y para usuarios."

---

## [09:40 - 10:00] Cierre

### Visual
- Volver al dashboard
- Transición a slides de cierre

### Narración
> "Café Luna es más que un sistema de gestión. Es una solución completa que mejora la eficiencia operativa, reduce errores, y proporciona visibilidad sobre el negocio."

> "Está listo para producción, es escalable, seguro, y fácil de usar."

> "El código completo está disponible en GitHub en el repositorio josemanuelfernandez-dev001/Cafe-Luna, junto con toda la documentación."

> "Gracias por ver esta demostración. Si tienen preguntas o comentarios, no duden en contactarnos."

### Visual Final
- Mostrar información de contacto
- Logo de Café Luna
- Fade out

---

## Notas de Producción

### Preparación Antes de Grabar

1. **Base de Datos**:
   - Asegurarse de tener datos de prueba variados
   - Al menos 5 pedidos con diferentes estados
   - Productos en todas las categorías
   - Items de inventario con algunos en stock bajo

2. **Navegador**:
   - Cerrar tabs innecesarias
   - Modo incógnito para sesión limpia
   - Zoom al 100%
   - Ocultar bookmarks bar

3. **Sistema**:
   - Desactivar notificaciones del OS
   - Cerrar aplicaciones innecesarias
   - Asegurar conexión estable a internet
   - Servidor corriendo sin errores

4. **Audio**:
   - Micrófono de calidad
   - Ambiente silencioso
   - Prueba de audio antes de grabar

### Durante la Grabación

1. **Hablar Claramente**:
   - Pace moderado
   - Pronunciación clara
   - Evitar muletillas ("um", "eh")

2. **Pausas Estratégicas**:
   - Después de cada acción importante
   - Permitir que el viewer vea el resultado
   - 2-3 segundos entre transiciones

3. **Mouse Visible**:
   - Movimientos deliberados
   - No mover el mouse innecesariamente
   - Highlight clicks importantes

4. **Errores**:
   - Si ocurre un error técnico, pausar y editar después
   - Tener plan B (screenshots) por si algo falla

### Post-Producción

1. **Edición**:
   - Cortar pausas largas
   - Añadir zoom en secciones importantes
   - Transiciones suaves
   - Música de fondo sutil (opcional)

2. **Subtítulos**:
   - Considerar añadir subtítulos en español
   - Útil para accesibilidad

3. **Marcadores de Tiempo**:
   - Añadir capítulos en la descripción del video
   - Facilita la navegación

4. **Call to Action**:
   - Link al repositorio GitHub
   - Link a documentación
   - Información de contacto

---

## Checklist Pre-Grabación

- [ ] Servidor corriendo sin errores
- [ ] Base de datos con datos de prueba
- [ ] Navegador limpio y configurado
- [ ] Notificaciones del OS desactivadas
- [ ] Micrófono probado
- [ ] Script revisado
- [ ] Pantalla grabada a 1080p
- [ ] Slides/assets listos

---

**Tiempo Total**: 10:00 minutos  
**Formato**: MP4, 1920x1080, 30fps  
**Audio**: 48kHz, stereo
