/* ═══════════════════════════════════════════
   PAI3 · Módulo 4 · Comunicación IPC
═══════════════════════════════════════════ */

/* Force violet accent — overrides campus.js default */
(function () {
  const r = document.documentElement;
  r.style.setProperty('--accent',        '#b040ff');
  r.style.setProperty('--accent-sub',    'rgba(176,64,255,0.13)');
  r.style.setProperty('--accent-border', 'rgba(176,64,255,0.38)');
  r.style.setProperty('--accent-mid',    'rgba(176,64,255,0.55)');
})();

/* ─── Reading progress ───────────────────── */
const readProgress = document.getElementById('readProgress');
if (readProgress) {
  window.addEventListener('scroll', () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    readProgress.style.width = docH > 0 ? `${(window.scrollY / docH) * 100}%` : '0%';
  }, { passive: true });
}

/* ─── Scroll reveal ──────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── Cursor glow ────────────────────────── */
const mglow = document.getElementById('mglow');
if (mglow) {
  window.addEventListener('mousemove', e => {
    mglow.style.transform = `translate(${e.clientX - 140}px, ${e.clientY - 140}px)`;
  }, { passive: true });
}

/* ─── Animated counters ──────────────────── */
function animateCounter(el, target) {
  if (!el) return;
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    anime({
      targets: { val: 0 }, val: target, round: 1,
      duration: 1800, easing: 'easeOutQuart',
      update(a) { el.textContent = Math.round(a.animations[0].currentValue); },
      complete() { el.textContent = target; }
    });
  }, { threshold: 0.5 });
  obs.observe(el);
}
animateCounter(document.getElementById('counter1'), 4);
animateCounter(document.getElementById('counter2'), 8);
animateCounter(document.getElementById('counter3'), 3);

/* ─── Pipe Simulation v2 ─────────────────────── */
const PIPE_BUF_SIZE = 8;
const pipe = {
  buf: [], sent: 0, received: 0, running: false,
  writerTimer: null, readerTimer: null,
  readerPaused: false, writerPaused: false,
  writerBlocked: false, readerBlocked: false,
  writeMs: 700, readMs: 1100,
};

function pipeInitSlots() {
  const slots = document.getElementById('pipeBufSlots');
  if (!slots) return;
  slots.innerHTML = '';
  for (let i = 0; i < PIPE_BUF_SIZE; i++) {
    const s = document.createElement('div');
    s.className = 'm4pipeBufSlot';
    s.id = 'pipeslot' + i;
    slots.appendChild(s);
  }
}

function pipeRenderBuf() {
  for (let i = 0; i < PIPE_BUF_SIZE; i++) {
    const s = document.getElementById('pipeslot' + i);
    if (!s) continue;
    const filled = i < pipe.buf.length;
    s.classList.toggle('filled', filled);
    s.textContent = filled ? 'D' + pipe.buf[i] : '';
  }
  const cap  = document.getElementById('pipeBufCap');
  const bar  = document.getElementById('pipeBufFillBar');
  const sent = document.getElementById('pipeSent');
  const recv = document.getElementById('pipeReceived');
  if (cap)  cap.textContent = pipe.buf.length + ' / ' + PIPE_BUF_SIZE;
  if (bar)  bar.style.width = ((pipe.buf.length / PIPE_BUF_SIZE) * 100) + '%';
  if (sent) sent.textContent = pipe.sent;
  if (recv) recv.textContent = pipe.received;
}

function pipeSetBadge(id, state) {
  const el = document.getElementById(id);
  if (!el) return;
  const map = { idle: 'INACTIVO', writing: 'write() ▶', reading: 'read() ▶', blocked: 'BLOQUEADO ⏸' };
  el.textContent = map[state] || state;
  el.dataset.state = state;
}

function pipeNarrate(html) {
  const el = document.getElementById('pipeNarration');
  if (el) el.innerHTML = html;
}

function pipeWriterStep() {
  if (!pipe.running) return;
  if (pipe.writerPaused) {
    pipeSetBadge('pipeWriterBadge', 'idle');
    pipe.writerTimer = setTimeout(pipeWriterStep, 300);
    return;
  }
  if (pipe.buf.length >= PIPE_BUF_SIZE) {
    if (!pipe.writerBlocked) {
      pipe.writerBlocked = true;
      pipeSetBadge('pipeWriterBadge', 'blocked');
      pipeNarrate('🔒 <strong>write() BLOQUEADO</strong> — el kernel buffer está lleno (<strong>' + PIPE_BUF_SIZE + '/' + PIPE_BUF_SIZE + '</strong>). Proceso A llamó a write() pero no hay espacio. El SO suspende a Proceso A hasta que Proceso B lea algún dato y libere espacio. Este mecanismo se llama <em>backpressure</em>.');
    }
    pipe.writerTimer = setTimeout(pipeWriterStep, 150);
    return;
  }
  pipe.writerBlocked = false;
  pipe.sent++;
  pipe.buf.push(pipe.sent);
  pipeSetBadge('pipeWriterBadge', 'writing');
  const newidx = pipe.buf.length - 1;
  pipeRenderBuf();
  const newest = document.getElementById('pipeslot' + newidx);
  if (newest) { newest.classList.add('newest'); setTimeout(() => newest.classList.remove('newest'), 300); }
  const pct = Math.round((pipe.buf.length / PIPE_BUF_SIZE) * 100);
  const warn = pct >= 87 ? ' ⚠️ Buffer casi lleno — write() se bloqueará pronto.' : pct >= 60 ? ' Buffer por encima del 60%.' : '';
  pipeNarrate('✏️ <strong>Proceso A escribió D' + pipe.sent + '</strong> en el pipe. Buffer: <strong>' + pipe.buf.length + '/' + PIPE_BUF_SIZE + '</strong> (' + pct + '%).' + warn + ' Los datos se acumulan en orden FIFO.');
  pipe.writerTimer = setTimeout(pipeWriterStep, pipe.writeMs);
}

