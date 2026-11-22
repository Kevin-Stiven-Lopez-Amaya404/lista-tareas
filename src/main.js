import './estilos.css';
import iconoEditar from './assets/icon-editar.svg';
import iconoEliminar from './assets/icon-eliminar.svg';
import {
  agregarTarea,
  alternarCompletada,
  borrarCompletadas,
  editarTarea,
  eliminarTarea,
  filtrarTareas,
  resumen,
} from './tareas.js';
import { cargarTareas, guardarTareas } from './almacenamiento.js';

let tareas = cargarTareas();

// único punto donde cambia la lista: así cada cambio queda guardado
function actualizar(nuevas) {
  tareas = nuevas;
  guardarTareas(tareas);
}
let editandoId = null; // solo una tarea en edición a la vez
let filtro = 'todas';

const MENSAJE_SIN_RESULTADOS = {
  pendientes: 'No hay tareas pendientes.',
  completadas: 'No hay tareas completadas.',
};

const form = document.querySelector('#form-tarea');
const input = document.querySelector('#nueva-tarea');
const boton = form.querySelector('button[type="submit"]');
const lista = document.querySelector('#lista-tareas');
const textoResumen = document.querySelector('#resumen');
const estadoVacio = document.querySelector('#estado-vacio');
const barraLista = document.querySelector('#barra-lista');
const filtros = document.querySelector('#filtros');
const botonBorrarCompletadas = document.querySelector('#borrar-completadas');
const sinResultados = document.querySelector('#sin-resultados');

function actualizarBoton() {
  boton.disabled = input.value.trim() === '';
}

function crearElemento(etiqueta, clase, texto) {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto) el.textContent = texto;
  return el;
}

function crearFormEdicion(tarea) {
  const formEdicion = crearElemento('form', 'tarea-edicion');

  const campo = crearElemento('input', 'tarea-edicion-campo');
  campo.type = 'text';
  campo.value = tarea.texto;
  campo.autocomplete = 'off';
  campo.setAttribute('aria-label', 'Texto de la tarea');

  const cancelar = crearElemento('button', 'boton boton-secundario tarea-cancelar', 'Cancelar');
  cancelar.type = 'button';
  const guardar = crearElemento('button', 'boton boton-primario', 'Guardar');
  guardar.type = 'submit';

  const acciones = crearElemento('div', 'tarea-edicion-acciones');
  acciones.append(cancelar, guardar);
  formEdicion.append(campo, acciones);
  return formEdicion;
}

function crearItem(tarea) {
  const li = crearElemento('li');
  li.dataset.id = tarea.id;

  if (tarea.id === editandoId) {
    li.className = 'tarea editando';
    li.append(crearFormEdicion(tarea));
    return li;
  }

  li.className = tarea.completada ? 'tarea completada' : 'tarea';

  const etiqueta = crearElemento('label', 'tarea-cuerpo');
  const casilla = crearElemento('input', 'tarea-check');
  casilla.type = 'checkbox';
  casilla.checked = tarea.completada;
  etiqueta.append(casilla, crearElemento('span', 'tarea-texto', tarea.texto));

  li.append(
    etiqueta,
    crearBotonIcono('tarea-editar', iconoEditar, `Editar tarea: ${tarea.texto}`),
    crearBotonIcono('tarea-eliminar', iconoEliminar, `Eliminar tarea: ${tarea.texto}`),
  );
  return li;
}

function crearBotonIcono(clase, src, etiqueta) {
  const boton = crearElemento('button', `boton-icono ${clase}`);
  boton.type = 'button';
  boton.setAttribute('aria-label', etiqueta);
  const icono = crearElemento('img');
  icono.src = src;
  icono.alt = '';
  icono.width = 20;
  icono.height = 20;
  boton.append(icono);
  return boton;
}

const visibles = () => filtrarTareas(tareas, filtro);

