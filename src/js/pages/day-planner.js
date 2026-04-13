/* day-planner.js — Page logic */

const DAY_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DAY_SHORT   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const CATS = {
    learn:   { label:'Learn Vulnerability', icon:'🐛', sub:'Study CVEs, concepts & techniques', color:'#00e5ff', topicLabel:'Vulnerability / Topic', topicPH:'e.g., IDOR via BOLA, XSS stored attacks...', linkLabel:'Resource / Link',  linkPH:'https://...', addBtn:'Add Session' },
    labs:    { label:'Solve Labs',           icon:'💻', sub:'PortSwigger, HackTheBox & CTFs',    color:'#9b5de5', topicLabel:'Lab Name',               topicPH:'e.g., SQL Injection UNION attack...',    linkLabel:'Lab URL',        linkPH:'https://portswigger.net/...', addBtn:'Add Lab' },
    hunting: { label:'Hunting',              icon:'🎯', sub:'Bug bounty recon & reporting',      color:'#f97316', topicLabel:'Target / Scope',          topicPH:'e.g., target.com, api.example.com...',  linkLabel:'Program URL',    linkPH:'https://hackerone.com/...', addBtn:'Add Target' }
};

const swState = {};
function getSW() {
    if(!swState['today']) swState['today'] = { running:false, startTs:null, elapsed:0, intervalId:null, stars:0 };
    return swState['today'];
}

