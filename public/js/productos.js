// Manejo de productos (opcional, funcionalidad adicional)

// Función para editar producto
async function editarProducto(id) {
  // Por ahora solo mostramos un alert
  alert('Funcionalidad de edición en desarrollo. ID: ' + id);
}

// Función para previsualizar imagen
const imagenUrlInput = document.getElementById('imagen_url');
if (imagenUrlInput) {
  imagenUrlInput.addEventListener('input', (e) => {
    const url = e.target.value;
    // Aquí se podría agregar una previsualización de la imagen
  });
}
