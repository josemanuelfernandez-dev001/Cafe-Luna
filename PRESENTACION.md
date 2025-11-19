# 🎯 Presentación Café Luna - 25 Diapositivas

## Slide 1: Portada
**Título**: ☕ Café Luna - Sistema de Gestión Interna para Cafeterías  
**Subtítulo**: Proyecto Final - Metodología Scrum  
**Autores**: José Manuel Fernández, Jorge Manuel Cabrera Zapata  
**Fecha**: Noviembre 2025

---

## Slide 2: Agenda
1. Introducción y Contexto
2. Problema y Solución
3. Tecnologías Utilizadas
4. Arquitectura del Sistema
5. Funcionalidades Principales
6. Demostración en Vivo
7. Resultados y Métricas
8. Conclusiones y Próximos Pasos

---

## Slide 3: El Problema
### Desafíos de las Cafeterías Modernas

**Antes de Café Luna:**
- 📝 Gestión manual de pedidos
- 🔢 Errores en órdenes de múltiples fuentes (mostrador, apps)
- 📊 Sin visibilidad en tiempo real
- 📦 Control deficiente de inventario
- 🕐 Pérdida de tiempo en reportes manuales
- 👥 Falta de control de acceso por roles

**Resultado**: Ineficiencia, errores, pérdida de ventas

---

## Slide 4: La Solución - Café Luna
### Sistema Integral de Gestión

**Con Café Luna:**
- ✅ Gestión digital de pedidos multi-origen
- ✅ Cola en tiempo real con alertas visuales
- ✅ Control automático de inventario
- ✅ Reportes instantáneos
- ✅ Control de acceso basado en roles
- ✅ Interfaz intuitiva y responsive

**Resultado**: Eficiencia, precisión, mejor servicio al cliente

---

## Slide 5: Características Clave

### 🎯 Funcionalidades Principales

| Característica | Beneficio |
|----------------|-----------|
| **Pedidos Multi-Origen** | Unifica mostrador + Uber Eats + Rappi + Didi |
| **Cola en Tiempo Real** | Visibilidad completa del flujo de trabajo |
| **Alertas Inteligentes** | Colores por tiempo de espera |
| **Control de Inventario** | Alertas de stock bajo automáticas |
| **Reportes Instantáneos** | Métricas de negocio en segundos |
| **4 Roles de Usuario** | Seguridad y permisos granulares |

---

## Slide 6: Stack Tecnológico

### 🛠️ Tecnologías Modernas y Probadas

**Backend:**
- Node.js 16+ con Express.js
- Supabase (PostgreSQL + Realtime)
- JWT + bcrypt para seguridad
- Jest para testing (70%+ coverage)

**Frontend:**
- Pug (Server-Side Rendering)
- Vanilla JavaScript
- CSS3 responsive (mobile-first)

**DevOps:**
- Git + GitHub
- npm para gestión de dependencias
- Documentación en Markdown

---

## Slide 7: Arquitectura - Vista de Alto Nivel

```
┌─────────────┐
│   Cliente   │
│  (Browser)  │
└──────┬──────┘
       │
       ▼
┌──────────────┐
│   Express    │
│   + Pug      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Supabase   │
│ (PostgreSQL) │
└──────────────┘
```

**Patrón**: MVC (Model-View-Controller)  
**Principio**: Separación de Responsabilidades

---

## Slide 8: Arquitectura - Capas

### 📋 Estructura en Capas

1. **Routes** → Enrutamiento de peticiones
2. **Middleware** → Autenticación y validación
3. **Controllers** → Lógica de negocio
4. **Services** → Operaciones complejas
5. **Database** → Persistencia (Supabase)
6. **Views** → Presentación (Pug)

**Total**: 50+ archivos organizados  
**Líneas**: ~8,000 líneas de código

---

## Slide 9: Base de Datos - Esquema

### 🗄️ 7 Tablas Principales

1. **usuarios** → Autenticación y roles
2. **productos** → Catálogo de cafetería
3. **pedidos** → Órdenes de clientes
4. **pedido_items** → Detalle de productos
5. **inventario** → Control de stock
6. **movimientos_inventario** → Historial
7. **historial_pedidos** → Auditoría

**Optimización**: 20+ índices estratégicos  
**Integridad**: 8 foreign keys

---

## Slide 10: Seguridad

### 🔒 Múltiples Capas de Protección

1. **Passwords**: Hasheadas con bcrypt (salt rounds)
2. **Tokens JWT**: Firmados y con expiración (8h)
3. **Cookies**: httpOnly para prevenir XSS
4. **Helmet.js**: Headers HTTP seguros
5. **express-validator**: Validación en todos los endpoints
6. **RBAC**: Control de acceso basado en roles
7. **Sanitización**: Logs y inputs limpios

**Resultado**: Sistema robusto contra ataques comunes

---

## Slide 11: Sistema de Roles (RBAC)

### 👥 4 Roles con Permisos Granulares

