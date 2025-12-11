document.addEventListener('DOMContentLoaded', initializeApp);

let currentFilter = { status: 'all', priority: 'all' };

function initializeApp() {
    loadTasks();
    document.getElementById('task-form').addEventListener('submit', addTask);
    document.getElementById('filter-status').addEventListener('change', handleFilterChange);
    document.getElementById('filter-priority').addEventListener('change', handleFilterChange);
    document.getElementById('clear-all-btn').addEventListener('click', clearAllTasks);
    document.getElementById('clear-completed-btn').addEventListener('click', clearCompletedTasks);
    checkDailyReset(); 
}

function getTasksFromStorage() { 
    return JSON.parse(localStorage.getItem('tasks')) || []; 
}

function saveTasksToStorage(tasks) { 
    localStorage.setItem('tasks', JSON.stringify(tasks)); 
}

function addTask(e) {
    e.preventDefault();
    const text = document.getElementById('task-input').value.trim();
    if (!text) return;

    const deadlineValue = document.getElementById('task-deadline').value;
    const today = new Date().toISOString().split('T')[0];
    if (deadlineValue && deadlineValue < today) {
        if (!confirm("Deadline sudah terlewat! Tetap tambahkan tugas?")) {
            return;
        }
    }

    const newTask = {
        id: Date.now(),
        text: text,
        description: document.getElementById('task-description').value.trim(),
        deadline: deadlineValue || null,
        priority: document.getElementById('task-priority').value,
        completed: false
    };

    const tasks = getTasksFromStorage();
    tasks.push(newTask);
    saveTasksToStorage(tasks);
    resetForm();
    loadTasks();
    showPopup("Tugas Baru Ditambahkan! 🚀");
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
    
    tasks.sort((a, b) => {
        if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        const dA = a.deadline ? new Date(a.deadline) : new Date('9999-12-31');
        const dB = b.deadline ? new Date(b.deadline) : new Date('9999-12-31');
        return dA - dB;
    });

    const filtered = tasks.filter(t => {
        const statusOk = currentFilter.status === 'all' || 
                             (currentFilter.status === 'completed' && t.completed) || 
                             (currentFilter.status === 'pending' && !t.completed);
        const priorityOk = currentFilter.priority === 'all' || t.priority === currentFilter.priority;
        return statusOk && priorityOk;
    });

    const list = document.getElementById('task-list');
    list.innerHTML = '';
    if (filtered.length === 0) {
        const li = document.createElement('li');
        li.textContent = tasks.length === 0 ? 'Belum ada tugas. Tambahkan satu!' : 'Tidak ada tugas yang cocok dengan filter saat ini.';
        li.style.textAlign = 'center';
        li.style.color = '#6c757d';
        li.style.background = 'transparent';
        li.style.boxShadow = 'none';
        li.style.borderLeft = 'none';
        list.appendChild(li);
    } else {
        filtered.forEach(renderTask);
    }

    updateProgress(tasks);
}

