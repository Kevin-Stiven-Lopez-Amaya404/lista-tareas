# Lista de Tareas

App web para anotar tareas: crearlas, marcarlas como completadas, editarlas y eliminarlas. Se guardan en el navegador, así que siguen ahí al volver. Funciona en celular y escritorio, con mouse y con teclado.

Versión actual: ver [Releases](https://github.com/Kevin-Stiven-Lopez-Amaya404/lista-tareas/releases) · [Historial de entregas](https://github.com/Kevin-Stiven-Lopez-Amaya404/docs-lista-tareas/blob/main/CHANGELOG.md) · [Diseño en Figma](https://www.figma.com/design/Gx9t5vMuidiEKMKpi1lfhV)

## Desarrollo

Vite + JavaScript, sin framework. Pruebas con Vitest. Requiere Node 24.

```
npm install      # primera vez
npm run dev      # servidor local
npm test         # pruebas
npm run build    # build de producción (dist/)
```

El CI (GitHub Actions) corre pruebas y build en cada PR a `dev` y `main`.

| Archivo | Qué contiene |
|---|---|
| `src/tareas.js` | Lógica pura de la lista (agregar, completar, editar, eliminar, resumen) |
| `src/almacenamiento.js` | Guardar y cargar en `localStorage`, validando lo guardado |
| `src/main.js` | Interfaz: dibuja la lista y maneja eventos, foco y edición |
| `src/estilos.css` | Estilos con los tokens de Figma como variables CSS |
| `src/*.test.js` | Pruebas de la lógica y del almacenamiento |

## Flujo de trabajo

```
dev ──► huN ──(PR huN → dev)──► dev ──(PR "Release", solo cuando se decide)──► main
```

- `main`: producción. Solo recibe PR de `dev` cuando se decide una entrega. Protegida.
- `dev`: integración y pruebas.
- `huN` (`hu4`, `hu5`…): una rama por historia de usuario, sale de `dev` con todo el trabajo de esa HU y vuelve a `dev` con un solo PR cuando está terminada y probada (CI en verde). La rama se conserva como historial.
- Tareas que no son una HU (configuración, mantenimiento): `chore/descripcion`.

Commits con el número de la HU: `HU-04: descripción`. Cada PR usa la plantilla `.github/pull_request_template.md`.

**Entregas:** PR `dev → main` "Release: vX.Y.Z", etiqueta `vX.Y.Z` y Release en GitHub, y `dev` se pone al día con `main`. La documentación se entrega a la vez.

Tablero del proyecto: https://kevin-stiven-lopez-amaya404.github.io/docs-lista-tareas/ ([repo](https://github.com/Kevin-Stiven-Lopez-Amaya404/docs-lista-tareas))
