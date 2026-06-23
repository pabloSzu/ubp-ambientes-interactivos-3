/* ═══════════════════════════════════════════
   Interactividad compartida: Evaluación + Proyecto
   - Botón "Copiar" automático en cada bloque <pre>
   - (checklists y calculadora se agregan aparte)
═══════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── Botones "Copiar" en todos los <pre> ─── */
  function addCopyButtons() {
    document.querySelectorAll('pre').forEach(pre => {
      if (pre.dataset.copyReady) return;
      pre.dataset.copyReady = '1';
      pre.classList.add('hasCopy');

      // Capturar el texto ANTES de inyectar el botón
      const codeText = (pre.innerText || pre.textContent || '').trim();

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copyBtn';
      btn.innerHTML = '<i class="ph ph-copy"></i> Copiar';

      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const text = codeText;
        try {
          await navigator.clipboard.writeText(text);
        } catch (_) {
          const r = document.createRange();
          r.selectNodeContents(pre);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(r);
          try { document.execCommand('copy'); } catch (__) {}
          sel.removeAllRanges();
        }
        const prev = btn.innerHTML;
        btn.innerHTML = '<i class="ph ph-check"></i> ¡Copiado!';
        btn.classList.add('copied');
        setTimeout(() => { btn.innerHTML = prev; btn.classList.remove('copied'); }, 1600);
      });

      pre.appendChild(btn);
    });
  }

  /* ─── Calculadora de speedup (Amdahl + Gustafson) ─── */
  function initSpeedCalc() {
    document.querySelectorAll('.speedCalc').forEach(c => {
      const P = c.querySelector('.scP');
      const N = c.querySelector('.scN');
      const out = {
        amdahl: c.querySelector('.scAmdahl'),
        eff:    c.querySelector('.scEff'),
        gust:   c.querySelector('.scGust'),
        max:    c.querySelector('.scMax'),
      };
      function calc() {
        const p = Math.min(100, Math.max(0, parseFloat(P.value) || 0)) / 100;
        const n = Math.max(1, Math.floor(parseFloat(N.value) || 1));
        const s = 1 - p;
        const S = 1 / (s + p / n);            // Amdahl
        const e = S / n;                       // Eficiencia
        const G = n - s * (n - 1);             // Gustafson-Barsis
        const lim = s > 0 ? 1 / s : Infinity;  // Límite N→∞ (Amdahl)
        if (out.amdahl) out.amdahl.textContent = '×' + S.toFixed(2);
        if (out.eff)    out.eff.textContent    = (e * 100).toFixed(0) + '%';
        if (out.gust)   out.gust.textContent   = '×' + G.toFixed(2);
        if (out.max)    out.max.textContent    = isFinite(lim) ? '×' + lim.toFixed(2) : '∞';
      }
      [P, N].forEach(i => i && i.addEventListener('input', calc));
      calc();
    });
  }

  function init() { addCopyButtons(); initSpeedCalc(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
