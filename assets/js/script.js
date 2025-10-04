// --- Variables base de navegación y pie ---
const barra = document.getElementById('navbar');
const botonMenu = document.getElementById('hamburger');
const menuMovil = document.getElementById('mobileMenu');
const anio = document.getElementById('year');
const botonMusica = document.getElementById('toggleMusic');

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

// --- Generador de música arcade original ---
if (botonMusica) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    botonMusica.disabled = true;
    botonMusica.textContent = 'Audio no soportado';
    botonMusica.setAttribute('aria-pressed', 'false');
    botonMusica.classList.add('boton-sonido--desactivado');
    return;
  }

  let audioContext;
  let masterGain;
  let bajoOsc;
  let melodiaOsc;
  let melodiaGain;
  let ritmoId;
  let paso = 0;
  const notas = [220, 277, 330, 415]; // Secuencia propia inspirada en sintetizadores ochenteros

  const iniciarMusica = async () => {
    if (!audioContext) {
      audioContext = new AudioCtx();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 0.18;
      masterGain.connect(audioContext.destination);
    }

    if (audioContext.state === 'suspended') await audioContext.resume();

    bajoOsc = audioContext.createOscillator();
    const bajoGain = audioContext.createGain();
    bajoOsc.type = 'sawtooth';
    bajoOsc.frequency.value = 55;
    bajoGain.gain.value = 0.05;
    bajoOsc.connect(bajoGain).connect(masterGain);
    bajoOsc.start();

    melodiaOsc = audioContext.createOscillator();
    melodiaGain = audioContext.createGain();
    melodiaOsc.type = 'square';
    melodiaOsc.frequency.value = notas[0];
    melodiaGain.gain.value = 0.06;
    melodiaOsc.connect(melodiaGain).connect(masterGain);
    melodiaOsc.start();

    paso = 0;
    ritmoId = window.setInterval(() => {
      if (!audioContext || !melodiaOsc || !bajoOsc) return;
      const ahora = audioContext.currentTime;
      const indice = paso % notas.length;
      const octava = paso % 8 < 4 ? 1 : 2;
      const frecuenciaNota = notas[indice] * octava;
      melodiaOsc.frequency.setValueAtTime(frecuenciaNota, ahora);
      melodiaGain.gain.setTargetAtTime(paso % 2 === 0 ? 0.07 : 0.04, ahora, 0.05);
      const frecuenciaBajo = paso % 4 === 0 ? 55 : 82.41;
      bajoOsc.frequency.setTargetAtTime(frecuenciaBajo, ahora, 0.1);
      paso++;
    }, 320);
  };

  const detenerMusica = async () => {
    if (ritmoId) {
      window.clearInterval(ritmoId);
      ritmoId = null;
    }
    [melodiaOsc, bajoOsc].forEach((osc) => {
      if (osc) {
        osc.stop();
        osc.disconnect();
      }
    });
    melodiaOsc = null;
    bajoOsc = null;
    melodiaGain = null;
    if (audioContext && audioContext.state === 'running') {
      await audioContext.suspend();
    }
  };

  botonMusica.addEventListener('click', async () => {
    const activo = botonMusica.getAttribute('aria-pressed') === 'true';
    if (activo) {
      await detenerMusica();
      botonMusica.setAttribute('aria-pressed', 'false');
      botonMusica.textContent = 'Activar música';
    } else {
      await iniciarMusica();
      botonMusica.setAttribute('aria-pressed', 'true');
      botonMusica.textContent = 'Silenciar música';
    }
  });
}
