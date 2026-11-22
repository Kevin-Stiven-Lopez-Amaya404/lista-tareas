import './estilos.css';
import { agregarTarea, resumen } from './tareas.js';

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
      li.className = 'tarea';
      li.textContent = tarea.texto;
      return li;
    }),
  );
}

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
