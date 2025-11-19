/**
 * Funciones para gestión de usuarios
 */

let usuarios = [];

/**
 * Cargar lista de usuarios
 */
async function cargarUsuarios() {
  try {
    const data = await fetchWithAuth('/api/usuarios', {}, false);
    usuarios = data.usuarios;
    renderUsuarios();
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
  }
}

/**
 * Renderizar tabla de usuarios
 */
function renderUsuarios() {
  const container = document.getElementById('usuariosTable');
  
  if (!container) return;
  
  if (usuarios.length === 0) {
    container.innerHTML = '<p class="text-muted">No hay usuarios</p>';
    return;
  }
  
  container.innerHTML = `
    <table class="tabla-usuarios">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Fecha Creación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${usuarios.map(usuario => `
          <tr>
            <td>${usuario.nombre}</td>
            <td>${usuario.email}</td>
            <td><span class="badge badge-${usuario.rol}">${formatearRol(usuario.rol)}</span></td>
            <td>
              <span class="badge ${usuario.activo ? 'badge-success' : 'badge-error'}">
                ${usuario.activo ? '✓ Activo' : '✕ Inactivo'}
              </span>
            </td>
            <td>${formatDate(usuario.created_at)}</td>
            <td>
              <button class="btn btn-sm btn-secondary" 
                      onclick="mostrarModalEditar('${usuario.id}')">
                ✏️ Editar
              </button>
              <button class="btn btn-sm btn-${usuario.activo ? 'warning' : 'success'}" 
                      onclick="toggleActivo('${usuario.id}', ${!usuario.activo})">
                ${usuario.activo ? '🚫 Desactivar' : '✅ Activar'}
              </button>
              <button class="btn btn-sm btn-info" 
                      onclick="mostrarModalPassword('${usuario.id}')">
                🔑 Password
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/**
 * Formatear rol a texto legible
 */
function formatearRol(rol) {
  const roles = {
    'admin': 'Administrador',
    'barista': 'Barista',
    'cocina': 'Cocina',
    'mesero': 'Mesero'
  };
  return roles[rol] || rol;
}

/**
 * Mostrar modal para crear nuevo usuario
 */
function mostrarFormNuevo() {
  const modal = document.getElementById('modalUsuario') || crearModalUsuario();
  
  document.getElementById('usuarioTitulo').textContent = 'Nuevo Usuario';
  document.getElementById('usuarioId').value = '';
  document.getElementById('nombre').value = '';
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
  document.getElementById('passwordGroup').style.display = 'block';
  document.getElementById('rol').value = 'barista';
  document.getElementById('activo').value = 'true';
  
  modal.style.display = 'flex';
}

/**
 * Mostrar modal para editar usuario
 */
function mostrarModalEditar(id) {
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) return;
  
  const modal = document.getElementById('modalUsuario') || crearModalUsuario();
  
  document.getElementById('usuarioTitulo').textContent = 'Editar Usuario';
  document.getElementById('usuarioId').value = usuario.id;
  document.getElementById('nombre').value = usuario.nombre;
  document.getElementById('email').value = usuario.email;
  document.getElementById('passwordGroup').style.display = 'none';
  document.getElementById('rol').value = usuario.rol;
  document.getElementById('activo').value = usuario.activo.toString();
  
  modal.style.display = 'flex';
}

/**
 * Crear modal de usuario si no existe
 */
function crearModalUsuario() {
  const modal = document.createElement('div');
  modal.id = 'modalUsuario';
  modal.className = 'modal';
  modal.style.display = 'none';
  
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3 id="usuarioTitulo">Usuario</h3>
        <button class="modal-close" onclick="cerrarModal()">✕</button>
      </div>
      <div class="modal-body">
        <form id="formUsuario" onsubmit="guardarUsuario(event)">
          <input type="hidden" id="usuarioId">
          
          <div class="form-group">
            <label for="nombre">Nombre *</label>
            <input type="text" id="nombre" class="form-control" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" class="form-control" required>
          </div>
          
          <div class="form-group" id="passwordGroup">
            <label for="password">Contraseña *</label>
            <input type="password" id="password" class="form-control" minlength="6" required>
          </div>
          
          <div class="form-group">
            <label for="rol">Rol *</label>
            <select id="rol" class="form-control" required>
              <option value="barista">Barista</option>
              <option value="cocina">Cocina</option>
              <option value="mesero">Mesero</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="activo">Estado</label>
            <select id="activo" class="form-control">
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="document.getElementById('formUsuario').requestSubmit()">
          💾 Guardar
        </button>
        <button class="btn btn-secondary" onclick="cerrarModal()">
          Cancelar
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  return modal;
}