function pipeReaderStep() {
  if (!pipe.running) return;
  if (pipe.readerPaused) {
    pipeSetBadge('pipeReaderBadge', 'idle');
    pipe.readerTimer = setTimeout(pipeReaderStep, 300);
    return;
  }
  if (pipe.buf.length === 0) {
    if (!pipe.readerBlocked) {
      pipe.readerBlocked = true;
      pipeSetBadge('pipeReaderBadge', 'blocked');
      pipeNarrate('📭 <strong>read() BLOQUEADO</strong> — el buffer está vacío (<strong>0/' + PIPE_BUF_SIZE + '</strong>). Proceso B llamó a read() pero no hay datos disponibles. El SO suspende a Proceso B hasta que Proceso A escriba algo. Sin busy-waiting — no consume CPU mientras espera.');
    }
    pipe.readerTimer = setTimeout(pipeReaderStep, 150);
    return;
  }
  pipe.readerBlocked = false;
  const item = pipe.buf.shift();
  pipe.received++;
  pipeSetBadge('pipeReaderBadge', 'reading');
  pipeRenderBuf();
  pipeNarrate('👁 <strong>Proceso B leyó D' + item + '</strong> del pipe (<em>FIFO — el dato más antiguo sale primero</em>). Buffer: <strong>' + pipe.buf.length + '/' + PIPE_BUF_SIZE + '</strong>. Total recibidos: ' + pipe.received + '.');
  pipe.readerTimer = setTimeout(pipeReaderStep, pipe.readMs);
}

function pipeToggle() {
  if (pipe.running) {
    pipe.running = false;
    clearTimeout(pipe.writerTimer);
    clearTimeout(pipe.readerTimer);
    pipeSetBadge('pipeWriterBadge', 'idle');
    pipeSetBadge('pipeReaderBadge', 'idle');
    const btn = document.getElementById('pipeBtn');
    if (btn) btn.innerHTML = '<i class="ph-bold ph-play"></i> Continuar';
  } else {
    pipe.running = true;
    pipe.writerBlocked = false;
    pipe.readerBlocked = false;
    const btn = document.getElementById('pipeBtn');
    if (btn) btn.innerHTML = '<i class="ph-bold ph-pause"></i> Pausar';
    pipeWriterStep();
    setTimeout(pipeReaderStep, pipe.readMs / 2);
  }
}

function pipeSaturate() {
  if (!pipe.running) { pipeToggle(); setTimeout(pipeSaturate, 100); return; }
  pipe.readerPaused = true;
  pipeNarrate('⚠️ <strong>Modo Saturación</strong> — Proceso B dejó de leer por 4 segundos. Observá cómo el buffer se llena y write() empieza a bloquearse al llegar a ' + PIPE_BUF_SIZE + '/' + PIPE_BUF_SIZE + '.');
  setTimeout(() => { pipe.readerPaused = false; }, 4000);
}

function pipeDrain() {
  if (!pipe.running) { pipeToggle(); setTimeout(pipeDrain, 100); return; }
  pipe.writerPaused = true;
  pipeNarrate('⚠️ <strong>Modo Vaciado</strong> — Proceso A dejó de escribir por 4 segundos. Observá cómo el buffer se vacía y read() empieza a bloquearse al llegar a 0/' + PIPE_BUF_SIZE + '.');
  setTimeout(() => { pipe.writerPaused = false; }, 4000);
}

function pipeReset() {
  pipe.running = false;
  clearTimeout(pipe.writerTimer);
  clearTimeout(pipe.readerTimer);
  pipe.buf = []; pipe.sent = 0; pipe.received = 0;
  pipe.writerBlocked = false; pipe.readerBlocked = false;
  pipe.readerPaused = false; pipe.writerPaused = false;
  pipeRenderBuf();
  pipeSetBadge('pipeWriterBadge', 'idle');
  pipeSetBadge('pipeReaderBadge', 'idle');
  const btn = document.getElementById('pipeBtn');
  if (btn) btn.innerHTML = '<i class="ph-bold ph-play"></i> Iniciar';
  pipeNarrate('Presioná <strong>Iniciar</strong> para ver el flujo de datos en el pipe.<span class="m4pipeNarHint">write() bloquea cuando el buffer está lleno · read() bloquea cuando está vacío · los datos salen en el mismo orden que entraron (FIFO)</span>');
}

