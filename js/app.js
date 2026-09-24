// ========================================
//  Python Learning Tracker — Main App
// ========================================

class PythonTracker {
    constructor() {
        this.data = this.loadData();
        this.currentFilter = 'all';
        this.currentStatus = 'all';
        this.calendarDate = new Date();
        this.timerInterval = null;
        this.timerSeconds = 0;
        this.timerRunning = false;
        this.timerProjectId = null;

        this.init();
    }

    // ---------- DATA PERSISTENCE ----------

    loadData() {
        const saved = localStorage.getItem('pythonTracker');
        if (saved) return JSON.parse(saved);

        // Initialize default data
        const data = {
            projects: {},
            activityLog: {},  // { "2026-09-24": { minutes: 30, projects: [1,2] } }
        };

        PROJECTS.forEach(p => {
            data.projects[p.id] = {
                status: 'not-started',  // not-started | in-progress | completed
                timeSpent: 0,           // in seconds
                startDate: null,
                completedDate: null,
                notes: ''
            };
        });

        return data;
    }

    saveData() {
        localStorage.setItem('pythonTracker', JSON.stringify(this.data));
    }

    // ---------- INITIALIZATION ----------

    init() {
        this.renderProjects();
        this.renderCalendar();
        this.updateStats();
        this.startClock();
        this.bindEvents();
    }

