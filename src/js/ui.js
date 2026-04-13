/**
 * ui.js — Shared UI utilities
 * Life System v1.0
 *
 * Handles: mini arcs, segmented bars, ring progress,
 * animated counters, and other reusable DOM helpers.
 */

const UI = (() => {

  // ── Mini SVG arc (52×52, r=20, dasharray=125.66) ─────────
  /**
   * @param {SVGCircleElement|string} el - element or id
   * @param {number} pct - 0 to 100
   */
  function setMiniArc(el, pct) {
    const node = typeof el === 'string' ? document.getElementById(el) : el;
    if (!node) return;
    node.style.strokeDashoffset = 125.66 - (Math.min(pct, 100) / 100) * 125.66;
  }

  // ── Large ring arc ───────────────────────────────────────
  /**
   * @param {string} id - element id
   * @param {number} pct - 0 to 100
   * @param {number} circ - full circumference (default 801.1 for r=128 ring)
   */
  function setRingArc(id, pct, circ = 801.1) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.strokeDasharray  = circ;
    el.style.strokeDashoffset = circ - (Math.min(pct, 100) / 100) * circ;
  }

  // ── Segmented progress bar ───────────────────────────────
  /**
   * @param {string}  containerId
   * @param {number}  total  - total items
   * @param {number}  done   - completed items
   * @param {string}  cls    - 'on-g' | 'on-c' | 'on-p' | 'on-a'
   * @param {number}  [maxSlots=20]
   */
  function buildNavSegs(containerId, total, done, cls, maxSlots = 20) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    const slots      = Math.min(total, maxSlots);
    const filledSlots = total > 0 ? Math.round((done / total) * slots) : 0;
    for (let i = 0; i < slots; i++) {
      const seg = document.createElement('div');
      seg.className = 'nav-seg' + (i < filledSlots ? ' ' + cls : '');
      container.appendChild(seg);
    }
  }

  // ── Simple bar width ─────────────────────────────────────
  function setBarWidth(id, pct) {
    const el = document.getElementById(id);
    if (el) el.style.width = Math.min(pct, 100) + '%';
  }

  // ── Text setter ──────────────────────────────────────────
  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  // ── Animated number count-up ─────────────────────────────
  /**
   * @param {string} id
   * @param {number} target
   * @param {number} [duration=800]
   */
  function countUp(id, target, duration = 800) {
    const el = document.getElementById(id);
    if (!el) return;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(t * target);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ── Defer visual updates (after CSS transitions settle) ──
  function afterPaint(fn, delay = 400) {
    setTimeout(fn, delay);
  }

  // ── Render background scaffolding ────────────────────────
  /** Injects the grid-bg + orbs HTML before the .wrap div */
  function renderBackground() {
    const bg = `
      <div class="grid-bg"></div>
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>`;
    document.body.insertAdjacentHTML('afterbegin', bg);
  }

  // ── Public API ───────────────────────────────────────────
  return {
    setMiniArc,
    setRingArc,
    buildNavSegs,
    setBarWidth,
    setText,
    countUp,
    afterPaint,
    renderBackground,
  };

})();

window.UI = UI;