pipeInitSlots();
pipeRenderBuf();

/* ─── Java tabs ──────────────────────────── */
function showJavaTab(idx) {
  document.querySelectorAll('.m4javaTab').forEach((tab, i) => {
    tab.classList.toggle('active', i === idx);
    tab.setAttribute('aria-selected', i === idx ? 'true' : 'false');
  });
  document.querySelectorAll('.m4javaPanel').forEach((panel, i) => {
    panel.classList.toggle('hidden', i !== idx);
  });
  if (typeof Prism !== 'undefined') {
    setTimeout(() => Prism.highlightAll(), 50);
  }
}

/* ─── Copy lab code ──────────────────────── */
function copyLabCode() {
  const block = document.getElementById('labCodeBlock');
  if (!block) return;
  const text = block.textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.m4labHintHeader .m4btn');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="ph-bold ph-check"></i> Copiado';
      setTimeout(() => { btn.innerHTML = orig; }, 1800);
    }
  }).catch(() => {
    const range = document.createRange();
    range.selectNodeContents(block);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  });
}

/* ─── Flash Quiz (Productor-Consumidor) ──── */
const pcFlashData = [
  {
    scenario: 'Productor genera 1 item/seg, consumidor procesa 1 item/seg, queue de 5 slots.',
    answer: 'Equilibrio — la queue se mantiene estable',
    options: [
      'Equilibrio — la queue se mantiene estable',
      'Productor más rápido — queue se llena, productor se bloquea',
      'Consumidor más rápido — queue se vacía, consumidor se bloquea',
    ],
    explanation: 'P = C: las tasas son iguales. La queue puede tener algunos ítems en tránsito pero no crece indefinidamente ni se vacía. El sistema está balanceado.',
  },
  {
    scenario: 'Productor genera 3 items/seg, consumidor procesa 1 item/seg, queue de 5 slots.',
    answer: 'Productor más rápido — queue se llena, productor se bloquea',
    options: [
      'Equilibrio — la queue se mantiene estable',
      'Productor más rápido — queue se llena, productor se bloquea',
      'Consumidor más rápido — queue se vacía, consumidor se bloquea',
    ],
    explanation: 'P > C: el productor agrega 3 veces más rápido de lo que el consumidor retira. La queue se llena (5 slots) y put() bloquea al productor hasta que el consumidor libere espacio. Backpressure en acción.',
  },
  {
    scenario: 'Productor genera 1 item/seg, consumidor procesa 3 items/seg, queue de 5 slots.',
    answer: 'Consumidor más rápido — queue se vacía, consumidor se bloquea',
    options: [
      'Equilibrio — la queue se mantiene estable',
      'Productor más rápido — queue se llena, productor se bloquea',
      'Consumidor más rápido — queue se vacía, consumidor se bloquea',
    ],
    explanation: 'P < C: el consumidor termina los ítems 3 veces más rápido de lo que llegan. La queue se vacía y take() bloquea al consumidor esperando que el productor agregue algo nuevo. Sin polling, sin CPU wasted.',
  },
];

