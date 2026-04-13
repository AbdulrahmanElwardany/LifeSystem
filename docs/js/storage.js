/**
 * storage.js — Centralized localStorage helpers
 * Life System v1.0
 *
 * All reads/writes go through these functions so the key names
 * are defined in one place and are easy to refactor or migrate.
 */

const Storage = (() => {

  // ── Key builders ─────────────────────────────────────────
  const keys = {
    daySession : (dateStr) => `day-${dateStr}`,
    goalsDaily : (dateStr) => `goals-daily-${dateStr}`,
    bugBounty  : () => 'bugBountyProgress',
    learningBugs: () => 'learningBugsProgress',
    graduation : () => 'graduationProgress',
    reminders  : () => 'reminders',
    idorWriteups: () => 'idorWriteups',
  };

  // ── Date helpers ─────────────────────────────────────────
  function todayStr() {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
  }

  function daysInCurrentMonth() {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth() + 1, 0).getDate();
  }

  // ── Generic get/set ──────────────────────────────────────
  function get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      console.warn('[Storage] Failed to write key:', key);
      return false;
    }
  }

  function remove(key) {
    localStorage.removeItem(key);
  }

  // ── Domain-specific helpers ──────────────────────────────

  /** Returns today's planner data { cat, sessions[] } */
  function getTodaySessions() {
    return get(keys.daySession(todayStr()), { cat: null, sessions: [] });
  }

  /** Saves today's planner data */
  function setTodaySessions(data) {
    return set(keys.daySession(todayStr()), data);
  }

  /** Returns number of active days this month */
  function getActiveStreakDays() {
    const n     = new Date();
    const year  = n.getFullYear();
    const month = String(n.getMonth() + 1).padStart(2, '0');
    const total = daysInCurrentMonth();
    let active  = 0;
    for (let d = 1; d <= total; d++) {
      const key  = keys.daySession(`${year}-${month}-${String(d).padStart(2, '0')}`);
      const data = get(key, { sessions: [] });
      if ((data.sessions || []).length > 0) active++;
    }
    return { active, total, month: n.getMonth(), year };
  }

  /** Returns overall progress totals */
  function getOverallProgress(GRAD_LESSONS) {
    const bbDone  = (() => { const s = get(keys.bugBounty(),    []); return Array.isArray(s) ? s.length : 0; })();
    const owDone  = (() => { const s = get(keys.learningBugs(), []); return Array.isArray(s) ? s.length : 0; })();
    const grState = get(keys.graduation(), {});
    const grDone  = Object.values(grState).filter(v => v === 'done').length;
    const grTotal = Object.keys(GRAD_LESSONS).length;

    return {
      done  : bbDone + owDone + grDone,
      total : 93 + 20 + grTotal,
      bbDone, owDone, grDone, grTotal,
    };
  }

  /** Returns reminders array */
  function getReminders() { return get(keys.reminders(), []); }
  function setReminders(arr) { return set(keys.reminders(), arr); }

  /** Returns IDOR writeups array */
  function getWriteups() { return get(keys.idorWriteups(), []); }
  function setWriteups(arr) { return set(keys.idorWriteups(), arr); }

  /** Returns today's goals array */
  function getTodayGoals() { return get(keys.goalsDaily(todayStr()), []); }
  function setTodayGoals(arr) { return set(keys.goalsDaily(todayStr()), arr); }

  /** Returns goals for a specific date string (YYYY-MM-DD) */
  function getGoalsForDate(dateStr) { return get(keys.goalsDaily(dateStr), []); }
  function setGoalsForDate(dateStr, arr) { return set(keys.goalsDaily(dateStr), arr); }

  // ── Public API ───────────────────────────────────────────
  return {
    keys,
    get, set, remove,
    todayStr,
    daysInCurrentMonth,
    getTodaySessions, setTodaySessions,
    getActiveStreakDays,
    getOverallProgress,
    getReminders, setReminders,
    getWriteups,  setWriteups,
    getTodayGoals, setTodayGoals,
    getGoalsForDate, setGoalsForDate,
  };

})();

// Make available globally (no bundler needed)
window.Storage = Storage;