function renderTask(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''} ${checkDeadlineStatus(task)}`;
    li.dataset.id = task.id;

    if (task.description) {
        const tooltip = document.createElement('div');
        tooltip.className = 'task-description-tooltip';
        tooltip.textContent = task.description;
        li.appendChild(tooltip);
    }

    const details = document.createElement('div'); details.className = 'task-details';

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;
    textSpan.addEventListener('click', () => toggleComplete(task.id)); 
    details.appendChild(textSpan);

    const infoLine = document.createElement('div'); infoLine.className = 'task-info-line';
    const prioritySpan = document.createElement('span');
    prioritySpan.className = `priority priority-${task.priority}`;
    prioritySpan.textContent = task.priority;
    infoLine.appendChild(prioritySpan);

    if (task.deadline) {
        const dl = document.createElement('span');
        dl.innerHTML = `<i class="far fa-clock"></i> ${formatDate(task.deadline)}`;
        infoLine.appendChild(dl);
    }

    const statusClass = checkDeadlineStatus(task);
    if (!task.completed) {
        if (statusClass === 'overdue') {
            const alert = document.createElement('span'); alert.className = 'alert-icon'; 
            alert.innerHTML = '<i class="fas fa-exclamation-triangle"></i> TERLAMBAT!'; 
            alert.style.color = 'var(--color-danger)';
            infoLine.appendChild(alert);
        } else if (statusClass === 'critical') {
            const alert = document.createElement('span'); alert.className = 'alert-icon'; 
            alert.innerHTML = '<i class="fas fa-exclamation-circle"></i> KRITIS!'; 
            alert.style.color = 'var(--color-danger)';
            infoLine.appendChild(alert);
        } else if (statusClass === 'urgent') {
            const alert = document.createElement('span'); alert.className = 'alert-icon'; 
            alert.innerHTML = '<i class="fas fa-calendar-times"></i> Mendesak'; 
            alert.style.color = 'var(--color-warning)';
            infoLine.appendChild(alert);
        }
    }

    details.appendChild(infoLine);
    li.appendChild(details);

    const controls = document.createElement('div'); controls.className = 'task-controls';
    const editBtn = document.createElement('button'); editBtn.className = 'action-button edit-btn'; 
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit'; 
    editBtn.addEventListener('click', () => editTask(task.id));
    
    const completeBtn = document.createElement('button'); completeBtn.className = 'action-button complete-btn'; 
    completeBtn.innerHTML = task.completed ? '<i class="fas fa-undo-alt"></i> Buka Lagi' : '<i class="fas fa-check"></i> Selesai'; 
    completeBtn.addEventListener('click', () => toggleComplete(task.id));
    
    const deleteBtn = document.createElement('button'); deleteBtn.className = 'action-button delete-btn'; 
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Hapus'; 
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    controls.append(editBtn, completeBtn, deleteBtn);
    li.appendChild(controls);

    document.getElementById('task-list').appendChild(li);
}

function toggleComplete(id) {
    const tasks = getTasksFromStorage();
    const t = tasks.find(t => t.id === id);
    if (!t) return;
    
    const action = t.completed ? "Buka lagi tugas ini?" : "Tandai selesai?";
    if (!confirm(action)) return;

    t.completed = !t.completed;
    saveTasksToStorage(tasks);
    loadTasks();

    if (t.completed) {
        showPopup("Tugas Selesai! 🎉");
    } else {
        showPopup("Tugas Dibuka Kembali.");
    }
}

function deleteTask(id) {
    if (!confirm("Apakah Anda yakin ingin menghapus tugas ini?")) return;
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(t => t.id !== id);
    saveTasksToStorage(tasks);
    loadTasks();
    showPopup("Tugas Dihapus.");
}

function editTask(id) {
    const tasks = getTasksFromStorage();
    const t = tasks.find(t => t.id === id);
    if (!t) return;
    const li = document.querySelector(`.task-item[data-id='${id}']`);
    if (!li) return;
    
    li.innerHTML = `
        <div class="edit-form-container">
            <input type="text" id="edit-text-${id}" value="${t.text}" required>
            <textarea id="edit-desc-${id}" placeholder="Deskripsi Tugas">${t.description || ''}</textarea>
            <input type="date" id="edit-deadline-${id}" value="${t.deadline || ''}">
            <select id="edit-priority-${id}">
                <option value="High" ${t.priority === 'High' ? 'selected' : ''}>High</option>
                <option value="Medium" ${t.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                <option value="Low" ${t.priority === 'Low' ? 'selected' : ''}>Low</option>
            </select>
            <div class="edit-actions">
                <button class="action-button complete-btn" id="save-${id}"><i class="fas fa-save"></i> Simpan</button>
                <button class="action-button delete-btn" id="cancel-${id}"><i class="fas fa-times"></i> Batal</button>
            </div>
        </div>
    `;
    
    document.getElementById(`save-${id}`).addEventListener('click', () => {
        const newText = document.getElementById(`edit-text-${id}`).value.trim();
        if (!newText) {
            alert("Judul tugas tidak boleh kosong.");
            return;
        }
        t.text = newText;
        t.description = document.getElementById(`edit-desc-${id}`).value.trim();
        t.deadline = document.getElementById(`edit-deadline-${id}`).value;
        t.priority = document.getElementById(`edit-priority-${id}`).value;
        saveTasksToStorage(tasks);
        loadTasks();
        showPopup("Tugas Diperbarui! ✅");
    });
    document.getElementById(`cancel-${id}`).addEventListener('click', () => loadTasks());
}

function clearAllTasks() {
    if (!confirm("PERINGATAN! Anda yakin ingin MENGHAPUS SEMUA tugas? Aksi ini tidak bisa dibatalkan.")) return;
    localStorage.removeItem('tasks');
    loadTasks();
    showPopup("Semua Tugas Dihapus! 🗑️");
}

function clearCompletedTasks() {
    let tasks = getTasksFromStorage();
    const incompleteTasks = tasks.filter(t => !t.completed);
    
    if (incompleteTasks.length === tasks.length) {
        alert("Tidak ada tugas yang selesai untuk dihapus.");
        return;
    }
    
    if (!confirm(`Yakin ingin menghapus ${tasks.length - incompleteTasks.length} tugas yang sudah selesai?`)) return;

    saveTasksToStorage(incompleteTasks);
    loadTasks();
    showPopup("Tugas Selesai Dihapus! 👍");
}

function updateProgress(tasks) {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    if (tasks.length === 0) {
        progressBar.style.width = '0%';
        progressBar.textContent = '';
        progressText.textContent = 'Belum ada tugas. Waktunya membuat rencana!';
        localStorage.setItem("allDonePopupShown", "false"); 
        return;
    }

    const completed = tasks.filter(t => t.completed).length;
    const percent = Math.round((completed / tasks.length) * 100);

    const colorStart = percent < 50 ? '#ffc107' : '#20c997';
    const colorEnd = percent < 50 ? '#dc3545' : '#198754';
    progressBar.style.background = `linear-gradient(90deg, ${colorStart}, ${colorEnd})`;
    
    progressBar.style.width = `${percent}%`;
    progressBar.textContent = `${percent}%`;

    progressText.textContent = `${completed} dari ${tasks.length} tugas selesai.`;

    if (completed === tasks.length && tasks.length > 0) {
        if (localStorage.getItem("allDonePopupShown") !== "true") {
            showAllDonePopup();
            localStorage.setItem("allDonePopupShown", "true");
        }
    } else {
        localStorage.setItem("allDonePopupShown", "false");
    }
}

function checkDeadlineStatus(task) {
    if (!task.deadline) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const deadline = new Date(task.deadline);
    deadline.setHours(0, 0, 0, 0); 

    const diffMs = deadline - today;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (task.completed) return '';
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 1) return 'critical'; 
    if (diffDays <= 7) return 'urgent';  
    return '';
}

function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00'); 
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function showPopup(message) {
    const popup = document.createElement("div");
    popup.className = "popup-success";
    popup.innerHTML = `<i class="fas fa-bell"></i> ${message}`;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.transition = "opacity 0.4s, transform 0.4s";
        popup.style.opacity = "0";
        popup.style.transform = "translate(-50%, -50%) scale(0.9)";
        setTimeout(() => popup.remove(), 400);
    }, 1800);
}

function showAllDonePopup() {
    const popup = document.createElement("div");
    popup.className = "popup-all-done";
    popup.innerHTML = "🏆 Selamat! Semua Tugas Telah Selesai! <br> Anda Luar Biasa! 🥳";

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.transition = "opacity 0.5s, transform 0.5s";
        popup.style.opacity = "0";
        popup.style.transform = "translate(-50%, -50%) scale(0.5)";
        setTimeout(() => popup.remove(), 500);
    }, 3000); 
}

function checkDailyReset() {
    const today = new Date().toISOString().split('T')[0];
    const lastReset = localStorage.getItem('lastResetDate');

    if (lastReset !== today) {
        localStorage.setItem("allDonePopupShown", "false"); 
        
        localStorage.setItem('lastResetDate', today);
        console.log("Daily check performed. Flags reset.");
    }
}