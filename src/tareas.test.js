import { describe, expect, it } from 'vitest';
import { agregarTarea } from './tareas.js';

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
