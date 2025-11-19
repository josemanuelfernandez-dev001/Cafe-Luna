/**
 * Utilidades generales para el frontend
 * Loading spinners, toasts, confirmaciones
 */

// ========== LOADING SPINNER ==========

let loadingCount = 0;

/**
 * Mostrar spinner de carga global
 */
function showLoading(message = 'Cargando...') {
  loadingCount++;
  
  let overlay = document.getElementById('loadingOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p id="loadingMessage">${message}</p>
      </div>
    `;
    document.body.appendChild(overlay);
  } else {
    document.getElementById('loadingMessage').textContent = message;
  }
  
  overlay.style.display = 'flex';
}

/**
 * Ocultar spinner de carga global
 */
function hideLoading() {
  loadingCount = Math.max(0, loadingCount - 1);
  
  if (loadingCount === 0) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }
}

// ========== TOAST NOTIFICATIONS ==========

/**
 * Mostrar notificación toast
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duración en ms (default: 3000)
 */
function showToast(message, type = 'info', duration = 3000) {
  const container = getOrCreateToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }[type] || 'ℹ';
  
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Animación de entrada
  setTimeout(() => toast.classList.add('toast-show'), 10);
  
  // Auto-ocultar
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Obtener o crear contenedor de toasts
 */
function getOrCreateToastContainer() {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

// ========== CONFIRMACIONES ==========

/**
 * Mostrar diálogo de confirmación
 * @param {string} message - Mensaje de confirmación
 * @param {string} confirmText - Texto del botón confirmar
 * @param {string} cancelText - Texto del botón cancelar
 * @returns {Promise<boolean>} - true si confirma, false si cancela
 */
function showConfirmDialog(message, confirmText = 'Confirmar', cancelText = 'Cancelar') {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    
    overlay.innerHTML = `
      <div class="confirm-dialog">
        <div class="confirm-message">${message}</div>
        <div class="confirm-actions">
          <button class="btn btn-secondary confirm-cancel">${cancelText}</button>
          <button class="btn btn-primary confirm-ok">${confirmText}</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    const handleResponse = (confirmed) => {
      overlay.remove();
      resolve(confirmed);
    };
    
    overlay.querySelector('.confirm-ok').addEventListener('click', () => handleResponse(true));
    overlay.querySelector('.confirm-cancel').addEventListener('click', () => handleResponse(false));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) handleResponse(false);
    });
  });
}

// ========== HELPERS ==========

/**
 * Obtener token JWT de las cookies
 */
function getAuthToken() {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'token') {
      return value;
    }
  }
  return null;
}

/**
 * Hacer petición con manejo automático de errores
 * @param {string} url - URL del endpoint
 * @param {object} options - Opciones de fetch
 * @param {boolean} showLoadingSpinner - Mostrar spinner (default: true)
 * @returns {Promise<any>} - Respuesta parseada
 */
async function fetchWithAuth(url, options = {}, showLoadingSpinner = true) {
  const token = getAuthToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };
  
  if (showLoadingSpinner) showLoading();
  
  try {
    const response = await fetch(url, mergedOptions);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
      throw new Error(error.error || `Error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    showToast(error.message || 'Error en la petición', 'error');
    throw error;
  } finally {
    if (showLoadingSpinner) hideLoading();
  }
}

/**
 * Formatear fecha a formato local
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Formatear fecha y hora
 */
function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formatear moneda
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
}

// ========== ESTILOS CSS (inyectar en el documento) ==========

if (!document.getElementById('utils-styles')) {
  const style = document.createElement('style');
  style.id = 'utils-styles';
  style.textContent = `
    /* Loading Overlay */
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    
    .loading-spinner {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      min-width: 200px;
    }
    
    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #8B4513;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    #loadingMessage {
      margin: 0;
      color: #333;
      font-size: 14px;
    }
    
    /* Toast Notifications */
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9998;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 250px;
      max-width: 400px;
      transform: translateX(400px);
      transition: transform 0.3s ease;
    }
    
    .toast-show {
      transform: translateX(0);
    }
    
    .toast-icon {
      font-size: 20px;
      font-weight: bold;
    }
    
    .toast-success {
      border-left: 4px solid #27ae60;
    }
    
    .toast-success .toast-icon {
      color: #27ae60;
    }
    
    .toast-error {
      border-left: 4px solid #e74c3c;
    }
    
    .toast-error .toast-icon {
      color: #e74c3c;
    }
    
    .toast-warning {
      border-left: 4px solid #f39c12;
    }
    
    .toast-warning .toast-icon {
      color: #f39c12;
    }
    
    .toast-info {
      border-left: 4px solid #3498db;
    }
    
    .toast-info .toast-icon {
      color: #3498db;
    }
    
    .toast-message {
      flex: 1;
      color: #333;
      font-size: 14px;
    }
    
    /* Confirm Dialog */
    .confirm-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    
    .confirm-dialog {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      max-width: 400px;
      width: 90%;
    }
    
    .confirm-message {
      margin-bottom: 1.5rem;
      font-size: 16px;
      color: #333;
      text-align: center;
    }
    
    .confirm-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }
  `;
  document.head.appendChild(style);
}
