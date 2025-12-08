document.addEventListener('DOMContentLoaded', initializeApp);
let currentFilter = { status: 'all', priority: 'all' };

function initializeApp() {
    loadTasks();
    document.getElementById('task-form').addEventListener('submit', addTask);
    document.getElementById('filter-status').addEventListener('change', handleFilterChange);
    document.getElementById('filter-priority').addEventListener('change', handleFilterChange);
}

function getTasksFromStorage() { return JSON.parse(localStorage.getItem('tasks')) || []; }
function saveTasksToStorage(tasks) { localStorage.setItem('tasks', JSON.stringify(tasks)); }

function addTask(e) {
    e.preventDefault();
    const text = document.getElementById('task-input').value.trim();
    if (!text) return;
    const newTask = {
        id: Date.now(),
        text: text,
        description: document.getElementById('task-description').value.trim(),
        deadline: document.getElementById('task-deadline').value || null,
        priority: document.getElementById('task-priority').value,
        completed: false
    };
    const tasks = getTasksFromStorage();
    tasks.push(newTask);
    saveTasksToStorage(tasks);
    resetForm();
    loadTasks();
}

function resetForm() {
    document.getElementById('task-input').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('task-deadline').value = '';
    document.getElementById('task-priority').value = 'Low';
}

function handleFilterChange() {
    currentFilter.status = document.getElementById('filter-status').value;
    currentFilter.priority = document.getElementById('filter-priority').value;
    loadTasks();
}

function loadTasks() {
    const tasks = getTasksFromStorage();
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };

    tasks.sort((a,b)=>{
        if(priorityOrder[b.priority]!==priorityOrder[a.priority]) return priorityOrder[b.priority]-priorityOrder[a.priority];
        const dA = a.deadline ? new Date(a.deadline) : Infinity;
        const dB = b.deadline ? new Date(b.deadline) : Infinity;
        return dA-dB;
    });

    const filtered = tasks.filter(t=>{
        const statusOk = currentFilter.status==='all'||(currentFilter.status==='completed'&&t.completed)||(currentFilter.status==='pending'&&!t.completed);
        const priorityOk = currentFilter.priority==='all'||t.priority===currentFilter.priority;
        return statusOk && priorityOk;
    });

    const list = document.getElementById('task-list');
    list.innerHTML = '';
    if(filtered.length===0) {
        const li = document.createElement('li');
        li.textContent = tasks.length===0 ? 'Belum ada tugas.' : 'Tidak ada tugas cocok filter.';
        li.style.textAlign = 'center';
        li.style.color = '#6c757d';
        list.appendChild(li);
    } else filtered.forEach(renderTask);

    updateProgress(tasks);
}