/**
 * Cerrar modal de usuario
 */
function cerrarModal() {
  const modal = document.getElementById('modalUsuario');
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Guardar usuario (crear o actualizar)
 */
async function guardarUsuario(event) {
  event.preventDefault();
  
  const id = document.getElementById('usuarioId').value;
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const rol = document.getElementById('rol').value;
  const activo = document.getElementById('activo').value === 'true';
  
  const isEdit = !!id;
  
  try {
    const formData = { nombre, email, rol, activo };
    
    if (!isEdit) {
      formData.password = password;
    }
    
    await fetchWithAuth(
      isEdit ? `/api/usuarios/${id}` : '/api/usuarios',
      {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(formData)
      }
    );
    
    showToast(`Usuario ${isEdit ? 'actualizado' : 'creado'} exitosamente`, 'success');
    cerrarModal();
    cargarUsuarios();
  } catch (error) {
    console.error('Error al guardar usuario:', error);
  }
}

/**
 * Toggle estado activo/inactivo
 */
async function toggleActivo(id, activo) {
  const mensaje = activo ? 
    '¿Estás seguro de activar este usuario?' : 
    '¿Estás seguro de desactivar este usuario?';
  
  const confirmed = await showConfirmDialog(mensaje);
  
  if (!confirmed) return;
  
  try {
    await fetchWithAuth(`/api/usuarios/${id}/desactivar`, {
      method: 'PATCH',
      body: JSON.stringify({ activo })
    });
    
    showToast(`Usuario ${activo ? 'activado' : 'desactivado'} exitosamente`, 'success');
    cargarUsuarios();
  } catch (error) {
    console.error('Error al cambiar estado:', error);
  }
}

/**
 * Mostrar modal para cambiar contraseña
 */
function mostrarModalPassword(id) {
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) return;
  
  let modal = document.getElementById('modalPassword');
  
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalPassword';
    modal.className = 'modal';
    document.body.appendChild(modal);
  }
  
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Cambiar Contraseña - ${usuario.nombre}</h3>
        <button class="modal-close" onclick="cerrarModalPassword()">✕</button>
      </div>
      <div class="modal-body">
        <form id="formPassword" onsubmit="cambiarPassword(event, '${id}')">
          <div class="form-group">
            <label for="newPassword">Nueva Contraseña *</label>
            <input type="password" id="newPassword" class="form-control" 
                   minlength="6" required>
            <small class="form-text">Mínimo 6 caracteres</small>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirmar Contraseña *</label>
            <input type="password" id="confirmPassword" class="form-control" 
                   minlength="6" required>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="document.getElementById('formPassword').requestSubmit()">
          🔑 Cambiar Contraseña
        </button>
        <button class="btn btn-secondary" onclick="cerrarModalPassword()">
          Cancelar
        </button>
      </div>
    </div>
  `;
  
  modal.style.display = 'flex';
}

/**
 * Cerrar modal de password
 */
function cerrarModalPassword() {
  const modal = document.getElementById('modalPassword');
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Cambiar contraseña de usuario
 */
async function cambiarPassword(event, id) {
  event.preventDefault();
  
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  if (newPassword !== confirmPassword) {
    showToast('Las contraseñas no coinciden', 'error');
    return;
  }
  
  try {
    await fetchWithAuth(`/api/usuarios/${id}/password`, {
      method: 'PATCH',
      body: JSON.stringify({ password: newPassword })
    });
    
    showToast('Contraseña actualizada exitosamente', 'success');
    cerrarModalPassword();
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
  }
}

// Cargar usuarios al iniciar la página si existe el contenedor
if (document.getElementById('usuariosTable')) {
  cargarUsuarios();
}
