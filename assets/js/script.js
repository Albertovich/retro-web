
// Sticky navbar solidify on scroll, mobile menu toggle, year
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const yearEl = document.getElementById('year');

yearEl && (yearEl.textContent = new Date().getFullYear());

let lastY = window.scrollY;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (!navbar) return;
  navbar.style.background = y > 12 ? 'rgba(0,0,0,0.78)' : 'rgba(0,0,0,0.6)';
  lastY = y;
});

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    if (isOpen) {
      mobileMenu.setAttribute('hidden', '');
      mobileMenu.setAttribute('aria-hidden', 'true');
    } else {
      mobileMenu.removeAttribute('hidden');
      mobileMenu.setAttribute('aria-hidden', 'false');
    }
  });
}

// Minimal retro hero canvas animation (no p5 here to keep homepage light)
(function(){
  const cvs = document.getElementById('heroCanvas');
  if(!cvs) return;
  const ctx = cvs.getContext('2d');
  let t=0;
  function loop(){
    const w=cvs.width, h=cvs.height;
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,w,h);
    // starfield
    for(let i=0;i<120;i++){
      const x = (i*53 + t*2) % w;
      const y = (i*97 + t) % h;
      ctx.fillStyle = i%3===0 ? '#ff00ff' : (i%3===1 ? '#00ff00' : '#ffff00');
      ctx.fillRect(x, y, 2, 2);
    }
    // title scanline pulse
    ctx.fillStyle = 'rgba(0,255,0,0.05)';
    const sy = Math.abs(Math.sin(t*0.05))*h;
    ctx.fillRect(0, sy, w, 8);
    t++;
    requestAnimationFrame(loop);
  }
  loop();
})();
