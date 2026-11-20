# Conteo de insumos

App web para contar el inventario de la tienda desde el celular o iPad. Varias personas pueden contar al mismo tiempo con el mismo PIN de tienda y ven los cambios en vivo.

- Datos: Firebase Firestore (proyecto `sbx-inventario`), con inicio de sesión anónimo.
- Publicada con GitHub Pages desde la rama `main`.
- `index.html` se genera con `web/construir_web.py` a partir de la plantilla de la app (carpeta `movil/` del proyecto).

Abrir: https://drongamer2.github.io/conteo-insumos/

## Pedidos y proyección

Pestaña **Pedidos** (`proyeccion.js`): proyecta el consumo a 3 días, 1 semana o 2 semanas y sugiere cuánto pedir en cada entrega (miércoles y sábado; la leche entera, deslactosada y light llega los miércoles). El uso diario sale de los reportes "Inventory Item Usage Analysis" (PDF) que se suben en la misma pestaña; viene incluido el del 16/11/2026. Lo que "hay" sale del conteo actual. Los ajustes y reportes se guardan en `config/proyeccion` de la tienda.