function render() {
  const mostradas = visibles();
  textoResumen.textContent = resumen(tareas);
  estadoVacio.hidden = tareas.length > 0;
  barraLista.hidden = tareas.length === 0;
  const completadas = tareas.filter((t) => t.completada).length;
  botonBorrarCompletadas.hidden = completadas === 0;
  botonBorrarCompletadas.textContent = `Borrar completadas (${completadas})`;
  for (const b of filtros.querySelectorAll('.filtro')) {
    b.setAttribute('aria-pressed', String(b.dataset.filtro === filtro));
  }
  lista.hidden = mostradas.length === 0;
  sinResultados.hidden = tareas.length === 0 || mostradas.length > 0;
  sinResultados.textContent = MENSAJE_SIN_RESULTADOS[filtro] ?? '';
  lista.replaceChildren(...mostradas.map(crearItem));
}

// tras un cambio que puede sacar la tarea de la vista: foco a la que ocupa su lugar, la anterior o `alternativa`
function enfocarCerca(id, posicion, selector, alternativa) {
  const ahora = visibles();
  if (ahora.some((t) => t.id === id)) return enfocar(id, selector);
  const cercana = ahora[posicion] ?? ahora[posicion - 1];
  if (cercana) enfocar(cercana.id, selector);
  else alternativa.focus();
}

const filtroActivo = () => filtros.querySelector('[aria-pressed="true"]');

// render() recrea la lista: con esto el foco vuelve al mismo control para el uso con teclado
function enfocar(id, selector) {
  lista.querySelector(`[data-id="${id}"] ${selector}`)?.focus();
}

function terminarEdicion(id) {
  editandoId = null;
  render();
  enfocar(id, '.tarea-editar');
}

lista.addEventListener('change', (evento) => {
  if (!evento.target.matches('.tarea-check')) return;
  const id = evento.target.closest('.tarea').dataset.id;
  const posicion = visibles().findIndex((t) => t.id === id);
  actualizar(alternarCompletada(tareas, id));
  render();
  enfocarCerca(id, posicion, '.tarea-check', filtroActivo());
});

lista.addEventListener('click', (evento) => {
  const item = evento.target.closest('.tarea');
  if (!item) return;
  if (evento.target.closest('.tarea-editar')) {
    editandoId = item.dataset.id;
    render();
    const campo = lista.querySelector('.tarea-edicion-campo');
    campo.focus();
    campo.select();
  } else if (evento.target.closest('.tarea-cancelar')) {
    terminarEdicion(item.dataset.id);
  } else if (evento.target.closest('.tarea-eliminar')) {
    eliminar(item.dataset.id);
  }
});

function eliminar(id) {
  const posicion = visibles().findIndex((t) => t.id === id);
  actualizar(eliminarTarea(tareas, id));
  render();
  // el foco no se pierde: a la tarea que ocupa su lugar, a la anterior, al filtro activo o al campo nuevo
  enfocarCerca(id, posicion, '.tarea-eliminar', tareas.length > 0 ? filtroActivo() : input);
}

botonBorrarCompletadas.addEventListener('click', () => {
  actualizar(borrarCompletadas(tareas));
  render();
  // el botón desaparece: el foco va al filtro activo o, si no quedan tareas, al campo de nueva tarea
  (tareas.length > 0 ? filtroActivo() : input).focus();
});

filtros.addEventListener('click', (evento) => {
  const opcion = evento.target.closest('.filtro');
  if (!opcion) return;
  filtro = opcion.dataset.filtro;
  render();
});

lista.addEventListener('input', (evento) => {
  if (!evento.target.matches('.tarea-edicion-campo')) return;
  evento.target.form.querySelector('[type="submit"]').disabled = evento.target.value.trim() === '';
});

lista.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && evento.target.closest('.tarea-edicion')) {
    terminarEdicion(evento.target.closest('.tarea').dataset.id);
  }
});

lista.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const id = evento.target.closest('.tarea').dataset.id;
  actualizar(editarTarea(tareas, id, evento.target.querySelector('.tarea-edicion-campo').value));
  terminarEdicion(id);
});

input.addEventListener('input', actualizarBoton);

form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  actualizar(agregarTarea(tareas, input.value));
  if (filtro === 'completadas') filtro = 'todas'; // la nueva es pendiente: que se vea
  input.value = '';
  actualizarBoton();
  input.focus();
  render();
});

actualizarBoton();
render();
