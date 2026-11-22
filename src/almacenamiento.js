// Guarda y carga las tareas en localStorage. Lo guardado se trata como no confiable:
// cualquier error o dato inválido deja la app funcionando con lo que sí sirve.

const CLAVE = 'lista-tareas:v1';

const esTareaValida = (t) =>
  t !== null &&
  typeof t === 'object' &&
  typeof t.id === 'string' &&
  typeof t.texto === 'string' &&
  t.texto.trim() !== '' &&
  typeof t.completada === 'boolean';

// `almacen` permite probar sin navegador; el acceso a localStorage va dentro del try
// porque algunos navegadores lanzan error al tocarlo si el almacenamiento está bloqueado.
export function cargarTareas(almacen) {
  try {
    const datos = JSON.parse((almacen ?? localStorage).getItem(CLAVE) ?? '[]');
    return Array.isArray(datos)
      ? datos.filter(esTareaValida).map(({ id, texto, completada }) => ({ id, texto, completada }))
      : [];
  } catch {
    return [];
  }
}

export function guardarTareas(tareas, almacen) {
  try {
    (almacen ?? localStorage).setItem(CLAVE, JSON.stringify(tareas));
    return true;
  } catch {
    return false; // sin espacio o bloqueado: la app sigue funcionando en memoria
  }
}
