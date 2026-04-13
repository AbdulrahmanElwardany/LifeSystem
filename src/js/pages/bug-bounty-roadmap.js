/* bug-bounty-roadmap.js — Page logic */

function toggleVideo(element) {
    element.classList.toggle('completed');
    updatePhaseProgress(element);
    saveProgress();
    updateProgress();
}
function togglePhase(header) {
    const section = header.parentElement;
    section.classList.toggle('collapsed');
    setTreeContentHeight();
}
function updatePhaseProgress(videoElement) {
    const phase = videoElement.closest('.phase-section');
    const phaseHeader = phase.querySelector('.phase-header');
    const total = phase.querySelectorAll('.video-item').length;
    const completed = phase.querySelectorAll('.video-item.completed').length;
    phaseHeader.querySelector('.phase-completed').textContent = completed;
    phaseHeader.querySelector('.phase-total').textContent = total;
}
function initializePhaseProgress() {
    document.querySelectorAll('.phase-section').forEach(phase => {
        const phaseHeader = phase.querySelector('.phase-header');
        const total = phase.querySelectorAll('.video-item').length;
        const completed = phase.querySelectorAll('.video-item.completed').length;
        phaseHeader.querySelector('.phase-completed').textContent = completed;
        phaseHeader.querySelector('.phase-total').textContent = total;
    });
}
function saveProgress() {
    const completed = [];
    document.querySelectorAll('.video-item').forEach((item, index) => {
        if (item.classList.contains('completed')) completed.push(index);
    });
    localStorage.setItem('bugBountyProgress', JSON.stringify(completed));
}
function loadProgress() {
    const saved = localStorage.getItem('bugBountyProgress');
    if (saved) {
        const completed = JSON.parse(saved);
        const items = document.querySelectorAll('.video-item');
        completed.forEach(index => { if (items[index]) items[index].classList.add('completed'); });
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
    // Ring
    const circ = 175.93;
    const ring = document.getElementById('ringFill');
    ring.style.strokeDasharray = circ;
    ring.style.strokeDashoffset = circ - (pct / 100) * circ;
    document.getElementById('ringPct').textContent = Math.round(pct) + '%';
}
function setTreeContentHeight() {
    document.querySelectorAll('.tree-content').forEach(content => {
        if (!content.parentElement.classList.contains('collapsed')) {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });
}
document.addEventListener('DOMContentLoaded', () => { loadProgress(); setTreeContentHeight(); });