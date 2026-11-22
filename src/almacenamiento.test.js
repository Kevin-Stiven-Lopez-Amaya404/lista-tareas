import { describe, expect, it } from 'vitest';
import { cargarTareas, guardarTareas } from './almacenamiento.js';

function almacenFalso(inicial = {}) {
  const datos = new Map(Object.entries(inicial));
  return {
    getItem: (k) => (datos.has(k) ? datos.get(k) : null),
    setItem: (k, v) => datos.set(k, String(v)),
  };
}

const CLAVE = 'lista-tareas:v1';
const tareas = [
  { id: 'a', texto: 'Comprar leche', completada: false },
  { id: 'b', texto: 'Pagar el arriendo', completada: true },
];

describe('almacenamiento (HU-06)', () => {
  it('guarda y vuelve a cargar las tareas con su estado', () => {
    const almacen = almacenFalso();
    expect(guardarTareas(tareas, almacen)).toBe(true);
    expect(cargarTareas(almacen)).toEqual(tareas);
  });

  it('sin datos guardados empieza con la lista vacía', () => {
    expect(cargarTareas(almacenFalso())).toEqual([]);
  });

  it('con datos dañados o que no son una lista empieza vacía', () => {
    expect(cargarTareas(almacenFalso({ [CLAVE]: '{no es json' }))).toEqual([]);
    expect(cargarTareas(almacenFalso({ [CLAVE]: '{"id":"a"}' }))).toEqual([]);
  });

  it('descarta las tareas inválidas y conserva las válidas', () => {
    const guardado = JSON.stringify([
      tareas[0],
      null,
      { id: 1, texto: 'id numérico', completada: false },
      { id: 'c', texto: '   ', completada: false },
      { id: 'd', texto: 'sin estado' },
      { ...tareas[1], extra: '<script>' },
    ]);
    expect(cargarTareas(almacenFalso({ [CLAVE]: guardado }))).toEqual(tareas);
  });

  it('si el navegador bloquea el almacenamiento, no falla', () => {
    const bloqueado = {
      getItem: () => { throw new Error('SecurityError'); },
      setItem: () => { throw new Error('QuotaExceededError'); },
    };
    expect(cargarTareas(bloqueado)).toEqual([]);
    expect(guardarTareas(tareas, bloqueado)).toBe(false);
  });
});
