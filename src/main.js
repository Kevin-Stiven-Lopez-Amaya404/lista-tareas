import './estilos.css';
import { agregarTarea } from './tareas.js';

let tareas = [];

const form = document.querySelector('#form-tarea');
const input = document.querySelector('#nueva-tarea');
const boton = form.querySelector('button[type="submit"]');
const lista = document.querySelector('#lista-tareas');

function actualizarBoton() {
  boton.disabled = input.value.trim() === '';
}

function render() {
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
