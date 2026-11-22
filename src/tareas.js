// Lógica pura de tareas: no toca el DOM, para poder probarla con Vitest.

export function agregarTarea(tareas, texto) {
  const limpio = texto.trim();
  if (!limpio) return tareas;
  return [...tareas, { id: crypto.randomUUID(), texto: limpio, completada: false }];
}
