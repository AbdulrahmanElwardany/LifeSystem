/* automation-roadmap.js — Page logic */

const LESSON_KEYS = [
        'intro-course-structure',
        'basics-setup','basics-syntax1','basics-syntax2','basics-files',
        'basics-http','basics-concurrency','basics-logging','basics-flags',
        'basics-project','basics-packages','basics-regex',
        'assets-concepts','assets-whois','assets-domain','assets-dns','assets-subdomain'
    ];
    const LESSON_DEFAULTS = [
        'done',
        'done','done','done','done',
        'done','done','done','done',
        'done','done','start',
        'done','done','start','start','start'
    ];

    function toggleVideo(element) {
        element.classList.toggle('completed');
        updatePhaseProgress(element);
        saveProgress();
        updateProgress();
    }
    function togglePhase(header) {
        header.parentElement.classList.toggle('collapsed');
        setTreeContentHeight();
    }
    function updatePhaseProgress(videoElement) {
        const phase = videoElement.closest('.phase-section');
        const ph = phase.querySelector('.phase-header');
        ph.querySelector('.phase-completed').textContent = phase.querySelectorAll('.video-item.completed').length;
        ph.querySelector('.phase-total').textContent = phase.querySelectorAll('.video-item').length;
    }
    function initializePhaseProgress() {
        document.querySelectorAll('.phase-section').forEach(phase => {
            const ph = phase.querySelector('.phase-header');
            ph.querySelector('.phase-completed').textContent = phase.querySelectorAll('.video-item.completed').length;
            ph.querySelector('.phase-total').textContent = phase.querySelectorAll('.video-item').length;
        });
    }
    function saveProgress() {
        const completedIndexes = [];
        document.querySelectorAll('.video-item').forEach((item, i) => {
            if (item.classList.contains('completed')) completedIndexes.push(i);
        });
        localStorage.setItem('graduationProgress2', JSON.stringify(completedIndexes));
        const state = {};
        document.querySelectorAll('.video-item').forEach((item, i) => {
            if (LESSON_KEYS[i]) state[LESSON_KEYS[i]] = item.classList.contains('completed') ? 'done' : LESSON_DEFAULTS[i];
        });
        localStorage.setItem('graduationProgress', JSON.stringify(state));
    }
    function loadProgress() {
        const saved = localStorage.getItem('graduationProgress2');
        const items = document.querySelectorAll('.video-item');
        if (saved) {
            JSON.parse(saved).forEach(i => { if (items[i]) items[i].classList.add('completed'); });
        } else {
            const oldSaved = localStorage.getItem('graduationProgress');
            if (oldSaved) {
                const state = JSON.parse(oldSaved);
                LESSON_KEYS.forEach((key, i) => { if (state[key] === 'done' && items[i]) items[i].classList.add('completed'); });
            } else {
                [0,1,2,3,4,5,6,7,8,9,10,12,13].forEach(i => { if (items[i]) items[i].classList.add('completed'); });
            }
        }
        initializePhaseProgress();
        updateProgress();
    }
    function updateProgress() {
        const total = document.querySelectorAll('.video-item').length;
        const completed = document.querySelectorAll('.video-item.completed').length;
        const pct = total > 0 ? (completed / total) * 100 : 0;
        document.getElementById('progressFill').style.width = pct + '%';
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('totalCount').textContent = total;
        document.getElementById('progressText').textContent = `${completed} / ${total} Lessons Completed`;
        document.getElementById('footStr').textContent = `${completed} of ${total} lessons · ${Math.round(pct)}%`;
        const circ = 175.93;
        const ring = document.getElementById('ringFill');
        ring.style.strokeDasharray = circ;
        ring.style.strokeDashoffset = circ - (pct / 100) * circ;
        document.getElementById('ringPct').textContent = Math.round(pct) + '%';
    }
    function setTreeContentHeight() {
        document.querySelectorAll('.tree-content').forEach(content => {
            if (!content.parentElement.classList.contains('collapsed')) content.style.maxHeight = content.scrollHeight + 'px';
        });
    }
    document.addEventListener('DOMContentLoaded', () => { loadProgress(); setTreeContentHeight(); });