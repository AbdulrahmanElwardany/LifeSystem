/* idor-writeups.js — Page logic */

const get  = () => JSON.parse(localStorage.getItem('idorWriteups') || '[]');
    const save = w => localStorage.setItem('idorWriteups', JSON.stringify(w));

    function addWriteup() {
        const title    = document.getElementById('writeupTitle').value.trim();
        const link     = document.getElementById('writeupLink').value.trim();
        const priority = document.getElementById('writeupPriority').value;
        const date     = document.getElementById('writeupDate').value;
        if (!title) { alert('Please enter a title'); return; }
        if (!date)  { alert('Please select a date');  return; }
        const w = get();
        w.push({ id: Date.now(), title, link, priority, date, completed: false, createdAt: new Date().toISOString() });
        save(w);
        document.getElementById('writeupTitle').value    = '';
        document.getElementById('writeupLink').value     = '';
        document.getElementById('writeupPriority').value = 'medium';
        document.getElementById('writeupDate').value     = '';
        renderAll(w);
    }

    function toggleWriteup(id) {
        const w = get(), item = w.find(x => x.id === id);
        if (item) { item.completed = !item.completed; save(w); renderAll(w); }
    }

    function deleteWriteup(id) {
        if (!confirm('Delete this writeup?')) return;
        const filtered = get().filter(x => x.id !== id);
        save(filtered); renderAll(filtered);
    }

    function editWriteup(id) {
        const w = get(), item = w.find(x => x.id === id);
        if (item) {
            document.getElementById('writeupTitle').value    = item.title;
            document.getElementById('writeupLink').value     = item.link || '';
            document.getElementById('writeupPriority').value = item.priority;
            document.getElementById('writeupDate').value     = item.date;
            const filtered = w.filter(x => x.id !== id);
            save(filtered); renderAll(filtered);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function renderAll(writeups) {
        const total   = writeups.length;
        const done    = writeups.filter(w => w.completed).length;
        document.getElementById('statTotal').textContent   = total;
        document.getElementById('statDone').textContent    = done;
        document.getElementById('statPending').textContent = total - done;
        document.getElementById('statHigh').textContent    = writeups.filter(w => w.priority === 'high' && !w.completed).length;
        document.getElementById('listCount').textContent   = `${total} item${total !== 1 ? 's' : ''}`;
        document.getElementById('footStr').textContent     = `${done} / ${total} completed`;

        const container = document.getElementById('writeupsList');
        if (!total) {
            container.innerHTML = `<div class="empty-state"><span class="empty-icon">📝</span><div class="empty-title">No writeups yet</div><div class="empty-sub">Add your first bug writeup above to start tracking your findings</div></div>`;
            return;
        }
        const sorted = [...writeups].sort((a, b) => new Date(b.date) - new Date(a.date));
        const slabIcon = {high:'🔴',medium:'🟡',low:'🔵'};
        container.innerHTML = sorted.map(w => `
            <div class="writeup-item p-${w.priority} ${w.completed ? 'completed' : ''}">
                <div class="writeup-slab">${slabIcon[w.priority]||'🔵'}</div>
                <div class="writeup-body">
                    <div class="writeup-info">
                        <div class="writeup-title">${w.title}</div>
                        <div class="writeup-meta">
                            ${w.link ? `<a href="${w.link}" target="_blank" class="writeup-link">🔗 ${w.link}</a>` : ''}
                            <div class="meta-pill">📅 ${formatDate(w.date)}</div>
                            <span class="pbadge pbadge-${w.priority}">${w.priority.toUpperCase()}</span>
                            ${w.completed ? `<div class="meta-pill" style="color:var(--cyan);border-color:rgba(0,229,255,.3)">✓ DONE</div>` : ''}
                        </div>
                    </div>
                </div>
                <div class="writeup-footer">
                    <button class="action-btn complete-btn" onclick="toggleWriteup(${w.id})">${w.completed ? '↩ Undo' : '✓ Done'}</button>
                    <button class="action-btn delete-btn" onclick="deleteWriteup(${w.id})">✕ Delete</button>
                </div>
            </div>
        `).join('');
    }

    function formatDate(d) {
        return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('writeupDate').valueAsDate = new Date();
        renderAll(get());
    });