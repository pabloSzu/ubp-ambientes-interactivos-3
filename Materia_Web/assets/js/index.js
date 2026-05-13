// Cursor glow
const glow = document.getElementById('glow');
document.addEventListener('mousemove', e => {
  glow.style.transform = `translate(${e.clientX - 210}px, ${e.clientY - 210}px)`;
});

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
