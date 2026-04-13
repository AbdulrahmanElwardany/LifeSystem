/* checklist.js — Page logic */

function loadReminderStats(){
    const r=JSON.parse(localStorage.getItem('reminders')||'[]');
    const t=r.length,c=r.filter(x=>x.completed).length;
    document.getElementById('totalReminders').textContent=t;
    document.getElementById('completedReminders').textContent=c;
    document.getElementById('reminderProgressBar').style.width=(t>0?(c/t)*100:0)+'%';
}
function loadWriteupStats(){
    const w=JSON.parse(localStorage.getItem('idorWriteups')||'[]');
    const t=w.length,c=w.filter(x=>x.completed).length;
    document.getElementById('totalWriteups').textContent=t;
    document.getElementById('completedWriteups').textContent=c;
    document.getElementById('writeupProgressBar').style.width=(t>0?(c/t)*100:0)+'%';
}
function updateFoot(){
    const r=JSON.parse(localStorage.getItem('reminders')||'[]');
    const w=JSON.parse(localStorage.getItem('idorWriteups')||'[]');
    const total=r.length+w.length,done=r.filter(x=>x.completed).length+w.filter(x=>x.completed).length;
    document.getElementById('footStr').textContent=`${done} of ${total} items completed`;
}
document.addEventListener('DOMContentLoaded',()=>{loadReminderStats();loadWriteupStats();updateFoot()});