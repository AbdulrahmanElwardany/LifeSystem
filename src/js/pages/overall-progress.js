/* overall-progress.js — Page logic */

/* ── Graduation lesson defaults ───────────────────────── */
    const GRAD_LESSONS = {
        'intro-course-structure':'done','basics-setup':'done','basics-syntax1':'done',
        'basics-syntax2':'done','basics-files':'done','basics-http':'done',
        'basics-concurrency':'done','basics-logging':'done','basics-flags':'done',
        'basics-project':'done','basics-packages':'done','basics-regex':'start',
        'assets-concepts':'done','assets-whois':'done','assets-domain':'start',
        'assets-dns':'start','assets-subdomain':'start'
    };

    /* ── Helpers ───────────────────────────────────────────── */
    function animNum(el, to, decimals) {
        const start = Date.now(), dur = 1200, from = 0;
        const run = () => {
            const p = Math.min((Date.now()-start)/dur, 1);
            const ease = 1 - Math.pow(1-p, 3);
            el.textContent = (from + (to-from)*ease).toFixed(decimals||0);
            if (p < 1) requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
    }

    function setMiniArc(arcEl, pct) {
        const c = 125.66;
        arcEl.style.strokeDashoffset = c - (pct/100)*c;
    }

    function buildSegs(container, total, done, cls) {
        container.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const s = document.createElement('div');
            s.className = 'seg' + (i < done ? ' ' + cls : '');
            container.appendChild(s);
        }
    }

    /* ── Big ring ──────────────────────────────────────────── */
    function setRing(pct, done, total) {
        const circ = 2 * Math.PI * 118; // 741.12
        document.getElementById('ringProg').style.strokeDasharray  = circ;
        document.getElementById('ringProg').style.strokeDashoffset = circ - (pct/100)*circ;
        animNum(document.getElementById('ringPct'), pct, 0);
        // workaround: update text after animation starts
        setTimeout(() => {
            document.getElementById('ringPct').textContent = Math.round(pct) + '%';
        }, 1250);
        document.getElementById('ringCount').textContent = `${done} / ${total}`;
    }

    /* ── Main ──────────────────────────────────────────────── */
    function loadProgress() {
        // Bug Bounty
        const bbSaved = localStorage.getItem('bugBountyProgress');
        const bbDone  = bbSaved ? JSON.parse(bbSaved).length : 0;
        const bbTotal = 93;
        const bbPct   = Math.round((bbDone/bbTotal)*100);

        // OWASP
        const owSaved = localStorage.getItem('learningBugsProgress');
        const owDone  = owSaved ? JSON.parse(owSaved).length : 0;
        const owTotal = 20;
        const owPct   = Math.round((owDone/owTotal)*100);

        // Graduation
        const grSaved = localStorage.getItem('graduationProgress');
        const grState = grSaved ? JSON.parse(grSaved) : GRAD_LESSONS;
        const grDone  = Object.values(grState).filter(v=>v==='done').length;
        const grTotal = Object.keys(GRAD_LESSONS).length;
        const grPct   = Math.round((grDone/grTotal)*100);

        // Totals
        const totalDone  = bbDone + owDone + grDone;
        const totalItems = bbTotal + owTotal + grTotal;
        const totalPct   = Math.round((totalDone/totalItems)*100);

        /* ── Update Bug Bounty card ── */
        document.getElementById('bbPct').textContent  = bbPct;
        document.getElementById('bbDone').textContent = bbDone;
        setTimeout(() => setMiniArc(document.getElementById('bbArc'), bbPct), 300);
        buildSegs(document.getElementById('bbSegs'), Math.min(bbTotal,20), Math.round((bbDone/bbTotal)*20), 'filled-g');

        /* ── Update OWASP card ── */
        document.getElementById('owPct').textContent  = owPct;
        document.getElementById('owDone').textContent = owDone;
        setTimeout(() => setMiniArc(document.getElementById('owArc'), owPct), 400);
        buildSegs(document.getElementById('owSegs'), owTotal, owDone, 'filled-c');

        /* ── Update Graduation card ── */
        document.getElementById('grPct').textContent  = grPct;
        document.getElementById('grDone').textContent = grDone;
        setTimeout(() => setMiniArc(document.getElementById('grArc'), grPct), 500);
        buildSegs(document.getElementById('grSegs'), grTotal, grDone, 'filled-p');

        /* ── Stats bar ── */
        setTimeout(() => {
            animNum(document.getElementById('sDone'),   totalDone);
            animNum(document.getElementById('sTotal'),  totalItems);
            animNum(document.getElementById('sRemain'), totalItems - totalDone);
        }, 200);

        /* ── Ring ── */
        setTimeout(() => setRing(totalPct, totalDone, totalItems), 300);

        /* ── Footer ── */
        document.getElementById('footStr').textContent =
            `${totalDone} of ${totalItems} lessons completed · ${totalPct}%`;

        /* ── Assignees ── */
        initAssignees();
    }

    /* ── Assignee config ───────────────────────────────────── */
    const COURSE_META = {
        bb: { tag: 'Course — 01', title: 'Bug Bounty Hunter',   accent: '#00ff88', accentBg: 'rgba(0,255,136,0.12)',   accentBorder: 'rgba(0,255,136,0.35)',   saveBg: 'linear-gradient(135deg,#00ff88,#00d4ff)', saveColor: '#05050f' },
        ow: { tag: 'Course — 02', title: 'OWASP Top 10',        accent: '#00e5ff', accentBg: 'rgba(0,229,255,0.12)',   accentBorder: 'rgba(0,229,255,0.35)',   saveBg: 'linear-gradient(135deg,#00e5ff,#7b2cbf)', saveColor: '#05050f' },
        gr: { tag: 'Course — 03', title: 'Graduation Project',  accent: '#9b5de5', accentBg: 'rgba(155,93,229,0.15)', accentBorder: 'rgba(155,93,229,0.4)',   saveBg: 'linear-gradient(135deg,#9b5de5,#ec4899)', saveColor: '#fff'    },
    };

    let activeKey = null;

    function getInitials(name) {
        if (!name || !name.trim()) return '?';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    function renderAssignee(key) {
        const name   = localStorage.getItem('assignee_' + key) || '';
        const meta   = COURSE_META[key];
        const initials = getInitials(name);

        const avatar  = document.getElementById(key + 'Avatar');
        const display = document.getElementById(key + 'NameDisplay');
        const btn     = avatar.closest('.assignee-row').querySelector('.assign-btn');

        avatar.textContent   = initials;
        avatar.style.background   = meta.accentBg;
        avatar.style.color        = meta.accent;
        avatar.style.borderColor  = meta.accentBorder;

        if (name.trim()) {
            display.textContent  = name.trim();
            display.className    = 'assignee-name-display';
            btn.textContent      = 'Change';
        } else {
            display.textContent  = 'Not set';
            display.className    = 'assignee-name-display empty';
            btn.textContent      = 'Set';
        }
    }

    function openPopover(key) {
        activeKey = key;
        const meta    = COURSE_META[key];
        const saved   = localStorage.getItem('assignee_' + key) || '';
        const overlay = document.getElementById('popoverOverlay');
        const input   = document.getElementById('popoverInput');
        const preview = document.getElementById('popoverAvatarPreview');
        const saveBtn = document.getElementById('popoverSave');

        document.getElementById('popoverTag').textContent   = meta.tag;
        document.getElementById('popoverTitle').textContent = 'Set Instructor';

        preview.style.background   = meta.accentBg;
        preview.style.color        = meta.accent;
        preview.style.borderColor  = meta.accentBorder;
        preview.textContent        = getInitials(saved);

        saveBtn.style.background = meta.saveBg;
        saveBtn.style.color      = meta.saveColor;

        input.value = saved;

        overlay.classList.add('open');
        setTimeout(() => input.focus(), 120);

        // Live preview initials
        input.oninput = () => {
            preview.textContent = getInitials(input.value);
        };

        // Enter to save
        input.onkeydown = (e) => {
            if (e.key === 'Enter') saveAssignee();
            if (e.key === 'Escape') closePopover();
        };
    }

    function closePopover() {
        document.getElementById('popoverOverlay').classList.remove('open');
        activeKey = null;
    }

    function closePopoverOnBg(e) {
        if (e.target === document.getElementById('popoverOverlay')) closePopover();
    }

    function saveAssignee() {
        if (!activeKey) return;
        const name = document.getElementById('popoverInput').value.trim();
        localStorage.setItem('assignee_' + activeKey, name);
        renderAssignee(activeKey);
        closePopover();
    }

    function clearAssignee() {
        if (!activeKey) return;
        localStorage.removeItem('assignee_' + activeKey);
        renderAssignee(activeKey);
        closePopover();
    }

    function initAssignees() {
        ['bb','ow','gr'].forEach(renderAssignee);
    }

    document.addEventListener('DOMContentLoaded', loadProgress);