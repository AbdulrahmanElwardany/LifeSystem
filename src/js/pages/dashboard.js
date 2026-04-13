/* dashboard.js — Dashboard page logic */

function buildStreakRing() {
    const { active, total, month } = Storage.getActiveStreakDays();
    const circ = 2 * Math.PI * 118;
    UI.setText('heroProgressPct', active);
    UI.setText('heroProgressFraction', `${active} / ${total} days · ${AppData.MONTHS[month]}`);
    UI.afterPaint(() => {
      const arc = document.getElementById('heroProgressArc');
      if (arc) {
        arc.style.strokeDasharray  = circ;
        arc.style.strokeDashoffset = circ - (active / total) * circ;
      }
    });
  }

  function loadProgress() {
    const { done, total } = Storage.getOverallProgress(AppData.GRAD_LESSONS);
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    UI.setText('totalCompletedPreview',  done);
    UI.setText('totalLessonsPreview',    total);
    UI.setText('totalLessonsPreview2',   total);
    UI.setText('progressArcPct',         pct);
    UI.setText('statTotalPct',           pct + '%');
    UI.setText('statTotalSub',           `${done} / ${total} lessons`);
    UI.setText('footStr',                `${done} of ${total} lessons completed · ${pct}%`);
    UI.buildNavSegs('navSegProgress', total, done, 'on-g');
    UI.afterPaint(() => {
      UI.setBarWidth('statTotalBar', pct);
      UI.setMiniArc('progressArc', pct);
    });
  }

  function loadPlanner() {
    const { sessions } = Storage.getTodaySessions();
    const mins = Math.round(sessions.reduce((a, s) => a + (s.elapsed || 0), 0) / 60);
    UI.setText('weekTasksPreview',      sessions.length);
    UI.setText('weekCompletionPreview', mins);
    UI.setText('statSessions',          sessions.length);
    UI.setText('statMinutes',           mins + ' min studied');
    UI.buildNavSegs('navSegPlanner', 10, sessions.length, 'on-c');
    UI.afterPaint(() => {
      UI.setBarWidth('statSessionBar', Math.min((sessions.length / 10) * 100, 100));
      const arc = document.getElementById('plannerArc');
      if (arc) arc.style.strokeDashoffset = 125.66 - Math.min(sessions.length / 10, 1) * 125.66;
    }, 500);
  }

  function loadChecklist() {
    const reminders = Storage.getReminders();
    const writeups  = Storage.getWriteups();
    const rDone = reminders.filter(x => x.completed).length;
    const wDone = writeups.filter(x => x.completed).length;
    const total = reminders.length + writeups.length || 1;
    const done  = rDone + wDone;

    UI.setText('totalRemindersPreview', reminders.length);
    UI.setText('totalWriteupsPreview',  writeups.length);
    UI.setText('statReminders',         reminders.length);
    UI.setText('statReminderSub',       (reminders.length - rDone) > 0 ? `${reminders.length - rDone} pending` : `${rDone} completed`);
    UI.setText('statWriteups',          writeups.length);
    UI.setText('statWriteupSub',        `${wDone} completed`);
    UI.buildNavSegs('navSegChecklist', Math.max(total, 10), done, 'on-p');
    UI.afterPaint(() => {
      UI.setBarWidth('statReminderBar', reminders.length > 0 ? (rDone / reminders.length) * 100 : 0);
      UI.setBarWidth('statWriteupBar',  writeups.length  > 0 ? (wDone / writeups.length)  * 100 : 0);
      const arc = document.getElementById('checklistArc');
      if (arc) arc.style.strokeDashoffset = 125.66 - (done / total) * 125.66;
    }, 600);
  }

  function loadGoals() {
    const goals = Storage.getTodayGoals();
    const done  = goals.filter(x => x.done).length;
    UI.setText('goalsTodayPreview', goals.length);
    UI.setText('goalsDonePreview',  done);
    UI.buildNavSegs('navSegGoals', Math.max(goals.length, 5), done, 'on-a');
    UI.afterPaint(() => {
      const arc = document.getElementById('goalsArc');
      if (arc) {
        const pct = goals.length > 0 ? (done / goals.length) * 100 : 0;
        arc.style.strokeDashoffset = 125.66 - (pct / 100) * 125.66;
      }
    }, 600);
  }

  document.addEventListener('DOMContentLoaded', () => {
    AppData.showQuote();
    buildStreakRing();
    loadProgress();
    loadPlanner();
    loadChecklist();
    loadGoals();
  });