| Funcionalidad | Admin | Barista | Cocina | Mesero |
|---------------|:-----:|:-------:|:------:|:------:|
| Crear pedidos | ✅ | ✅ | ❌ | ✅ |
| Actualizar estados | ✅ | ✅ | ✅ | ❌ |
| Gestionar productos | ✅ | ❌ | ❌ | ❌ |
| Control inventario | ✅ | ✅ | ❌ | ❌ |
| Ver reportes | ✅ | ✅ | ✅ | ✅ |
| Gestionar usuarios | ✅ | ❌ | ❌ | ❌ |

**Implementación**: Middleware personalizado

---

## Slide 12: Funcionalidad #1 - Gestión de Pedidos

### 📋 Sistema Completo de Pedidos

**Crear Pedido:**
- Selección de tipo (Mostrador, Uber Eats, Rappi, Didi)
- Agregar productos del catálogo
- Información del cliente (opcional)
- Observaciones especiales
- Generación automática de número de pedido (DDMMYY-XXX)

**Seguimiento:**
- Cola en tiempo real
- Estados: Pendiente → En Preparación → Listo → Entregado
- Colores por tiempo de espera (Verde/Amarillo/Rojo)
- Actualización automática cada 30 segundos

---

## Slide 13: Funcionalidad #2 - Control de Inventario

### 📦 Gestión Inteligente de Stock

**Características:**
- Lista completa de insumos
- Cantidad actual vs. mínima
- Alertas visuales para stock bajo (⚠️)
- Registro de entradas y salidas
- Historial completo de movimientos
- Observaciones por movimiento

**Beneficios:**
- Evita faltantes
- Optimiza compras
- Trazabilidad completa

---

## Slide 14: Funcionalidad #3 - Reportes

### 📊 Inteligencia de Negocio

**Reporte Diario:**
- Total de ventas ($)
- Cantidad de pedidos
- Ticket promedio
- Ventas por origen (Mostrador, Apps)
- Ventas por categoría
- Top 10 productos más vendidos

**Reporte por Período:**
- Resumen entre dos fechas
- Métricas comparativas
- Tendencias de ventas

**Generación**: Instantánea con un click

---

## Slide 15: UX/UI - Diseño Responsive

### 🎨 Interfaz Moderna y Adaptable

**Características:**
- **Mobile-First**: Optimizado para dispositivos móviles
- **Responsive**: Se adapta a tablet y desktop
- **Tema Personalizado**: Tonos café/marrón
- **Iconografía Clara**: Fácil identificación
- **Feedback Visual**: Loading spinners, toasts, confirmaciones

**Componentes Reutilizables:**
- Toast notifications (success, error, warning, info)
- Loading overlay con spinner
- Diálogos de confirmación
- Formularios validados

---

## Slide 16: Real-Time Updates

### ⚡ Actualización en Tiempo Real

**Implementación:**
- Polling automático cada 30 segundos
- Actualización de cola de pedidos
- Sincronización entre usuarios
- Sin refrescar página manualmente

**Ventajas:**
- Todos ven la misma información
- Reducción de errores de comunicación
- Mejor coordinación del equipo
- Respuesta rápida a nuevos pedidos

**Futuro**: Migrar a WebSockets (Supabase Realtime)

---

## Slide 17: Testing

### 🧪 Calidad Asegurada

**Estrategia de Testing:**
- **Unit Tests**: 128 tests con Jest
- **Coverage**: 70%+ en todas las áreas críticas
- **Mocking**: Supabase mockeado para tests aislados
- **Integration Tests**: Flujos completos de API

**Áreas Cubiertas:**
- ✅ Autenticación (login, logout, sesiones)
- ✅ Pedidos (crear, listar, actualizar)
- ✅ Productos (CRUD completo)
- ✅ Inventario (movimientos, alertas)
- ✅ Usuarios (gestión completa)

**Comando**: `npm test`

---

## Slide 18: Optimización

### ⚡ Rendimiento Optimizado

**Base de Datos:**
- 20+ índices estratégicos
- Índices parciales para queries específicos
- Full-text search en productos
- Análisis de tablas (ANALYZE)

**Backend:**
- Queries eficientes
- Validación temprana
- Error handling centralizado
- Log sanitization

**Frontend:**
- Minificación de assets
- Lazy loading preparado
- Caché de navegador

**Resultado**: Respuestas < 100ms en promedio

---

## Slide 19: Documentación

### 📚 Documentación Profesional y Completa

**Técnica:**
- ✅ README.md con badges
- ✅ ARQUITECTURA.md (13 páginas)
- ✅ API.md (30+ endpoints documentados)
- ✅ DEPLOYMENT.md (guía completa)

**Usuario:**
- ✅ MANUAL_USUARIO.md (35 páginas)
- ✅ FAQ y troubleshooting
- ✅ Guías paso a paso

