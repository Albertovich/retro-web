# Retro Web

Sitio multi‑página estático con estética arcade 80s, listo para GitHub Pages (publicando desde **root**).

## Estructura
- `index.html`, `sobre.html`, `portafolio.html`, `contacto.html`
- `proyectos/*/index.html` con lienzo p5.js
- `assets/css/styles.css`, `assets/js/script.js`, `assets/img/*`

## Despliegue
1. Sube todo a la rama por defecto (ej. `main`).
2. En **Settings → Pages**, origen: **Deploy from a branch → `main` / root**.
3. Espera a que se genere y accede a la URL de Pages.

## Desarrollo local
Puedes abrir `index.html` directamente en el navegador o usar un server estático.


## Favicon
Para regenerar el favicon embebido en las páginas HTML:
1. Genera un PNG de 64×64 a partir de `assets/img/favicon.svg` y obtén su base64, por ejemplo:
   ```bash
   magick assets/img/favicon.svg -resize 64x64 -background none -gravity center -extent 64x64 png:- | base64 -w0 > /tmp/favicon64.txt
   ```
2. Sustituye el valor de `href` en las etiquetas `<link rel="alternate icon" type="image/png">` de `index.html`, `sobre.html`, `portafolio.html` y `contacto.html` por `data:image/png;base64,` seguido de la nueva cadena generada.

