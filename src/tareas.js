// Lógica pura de tareas: no toca el DOM, para poder probarla con Vitest.

export function agregarTarea(tareas, texto) {
  const limpio = texto.trim();
  if (!limpio) return tareas;
  return [...tareas, { id: crypto.randomUUID(), texto: limpio, completada: false }];
}

export function alternarCompletada(tareas, id) {
  return tareas.map((t) => (t.id === id ? { ...t, completada: !t.completada } : t));
}

export function editarTarea(tareas, id, texto) {
  const limpio = texto.trim();
  if (!limpio) return tareas;
  return tareas.map((t) => (t.id === id ? { ...t, texto: limpio } : t));
}

export function eliminarTarea(tareas, id) {
  return tareas.filter((t) => t.id !== id);
}

// filtro desconocido = todas, para que un valor inesperado nunca oculte tareas
export function filtrarTareas(tareas, filtro) {
  if (filtro === 'pendientes') return tareas.filter((t) => !t.completada);
  if (filtro === 'completadas') return tareas.filter((t) => t.completada);
  return tareas;
}

const plural = (n, palabra) => `${n} ${palabra}${n === 1 ? '' : 's'}`;

export function resumen(tareas) {
  if (tareas.length === 0) return 'Sin tareas todavía';
  const completadas = tareas.filter((t) => t.completada).length;
  return `${plural(tareas.length - completadas, 'pendiente')} · ${plural(completadas, 'completada')}`;
}
