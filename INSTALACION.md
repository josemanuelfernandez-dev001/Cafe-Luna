# 🚀 Guía de Instalación Rápida - Café Luna

## Pasos para poner en marcha el sistema

### 1. Prerrequisitos
- Node.js 16 o superior
- Una cuenta de Supabase (gratuita)
- Git

### 2. Clonar el repositorio
```bash
git clone https://github.com/josemanuelfernandez-dev001/Cafe-Luna.git
cd Cafe-Luna
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Configurar variables de entorno
```bash
cp .env.example .env
```

El archivo `.env` ya contiene las credenciales de Supabase configuradas para desarrollo.

### 5. Configurar la base de datos en Supabase

1. Ve a [Supabase](https://supabase.com) y crea una cuenta (si no tienes una)
2. El proyecto ya está configurado con estas credenciales:
   - **URL:** https://uegevvbdylinllgyisji.supabase.co
   - **Key:** (incluida en .env.example)

3. En el panel de Supabase, ve a **SQL Editor**

4. Ejecuta los scripts en este orden:
   
   **Primero:** Copia y ejecuta todo el contenido de `database/schema.sql`
   - Esto creará todas las tablas necesarias
   
   **Segundo:** Copia y ejecuta todo el contenido de `database/seed.sql`
   - Esto insertará los datos de prueba

5. Verifica que las tablas se crearon correctamente:
   - Ve a **Table Editor** en Supabase
   - Deberías ver: usuarios, productos, pedidos, pedido_items, historial_pedidos, inventario, movimientos_inventario

### 6. Iniciar el servidor

**Modo desarrollo (con auto-reload):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

### 7. Acceder a la aplicación

Abre tu navegador en: **http://localhost:3000**

### 8. Iniciar sesión

Usa cualquiera de estas credenciales de prueba:

| Email | Password | Rol |
|-------|----------|-----|
| admin@cafeluna.com | password123 | Administrador |
| carlos@cafeluna.com | password123 | Barista |
| ana@cafeluna.com | password123 | Barista |
| roberto@cafeluna.com | password123 | Cocina |

## 🎉 ¡Listo!

Tu sistema de gestión de Café Luna está funcionando.

### Próximos pasos:

1. **Explora el Dashboard** - Ve las estadísticas del día
2. **Crea un Pedido** - Ve a "Crear Pedido" desde el menú
3. **Ver la Cola** - Mira la cola de pedidos en tiempo real
4. **Gestiona Productos** - Si eres admin, puedes crear productos
5. **Revisa Reportes** - Ve los reportes de ventas diarias

## 📞 Soporte

Si tienes problemas:
1. Verifica que Node.js esté instalado: `node --version`
2. Verifica que las variables de entorno estén correctas
3. Revisa que los scripts SQL se ejecutaron sin errores
4. Consulta el archivo README.md completo

## 🔧 Troubleshooting

**Error: Cannot find module**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error de conexión a Supabase**
- Verifica las variables SUPABASE_URL y SUPABASE_ANON_KEY en .env
- Asegúrate de haber ejecutado los scripts SQL

**Puerto 3000 en uso**
- Cambia el puerto en .env: `PORT=3001`

---

¡Disfruta usando Café Luna! ☕