function renderPcFlash() {
  const container = document.getElementById('pcFlashCards');
  if (!container) return;
  container.innerHTML = '';

  pcFlashData.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'm4flashCard';

    const btnsHtml = item.options.map(opt => `
      <button class="m4flashBtn" data-idx="${idx}" data-choice="${opt}">${opt}</button>
    `).join('');

    card.innerHTML = `
      <div class="m4flashScenario">${item.scenario}</div>
      <div class="m4flashBtns">${btnsHtml}</div>
      <div class="m4flashAnswer" id="pcfqAnswer${idx}">
        <strong>${item.answer}</strong> — ${item.explanation}
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('.m4flashBtn').forEach(btn => {
    btn.addEventListener('click', function () {
      const idx = parseInt(this.dataset.idx);
      const choice = this.dataset.choice;
      const item = pcFlashData[idx];
      const card = this.closest('.m4flashCard');
      const btns = card.querySelectorAll('.m4flashBtn');
      const answerEl = document.getElementById(`pcfqAnswer${idx}`);

      btns.forEach(b => {
        b.disabled = true;
        if (b.dataset.choice === item.answer) b.classList.add('correct');
        else if (b.dataset.choice === choice && choice !== item.answer) b.classList.add('wrong');
      });

      if (answerEl) answerEl.classList.add('show');
    });
  });
}

/* ═══════════════════════════════════════════
   BLOCKINGQUEUE SIMULATOR
═══════════════════════════════════════════ */

const bqState = {
  queue: [],
  maxSize: 8,
  produced: 0,
  consumed: 0,
  producerBlocked: 0,
  consumerBlocked: 0,
  producerRate: 800,
  consumerRate: 1200,
  running: false,
  producerTimer: null,
  consumerTimer: null,
  producerRetryTimer: null,
  consumerRetryTimer: null,
};

function bqSetActorState(actorEl, badgeEl, state) {
  if (!actorEl || !badgeEl) return;
  actorEl.className = 'm4bqActor';
  badgeEl.className = 'm4bqBadge';

  const states = {
    idle:      { actor: '',           badge: '',          text: 'INACTIVO' },
    producing: { actor: 'producing',  badge: 'producing', text: 'PRODUCIENDO ▶' },
    consuming: { actor: 'consuming',  badge: 'consuming', text: 'CONSUMIENDO ▶' },
    blocked:   { actor: 'blocked',    badge: 'blocked',   text: 'BLOQUEADO ⏸' },
  };

  const s = states[state] || states.idle;
  if (s.actor) actorEl.classList.add(s.actor);
  if (s.badge) badgeEl.classList.add(s.badge);
  const textEl = badgeEl.querySelector('.m4bqBadgeText');
  if (textEl) textEl.textContent = s.text;
}

function bqRenderQueue() {
  const slots = document.querySelectorAll('.m4bqSlot');
  const fillBar = document.getElementById('bqFillBar');
  const capLabel = document.getElementById('bqCapLabel');

  slots.forEach((slot, i) => {
    const wasFilled = slot.classList.contains('filled');
    const isFilled = i < bqState.queue.length;
    if (isFilled && !wasFilled) {
      slot.classList.add('filled', 'filling');
      setTimeout(() => slot.classList.remove('filling'), 250);
    } else if (!isFilled && wasFilled) {
      slot.classList.remove('filled');
    }
    slot.textContent = isFilled ? (i + 1) : '';
  });

  const pct = (bqState.queue.length / bqState.maxSize) * 100;
  if (fillBar) fillBar.style.width = `${pct}%`;
  if (capLabel) capLabel.textContent = `${bqState.queue.length} / ${bqState.maxSize}`;
}

function bqUpdateStats() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('statProduced',    bqState.produced);
  set('statConsumed',    bqState.consumed);
  set('statProdBlocked', bqState.producerBlocked);
  set('statConsBlocked', bqState.consumerBlocked);
}

function bqProduce() {
  if (!bqState.running) return;

  const producerEl = document.getElementById('bqProducer');
  const prodBadge  = document.getElementById('bqProdBadge');

  if (bqState.queue.length >= bqState.maxSize) {
    // BLOCKED — queue full
    bqState.producerBlocked++;
    bqSetActorState(producerEl, prodBadge, 'blocked');
    bqNarrate('🔒 <strong>put() BLOQUEADO</strong> — la queue está llena (<strong>' + bqState.maxSize + '/' + bqState.maxSize + '</strong>). El productor llamó a put() pero no hay espacio. Java suspende este hilo automáticamente hasta que el consumidor haga take() y libere un slot. <em>Backpressure en acción.</em>');
    bqLogEvent('put() bloqueado — queue llena', 'blocked');
    bqUpdateStats();
    // Retry every 200ms until there's space
    bqState.producerRetryTimer = setTimeout(() => { bqProduce(); }, 200);
    return;
  }

  bqSetActorState(producerEl, prodBadge, 'producing');
  bqState.queue.push('item' + (bqState.produced + 1));
  bqState.produced++;
  bqRenderQueue();
  const pct2 = Math.round((bqState.queue.length / bqState.maxSize) * 100);
  const w2 = pct2 >= 87 ? ' ⚠️ Queue casi llena.' : pct2 >= 60 ? ' Queue por encima del 60%.' : '';
  bqNarrate('📦 <strong>Productor puso ítem #' + bqState.produced + '</strong> en la queue. Ocupación: <strong>' + bqState.queue.length + '/' + bqState.maxSize + '</strong> (' + pct2 + '%).' + w2);
  bqLogEvent('put(item-' + bqState.produced + ') → queue: ' + bqState.queue.length + '/' + bqState.maxSize, 'produce');
  bqUpdateStats();

  if (typeof anime !== 'undefined') {
    const fillBar = document.getElementById('bqFillBar');
    if (fillBar) anime({ targets: fillBar, scaleX: [1.03, 1], duration: 250, easing: 'easeOutBack' });
  }

  // Schedule next production
  bqState.producerTimer = setTimeout(() => {
    bqSetActorState(producerEl, prodBadge, 'idle');
    bqProduce();
  }, bqState.producerRate);
}

function bqConsume() {
  if (!bqState.running) return;

  const consumerEl = document.getElementById('bqConsumer');
  const consBadge  = document.getElementById('bqConsBadge');

  if (bqState.queue.length === 0) {
    // BLOCKED — queue empty
    bqState.consumerBlocked++;
    bqSetActorState(consumerEl, consBadge, 'blocked');
    bqNarrate('📭 <strong>take() BLOQUEADO</strong> — la queue está vacía (<strong>0/' + bqState.maxSize + '</strong>). El consumidor llamó a take() pero no hay ítems. Java suspende este hilo automáticamente hasta que el productor haga put(). Sin polling, sin CPU wasted.');
    bqLogEvent('take() bloqueado — queue vacía', 'blocked');
    bqUpdateStats();
    // Retry every 200ms until there's something to consume
    bqState.consumerRetryTimer = setTimeout(() => { bqConsume(); }, 200);
    return;
  }

  bqSetActorState(consumerEl, consBadge, 'consuming');
  bqState.queue.shift();
  bqState.consumed++;
  bqRenderQueue();
  bqNarrate('✅ <strong>Consumidor tomó ítem #' + bqState.consumed + '</strong> de la queue. Ocupación: <strong>' + bqState.queue.length + '/' + bqState.maxSize + '</strong>. El slot liberado permite al productor continuar si estaba bloqueado.');
  bqLogEvent('take() → consumido #' + bqState.consumed + ' | queue: ' + bqState.queue.length + '/' + bqState.maxSize, 'consume');
  bqUpdateStats();

  // Schedule next consumption
  bqState.consumerTimer = setTimeout(() => {
    bqSetActorState(consumerEl, consBadge, 'idle');
    bqConsume();
  }, bqState.consumerRate);
}

function bqToggle() {
  const btn = document.getElementById('bqToggleBtn');

  if (bqState.running) {
    // Pause
    bqState.running = false;
    clearTimeout(bqState.producerTimer);
    clearTimeout(bqState.consumerTimer);
    clearTimeout(bqState.producerRetryTimer);
    clearTimeout(bqState.consumerRetryTimer);

    const producerEl = document.getElementById('bqProducer');
    const prodBadge  = document.getElementById('bqProdBadge');
    const consumerEl = document.getElementById('bqConsumer');
    const consBadge  = document.getElementById('bqConsBadge');
    bqSetActorState(producerEl, prodBadge, 'idle');
    bqSetActorState(consumerEl, consBadge, 'idle');

    if (btn) btn.innerHTML = '<i class="ph-bold ph-play"></i> Continuar';
  } else {
    // Start / resume
    bqState.running = true;
    if (btn) btn.innerHTML = '<i class="ph-bold ph-pause"></i> Pausar';
    bqProduce();
    bqConsume();
  }
}

function bqReset() {
  bqState.running = false;
  clearTimeout(bqState.producerTimer);
  clearTimeout(bqState.consumerTimer);
  clearTimeout(bqState.producerRetryTimer);
  clearTimeout(bqState.consumerRetryTimer);

  bqState.queue = [];
  bqState.produced = 0;
  bqState.consumed = 0;
  bqState.producerBlocked = 0;
  bqState.consumerBlocked = 0;

  bqRenderQueue();
  bqUpdateStats();

  const producerEl = document.getElementById('bqProducer');
  const prodBadge  = document.getElementById('bqProdBadge');
  const consumerEl = document.getElementById('bqConsumer');
  const consBadge  = document.getElementById('bqConsBadge');
  bqSetActorState(producerEl, prodBadge, 'idle');
  bqSetActorState(consumerEl, consBadge, 'idle');

  const btn = document.getElementById('bqToggleBtn');
  if (btn) btn.innerHTML = '<i class="ph-bold ph-play"></i> Iniciar';
}

function bqNarrate(html) {
  const el = document.getElementById('bqNarration');
  if (el) el.innerHTML = html;
}

function bqLogEvent(text, type) {
  const log = document.getElementById('bqLog');
  if (!log) return;
  const entry = document.createElement('div');
  entry.className = 'm4bqLogEntry ' + (type || '');
  entry.textContent = text;
  log.insertBefore(entry, log.firstChild);
  while (log.children.length > 6) log.removeChild(log.lastChild);
}

function bqScenario(name) {
  const map = {
    'fast-prod': { prod: 400,  cons: 1600 },
    'balanced':  { prod: 800,  cons: 800  },
    'fast-cons': { prod: 1600, cons: 350  },
  };
  const s = map[name];
  if (!s) return;
  bqState.producerRate = s.prod;
  bqState.consumerRate = s.cons;
  const pSlider = document.getElementById('producerSlider');
  const cSlider = document.getElementById('consumerSlider');
  const pLabel  = document.getElementById('prodRateLabel');
  const cLabel  = document.getElementById('consRateLabel');
  if (pSlider) pSlider.value = s.prod;
  if (cSlider) cSlider.value = s.cons;
  if (pLabel)  pLabel.textContent = s.prod;
  if (cLabel)  cLabel.textContent = s.cons;
  document.querySelectorAll('.m4bqPresetBtn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector('[onclick="bqScenario(\'' + name + '\')"]');
  if (btn) btn.classList.add('active');
  const names = { 'fast-prod': 'P más rápido — la queue se va a llenar y put() bloqueará al productor.', 'balanced': 'Equilibrio — productor y consumidor van a la misma velocidad.', 'fast-cons': 'C más rápido — la queue se va a vaciar y take() bloqueará al consumidor.' };
  bqNarrate('⚙️ Escenario cargado: <strong>' + names[name] + '</strong> Presioná Iniciar para verlo en acción.');
}

/* ─── Slider listeners ───────────────────── */
const prodSlider = document.getElementById('producerSlider');
const consSlider = document.getElementById('consumerSlider');
const prodRateLabel = document.getElementById('prodRateLabel');
const consRateLabel = document.getElementById('consRateLabel');

if (prodSlider) {
  prodSlider.addEventListener('input', function () {
    bqState.producerRate = parseInt(this.value);
    if (prodRateLabel) prodRateLabel.textContent = this.value;
  });
}
if (consSlider) {
  consSlider.addEventListener('input', function () {
    bqState.consumerRate = parseInt(this.value);
    if (consRateLabel) consRateLabel.textContent = this.value;
  });
}

/* ═══════════════════════════════════════════
   EL COURIER GAME
═══════════════════════════════════════════ */

const courierScenarios = [
  {
    scenario: 'Un programa en C crea un proceso hijo con fork(). El padre genera números y el hijo los suma. No necesitan comunicarse con ningún otro proceso.',
    answer: 'Pipe',
    hint: 'Los pipes son perfectos para comunicación padre-hijo creada con fork(). Son unidireccionales, rápidos y no requieren configuración en el filesystem.',
  },
  {
    scenario: 'Dos aplicaciones completamente independientes (un logger y una app web) corriendo en el mismo servidor Linux necesitan intercambiar texto. No hay relación padre-hijo entre ellos.',
    answer: 'FIFO (Named Pipe)',
    hint: 'Un FIFO (named pipe) tiene un nombre en el filesystem como /tmp/mi_pipe. Cualquier proceso puede abrirlo aunque no haya relación de parentesco. Perfecto para este caso.',
  },
  {
    scenario: 'Un sistema de e-commerce recibe pedidos a ráfagas. Un procesador de pagos los atiende más lento. Si el procesador se cae y reinicia, los pedidos no deben perderse.',
    answer: 'Cola de mensajes',
    hint: 'Las colas de mensajes son persistentes y asincrónicas. El productor envía y sigue su camino aunque el consumidor esté caído. Los mensajes esperan hasta que alguien los procese.',
  },
  {
    scenario: 'Un motor de física genera vectores de 4096 floats a 120fps. Un renderizador los lee inmediatamente. La latencia máxima permitida es 0.5ms.',
    answer: 'Memoria compartida',
    hint: 'La memoria compartida es el mecanismo más rápido — no hay copia de datos, ambos procesos acceden al mismo segmento de RAM. Para datos grandes y alta frecuencia, es la única opción viable.',
  },
  {
    scenario: 'En Java, un hilo genera tareas de red y 4 worker threads las procesan. Si no hay tareas, los workers deben esperar sin consumir CPU.',
    answer: 'BlockingQueue (Java)',
    hint: 'BlockingQueue es exactamente para esto: los workers llaman a take() y se bloquean automáticamente si no hay nada. Cuando el productor hace put(), un worker se despierta. Zero polling, zero CPU wasted.',
  },
];

const courierOptions = [
  'Pipe',
  'FIFO (Named Pipe)',
  'Cola de mensajes',
  'Memoria compartida',
  'BlockingQueue (Java)',
];

let courierScore = 0;

function buildCourier() {
  courierScore = 0;
  const scoreEl = document.getElementById('gameScore');
  if (scoreEl) scoreEl.textContent = '0';

  const container = document.getElementById('gameCards');
  if (!container) return;
  container.innerHTML = '';

  courierScenarios.forEach((s, idx) => {
    const card = document.createElement('div');
    card.className = 'm4gameCard';
    card.id = `gcard${idx}`;

    const optsHtml = courierOptions.map(opt => `
      <button class="m4gameOpt" data-card="${idx}" data-opt="${opt}">${opt}</button>
    `).join('');

    card.innerHTML = `
      <div class="m4gameCardNum">Entrega ${idx + 1}</div>
      <div class="m4gameScenario">${s.scenario}</div>
      <div class="m4gameOptions">${optsHtml}</div>
      <div class="m4gameHint" id="ghint${idx}">${s.hint}</div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('.m4gameOpt').forEach(btn => {
    btn.addEventListener('click', function () {
      courierAnswer(parseInt(this.dataset.card), this.dataset.opt);
    });
  });
}

