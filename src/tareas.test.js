import { describe, expect, it } from 'vitest';
import { agregarTarea, alternarCompletada, editarTarea, eliminarTarea, resumen } from './tareas.js';

describe('eliminarTarea (HU-05)', () => {
  const base = [
    { id: 'a', texto: 'Uno', completada: false },
    { id: 'b', texto: 'Dos', completada: true },
    { id: 'c', texto: 'Tres', completada: false },
  ];

  it('quita solo la tarea indicada y mantiene el orden', () => {
    expect(eliminarTarea(base, 'b').map((t) => t.id)).toEqual(['a', 'c']);
  });

  it('actualiza el resumen y llega al estado vacío', () => {
    expect(resumen(eliminarTarea(base, 'b'))).toBe('2 pendientes · 0 completadas');
    expect(resumen(eliminarTarea([base[0]], 'a'))).toBe('Sin tareas todavía');
  });

  it('no modifica la lista original', () => {
    eliminarTarea(base, 'a');
    expect(base).toHaveLength(3);
  });
});

describe('editarTarea (HU-04)', () => {
  const base = [
    { id: 'a', texto: 'Comprar leche', completada: true },
    { id: 'b', texto: 'Estudiar', completada: false },
  ];

  it('cambia el texto de la tarea indicada, sin espacios sobrantes', () => {
    const lista = editarTarea(base, 'b', '  Estudiar para el parcial ');
    expect(lista[1].texto).toBe('Estudiar para el parcial');
    expect(lista[0]).toBe(base[0]);
  });

  it('conserva el estado completada', () => {
    expect(editarTarea(base, 'a', 'Comprar pan')[0]).toMatchObject({ texto: 'Comprar pan', completada: true });
  });

  it('ignora texto vacío o solo con espacios', () => {
    expect(editarTarea(base, 'a', '')).toBe(base);
    expect(editarTarea(base, 'a', '   ')).toBe(base);
  });

  it('no modifica la lista original', () => {
    editarTarea(base, 'b', 'Otro');
    expect(base[1].texto).toBe('Estudiar');
  });
});

describe('alternarCompletada (HU-03)', () => {
  const base = [
    { id: 'a', texto: 'Uno', completada: false },
    { id: 'b', texto: 'Dos', completada: false },
  ];

  it('marca como completada solo la tarea indicada', () => {
    const lista = alternarCompletada(base, 'b');
    expect(lista.map((t) => t.completada)).toEqual([false, true]);
  });

  it('al alternar de nuevo vuelve a pendiente', () => {
    expect(alternarCompletada(alternarCompletada(base, 'a'), 'a')[0].completada).toBe(false);
  });

  it('no modifica la lista original', () => {
    alternarCompletada(base, 'a');
    expect(base[0].completada).toBe(false);
  });

  it('actualiza el resumen', () => {
    expect(resumen(alternarCompletada(base, 'a'))).toBe('1 pendiente · 1 completada');
  });
});

describe('resumen (HU-02)', () => {
  const t = (completada) => ({ id: 'x', texto: 'x', completada });

  it('sin tareas muestra el texto del estado vacío', () => {
    expect(resumen([])).toBe('Sin tareas todavía');
  });

  it('cuenta pendientes y completadas con plural', () => {
    expect(resumen([t(false), t(false), t(false), t(true)])).toBe('3 pendientes · 1 completada');
  });

  it('usa singular y cero correctamente', () => {
    expect(resumen([t(false)])).toBe('1 pendiente · 0 completadas');
    expect(resumen([t(true), t(true)])).toBe('0 pendientes · 2 completadas');
  });
});

describe('agregarTarea (HU-01)', () => {
  it('agrega una tarea pendiente al final de la lista', () => {
    const lista = agregarTarea([], 'Comprar leche');
    expect(lista).toHaveLength(1);
    expect(lista[0]).toMatchObject({ texto: 'Comprar leche', completada: false });
    expect(lista[0].id).toBeTruthy();
  });

  it('quita los espacios al inicio y al final', () => {
    expect(agregarTarea([], '   Llamar al médico  ')[0].texto).toBe('Llamar al médico');
  });

  it('ignora texto vacío o solo con espacios', () => {
    const lista = [];
    expect(agregarTarea(lista, '')).toBe(lista);
    expect(agregarTarea(lista, '   ')).toBe(lista);
  });

  it('no modifica la lista original y mantiene el orden', () => {
    const original = agregarTarea([], 'Primera');
    const nueva = agregarTarea(original, 'Segunda');
    expect(original).toHaveLength(1);
    expect(nueva.map((t) => t.texto)).toEqual(['Primera', 'Segunda']);
  });
});
