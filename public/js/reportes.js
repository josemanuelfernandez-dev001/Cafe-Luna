// Funcionalidad para reportes (opcional, puede extenderse)

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
  // Implementación básica de conversión a CSV
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