function courierAnswer(cardIdx, chosen) {
  const s = courierScenarios[cardIdx];
  const card = document.getElementById(`gcard${cardIdx}`);
  if (!card || card.dataset.answered) return;
  card.dataset.answered = '1';

  const opts = card.querySelectorAll('.m4gameOpt');
  opts.forEach(b => {
    b.disabled = true;
    if (b.dataset.opt === s.answer) b.classList.add('correct');
    else if (b.dataset.opt === chosen && chosen !== s.answer) b.classList.add('wrong');
  });

  const hintEl = document.getElementById(`ghint${cardIdx}`);
  if (hintEl) hintEl.classList.add('show');

  if (chosen === s.answer) {
    courierScore++;
    const scoreEl = document.getElementById('gameScore');
    if (scoreEl) {
      scoreEl.textContent = courierScore;
      if (typeof anime !== 'undefined') {
        anime({ targets: scoreEl, scale: [1.4, 1], duration: 400, easing: 'easeOutBack' });
      }
    }
    card.classList.add('solved');
  } else {
    card.classList.add('solved-wrong');
  }
}

/* ═══════════════════════════════════════════
   QUIZ
═══════════════════════════════════════════ */

const quizData = [
  {
    q: '¿Por qué los procesos necesitan mecanismos de IPC?',
    opts: [
      'Porque los threads son más lentos que los procesos',
      'Porque cada proceso tiene su propio espacio de memoria aislado',
      'Porque Java no permite variables globales entre clases',
      'Porque el scheduler no comparte CPU entre procesos distintos',
    ],
    correct: 1,
    feedback: 'Cada proceso tiene su propio espacio de memoria virtual — no puede acceder a las variables de otro proceso directamente. IPC provee canales controlados para cruzar esa barrera de aislamiento.',
  },
  {
    q: '¿Cuál es la característica fundamental de un pipe?',
    opts: [
      'Es bidireccional y persistente',
      'Requiere un nombre en el filesystem',
      'Es unidireccional y opera entre procesos relacionados',
      'Solo funciona con procesos de diferente usuario',
    ],
    correct: 2,
    feedback: 'Un pipe anónimo es unidireccional (datos fluyen en un solo sentido) y típicamente se usa entre procesos con relación padre-hijo creada con fork(). Para comunicación entre procesos no relacionados se usa un FIFO (named pipe).',
  },
  {
    q: '¿Qué diferencia a un FIFO de un pipe anónimo?',
    opts: [
      'El FIFO es más rápido porque usa memoria compartida',
      'El FIFO tiene nombre en el filesystem y permite comunicación entre procesos no relacionados',
      'El FIFO es bidireccional, el pipe no',
      'El FIFO solo funciona en Windows',
    ],
    correct: 1,
    feedback: 'Un FIFO (named pipe) se crea como un archivo especial en el sistema de archivos (ej: mkfifo /tmp/mi_pipe). Cualquier proceso que conozca ese path puede abrirlo, sin importar si hay relación padre-hijo. Es la extensión natural del pipe para casos más generales.',
  },
  {
    q: '¿Qué hace BlockingQueue.put() cuando la queue está llena?',
    opts: [
      'Lanza una excepción y el programa termina',
      'Ignora el item y continúa',
      'Bloquea el hilo productor hasta que haya espacio disponible',
      'Reemplaza el item más antiguo con el nuevo',
    ],
    correct: 2,
    feedback: 'put() implementa el contrato del productor-consumidor: si no hay lugar, el hilo se bloquea automáticamente y espera hasta que el consumidor haga take() y libere un slot. Este bloqueo es transparente — el código del productor no necesita verificar el tamaño manualmente.',
  },
  {
    q: 'En el patrón productor-consumidor, ¿qué pasa si el productor es consistentemente más rápido que el consumidor?',
    opts: [
      'El consumidor acelera automáticamente para equilibrarse',
      'La queue se va llenando hasta que el productor se bloquea o se pierde trabajo',
      'Java reinicia el programa automáticamente',
      'El scheduler prioriza al consumidor',
    ],
    correct: 1,
    feedback: 'Si el productor supera al consumidor, la queue se llena. Con BlockingQueue, el productor se bloquea (correcto, no se pierden datos). Con queues sin límite de capacidad, la memoria puede agotarse. En sistemas reales, el backpressure es una señal importante para ajustar la tasa de producción.',
  },
  {
    q: '¿Cuál es la ventaja principal de la memoria compartida sobre las colas de mensajes?',
    opts: [
      'Es más fácil de programar y no requiere sincronización',
      'Soporta más procesos simultáneos',
      'No hay copia de datos — ambos procesos acceden al mismo segmento de RAM',
      'Funciona a través de la red sin configuración',
    ],
    correct: 2,
    feedback: 'En pipes y colas, los datos se copian de un buffer a otro. En memoria compartida, ambos procesos mapean el mismo segmento físico de RAM. Sin copia = latencia mínima, ideal para datos grandes a alta frecuencia. El costo es que requiere sincronización manual (mutex, semáforo) para evitar race conditions.',
  },
  {
    q: '¿Para qué sirve LinkedBlockingQueue en Java?',
    opts: [
      'Es una lista enlazada para ordenar elementos',
      'Es una BlockingQueue con capacidad opcional que bloquea en put()/take()',
      'Es un reemplazo de ArrayList para hilos',
      'Gestiona la creación y destrucción de hilos automáticamente',
    ],
    correct: 1,
    feedback: 'LinkedBlockingQueue implementa BlockingQueue usando una lista enlazada internamente. Se puede crear con capacidad máxima (new LinkedBlockingQueue<>(N)) o sin límite. Los métodos put() y take() bloquean automáticamente cuando la queue está llena o vacía respectivamente.',
  },
  {
    q: '¿Por qué una cola de mensajes es mejor que memoria compartida para un sistema de pedidos e-commerce?',
    opts: [
      'La cola es más rápida para datos pequeños',
      'La cola persiste pedidos aunque el consumidor esté caído, y desacopla totalmente productor y consumidor',
      'La memoria compartida no funciona entre servidores diferentes',
      'La cola evita automáticamente todas las race conditions',
    ],
    correct: 1,
    feedback: 'Una cola de mensajes es asincrónica y (dependiendo del sistema) persistente. Si el procesador de pedidos se cae, los mensajes esperan en la cola. El productor (web) no sabe ni le importa si el consumidor está activo. Este desacoplamiento es clave para sistemas resilientes. La memoria compartida requiere que ambos procesos estén activos simultáneamente.',
  },
];

