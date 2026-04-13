/**
 * data.js — App-wide constants and static data
 * Life System v1.0
 */

const AppData = (() => {

  // ── Motivational quotes ──────────────────────────────────
  const QUOTES = [
    { text: "The best time to plant a tree was 20 years ago. The <strong>second best time is now</strong>." },
    { text: "<strong>Consistency</strong> is what transforms average into excellence." },
    { text: "Every expert was once a <strong>beginner</strong>. Keep going." },
    { text: "Bugs are just <strong>undiscovered features</strong>. Hunt them down." },
    { text: "Security is not a product, but a <strong>process</strong>. — Bruce Schneier" },
    { text: "The hacker mindset doesn't see boundaries. It sees <strong>challenges</strong>." },
    { text: "One day or day one — <strong>you decide</strong>." },
    { text: "An hour of study is worth more than a day of <strong>wishful thinking</strong>." },
    { text: "Progress, not perfection. <strong>Move forward every day</strong>." },
    { text: "The only way to learn is to <strong>do the work</strong>." },
  ];

  // ── Graduation project lessons ────────────────────────────
  const GRAD_LESSONS = {
    'intro-course-structure' : 'done',
    'basics-setup'           : 'done',
    'basics-syntax1'         : 'done',
    'basics-syntax2'         : 'done',
    'basics-files'           : 'done',
    'basics-http'            : 'done',
    'basics-concurrency'     : 'done',
    'basics-logging'         : 'done',
    'basics-flags'           : 'done',
    'basics-project'         : 'done',
    'basics-packages'        : 'done',
    'basics-regex'           : 'start',
    'assets-concepts'        : 'done',
    'assets-whois'           : 'done',
    'assets-domain'          : 'start',
    'assets-dns'             : 'start',
    'assets-subdomain'       : 'start',
  };

  // ── Month labels ─────────────────────────────────────────
  const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN',
                  'JUL','AUG','SEP','OCT','NOV','DEC'];

  // ── Quote carousel ───────────────────────────────────────
  let quoteIndex = Math.floor(Math.random() * QUOTES.length);

  function showQuote(elementId = 'quoteText') {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.classList.remove('animating');
    void el.offsetWidth; // force reflow
    el.innerHTML = QUOTES[quoteIndex].text;
    el.classList.add('animating');
  }

  function nextQuote(elementId = 'quoteText') {
    quoteIndex = (quoteIndex + 1) % QUOTES.length;
    showQuote(elementId);
  }

  // ── Public API ───────────────────────────────────────────
  return { QUOTES, GRAD_LESSONS, MONTHS, showQuote, nextQuote };

})();

window.AppData = AppData;
