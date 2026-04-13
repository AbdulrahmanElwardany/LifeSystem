/* learning-bugs.js — Page logic */

function toggleBug(element) {
        element.classList.toggle('completed');
        saveProgress();
        updateProgress();
    }
    function togglePhase(header) {
        header.parentElement.classList.toggle('collapsed');
        setTreeContentHeight();
    }
    function saveProgress() {
        const completed = [];
        document.querySelectorAll('.bug-item').forEach((item, index) => {
            if (item.classList.contains('completed')) completed.push(index);
        });
        localStorage.setItem('learningBugsProgress', JSON.stringify(completed));
    }
    function loadProgress() {
        const saved = localStorage.getItem('learningBugsProgress');
        if (saved) {
            const completed = JSON.parse(saved);
            const items = document.querySelectorAll('.bug-item');
            completed.forEach(index => { if (items[index]) items[index].classList.add('completed'); });
        }
        updateProgress();
    }
    function updateProgress() {
        const total = document.querySelectorAll('.bug-item').length;
        const completed = document.querySelectorAll('.bug-item.completed').length;
        const pct = total > 0 ? (completed / total) * 100 : 0;
        document.getElementById('progressFill').style.width = pct + '%';
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('totalCount').textContent = total;
        document.getElementById('progressText').textContent = `${completed} / ${total} Bugs Completed`;
        document.getElementById('footStr').textContent = `${completed} of ${total} topics · ${Math.round(pct)}%`;
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