let quizIdx = 0;
let quizCorrect = 0;

function renderQuiz() {
  quizIdx = 0;
  quizCorrect = 0;
  showQuestion();
}

function showQuestion() {
  const numEl      = document.getElementById('quizNum');
  const progressEl = document.getElementById('quizProgress');
  const contentEl  = document.getElementById('quizContent');
  if (!contentEl) return;

  if (quizIdx >= quizData.length) {
    if (numEl) numEl.textContent = 'Resultado final';
    if (progressEl) progressEl.style.width = '100%';

    const pct = Math.round((quizCorrect / quizData.length) * 100);
    let msg = '';
    if (pct >= 90)      msg = 'Excelente. Dominás los conceptos de IPC y productor-consumidor.';
    else if (pct >= 70) msg = 'Muy bien. Algunos mecanismos para repasar.';
    else if (pct >= 50) msg = 'Bien encaminado. Repasá los 4 mecanismos de IPC del módulo.';
    else                msg = 'Repasá el módulo y volvé a intentarlo.';

    contentEl.innerHTML = `
      <div class="m4quizResult">
        <div class="m4quizResultScore">${quizCorrect}/${quizData.length}</div>
        <div class="m4quizResultMsg">${msg}</div>
        <button class="m4quizRetry" onclick="renderQuiz()">
          <i class="ph-bold ph-arrow-counter-clockwise"></i> Reintentar
        </button>
      </div>
    `;
    return;
  }

  const q = quizData[quizIdx];
  const pct = Math.round((quizIdx / quizData.length) * 100);
  if (numEl) numEl.textContent = `Pregunta ${quizIdx + 1} de ${quizData.length}`;
  if (progressEl) progressEl.style.width = `${pct}%`;

  const optsHtml = q.opts.map((opt, i) => `
    <button class="m4quizOpt" data-idx="${i}" onclick="answerQuiz(${i})">${opt}</button>
  `).join('');

  contentEl.innerHTML = `
    <div class="m4quizQ">${q.q}</div>
    <div class="m4quizOpts">${optsHtml}</div>
    <div class="m4quizFeedback" id="qFeedback"></div>
    <button class="m4quizNext" id="qNext" onclick="nextQuestion()">
      ${quizIdx < quizData.length - 1 ? 'Siguiente <i class="ph-bold ph-arrow-right"></i>' : 'Ver resultado <i class="ph-bold ph-flag-checkered"></i>'}
    </button>
  `;
}

function answerQuiz(chosen) {
  const q = quizData[quizIdx];
  const opts = document.querySelectorAll('.m4quizOpt');
  const feedbackEl = document.getElementById('qFeedback');
  const nextBtn = document.getElementById('qNext');

  opts.forEach(b => {
    b.disabled = true;
    const idx = parseInt(b.dataset.idx);
    if (idx === q.correct) b.classList.add('correct');
    else if (idx === chosen && chosen !== q.correct) b.classList.add('wrong');
  });

  const isCorrect = chosen === q.correct;
  if (isCorrect) quizCorrect++;

  if (feedbackEl) {
    feedbackEl.textContent = q.feedback;
    feedbackEl.className = `m4quizFeedback ${isCorrect ? 'correct' : 'wrong'}`;
  }
  if (nextBtn) nextBtn.classList.add('show');
}

function nextQuestion() {
  quizIdx++;
  showQuestion();
}

/* ─── Flip cards ─────────────────────────── */
document.querySelectorAll('.m4flipCard').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
});

/* ─── Init ───────────────────────────────── */
buildCourier();
renderQuiz();
renderPcFlash();
bqRenderQueue();
bqUpdateStats();

if (typeof Prism !== 'undefined') {
  Prism.highlightAll();
}
