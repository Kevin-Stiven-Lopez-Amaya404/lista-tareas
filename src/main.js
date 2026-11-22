import './estilos.css';
import { agregarTarea, alternarCompletada, resumen } from './tareas.js';

let tareas = [];

const form = document.querySelector('#form-tarea');
const input = document.querySelector('#nueva-tarea');
const boton = form.querySelector('button[type="submit"]');
const lista = document.querySelector('#lista-tareas');
const textoResumen = document.querySelector('#resumen');
const estadoVacio = document.querySelector('#estado-vacio');

function actualizarBoton() {
  boton.disabled = input.value.trim() === '';
}

function render() {
  textoResumen.textContent = resumen(tareas);
  estadoVacio.hidden = tareas.length > 0;
  lista.hidden = tareas.length === 0;
  lista.replaceChildren(
    ...tareas.map((tarea) => {
      const li = document.createElement('li');
      li.className = tarea.completada ? 'tarea completada' : 'tarea';
      li.dataset.id = tarea.id;

      const etiqueta = document.createElement('label');
      etiqueta.className = 'tarea-cuerpo';

      const casilla = document.createElement('input');
      casilla.type = 'checkbox';
      casilla.className = 'tarea-check';
      casilla.checked = tarea.completada;

      const texto = document.createElement('span');
      texto.className = 'tarea-texto';
      texto.textContent = tarea.texto;

      etiqueta.append(casilla, texto);
      li.append(etiqueta);
      return li;
    }),
  );
}

lista.addEventListener('change', (evento) => {
  if (!evento.target.matches('.tarea-check')) return;
  const id = evento.target.closest('.tarea').dataset.id;
  tareas = alternarCompletada(tareas, id);
  render();
  // render() recrea la lista: devolver el foco a la misma casilla para el uso con teclado
  lista.querySelector(`[data-id="${id}"] .tarea-check`).focus();
});

input.addEventListener('input', actualizarBoton);

form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  tareas = agregarTarea(tareas, input.value);
  input.value = '';
  actualizarBoton();
  input.focus();
  render();
});

actualizarBoton();
render();
