/**
 * Widget de alertas de inventario
 */

/**
 * Cargar y mostrar alertas de stock bajo
 */
async function cargarAlertas() {
  try {
    const data = await fetchWithAuth('/api/inventario/alertas', {}, false);
    const alertas = data.alertas || [];
    
    actualizarBadgeAlertas(alertas.length);
    
    const widget = document.getElementById('alertasWidget');
    if (widget) {
      renderAlertasWidget(alertas, widget);
    }
    
    return alertas;
  } catch (error) {
    console.error('Error al cargar alertas:', error);
    return [];
  }
}

/**
 * Actualizar badge de alertas en navbar
 */
function actualizarBadgeAlertas(count) {
  let badge = document.getElementById('alertasBadge');
  
  if (!badge) {
    // Buscar el enlace de inventario en navbar
    const navLinks = document.querySelectorAll('nav a');
    for (let link of navLinks) {
      if (link.href && link.href.includes('/inventario')) {
        badge = document.createElement('span');
        badge.id = 'alertasBadge';
        badge.className = 'badge-alert';
        link.appendChild(badge);
        break;
      }
    }
  }
  
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  }
}

/**
 * Renderizar widget de alertas
 */
function renderAlertasWidget(alertas, container) {
  if (alertas.length === 0) {
    container.innerHTML = `
      <div class="alertas-widget">
        <h3 class="alertas-titulo">
          <span class="alertas-icon">✓</span>
          Stock en Orden
        </h3>
        <p class="text-muted">No hay alertas de stock bajo</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = `
    <div class="alertas-widget">
      <h3 class="alertas-titulo">
        <span class="alertas-icon alert">⚠️</span>
        Alertas de Stock (${alertas.length})
      </h3>
      <div class="alertas-lista">
        ${alertas.map(alerta => `
          <div class="alerta-item">
            <div class="alerta-info">
              <strong>${alerta.nombre}</strong>
              <span class="alerta-cantidad">
                ${alerta.cantidad_actual} ${alerta.unidad_medida} 
                / ${alerta.stock_minimo} ${alerta.unidad_medida}
              </span>
            </div>
            <span class="alerta-faltante">
              Faltan: ${alerta.faltante.toFixed(2)} ${alerta.unidad_medida}
            </span>
          </div>
        `).join('')}
      </div>
      <a href="/inventario" class="btn btn-sm btn-primary" style="margin-top: 1rem;">
        Ver Inventario Completo
      </a>
    </div>
  `;
}

/**
 * Inicializar sistema de alertas
 */
function inicializarAlertas() {
  // Cargar alertas al inicio
  cargarAlertas();
  
  // Recargar alertas cada 5 minutos
  setInterval(cargarAlertas, 5 * 60 * 1000);
}

// Estilos para el widget de alertas
if (!document.getElementById('alertas-styles')) {
  const style = document.createElement('style');
  style.id = 'alertas-styles';
  style.textContent = `
    /* Badge de alertas en navbar */
    .badge-alert {
      background: #e74c3c;
      color: white;
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: bold;
      margin-left: 5px;
      position: relative;
      top: -2px;
    }
    
    /* Widget de alertas */
    .alertas-widget {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .alertas-titulo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0 0 1rem 0;
      font-size: 1.2rem;
      color: #2c3e50;
    }
    
    .alertas-icon {
      font-size: 1.5rem;
    }
    
    .alertas-icon.alert {
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    .alertas-lista {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .alerta-item {
      padding: 0.75rem;
      background: #fff5f5;
      border-left: 3px solid #e74c3c;
      border-radius: 4px;
    }
    
    .alerta-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
    }
    
    .alerta-info strong {
      color: #2c3e50;
    }
    
    .alerta-cantidad {
      color: #7f8c8d;
      font-size: 0.9rem;
    }
    
    .alerta-faltante {
      display: block;
      color: #e74c3c;
      font-size: 0.85rem;
      font-weight: 600;
    }
  `;
  document.head.appendChild(style);
}

// Inicializar si estamos en el dashboard
if (window.location.pathname === '/dashboard' || document.getElementById('alertasWidget')) {
  inicializarAlertas();
}
