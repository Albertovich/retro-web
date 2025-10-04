// --- Variables base de navegación y pie ---
const barra = document.getElementById('navbar');
const botonMenu = document.getElementById('hamburger');
const menuMovil = document.getElementById('mobileMenu');
const anio = document.getElementById('year');

// --- Actualiza el año automáticamente ---
if (anio) anio.textContent = new Date().getFullYear();

// --- Ajusta la opacidad de la barra al hacer scroll ---
window.addEventListener('scroll', () => {
  if (!barra) return;
  barra.style.background = window.scrollY > 12 ? 'rgba(0,0,0,0.78)' : 'rgba(0,0,0,0.65)';
});

// --- Alterna el menú móvil en pantallas pequeñas ---
if (botonMenu && menuMovil) {
  botonMenu.addEventListener('click', () => {
    const abierto = botonMenu.getAttribute('aria-expanded') === 'true';
    botonMenu.setAttribute('aria-expanded', String(!abierto));
    if (abierto) {
      menuMovil.setAttribute('hidden', '');
      menuMovil.setAttribute('aria-hidden', 'true');
    } else {
      menuMovil.removeAttribute('hidden');
      menuMovil.setAttribute('aria-hidden', 'false');
    }
  });
}

// --- Animación retro sencilla en el canvas del hero ---
(() => {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const proporcion = 16 / 9;

  // Ajusta el tamaño del canvas según el ancho disponible
  const redimensionar = () => {
    const ancho = Math.min(canvas.parentElement?.clientWidth || 640, 640);
    const alto = Math.round(ancho / proporcion);
    canvas.width = ancho;
    canvas.height = alto;
  };

  redimensionar();
  window.addEventListener('resize', redimensionar);

  let t = 0;
  const dibujar = () => {
    redimensionar();
    const { width: w, height: h } = canvas;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    // Campo de estrellas de colores
    for (let i = 0; i < 120; i++) {
      const x = (i * 47 + t * 2) % w;
      const y = (i * 89 + t) % h;
      ctx.fillStyle = i % 3 === 0 ? '#ff00ff' : i % 3 === 1 ? '#00ff00' : '#ffff00';
      ctx.fillRect(x, y, 2, 2);
    }

    // Línea luminosa que recorre la pantalla
    ctx.fillStyle = 'rgba(0,255,0,0.05)';
    const lineaY = Math.abs(Math.sin(t * 0.05)) * h;
    ctx.fillRect(0, lineaY, w, 8);

    t++;
    requestAnimationFrame(dibujar);
  };

  dibujar();
})();
