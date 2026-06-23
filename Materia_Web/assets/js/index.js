// Efecto de cursor desactivado: el seguidor con trail siempre se lee "lento"
// (el ojo lo compara con el cursor real, que es instantáneo). El #glow queda
// fuera de pantalla, invisible y sin costo de render.

// Scroll reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Modal
const modalOverlay = document.getElementById('modalOverlay');
const openModalBtn = document.getElementById('openModal');

function openModal() {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Bio section — starfield canvas
(function () {
  const section = document.getElementById('docente');
  if (!section) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'bioCanvas';
  section.prepend(canvas);
  const ctx = canvas.getContext('2d');

  let W, H, stars = [], raf;

  function resize() {
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
  }

  function initStars() {
    stars = [];
    const n = Math.round((W * H) / 5500);
    for (let i = 0; i < n; i++) {
      const isTeal = Math.random() < 0.12;
      stars.push({
        x:       Math.random() * W,
        y:       Math.random() * H,
        r:       Math.random() * 1.1 + 0.25,
        base:    Math.random() * 0.55 + 0.12,
        phase:   Math.random() * Math.PI * 2,
        speed:   Math.random() * 0.0008 + 0.0003,
        vy:      -(Math.random() * 0.12 + 0.03),
        color:   isTeal ? '0,232,198' : '210,228,255',
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.y += s.vy;
      if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }

      const pulse = (Math.sin(t * s.speed * 1000 + s.phase) + 1) / 2;
      const alpha = s.base * (0.55 + 0.45 * pulse);

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color},${alpha.toFixed(2)})`;
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }

  // Pause when off-screen
  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { if (!raf) raf = requestAnimationFrame(draw); }
    else { cancelAnimationFrame(raf); raf = null; }
  });
  obs.observe(section);

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { resize(); initStars(); }, 150);
  });

  resize();
  initStars();
})();

openModalBtn.addEventListener('click', openModal);
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalClose2').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

