# Lista de Tareas

App web con Vite + JavaScript. Pruebas con Vitest.

```
npm install      # primera vez
npm run dev      # servidor local
npm test         # pruebas
npm run build    # build de producción (dist/)
```

El CI (GitHub Actions) corre pruebas y build en cada PR a `dev` y `main`.

## Flujo de trabajo

```
dev ──► huN ──(PR huN → dev)──► dev ──(PR "Release", solo cuando se decide)──► main
```

- `main`: producción. Solo recibe PR de `dev` cuando se decide una entrega. Protegida.
- `dev`: integración y pruebas.
- `huN` (`hu4`, `hu5`…): una rama por historia de usuario, sale de `dev` con todo el trabajo de esa HU y vuelve a `dev` con un solo PR cuando está terminada y probada (CI en verde). La rama se conserva como historial.
- Tareas que no son una HU (configuración, mantenimiento): `chore/descripcion`.

Commits con el número de la HU: `HU-04: descripción`.

Tablero del proyecto: https://kevin-stiven-lopez-amaya404.github.io/docs-lista-tareas/ ([repo](https://github.com/Kevin-Stiven-Lopez-Amaya404/docs-lista-tareas))
