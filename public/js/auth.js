// Manejo de autenticación

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Login exitoso
        window.location.href = '/dashboard';
      } else {
        // Error en login
        errorMessage.textContent = data.error || 'Error al iniciar sesión';
        errorMessage.style.display = 'block';
      }
    } catch (error) {
      console.error('Error:', error);
      errorMessage.textContent = 'Error de conexión. Intenta de nuevo.';
      errorMessage.style.display = 'block';
    }
  });
}

// Logout
const btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
  btnLogout.addEventListener('click', async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      });
      
      if (response.ok) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Redirigir de todas formas
      window.location.href = '/login';
    }
  });
}

// Verificar sesión en páginas protegidas
async function verificarSesion() {
  try {
    const response = await fetch('/api/auth/verificar');
    if (!response.ok) {
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Error al verificar sesión:', error);
  }
}

// Verificar sesión si estamos en una página protegida
if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
  // No verificar para evitar loops, el servidor maneja la autorización
}