    bindEvents() {
        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentFilter = tab.dataset.filter;
                this.renderProjects();
            });
        });

        // Status filters
        document.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentStatus = btn.dataset.status;
                this.renderProjects();
            });
        });

        // Calendar navigation
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.calendarDate.setMonth(this.calendarDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.calendarDate.setMonth(this.calendarDate.getMonth() + 1);
            this.renderCalendar();
        });

        // Timer modal
        document.getElementById('closeTimer').addEventListener('click', () => this.closeTimerModal());
        document.getElementById('startTimer').addEventListener('click', () => this.startTimer());
        document.getElementById('pauseTimer').addEventListener('click', () => this.pauseTimer());
        document.getElementById('stopTimer').addEventListener('click', () => this.stopTimer());

        // Notes modal
        document.getElementById('closeNotes').addEventListener('click', () => this.closeNotesModal());
        document.getElementById('saveNotes').addEventListener('click', () => this.saveNotes());

        // Close modals on overlay click
        document.getElementById('timerModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeTimerModal();
        });
        document.getElementById('notesModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeNotesModal();
        });
    }

    // ---------- CLOCK ----------

    startClock() {
        const updateTime = () => {
            const now = new Date();
            document.getElementById('currentTime').textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
        };
        updateTime();
        setInterval(updateTime, 1000);
    }

    // ---------- RENDER PROJECTS ----------

    renderProjects() {
        const container = document.getElementById('projectsList');
        let filtered = PROJECTS;

        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(p => p.level === this.currentFilter);
        }

        if (this.currentStatus !== 'all') {
            filtered = filtered.filter(p => this.data.projects[p.id].status === this.currentStatus);
        }

        container.innerHTML = filtered.map((project, index) => {
            const pData = this.data.projects[project.id];
            const timeStr = this.formatTime(pData.timeSpent);
            const statusClass = `status-${pData.status}`;

            return `
                <div class="project-card ${project.level} ${statusClass}" style="--i:${index}">
                    <div class="project-number">${project.id}</div>
                    <div class="project-info">
                        <div class="project-title">${project.title}</div>
                        <div class="project-description">${project.description}</div>
                        <div class="project-tags">
                            ${project.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                        </div>
                    </div>
                    <div class="project-actions">
                        <span class="project-time">${timeStr}</span>
                        <select class="status-select" data-id="${project.id}" onchange="tracker.updateStatus(${project.id}, this.value)">
                            <option value="not-started" ${pData.status === 'not-started' ? 'selected' : ''}>⬜ Not Started</option>
                            <option value="in-progress" ${pData.status === 'in-progress' ? 'selected' : ''}>🔵 In Progress</option>
                            <option value="completed" ${pData.status === 'completed' ? 'selected' : ''}>✅ Completed</option>
                        </select>
                        <button class="action-btn" onclick="tracker.openTimerModal(${project.id})" title="Start Timer">⏱️</button>
                        <button class="action-btn" onclick="tracker.openNotesModal(${project.id})" title="Notes">📝</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ---------- STATUS ----------

    updateStatus(projectId, status) {
        const pData = this.data.projects[projectId];
        pData.status = status;

        if (status === 'in-progress' && !pData.startDate) {
            pData.startDate = new Date().toISOString().split('T')[0];
        }

        if (status === 'completed') {
            pData.completedDate = new Date().toISOString().split('T')[0];
            this.logActivity(0);
        }

        this.saveData();
        this.renderProjects();
        this.updateStats();
    }

    // ---------- TIMER ----------

    openTimerModal(projectId) {
        this.timerProjectId = projectId;
        const project = PROJECTS.find(p => p.id === projectId);
        document.getElementById('timerProjectName').textContent = `⏱️ ${project.title}`;
        document.getElementById('timerModal').classList.add('active');

        // Reset display
        this.timerSeconds = 0;
        this.updateTimerDisplay();
        document.getElementById('startTimer').style.display = '';
        document.getElementById('pauseTimer').style.display = 'none';
    }

    closeTimerModal() {
        if (this.timerRunning) this.pauseTimer();
        document.getElementById('timerModal').classList.remove('active');
    }

    startTimer() {
        this.timerRunning = true;
        document.getElementById('startTimer').style.display = 'none';
        document.getElementById('pauseTimer').style.display = '';

        this.timerInterval = setInterval(() => {
            this.timerSeconds++;
            this.updateTimerDisplay();
        }, 1000);
    }

    pauseTimer() {
        this.timerRunning = false;
        clearInterval(this.timerInterval);
        document.getElementById('startTimer').style.display = '';
        document.getElementById('pauseTimer').style.display = 'none';
    }

    stopTimer() {
        if (this.timerRunning) {
            clearInterval(this.timerInterval);
            this.timerRunning = false;
        }

        if (this.timerSeconds > 0 && this.timerProjectId) {
            // Save time to project
            this.data.projects[this.timerProjectId].timeSpent += this.timerSeconds;

            // Auto-set to in-progress if not started
            if (this.data.projects[this.timerProjectId].status === 'not-started') {
                this.data.projects[this.timerProjectId].status = 'in-progress';
                this.data.projects[this.timerProjectId].startDate = new Date().toISOString().split('T')[0];
            }

            // Log activity
            this.logActivity(Math.ceil(this.timerSeconds / 60));

            this.saveData();
            this.renderProjects();
            this.updateStats();
            this.renderCalendar();
        }

        this.timerSeconds = 0;
        this.updateTimerDisplay();
        this.closeTimerModal();
    }

    updateTimerDisplay() {
        const h = Math.floor(this.timerSeconds / 3600);
        const m = Math.floor((this.timerSeconds % 3600) / 60);
        const s = this.timerSeconds % 60;
        document.getElementById('timerHours').textContent = String(h).padStart(2, '0');
        document.getElementById('timerMinutes').textContent = String(m).padStart(2, '0');
        document.getElementById('timerSeconds').textContent = String(s).padStart(2, '0');
    }

    // ---------- NOTES ----------

    openNotesModal(projectId) {
        this.notesProjectId = projectId;
        const project = PROJECTS.find(p => p.id === projectId);
        document.getElementById('notesProjectName').textContent = `📝 ${project.title}`;
        document.getElementById('notesTextarea').value = this.data.projects[projectId].notes || '';
        document.getElementById('notesModal').classList.add('active');
    }

    closeNotesModal() {
        document.getElementById('notesModal').classList.remove('active');
    }

    saveNotes() {
        this.data.projects[this.notesProjectId].notes = document.getElementById('notesTextarea').value;
        this.saveData();
        this.closeNotesModal();
    }

    // ---------- ACTIVITY LOG ----------

    logActivity(minutes) {
        const today = new Date().toISOString().split('T')[0];
        if (!this.data.activityLog[today]) {
            this.data.activityLog[today] = { minutes: 0, projects: [] };
        }
        this.data.activityLog[today].minutes += minutes;
        if (this.timerProjectId && !this.data.activityLog[today].projects.includes(this.timerProjectId)) {
            this.data.activityLog[today].projects.push(this.timerProjectId);
        }
        this.saveData();
    }

    // ---------- STATS ----------

    updateStats() {
        const projects = Object.values(this.data.projects);
        const completed = projects.filter(p => p.status === 'completed').length;
        const inProgress = projects.filter(p => p.status === 'in-progress').length;
        const totalSeconds = projects.reduce((sum, p) => sum + p.timeSpent, 0);

        document.getElementById('totalCompleted').textContent = `${completed}/35`;
        document.getElementById('inProgress').textContent = inProgress;
        document.getElementById('totalTime').textContent = this.formatTimeShort(totalSeconds);
        document.getElementById('currentStreak').textContent = this.calculateStreak();

        // Update bars
        document.getElementById('completedBar').style.width = `${(completed / 35) * 100}%`;
        document.getElementById('progressBar').style.width = `${(inProgress / 35) * 100}%`;
        document.getElementById('timeBar').style.width = `${Math.min((totalSeconds / 360000) * 100, 100)}%`; // 100h max
        document.getElementById('streakBar').style.width = `${Math.min((this.calculateStreak() / 30) * 100, 100)}%`;
    }

    calculateStreak() {
        let streak = 0;
        const today = new Date();
        let checkDate = new Date(today);

        // If no activity today, start checking from yesterday
        const todayStr = checkDate.toISOString().split('T')[0];
        if (!this.data.activityLog[todayStr]) {
            checkDate.setDate(checkDate.getDate() - 1);
        }

        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            if (this.data.activityLog[dateStr] && this.data.activityLog[dateStr].minutes > 0) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    }

    // ---------- CALENDAR ----------

    renderCalendar() {
        const year = this.calendarDate.getFullYear();
        const month = this.calendarDate.getMonth();

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        document.getElementById('calendarMonth').textContent = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startWeekday = (firstDay.getDay() + 6) % 7; // Monday = 0
        const daysInMonth = lastDay.getDate();

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const grid = document.getElementById('calendarGrid');
        let html = '';

        // Empty cells before first day
        for (let i = 0; i < startWeekday; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        // Day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const activity = this.data.activityLog[dateStr];
            const minutes = activity ? activity.minutes : 0;
            const level = this.getActivityLevel(minutes);
            const isToday = dateStr === todayStr ? 'today' : '';

            const tooltip = minutes > 0 ? `${minutes} min on ${dateStr}` : dateStr;

            html += `<div class="calendar-day level-${level} ${isToday}" title="${tooltip}">${day}</div>`;
        }

        grid.innerHTML = html;
    }

    getActivityLevel(minutes) {
        if (minutes === 0) return 0;
        if (minutes < 30) return 1;
        if (minutes < 60) return 2;
        if (minutes < 120) return 3;
        return 4;
    }

    // ---------- HELPERS ----------

    formatTime(seconds) {
        if (seconds === 0) return '0m';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    }

    formatTimeShort(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0) return `${h}h ${m}m`;
        if (m > 0) return `${m}m`;
        return '0h';
    }
}

// Initialize the app
const tracker = new PythonTracker();
