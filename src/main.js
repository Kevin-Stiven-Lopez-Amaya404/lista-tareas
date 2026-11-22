import './estilos.css';
import iconoEditar from './assets/icon-editar.svg';
import iconoEliminar from './assets/icon-eliminar.svg';
import { agregarTarea, alternarCompletada, editarTarea, eliminarTarea, resumen } from './tareas.js';
import { cargarTareas, guardarTareas } from './almacenamiento.js';

let tareas = cargarTareas();

// único punto donde cambia la lista: así cada cambio queda guardado
function actualizar(nuevas) {
  tareas = nuevas;
  guardarTareas(tareas);
}
let editandoId = null; // solo una tarea en edición a la vez

const form = document.querySelector('#form-tarea');
const input = document.querySelector('#nueva-tarea');
const boton = form.querySelector('button[type="submit"]');
const lista = document.querySelector('#lista-tareas');
const textoResumen = document.querySelector('#resumen');
const estadoVacio = document.querySelector('#estado-vacio');

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

function render() {
  textoResumen.textContent = resumen(tareas);
  estadoVacio.hidden = tareas.length > 0;
  lista.hidden = tareas.length === 0;
  lista.replaceChildren(...tareas.map(crearItem));
}

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
  actualizar(alternarCompletada(tareas, id));
  render();
  enfocar(id, '.tarea-check');
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
  const posicion = tareas.findIndex((t) => t.id === id);
  actualizar(eliminarTarea(tareas, id));
  render();
  // el foco no se pierde: pasa a la tarea que ocupa su lugar, a la anterior o al campo de nueva tarea
  const siguiente = tareas[posicion] ?? tareas[posicion - 1];
  if (siguiente) enfocar(siguiente.id, '.tarea-eliminar');
  else input.focus();
}

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
  input.value = '';
  actualizarBoton();
  input.focus();
  render();
});

actualizarBoton();
render();
