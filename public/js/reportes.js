/**
 * Funcionalidad para reportes con gráficos
 */

let chartVentasPorHora = null;
let chartVentasPorTipo = null;

/**
 * Cargar reporte de ventas diarias
 */
async function cargarReporte() {
  const fecha = document.getElementById('fecha').value;
  if (!fecha) {
    showToast('Por favor selecciona una fecha', 'warning');
    return;
  }
  
  try {
    const data = await fetchWithAuth(`/api/reportes/ventas-diarias?fecha=${fecha}`);
    renderReporte(data);
  } catch (error) {
    console.error('Error al cargar reporte:', error);
  }
}

/**
 * Renderizar reporte completo con gráficos
 */
function renderReporte(data) {
  const container = document.getElementById('reporteContainer');
  
  container.innerHTML = `
    <div class="reporte-seccion">
      <div class="reporte-header">
        <h3>Resumen del día ${formatDate(data.fecha)}</h3>
        ${data.comparacion ? `
          <div class="comparacion">
            <span class="comparacion-label">vs. ${formatDate(data.comparacion.fecha_anterior)}</span>
            <span class="comparacion-valor ${data.comparacion.diferencia >= 0 ? 'positivo' : 'negativo'}">
              ${data.comparacion.diferencia >= 0 ? '▲' : '▼'} 
              ${formatCurrency(Math.abs(data.comparacion.diferencia))} 
              (${data.comparacion.porcentaje.toFixed(1)}%)
            </span>
          </div>
        ` : ''}
      </div>
      
      <div class="metricas-grid">
        <div class="metrica-card">
          <div class="metrica-icon">💰</div>
          <div class="metrica-info">
            <span class="metrica-label">Total Ventas</span>
            <span class="metrica-valor">${formatCurrency(data.metricas.total_ventas)}</span>
          </div>
        </div>
        <div class="metrica-card">
          <div class="metrica-icon">📋</div>
          <div class="metrica-info">
            <span class="metrica-label">Pedidos</span>
            <span class="metrica-valor">${data.metricas.cantidad_pedidos}</span>
          </div>
        </div>
        <div class="metrica-card">
          <div class="metrica-icon">🎯</div>
          <div class="metrica-info">
            <span class="metrica-label">Ticket Promedio</span>
            <span class="metrica-valor">${formatCurrency(data.metricas.ticket_promedio)}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="graficos-grid">
      <div class="grafico-seccion">
        <h3>Ventas por Hora</h3>
        <canvas id="chartVentasPorHora"></canvas>
      </div>
      
      <div class="grafico-seccion">
        <h3>Ventas por Tipo</h3>
        <canvas id="chartVentasPorTipo"></canvas>
      </div>
    </div>
    
    <div class="reporte-seccion">
      <h3>Top 10 Productos Más Vendidos</h3>
      <div class="tabla-container">
        <table class="tabla-reporte">
          <thead>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.top_productos.map((prod, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${prod.nombre}</td>
                <td>${prod.cantidad}</td>
                <td>${formatCurrency(prod.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  // Renderizar gráficos
  renderChartVentasPorHora(data.ventas_por_hora);
  renderChartVentasPorTipo(data.por_origen);
}

/**
 * Renderizar gráfico de ventas por hora (barras)
 */
function renderChartVentasPorHora(ventasPorHora) {
  // Destruir gráfico anterior si existe
  if (chartVentasPorHora) {
    chartVentasPorHora.destroy();
  }
  
  const ctx = document.getElementById('chartVentasPorHora');
  if (!ctx) return;
  
  // Filtrar solo horas con ventas
  const horasConVentas = ventasPorHora.filter(v => v.cantidad > 0);
  
  chartVentasPorHora = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: horasConVentas.map(v => `${v.hora}:00`),
      datasets: [{
        label: 'Ventas',
        data: horasConVentas.map(v => v.total),
        backgroundColor: 'rgba(139, 69, 19, 0.6)',
        borderColor: 'rgba(139, 69, 19, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value.toFixed(2);
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return 'Ventas: ' + formatCurrency(context.parsed.y);
            }
          }
        }
      }
    }
  });
}

/**
 * Renderizar gráfico de ventas por tipo (dona)
 */
function renderChartVentasPorTipo(porOrigen) {
  // Destruir gráfico anterior si existe
  if (chartVentasPorTipo) {
    chartVentasPorTipo.destroy();
  }
  
  const ctx = document.getElementById('chartVentasPorTipo');
  if (!ctx) return;
  
  const tipos = Object.keys(porOrigen);
  const colores = {
    'mostrador': 'rgba(52, 152, 219, 0.8)',
    'uber_eats': 'rgba(46, 204, 113, 0.8)',
    'rappi': 'rgba(241, 196, 15, 0.8)',
    'didi_food': 'rgba(231, 76, 60, 0.8)'
  };
  
  chartVentasPorTipo = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: tipos.map(tipo => formatearOrigen(tipo)),
      datasets: [{
        data: tipos.map(tipo => porOrigen[tipo].total),
        backgroundColor: tipos.map(tipo => colores[tipo] || 'rgba(149, 165, 166, 0.8)'),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = formatCurrency(context.parsed);
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

/**
 * Formatear origen a texto legible
 */
function formatearOrigen(origen) {
  const origenes = {
    'mostrador': 'Mostrador',
    'uber_eats': 'Uber Eats',
    'rappi': 'Rappi',
    'didi_food': 'Didi Food'
  };
  return origenes[origen] || origen;
}

// Función para exportar reporte a CSV
function exportarCSV(data, filename) {
  const csv = convertirACSV(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

function convertirACSV(data) {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header]).join(','))
  ].join('\n');
  
  return csv;
}

// Función para imprimir reporte
function imprimirReporte() {
  window.print();
}