const TODAY = new Date();
function todayKey() { return `day-${TODAY.getFullYear()}-${String(TODAY.getMonth()+1).padStart(2,'0')}-${String(TODAY.getDate()).padStart(2,'0')}`; }
function dateKey(d)  { return `day-${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function getTodayData()  { return JSON.parse(localStorage.getItem(todayKey())||'{"cat":null,"sessions":[]}'); }
function saveTodayData(data) { localStorage.setItem(todayKey(), JSON.stringify(data)); }
function getDateData(d)  { return JSON.parse(localStorage.getItem(dateKey(d))||'{"cat":null,"sessions":[]}'); }

function formatElapsed(secs) {
    if(!secs||secs<=0) return '00:00';
    const h=Math.floor(secs/3600), m=Math.floor((secs%3600)/60), s=secs%60;
    if(h>0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
function secsToHuman(secs) {
    if(!secs||secs<=0) return '0m';
    const h=Math.floor(secs/3600), m=Math.floor((secs%3600)/60);
    if(h>0) return `${h}h ${m}m`;
    return `${m}m`;
}

function switchMainTab(id) {
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.id===id));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id===`pane-${id}`));
    if(id==='week')  renderWeekScore();
    if(id==='month') renderMonthScore();
}

function init() {
    document.getElementById('headerDate').textContent =
        TODAY.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
    updateBadges();
    renderToday();
}

function updateBadges() {
    const td = getTodayData();
    const todaySessions = (td.sessions||[]).length;
    const b1 = document.getElementById('badge-today');
    if(b1) b1.textContent = todaySessions > 0 ? todaySessions + ' session' + (todaySessions!==1?'s':'') : 'No sessions';

    const now = new Date();
    const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate()-now.getDay());
    let weekActive=0;
    for(let i=0;i<7;i++){ const d=new Date(startOfWeek); d.setDate(startOfWeek.getDate()+i); if((getDateData(d).sessions||[]).length>0) weekActive++; }
    const b2 = document.getElementById('badge-week');
    if(b2) b2.textContent = weekActive + '/7 days';

    const year=now.getFullYear(), month=now.getMonth(), daysInMonth=new Date(year,month+1,0).getDate();
    let monthActive=0;
    for(let day=1;day<=daysInMonth;day++){ const d=new Date(year,month,day); if((getDateData(d).sessions||[]).length>0) monthActive++; }
    const b3 = document.getElementById('badge-month');
    if(b3) b3.textContent = monthActive + '/' + daysInMonth + ' days';
}

function renderToday() {
    const dd = getTodayData();
    const cat = dd.cat;
    const dateStr = TODAY.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
    const todayTab = document.querySelector('.tab[data-id="today"]');
    if(todayTab) todayTab.dataset.cat = cat||'';

    const selectorHTML = `
        <div class="cat-selector-card" id="cat-selector" style="${cat?'display:none':''}">
            <div class="cat-selector-title">// ${dateStr} — What will you do today?</div>
            <div class="cat-options">
                ${Object.entries(CATS).map(([key,cfg])=>`
                    <div class="cat-option ${cat===key?'selected':''}" data-val="${key}" onclick="selectCat('${key}')">
                        <div class="opt-icon">${cfg.icon}</div>
                        <div class="opt-label">${cfg.label}</div>
                        <div class="opt-sub">${cfg.sub}</div>
                    </div>`).join('')}
            </div>
        </div>`;

    if(!cat){
        document.getElementById('pane-today').innerHTML = selectorHTML + `<div class="no-cat-msg">↑ PICK A CATEGORY ABOVE TO START YOUR SESSION</div>`;
        return;
    }

    const cfg = CATS[cat];
    const sessions = dd.sessions||[];
    const totalSecs = sessions.reduce((a,s)=>a+(s.elapsed||0),0);
    const avgRating = sessions.length ? sessions.reduce((a,s)=>a+(s.rating||0),0)/sessions.length : 0;
    const sw = getSW();

    document.getElementById('pane-today').innerHTML = selectorHTML + `
        <div class="day-work-area" style="--c:${cfg.color}">
            <div class="day-banner" style="--c:${cfg.color}">
                <div class="day-banner-icon">${cfg.icon}</div>
                <div class="day-banner-info">
                    <div class="day-banner-title">${cfg.label}</div>
                    <div class="day-banner-sub">// ${dateStr} · ${cfg.sub}</div>
                </div>
                <button class="change-cat-btn" onclick="changeCat()">✏️ CHANGE</button>
            </div>

            <div class="day-stats">
                <div class="stat-box" style="--c:${cfg.color}">
                    <div class="stat-box-value" id="stat-count">${sessions.length}</div>
                    <div class="stat-box-label">Sessions</div>
                </div>
                <div class="stat-box" style="--c:${cfg.color}">
                    <div class="stat-box-value" id="stat-time" style="font-size:1.4rem">${secsToHuman(totalSecs)}</div>
                    <div class="stat-box-label">Total Time</div>
                </div>
                <div class="stat-box" style="--c:${cfg.color}">
                    <div class="stat-box-value" id="stat-rating" style="font-size:${sessions.length?'1.2rem':'1.8rem'}">${sessions.length?'★'.repeat(Math.round(avgRating))+'☆'.repeat(5-Math.round(avgRating)):'—'}</div>
                    <div class="stat-box-label">Avg Rating</div>
                </div>
            </div>

            <div class="stopwatch-card" style="--c:${cfg.color}">
                <h3>⏱ ${cfg.addBtn}</h3>
                <div class="sw-fields">
                    <div class="sw-full">
                        <label class="field-label">${cfg.topicLabel}</label>
                        <input class="ifield" id="sw-topic" type="text" placeholder="${cfg.topicPH}">
                    </div>
                    <div class="sw-full">
                        <label class="field-label">${cfg.linkLabel}</label>
                        <input class="ifield" id="sw-link" type="url" placeholder="${cfg.linkPH}">
                    </div>
                </div>
                <div class="sw-display">
                    <div class="sw-clock ${sw.running?'running':''}" id="sw-clock">${formatElapsed(sw.elapsed)}</div>
                    <div class="sw-status ${sw.running?'active':''}" id="sw-status">${sw.running?'● RUNNING':'● STOPPED'}</div>
                </div>
                <div class="sw-controls">
                    <button class="sw-btn sw-btn-start" id="sw-start" onclick="swStart()" style="${sw.running?'display:none':''}">▶ START</button>
                    <button class="sw-btn sw-btn-stop ${sw.running?'visible':''}" id="sw-stop" onclick="swStop()" style="${sw.running?'':'display:none'}">■ STOP</button>
                    <button class="sw-btn sw-btn-reset" onclick="swReset()">↺ RESET</button>
                </div>
                <div class="sw-rating-section ${!sw.running && sw.elapsed>0?'visible':''}" id="sw-rating">
                    <label class="field-label" style="text-align:center;display:block;">⭐ How did it go?</label>
                    <div class="stars-row" id="sw-stars">
                        ${[1,2,3,4,5].map(n=>`<button class="star-btn ${sw.stars>=n?'lit':''}" onclick="swSetStars(${n})" type="button">★</button>`).join('')}
                    </div>
                    <button class="sw-save-btn ${!sw.running&&sw.elapsed>0?'visible':''}" id="sw-save" onclick="swSave()" style="background:${cfg.color}">💾 SAVE SESSION</button>
                </div>
            </div>

            <div class="sessions-header">
                <div class="sessions-title" style="--c:${cfg.color}">📁 Today's Sessions</div>
                <div class="sessions-count" id="scount">${sessions.length} session${sessions.length!==1?'s':''}</div>
            </div>
            <div id="sessions-list">${renderSessionsHTML(sessions, cfg.color)}</div>
        </div>`;
}

function renderSessionsHTML(sessions, color) {
    if(!sessions.length) return `<div class="empty-state"><span class="empty-state-icon">⏱</span><p>NO SESSIONS YET<br>Start the stopwatch above to begin tracking</p></div>`;
    return [...sessions].reverse().map(s=>{
        const filled=Math.round(s.rating||0);
        return `<div class="session-card" style="--c:${color}">
            <button class="session-del" onclick="deleteSession(${s.id})">✕</button>
            <div class="session-top">
                <div class="session-topic">${s.topic||'Untitled Session'}</div>
                <div class="session-stars">${'★'.repeat(filled)+'☆'.repeat(5-filled)}</div>
            </div>
            <div class="session-meta">
                <div class="meta-pill highlight">⏱ ${secsToHuman(s.elapsed)}</div>
                <div class="meta-pill">🕐 ${s.loggedAt}</div>
            </div>
            ${s.link?`<a href="${s.link}" target="_blank" class="session-link">🔗 ${s.link}</a>`:''}
        </div>`;
    }).join('');
}

function swStart() {
    const sw=getSW(); if(sw.running) return;
    sw.running=true; sw.startTs=Date.now()-sw.elapsed*1000;
    sw.intervalId=setInterval(()=>{ sw.elapsed=Math.floor((Date.now()-sw.startTs)/1000); const el=document.getElementById('sw-clock'); if(el) el.textContent=formatElapsed(sw.elapsed); },1000);
    const c=document.getElementById('sw-clock'), s=document.getElementById('sw-status');
    const st=document.getElementById('sw-start'), sp=document.getElementById('sw-stop'), r=document.getElementById('sw-rating');
    if(c) c.classList.add('running'); if(s){s.textContent='● RUNNING';s.classList.add('active');}
    if(st) st.style.display='none'; if(sp){sp.style.display='block';sp.classList.add('visible');}
    if(r) r.classList.remove('visible');
}

function swStop() {
    const sw=getSW(); if(!sw.running) return;
    clearInterval(sw.intervalId); sw.running=false;
    sw.elapsed=Math.floor((Date.now()-sw.startTs)/1000);
    const c=document.getElementById('sw-clock'), s=document.getElementById('sw-status');
    const st=document.getElementById('sw-start'), sp=document.getElementById('sw-stop');
    const r=document.getElementById('sw-rating'), sv=document.getElementById('sw-save');
    if(c){c.textContent=formatElapsed(sw.elapsed);c.classList.remove('running');}
    if(s){s.textContent='● STOPPED';s.classList.remove('active');}
    if(st) st.style.display='block'; if(sp){sp.style.display='none';sp.classList.remove('visible');}
    if(r&&sw.elapsed>0) r.classList.add('visible');
    if(sv&&sw.elapsed>0) sv.classList.add('visible');
}

function swReset() {
    const sw=getSW(); clearInterval(sw.intervalId);
    sw.running=false; sw.elapsed=0; sw.startTs=null; sw.stars=0;
    const c=document.getElementById('sw-clock'), s=document.getElementById('sw-status');
    const st=document.getElementById('sw-start'), sp=document.getElementById('sw-stop');
    const r=document.getElementById('sw-rating'), stars=document.getElementById('sw-stars');
    if(c){c.textContent='00:00';c.classList.remove('running');}
    if(s){s.textContent='● STOPPED';s.classList.remove('active');}
    if(st) st.style.display='block'; if(sp){sp.style.display='none';sp.classList.remove('visible');}
    if(r) r.classList.remove('visible');
    if(stars) stars.querySelectorAll('.star-btn').forEach(b=>b.classList.remove('lit'));
}

function swSetStars(n) {
    getSW().stars=n;
    const row=document.getElementById('sw-stars');
    if(row) row.querySelectorAll('.star-btn').forEach((b,i)=>b.classList.toggle('lit',i<n));
}

function swSave() {
    const sw=getSW(); if(sw.elapsed===0) return;
    const topic=document.getElementById('sw-topic')?.value.trim();
    const link=document.getElementById('sw-link')?.value.trim();
    const now=new Date();
    const dd=getTodayData();
    dd.sessions.push({ id:Date.now(), topic:topic||'Untitled Session', link, rating:sw.stars, elapsed:sw.elapsed, loggedAt:now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}) });
    saveTodayData(dd);
    const t=document.getElementById('sw-topic'), l=document.getElementById('sw-link');
    if(t) t.value=''; if(l) l.value='';
    swReset(); refreshTodayUI(); updateBadges();
}

function deleteSession(id) {
    if(!confirm('Delete this session?')) return;
    const dd=getTodayData(); dd.sessions=dd.sessions.filter(s=>s.id!==id);
    saveTodayData(dd); refreshTodayUI();
}

function selectCat(catKey) {
    const dd=getTodayData(); dd.cat=catKey; if(!dd.sessions) dd.sessions=[];
    saveTodayData(dd); renderToday();
}

function changeCat() {
    const dd=getTodayData(); dd.cat=null; saveTodayData(dd); renderToday();
}

function refreshTodayUI() {
    const dd=getTodayData(); const sessions=dd.sessions||[]; const cat=dd.cat; if(!cat) return;
    const cfg=CATS[cat];
    const totalSecs=sessions.reduce((a,s)=>a+(s.elapsed||0),0);
    const avgR=sessions.length?sessions.reduce((a,s)=>a+(s.rating||0),0)/sessions.length:0;
    const filled=Math.round(avgR);
    const q=id=>document.getElementById(id);
    if(q('stat-count'))   q('stat-count').textContent=sessions.length;
    if(q('stat-time'))    q('stat-time').textContent=secsToHuman(totalSecs);
    if(q('stat-rating'))  q('stat-rating').textContent=sessions.length?'★'.repeat(filled)+'☆'.repeat(5-filled):'—';
    if(q('scount'))       q('scount').textContent=`${sessions.length} session${sessions.length!==1?'s':''}`;
    if(q('sessions-list')) q('sessions-list').innerHTML=renderSessionsHTML(sessions,cfg.color);
}

// ── WEEK SCORE ────────────────────────────────────────
function renderWeekScore() {
    const pane = document.getElementById('pane-week');
    const now = new Date();
    const weekDays = [];
    const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate()-now.getDay());
    for(let i=0;i<7;i++){ const d=new Date(startOfWeek); d.setDate(startOfWeek.getDate()+i); weekDays.push(d); }

    let totalSecs=0,totalSessions=0,totalDaysActive=0;
    const catTotals={learn:{secs:0,sessions:0},labs:{secs:0,sessions:0},hunting:{secs:0,sessions:0}};
    const dayBreakdown=[];
    let allRatings=[];

    weekDays.forEach(d=>{
        const dd=getDateData(d); const sessions=dd.sessions||[];
        const secs=sessions.reduce((a,s)=>a+(s.elapsed||0),0);
        const isT=d.toDateString()===now.toDateString();
        totalSecs+=secs; totalSessions+=sessions.length;
        if(sessions.length>0) totalDaysActive++;
        sessions.forEach(s=>{ if(s.rating) allRatings.push(s.rating); });
        if(dd.cat&&catTotals[dd.cat]){ catTotals[dd.cat].secs+=secs; catTotals[dd.cat].sessions+=sessions.length; }
        dayBreakdown.push({ label:DAY_SHORT[d.getDay()], date:d.getDate(), secs, sessions:sessions.length, isToday:isT, cat:dd.cat });
    });

    const avgRating=allRatings.length?(allRatings.reduce((a,b)=>a+b,0)/allRatings.length):0;
    const maxSecs=Math.max(...dayBreakdown.map(d=>d.secs),1);
    const scorePercent=Math.round((totalDaysActive/7)*100);

    pane.innerHTML = `
        <div class="score-page" style="--c:var(--cyan)">
            <div class="score-hero" style="--c:var(--cyan)">
                <div class="score-hero-label">Week Activity Score</div>
                <div class="score-hero-value" style="color:var(--cyan);text-shadow:0 0 40px var(--cyan)">${scorePercent}%</div>
                <div class="score-hero-sub">${totalDaysActive} of 7 days active · ${secsToHuman(totalSecs)} total</div>
            </div>
            <div class="score-grid">
                <div class="score-card" style="--c:var(--green)"><div class="score-card-value" style="color:var(--green)">${totalSessions}</div><div class="score-card-label">Total Sessions</div></div>
                <div class="score-card" style="--c:var(--cyan)"><div class="score-card-value" style="color:var(--cyan)">${secsToHuman(totalSecs)}</div><div class="score-card-label">Time Studied</div></div>
                <div class="score-card" style="--c:var(--purple)"><div class="score-card-value" style="color:var(--purple)">${totalDaysActive}</div><div class="score-card-label">Active Days</div></div>
                <div class="score-card" style="--c:var(--amber)"><div class="score-card-value" style="color:var(--amber);font-size:${avgRating?'1.2rem':'1.6rem'}">${avgRating?'★'.repeat(Math.round(avgRating))+'☆'.repeat(5-Math.round(avgRating)):'—'}</div><div class="score-card-label">Avg Rating</div></div>
            </div>
            <div class="cat-breakdown">
                ${Object.entries(catTotals).map(([key,data])=>{
                    const cfg=CATS[key];
                    return `<div class="cat-score-card" style="--cc:${cfg.color}">
                        <div class="cat-score-icon">${cfg.icon}</div>
                        <div class="cat-score-label">${cfg.label}</div>
                        <div class="cat-score-sessions">${data.sessions}</div>
                        <div class="cat-score-time">${secsToHuman(data.secs)}</div>
                    </div>`;
                }).join('')}
            </div>
            <div class="breakdown-card">
                <div class="breakdown-title">📅 Daily Breakdown</div>
                ${dayBreakdown.map(d=>{
                    const pct=Math.round((d.secs/maxSecs)*100);
                    const color=d.cat?CATS[d.cat].color:'#2a2a4a';
                    const todayMark=d.isToday?' 📍':'';
                    return `<div class="breakdown-row">
                        <div class="breakdown-day" style="color:${d.isToday?'var(--green)':'var(--muted)'}">${d.label} ${d.date}${todayMark}</div>
                        <div class="breakdown-bar-wrap"><div class="breakdown-bar-track"><div class="breakdown-bar-fill" style="width:${pct}%;background:${color}"></div></div></div>
                        <div class="breakdown-meta">${d.sessions>0?`${d.sessions} sess · ${secsToHuman(d.secs)}`:'—'}</div>
                    </div>`;
                }).join('')}
            </div>
        </div>`;
}

// ── MONTH SCORE ───────────────────────────────────────
function renderMonthScore() {
    const pane = document.getElementById('pane-month');
    const now = new Date();
    const year=now.getFullYear(), month=now.getMonth();
    const daysInMonth=new Date(year,month+1,0).getDate();
    const firstDay=new Date(year,month,1).getDay();

    let totalSecs=0,totalSessions=0,totalDaysActive=0;
    const catTotals={learn:{secs:0,sessions:0},labs:{secs:0,sessions:0},hunting:{secs:0,sessions:0}};
    let allRatings=[];
    const dayData={};

    for(let day=1;day<=daysInMonth;day++){
        const d=new Date(year,month,day);
        const dd=getDateData(d); const sessions=dd.sessions||[];
        const secs=sessions.reduce((a,s)=>a+(s.elapsed||0),0);
        totalSecs+=secs; totalSessions+=sessions.length;
        if(sessions.length>0) totalDaysActive++;
        sessions.forEach(s=>{ if(s.rating) allRatings.push(s.rating); });
        if(dd.cat&&catTotals[dd.cat]){ catTotals[dd.cat].secs+=secs; catTotals[dd.cat].sessions+=sessions.length; }
        dayData[day]={secs,sessions:sessions.length,cat:dd.cat};
    }

    const avgRating=allRatings.length?allRatings.reduce((a,b)=>a+b,0)/allRatings.length:0;
    const scorePercent=Math.round((totalDaysActive/daysInMonth)*100);
    const maxSecs=Math.max(...Object.values(dayData).map(d=>d.secs),1);

    const dayLabels=DAY_SHORT.map(d=>`<div class="heatmap-day-label">${d}</div>`).join('');
    let cells='';
    for(let i=0;i<firstDay;i++) cells+=`<div class="heatmap-cell empty-cell"></div>`;
    for(let day=1;day<=daysInMonth;day++){
        const d=dayData[day];
        const isToday=day===now.getDate();
        const intensity=d.secs>0?Math.max(0.15,d.secs/maxSecs):0;
        const color=d.cat?CATS[d.cat].color:'#00ff88';
        const bg=d.secs>0?`rgba(${hexToRgb(color)},${intensity.toFixed(2)})`:'rgba(10,10,26,0.8)';
        const tooltip=d.secs>0?`${day} — ${d.sessions} sess, ${secsToHuman(d.secs)}`:`${day} — No activity`;
        cells+=`<div class="heatmap-cell ${d.secs>0?'has-data':''} ${isToday?'today-cell':''}" style="background:${bg}">
            ${day}<div class="heatmap-tooltip">${tooltip}</div>
        </div>`;
    }

    pane.innerHTML = `
        <div class="score-page" style="--c:var(--amber)">
            <div class="score-hero" style="--c:var(--amber)">
                <div class="score-hero-label">${MONTH_NAMES[month]} ${year} — Month Score</div>
                <div class="score-hero-value" style="color:var(--amber);text-shadow:0 0 40px var(--amber)">${scorePercent}%</div>
                <div class="score-hero-sub">${totalDaysActive} of ${daysInMonth} days active · ${secsToHuman(totalSecs)} total</div>
            </div>
            <div class="score-grid">
                <div class="score-card" style="--c:var(--green)"><div class="score-card-value" style="color:var(--green)">${totalSessions}</div><div class="score-card-label">Total Sessions</div></div>
                <div class="score-card" style="--c:var(--cyan)"><div class="score-card-value" style="color:var(--cyan)">${secsToHuman(totalSecs)}</div><div class="score-card-label">Time Studied</div></div>
                <div class="score-card" style="--c:var(--purple)"><div class="score-card-value" style="color:var(--purple)">${totalDaysActive}</div><div class="score-card-label">Active Days</div></div>
                <div class="score-card" style="--c:var(--amber)"><div class="score-card-value" style="color:var(--amber);font-size:${avgRating?'1.2rem':'1.6rem'}">${avgRating?'★'.repeat(Math.round(avgRating))+'☆'.repeat(5-Math.round(avgRating)):'—'}</div><div class="score-card-label">Avg Rating</div></div>
            </div>
            <div class="cat-breakdown">
                ${Object.entries(catTotals).map(([key,data])=>{
                    const cfg=CATS[key];
                    return `<div class="cat-score-card" style="--cc:${cfg.color}">
                        <div class="cat-score-icon">${cfg.icon}</div>
                        <div class="cat-score-label">${cfg.label}</div>
                        <div class="cat-score-sessions">${data.sessions}</div>
                        <div class="cat-score-time">${secsToHuman(data.secs)}</div>
                    </div>`;
                }).join('')}
            </div>
            <div class="heatmap-card">
                <div class="heatmap-title">🗓 Activity Heatmap — ${MONTH_NAMES[month]}</div>
                <div class="heatmap-grid">${dayLabels}${cells}</div>
                <div style="display:flex;align-items:center;gap:8px;margin-top:14px;font-family:var(--mono);font-size:0.65rem;color:var(--muted);">
                    <span>Less</span>
                    <div style="width:16px;height:16px;border-radius:4px;background:rgba(0,255,136,0.1)"></div>
                    <div style="width:16px;height:16px;border-radius:4px;background:rgba(0,255,136,0.3)"></div>
                    <div style="width:16px;height:16px;border-radius:4px;background:rgba(0,255,136,0.6)"></div>
                    <div style="width:16px;height:16px;border-radius:4px;background:rgba(0,255,136,0.9)"></div>
                    <span>More</span>
                    <span style="margin-left:12px;">📍 = Today</span>
                </div>
            </div>
        </div>`;
}

function hexToRgb(hex) {
    const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
}

document.addEventListener('DOMContentLoaded', init);