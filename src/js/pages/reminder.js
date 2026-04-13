/* reminder.js — Page logic */

const get = () => JSON.parse(localStorage.getItem('reminders') || '[]');
    const save = r => localStorage.setItem('reminders', JSON.stringify(r));

    function addReminder() {
        const title    = document.getElementById('reminderTitle').value.trim();
        const link     = document.getElementById('reminderLink').value.trim();
        const date     = document.getElementById('reminderDate').value;
        const priority = document.getElementById('reminderPriority').value;
        if (!title) { alert('Please enter a title'); return; }
        if (!date)  { alert('Please select a date');  return; }
        const r = get();
        r.push({ id: Date.now(), title, link, date, priority, completed: false, createdAt: new Date().toISOString() });
        save(r);
        document.getElementById('reminderTitle').value    = '';
        document.getElementById('reminderLink').value     = '';
        document.getElementById('reminderDate').value     = '';
        document.getElementById('reminderPriority').value = 'medium';
        renderAll(r);
    }

    function toggleReminder(id) {
        const r = get(), item = r.find(x => x.id === id);
        if (item) { item.completed = !item.completed; save(r); renderAll(r); }
    }

    function deleteReminder(id) {
        if (!confirm('Delete this reminder?')) return;
        const filtered = get().filter(x => x.id !== id);
        save(filtered); renderAll(filtered);
    }

    function renderAll(reminders) {
        const total   = reminders.length;
        const done    = reminders.filter(r => r.completed).length;
        document.getElementById('statTotal').textContent   = total;
        document.getElementById('statDone').textContent    = done;
        document.getElementById('statPending').textContent = total - done;
        document.getElementById('statHigh').textContent    = reminders.filter(r => r.priority === 'high' && !r.completed).length;
        document.getElementById('listCount').textContent   = `${total} item${total !== 1 ? 's' : ''}`;
        document.getElementById('footStr').textContent     = `${done} / ${total} completed`;

        const container = document.getElementById('remindersList');
        if (!total) {
            container.innerHTML = `<div class="empty-state"><span class="empty-icon">🔔</span><div class="empty-title">No reminders yet</div><div class="empty-sub">Add your first reminder above to get started</div></div>`;
            return;
        }
        const sorted = [...reminders].sort((a, b) => new Date(a.date) - new Date(b.date));
        const slabIcon = {high:'🔴',medium:'🟡',low:'🟢'};
        container.innerHTML = sorted.map(r => `
            <div class="reminder-item p-${r.priority} ${r.completed ? 'completed' : ''}">
                <div class="reminder-slab">${slabIcon[r.priority]||'🔵'}</div>
                <div class="reminder-body">
                    <div class="reminder-info">
                        <div class="reminder-title">${r.title}</div>
                        <div class="reminder-meta">
                            ${r.link ? `<a href="${r.link}" target="_blank" class="reminder-link">🔗 ${r.link}</a>` : ''}
                            <div class="meta-pill">📅 ${formatDate(r.date)}</div>
                            <span class="pbadge pbadge-${r.priority}">${r.priority.toUpperCase()}</span>
                            ${r.completed ? `<div class="meta-pill" style="color:var(--green);border-color:rgba(0,255,136,.3)">✓ DONE</div>` : ''}
                        </div>
                    </div>
                </div>
                <div class="reminder-footer">
                    <button class="action-btn complete-btn" onclick="toggleReminder(${r.id})">${r.completed ? '↩ Undo' : '✓ Done'}</button>
                    <button class="action-btn delete-btn" onclick="deleteReminder(${r.id})">✕ Delete</button>
                </div>
            </div>
        `).join('');
    }

    function formatDate(d) {
        return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('reminderDate').valueAsDate = new Date();
        renderAll(get());
    });