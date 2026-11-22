// Lógica pura de tareas: no toca el DOM, para poder probarla con Vitest.

export function agregarTarea(tareas, texto) {
  const limpio = texto.trim();
  if (!limpio) return tareas;
  return [...tareas, { id: crypto.randomUUID(), texto: limpio, completada: false }];
}

export function alternarCompletada(tareas, id) {
  return tareas.map((t) => (t.id === id ? { ...t, completada: !t.completada } : t));
}

const plural = (n, palabra) => `${n} ${palabra}${n === 1 ? '' : 's'}`;

export function resumen(tareas) {
  if (tareas.length === 0) return 'Sin tareas todavía';
  const completadas = tareas.filter((t) => t.completada).length;
  return `${plural(tareas.length - completadas, 'pendiente')} · ${plural(completadas, 'completada')}`;
}
