/**
 * Funciones para gestión de inventario
 */

let inventario = [];
let mostrarSoloStockBajo = false;

/**
 * Cargar lista de insumos
 */
async function cargarInventario() {
  try {
    let url = '/api/inventario/insumos';
    if (mostrarSoloStockBajo) {
      url += '?alerta_stock=true';
    }
    
    const data = await fetchWithAuth(url, {}, false);
    inventario = data.insumos || data.inventario || [];
    renderInventario();
  } catch (error) {
    console.error('Error al cargar inventario:', error);
  }
}

/**
 * Renderizar tabla/grid de inventario
 */
function renderInventario() {
  const grid = document.getElementById('inventarioGrid');
  
  if (!grid) return;
  
  if (inventario.length === 0) {
    grid.innerHTML = '<p class="text-muted">No hay items en el inventario</p>';
    return;
  }
  
  grid.innerHTML = inventario.map(item => {
    const porcentaje = (item.cantidad_actual / item.stock_minimo) * 100;
    const alerta = item.cantidad_actual <= item.stock_minimo;
    
    return `
      <div class="inventario-card ${alerta ? 'alerta' : ''}">
        <div class="inventario-header">
          <h3>${item.nombre}</h3>
          ${alerta ? '<span class="badge badge-error">⚠️ Stock Bajo</span>' : ''}
        </div>
        <div class="inventario-body">
          <p class="item-descripcion">${item.descripcion || ''}</p>
          <div class="inventario-stats">
            <div class="stat">
              <span class="stat-label">Cantidad Actual</span>
              <span class="stat-value ${alerta ? 'text-error' : ''}">${item.cantidad_actual} ${item.unidad_medida}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Stock Mínimo</span>
              <span class="stat-value">${item.stock_minimo} ${item.unidad_medida}</span>
            </div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill ${alerta ? 'bg-error' : 'bg-success'}" 
                 style="width: ${Math.min(porcentaje, 100)}%"></div>
          </div>
          <div class="inventario-actions">
            <button class="btn btn-sm btn-success" onclick="mostrarModalEntrada('${item.id}')">
              ➕ Entrada
            </button>
            <button class="btn btn-sm btn-warning" onclick="mostrarModalSalida('${item.id}')">
              ➖ Salida
            </button>
            <button class="btn btn-sm btn-secondary" onclick="verMovimientos('${item.id}')">
              📋 Historial
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Filtrar solo items con stock bajo
 */
function filtrarStockBajo() {
  mostrarSoloStockBajo = true;
  cargarInventario();
}

/**
 * Mostrar todos los items
 */
function mostrarTodos() {
  mostrarSoloStockBajo = false;
  cargarInventario();
}

/**
 * Mostrar modal para registrar entrada
 */
function mostrarModalEntrada(itemId) {
  const item = inventario.find(i => i.id === itemId);
  if (!item) return;
  
  const modal = document.getElementById('modalMovimiento') || crearModalMovimiento();
  document.getElementById('movimientoTitulo').textContent = `Registrar Entrada - ${item.nombre}`;
  document.getElementById('movimientoItemId').value = itemId;
  document.getElementById('movimientoTipo').value = 'entrada';
  document.getElementById('movimientoCantidad').value = '';
  document.getElementById('movimientoObservaciones').value = '';
  
  modal.style.display = 'flex';
}

/**
 * Mostrar modal para registrar salida
 */
function mostrarModalSalida(itemId) {
  const item = inventario.find(i => i.id === itemId);
  if (!item) return;
  
  const modal = document.getElementById('modalMovimiento') || crearModalMovimiento();
  document.getElementById('movimientoTitulo').textContent = `Registrar Salida - ${item.nombre}`;
  document.getElementById('movimientoItemId').value = itemId;
  document.getElementById('movimientoTipo').value = 'salida';
  document.getElementById('movimientoCantidad').value = '';
  document.getElementById('movimientoObservaciones').value = '';
  
  modal.style.display = 'flex';
}

/**
 * Crear modal de movimiento si no existe
 */
function crearModalMovimiento() {
  const modal = document.createElement('div');
  modal.id = 'modalMovimiento';
  modal.className = 'modal';
  modal.style.display = 'none';
  
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3 id="movimientoTitulo">Registrar Movimiento</h3>
        <button class="modal-close" onclick="cerrarModalMovimiento()">✕</button>
      </div>
      <div class="modal-body">
        <form id="formMovimiento" onsubmit="guardarMovimiento(event)">
          <input type="hidden" id="movimientoItemId">
          <input type="hidden" id="movimientoTipo">
          
          <div class="form-group">
            <label for="movimientoCantidad">Cantidad *</label>
            <input type="number" id="movimientoCantidad" class="form-control" 
                   min="0" step="0.01" required>
          </div>
          
          <div class="form-group">
            <label for="movimientoObservaciones">Observaciones</label>
            <textarea id="movimientoObservaciones" class="form-control" 
                      rows="3"></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="document.getElementById('formMovimiento').requestSubmit()">
          💾 Guardar
        </button>
        <button class="btn btn-secondary" onclick="cerrarModalMovimiento()">
          Cancelar
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  return modal;
}

/**
 * Cerrar modal de movimiento
 */
function cerrarModalMovimiento() {
  const modal = document.getElementById('modalMovimiento');
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Guardar movimiento de inventario
 */
async function guardarMovimiento(event) {
  event.preventDefault();
  
  const itemId = document.getElementById('movimientoItemId').value;
  const tipo = document.getElementById('movimientoTipo').value;
  const cantidad = parseFloat(document.getElementById('movimientoCantidad').value);
  const observaciones = document.getElementById('movimientoObservaciones').value;
  
  try {
    const endpoint = tipo === 'entrada' ? '/api/inventario/entradas' : '/api/inventario/salidas';
    
    await fetchWithAuth(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        inventario_id: itemId,
        cantidad,
        observaciones: observaciones || null
      })
    });
    
    showToast(`${tipo === 'entrada' ? 'Entrada' : 'Salida'} registrada exitosamente`, 'success');
    cerrarModalMovimiento();
    cargarInventario();
  } catch (error) {
    console.error('Error al guardar movimiento:', error);
  }
}

/**
 * Ver historial de movimientos de un item
 */
async function verMovimientos(itemId) {
  try {
    const data = await fetchWithAuth(`/api/inventario/movimientos?inventario_id=${itemId}`);
    mostrarHistorialMovimientos(data.movimientos);
  } catch (error) {
    console.error('Error al cargar movimientos:', error);
  }
}

/**
 * Mostrar historial de movimientos en modal
 */
function mostrarHistorialMovimientos(movimientos) {
  let modal = document.getElementById('modalHistorial');
  
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalHistorial';
    modal.className = 'modal';
    document.body.appendChild(modal);
  }
  
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 800px;">
      <div class="modal-header">
        <h3>Historial de Movimientos</h3>
        <button class="modal-close" onclick="cerrarHistorialMovimientos()">✕</button>
      </div>
      <div class="modal-body">
        <div class="tabla-container">
          <table class="tabla-movimientos">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Cantidad Anterior</th>
                <th>Cantidad Nueva</th>
                <th>Usuario</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              ${movimientos.length === 0 ? 
                '<tr><td colspan="6" class="text-center text-muted">No hay movimientos registrados</td></tr>' :
                movimientos.map(m => `
                  <tr>
                    <td>${formatDateTime(m.created_at)}</td>
                    <td>
                      <span class="badge badge-${m.tipo_movimiento === 'entrada' ? 'success' : 'warning'}">
                        ${m.tipo_movimiento === 'entrada' ? '➕' : '➖'} ${m.tipo_movimiento}
                      </span>
                    </td>
                    <td>${m.cantidad_anterior}</td>
                    <td>${m.cantidad_nueva}</td>
                    <td>${m.usuario?.nombre || 'N/A'}</td>
                    <td>${m.observaciones || '-'}</td>
                  </tr>
                `).join('')
              }
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="cerrarHistorialMovimientos()">Cerrar</button>
      </div>
    </div>
  `;
  
  modal.style.display = 'flex';
}

/**
 * Cerrar modal de historial
 */
function cerrarHistorialMovimientos() {
  const modal = document.getElementById('modalHistorial');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Cargar inventario al iniciar la página si existe el contenedor
if (document.getElementById('inventarioGrid')) {
  cargarInventario();
}