**Proyecto:**
- ✅ RETROSPECTIVA.md
- ✅ Comentarios en código
- ✅ Scripts SQL documentados

**Total**: 100+ páginas de documentación

---

## Slide 20: Métricas del Proyecto

### 📈 Resultados Cuantificables

**Desarrollo:**
- **Duración**: 3 sprints (3 semanas)
- **Archivos**: 50+ archivos organizados
- **Código**: ~8,000 líneas
- **Commits**: 50+ commits

**Backend:**
- **Endpoints API**: 30+ rutas
- **Tests**: 128 tests unitarios
- **Coverage**: 70%+ 
- **Tablas DB**: 7 tablas + índices

**Frontend:**
- **Páginas**: 12+ vistas
- **Componentes**: Modulares y reutilizables
- **JavaScript**: ~2,000 líneas

---

## Slide 21: Demostración - Login

### 🔐 Sistema de Autenticación

**Flujo:**
1. Usuario ingresa email y password
2. Sistema valida credenciales
3. Genera JWT (8 horas de validez)
4. Almacena en cookie httpOnly
5. Crea sesión con información del usuario
6. Redirecciona a dashboard

**Seguridad:**
- Password hasheado con bcrypt
- Token firmado con secret
- Cookie httpOnly previene XSS
- Validación en cada request

---

## Slide 22: Demostración - Crear Pedido

### 📋 Flujo Completo de Pedido

**Demo en Vivo:**
1. Seleccionar tipo de pedido (Mostrador)
2. Buscar y agregar productos
3. Ajustar cantidades
4. Añadir información del cliente
5. Agregar observaciones
6. Confirmar pedido
7. Ver número de pedido generado
8. Verificar en cola de pedidos

**Tiempo total**: < 60 segundos

---

## Slide 23: Demostración - Cola de Pedidos

### ⏱️ Gestión en Tiempo Real

**Demo en Vivo:**
1. Ver pedidos pendientes con colores
2. Tomar un pedido (cambiar a "En Preparación")
3. Completar preparación (cambiar a "Listo")
4. Entregar pedido (cambiar a "Entregado")
5. Verificar actualización en tiempo real
6. Ver historial de cambios

**Colores por Urgencia:**
- 🟢 Verde: < 15 min
- 🟡 Amarillo: 15-30 min
- 🔴 Rojo: > 30 min

---

## Slide 24: Futuras Mejoras

### 🚀 Roadmap y Evolución

**Corto Plazo (1-3 meses):**
- CI/CD Pipeline con GitHub Actions
- E2E Tests con Playwright
- Monitoring con Sentry
- PWA para instalación

**Mediano Plazo (3-6 meses):**
- Dashboard analytics avanzado
- Exportar reportes a PDF
- Integración con sistemas de pago
- Notificaciones push

**Largo Plazo (6-12 meses):**
- App móvil nativa (iOS/Android)
- IA para predicción de demanda
- Sistema de lealtad
- API pública para integraciones

---

## Slide 25: Conclusiones y Agradecimientos

### ✅ Logros Principales

**Técnicos:**
- Sistema completo y funcional
- Arquitectura sólida y escalable
- Testing robusto (70%+ coverage)
- Documentación profesional

**De Negocio:**
- Solución real a problema real
- Listo para producción
- Potencial comercial

**Aprendizaje:**
- Full-stack development
- Metodología Scrum
- Trabajo en equipo
- Buenas prácticas de ingeniería

### 🙏 Gracias

**Contacto:**
- GitHub: [josemanuelfernandez-dev001/Cafe-Luna](https://github.com/josemanuelfernandez-dev001/Cafe-Luna)
- Email: contacto@cafeluna.com

**¿Preguntas?** 🤔

---

# Notas del Presentador

## Timing Sugerido (25 min total)

- Slides 1-4 (Intro): 3 min
- Slides 5-11 (Tech Stack): 5 min
- Slides 12-16 (Funcionalidades): 5 min
- Slides 17-20 (Testing y Métricas): 4 min
- Slides 21-23 (Demo en Vivo): 6 min
- Slides 24-25 (Futuro y Cierre): 2 min

## Tips para la Presentación

1. **Inicio Fuerte**: Captar atención con el problema
2. **Demo en Vivo**: La parte más importante
3. **Métricas Concretas**: Números impresionan
4. **Confianza**: Conoces el proyecto a fondo
5. **Backup Plan**: Screenshots si falla la demo

## Q&A Preparadas

**P: ¿Por qué Supabase y no Firebase?**  
R: PostgreSQL es más robusto para datos estructurados, mejor para reportes complejos.

**P: ¿Puede escalar a múltiples cafeterías?**  
R: Sí, con modificaciones para multi-tenancy y subdomains.

**P: ¿Cuánto tiempo tomó el desarrollo?**  
R: 3 sprints de 1 semana cada uno, ~120 horas totales.

**P: ¿Planes de comercialización?**  
R: Potencial como SaaS, necesitaría marketing y ventas.