function renderTask(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed?'completed':''} ${checkDeadlineStatus(task)}`;
    li.dataset.id = task.id;

    const details = document.createElement('div'); details.className='task-details';

    const textSpan = document.createElement('span');
    textSpan.className='task-text';
    textSpan.textContent=task.text;
    textSpan.addEventListener('click',()=>toggleComplete(task.id));
    details.appendChild(textSpan);

    const infoLine = document.createElement('div'); infoLine.className='task-info-line';
    const prioritySpan = document.createElement('span');
    prioritySpan.className=`priority priority-${task.priority}`;
    prioritySpan.textContent=` ${task.priority}`;
    infoLine.appendChild(prioritySpan);

    if(task.deadline){
        const dl = document.createElement('span');
        dl.innerHTML=` | 📅 ${formatDate(task.deadline)}`;
        infoLine.appendChild(dl);
    }

    const statusClass = checkDeadlineStatus(task);
    if(statusClass==='critical'&&!task.completed){ const alert=document.createElement('span'); alert.className='alert-icon'; alert.innerHTML='🚨 KRITIS!'; infoLine.appendChild(alert);}
    if(statusClass==='overdue'&&!task.completed){ const alert=document.createElement('span'); alert.className='alert-icon'; alert.innerHTML='❌ TERLAMBAT!'; infoLine.appendChild(alert);}
    if(statusClass==='urgent'&&!task.completed){ const alert=document.createElement('span'); alert.className='alert-icon'; alert.innerHTML='⚠️ Mendesak'; infoLine.appendChild(alert);}

    details.appendChild(infoLine);
    li.appendChild(details);

    const controls = document.createElement('div'); controls.className='task-controls';
    const editBtn=document.createElement('button'); editBtn.className='action-button edit-btn'; editBtn.textContent='✏️ Edit'; editBtn.addEventListener('click',()=>editTask(task.id));
    const completeBtn=document.createElement('button'); completeBtn.className='action-button complete-btn'; completeBtn.textContent=task.completed?'↩️ Buka Lagi':'✅ Selesai'; completeBtn.addEventListener('click',()=>toggleComplete(task.id));
    const deleteBtn=document.createElement('button'); deleteBtn.className='action-button delete-btn'; deleteBtn.textContent='🗑️ Hapus'; deleteBtn.addEventListener('click',()=>deleteTask(task.id));
    controls.append(editBtn,completeBtn,deleteBtn);
    li.appendChild(controls);

    document.getElementById('task-list').appendChild(li);
}

function toggleComplete(id){
    const tasks=getTasksFromStorage();
    const t=tasks.find(t=>t.id===id);
    if(!t) return;
if (confirm(t.completed ? "Buka lagi tugas ini?" : "Tandai selesai?")) {
    t.completed = !t.completed;
    saveTasksToStorage(tasks);
    loadTasks();

    if (t.completed) {
        showPopup("Tugas Selesai!");
    } else {
        showPopup("Tugas Dibuka Lagi !");
    }
}

}

function deleteTask(id){
    if(!confirm("Hapus tugas ini?")) return;
    let tasks=getTasksFromStorage();
    tasks=tasks.filter(t=>t.id!==id);
    saveTasksToStorage(tasks);
    loadTasks();
}

function editTask(id){
    const tasks=getTasksFromStorage();
    const t=tasks.find(t=>t.id===id); if(!t) return;
    const li=document.querySelector(`.task-item[data-id='${id}']`);
    if(!li) return;
    li.innerHTML=`
        <div class="edit-form-container">
            <input type="text" id="edit-text-${id}" value="${t.text}" required>
            <textarea id="edit-desc-${id}">${t.description||''}</textarea>
            <input type="date" id="edit-deadline-${id}" value="${t.deadline||''}">
            <select id="edit-priority-${id}">
                <option value="High" ${t.priority==='High'?'selected':''}>High</option>
                <option value="Medium" ${t.priority==='Medium'?'selected':''}>Medium</option>
                <option value="Low" ${t.priority==='Low'?'selected':''}>Low</option>
            </select>
            <div class="edit-actions">
                <button class="action-button complete-btn" id="save-${id}">💾 Simpan</button>
                <button class="action-button delete-btn" id="cancel-${id}">❌ Batal</button>
            </div>
        </div>
    `;
    document.getElementById(`save-${id}`).addEventListener('click',()=>{
        t.text=document.getElementById(`edit-text-${id}`).value.trim();
        t.description=document.getElementById(`edit-desc-${id}`).value.trim();
        t.deadline=document.getElementById(`edit-deadline-${id}`).value;
        t.priority=document.getElementById(`edit-priority-${id}`).value;
        saveTasksToStorage(tasks); loadTasks();
    });
    document.getElementById(`cancel-${id}`).addEventListener('click',()=>loadTasks());
}
function updateProgress(tasks) {
    if (tasks.length === 0) {
        document.getElementById('progress-bar').style.width = '0%';
        document.getElementById('progress-bar').textContent = '';
        document.getElementById('progress-text').textContent = 'Belum ada tugas.';
        return;
    }

    const completed = tasks.filter(t => t.completed).length;
    const percent = Math.round((completed / tasks.length) * 100);

    const bar = document.getElementById('progress-bar');
    bar.style.width = `${percent}%`;
    bar.textContent = `${percent}%`;

    document.getElementById('progress-text').textContent =
        `${completed} dari ${tasks.length} tugas selesai.`;

    if (completed === tasks.length && tasks.length > 0) {
        const alreadyShown = localStorage.getItem("allDonePopupShown") === "true";

        if (!alreadyShown) {
            showAllDonePopup();
            localStorage.setItem("allDonePopupShown", "true");
        }
    } else {
        localStorage.setItem("allDonePopupShown", "false");
    }
}

function checkDeadlineStatus(task){
    if(!task.deadline) return '';
    const today=new Date(); const deadline=new Date(task.deadline);
    const diff=(deadline-today)/(1000*60*60*24);
    if(task.completed) return '';
    if(diff<0) return 'overdue';
    if(diff<=1) return 'critical';
    if(diff<=7) return 'urgent';
    return '';
}

function formatDate(dateStr){
    const d=new Date(dateStr);
    return d.toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'});
}
function showPopup(message) {
    const popup = document.createElement("div");
    popup.className = "popup-success";
    popup.textContent = message;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.transition = "opacity 0.3s";
        popup.style.opacity = "0";
        setTimeout(() => popup.remove(), 300);
    }, 1500);
}
function showAllDonePopup() {
    const smallPopup = document.querySelector(".popup-success");

    if (smallPopup) {

        smallPopup.remove();
        setTimeout(() => {
            tampilkanPopupBesar();
        }, 9950);
    } else {
        tampilkanPopupBesar();
    }
}

function tampilkanPopupBesar() {
    const popup = document.createElement("div");
    popup.className = "popup-all-done";
    popup.innerHTML = "🎉 Selamat Semua Tugas Telah Selesai! 🎉";

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.transition = "opacity 0.4s";
        popup.style.opacity = "0";
        setTimeout(() => popup.remove(), 600);
    }, 200);
}