// Manejo de pedidos

let productos = [];
let itemsSeleccionados = [];

// Cargar productos al inicio
async function cargarProductosParaPedido() {
  try {
    const token = document.cookie.split('token=')[1]?.split(';')[0];
    const response = await fetch('/api/productos?disponible=true', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      productos = data.productos;
      renderProductosParaSeleccionar();
    }
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}

// Renderizar productos para seleccionar
function renderProductosParaSeleccionar() {
  const container = document.getElementById('productosContainer');
  
  if (!container) return;
  
  if (productos.length === 0) {
    container.innerHTML = '<p class="text-muted">No hay productos disponibles</p>';
    return;
  }
  
  container.innerHTML = productos.map(producto => `
    <div class="producto-selector" data-producto-id="${producto.id}" onclick="agregarProducto('${producto.id}')">
      <div style="font-size: 2rem; margin-bottom: 0.5rem;">🍽️</div>
      <h4 style="margin: 0; font-size: 0.9rem;">${producto.nombre}</h4>
      <p style="margin: 0.5rem 0; font-weight: bold; color: #27ae60;">$${parseFloat(producto.precio).toFixed(2)}</p>
    </div>
  `).join('');
}

// Agregar producto a la selección
function agregarProducto(productoId) {
  const producto = productos.find(p => p.id === productoId);
  if (!producto) return;
  
  // Verificar si ya está en la lista
  const existente = itemsSeleccionados.find(i => i.producto_id === productoId);
  
  if (existente) {
    existente.cantidad++;
  } else {
    itemsSeleccionados.push({
      producto_id: productoId,
      nombre: producto.nombre,
      precio_unitario: parseFloat(producto.precio),
      cantidad: 1
    });
  }
  
  actualizarListaItems();
}

// Eliminar producto de la selección
function eliminarItem(productoId) {
  itemsSeleccionados = itemsSeleccionados.filter(i => i.producto_id !== productoId);
  actualizarListaItems();
}

// Cambiar cantidad
function cambiarCantidad(productoId, cantidad) {
  const item = itemsSeleccionados.find(i => i.producto_id === productoId);
  if (item) {
    item.cantidad = Math.max(1, cantidad);
    actualizarListaItems();
  }
}

// Actualizar lista de items seleccionados
function actualizarListaItems() {
  const listaItems = document.getElementById('listaItems');
  const totalEl = document.getElementById('totalPedido');
  
  if (!listaItems || !totalEl) return;
  
  if (itemsSeleccionados.length === 0) {
    listaItems.innerHTML = '<p class="text-muted">No hay items seleccionados</p>';
    totalEl.textContent = '0.00';
    return;
  }
  
  listaItems.innerHTML = itemsSeleccionados.map(item => {
    const subtotal = item.cantidad * item.precio_unitario;
    return `
      <div class="item-seleccionado">
        <div>
          <strong>${item.nombre}</strong>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; align-items: center;">
            <button onclick="cambiarCantidad('${item.producto_id}', ${item.cantidad - 1})" class="btn btn-sm">-</button>
            <span>${item.cantidad}</span>
            <button onclick="cambiarCantidad('${item.producto_id}', ${item.cantidad + 1})" class="btn btn-sm">+</button>
            <span style="margin-left: 0.5rem;">× $${item.precio_unitario.toFixed(2)}</span>
          </div>
        </div>
        <div>
          <div>$${subtotal.toFixed(2)}</div>
          <button onclick="eliminarItem('${item.producto_id}')" class="btn btn-sm btn-error" style="margin-top: 0.5rem;">✕</button>
        </div>
      </div>
    `;
  }).join('');
  
  // Calcular total
  const total = itemsSeleccionados.reduce((sum, item) => sum + (item.cantidad * item.precio_unitario), 0);
  totalEl.textContent = total.toFixed(2);
}

// Manejar envío de formulario
const formCrearPedido = document.getElementById('formCrearPedido');
if (formCrearPedido) {
  formCrearPedido.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (itemsSeleccionados.length === 0) {
      alert('Debes seleccionar al menos un producto');
      return;
    }
    
    const pedidoData = {
      tipo: document.getElementById('tipo').value,
      items: itemsSeleccionados.map(item => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad
      })),
      observaciones: document.getElementById('observaciones').value,
      cliente_nombre: document.getElementById('cliente_nombre').value,
      cliente_telefono: document.getElementById('cliente_telefono').value,
      direccion: document.getElementById('direccion').value,
      numero_externo: document.getElementById('numero_externo').value
    };
    
    try {
      const token = document.cookie.split('token=')[1]?.split(';')[0];
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pedidoData)
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`Pedido creado exitosamente: ${data.pedido.numero_pedido}`);
        window.location.href = '/pedidos/cola';
      } else {
        const error = await response.json();
        alert('Error: ' + (error.error || 'No se pudo crear el pedido'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear pedido');
    }
  });
  
  // Cargar productos al cargar la página
  cargarProductosParaPedido();
}
