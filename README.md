# Lista de Tareas

App web con Vite + JavaScript. Pruebas con Vitest.

```
npm install      # primera vez
npm run dev      # servidor local
npm test         # pruebas
npm run build    # build de producción (dist/)
```

El CI (GitHub Actions) corre pruebas y build en cada PR a `develop` y `main`.

## Flujo de trabajo

- `main`: código estable, lo que se entrega. Nunca se sube código directo.
- `develop`: integración y pruebas.
- `feature/HU-XX-descripcion`: una rama por historia de usuario, sale de `develop` y vuelve a `develop`.

Commits con el número de la HU: `HU-01: descripción`.

Tablero del proyecto: https://kevin-stiven-lopez-amaya404.github.io/docs-lista-tareas/ ([repo](https://github.com/Kevin-Stiven-Lopez-Amaya404/docs-lista-tareas))
