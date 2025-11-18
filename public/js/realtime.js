// Conexión en tiempo real con Supabase
// Implementación con Supabase Realtime y fallback a polling

let realtimeChannel = null;
let supabaseClient = null;
let pollingInterval = null;

// Inicializar cliente Supabase para Realtime
async function inicializarClienteSupabase() {
  try {
    // Cargar el SDK de Supabase desde CDN
    if (typeof supabase === 'undefined') {
      console.warn('Supabase SDK no disponible, usando polling como fallback');
      return null;
    }
    
    // Obtener credenciales (en un escenario real, estas se obtendrían de forma segura)
    const SUPABASE_URL = 'https://uegevvbdylinllgyisji.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlZ2V2dmJkeWxpbmxsZ3lpc2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNTYwMTAsImV4cCI6MjA3ODYzMjAxMH0.FiLPJj-AIGZelrF9T5yusWB32wud4gQsxkqg0ZvckLg';
    
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    return supabaseClient;
  } catch (error) {
    console.error('Error al inicializar cliente Supabase:', error);
    return null;
  }
}

// Inicializar conexión en tiempo real
async function inicializarRealtime() {
  const client = await inicializarClienteSupabase();
  
  if (client) {
    console.log('✅ Sistema de tiempo real inicializado (Supabase Realtime)');
    // La suscripción se hará en la función específica suscribirCambiosPedidos
  } else {
    console.log('⚠️ Sistema de tiempo real inicializado (modo polling - fallback)');
    // Recargar datos cada 30 segundos como fallback
    pollingInterval = setInterval(() => {
      if (typeof cargarPedidos === 'function') {
        cargarPedidos();
      }
    }, 30000);
  }
}

// Suscribirse a cambios de pedidos
async function suscribirCambiosPedidos(callback) {
  if (!supabaseClient) {
    console.log('Usando polling como método de actualización');
    return;
  }
  
  try {
    realtimeChannel = supabaseClient
      .channel('pedidos_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pedidos' },
        (payload) => {
          console.log('🔔 Cambio detectado en pedidos:', payload.eventType);
          if (callback) {
            callback(payload);
          }
          // Recargar pedidos cuando hay cambios
          if (typeof cargarPedidos === 'function') {
            cargarPedidos();
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Suscripción a cambios en tiempo real activa');
        }
      });
  } catch (error) {
    console.error('Error al suscribirse a cambios:', error);
  }
}

// Desuscribirse de cambios
function desuscribirse() {
  if (realtimeChannel) {
    realtimeChannel.unsubscribe();
    realtimeChannel = null;
  }
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
}

// Notificación de nuevo pedido
function notificarNuevoPedido(pedido) {
  // Verificar si el navegador soporta notificaciones
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Nuevo Pedido', {
      body: `Pedido ${pedido.numero_pedido} - $${pedido.total}`,
      icon: '/images/logo.png'
    });
  }
  
  // Reproducir sonido (opcional)
  // const audio = new Audio('/sounds/notification.mp3');
  // audio.play();
}

// Solicitar permiso para notificaciones
function solicitarPermisoNotificaciones() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  inicializarRealtime();
  solicitarPermisoNotificaciones();
});

// Limpiar al salir
window.addEventListener('beforeunload', () => {
  desuscribirse();
});
