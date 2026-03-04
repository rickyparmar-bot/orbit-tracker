/**
 * Orbit - Goal Tracker Logic (app.js)
 */

const startApp = () => {
    // === STATE ===
    const STORAGE_KEY = 'orbit_goals_v10'; // Lakshya 2027 + Backlog
    let goals = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    let currentFilter = 'all';

    // === DOM ELEMENTS ===
    const btnNewGoal = document.getElementById('btn-new-goal');
    const modalOverlay = document.getElementById('goal-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const formGoal = document.getElementById('form-goal');
    const goalsContainer = document.getElementById('goals-container');
    const subjectTemplate = document.getElementById('subject-group-template');
    const chapterTemplate = document.getElementById('chapter-row-template');

    // Inputs
    const inputTitle = document.getElementById('goal-title-input');
    const inputTarget = document.getElementById('goal-target');
    const inputUnit = document.getElementById('goal-unit');
    const inputId = document.getElementById('goal-id');
    const modalTitle = document.getElementById('modal-title');

    // Stats
    const statTotal = document.getElementById('stat-total');
    const statProgress = document.getElementById('stat-progress');
    const statCompleted = document.getElementById('stat-completed');

    // Filters
    const filterBtns = document.querySelectorAll('.filter-btn');

    // === INITIALIZATION ===
    async function init() {
        const initialCount = goals.length;
        goals = goals.filter(g => !['Read Books', 'Run a Marathon', 'Drink Water'].includes(g.title));
        if (goals.length !== initialCount) saveGoals();

        await loadPlannerGoals();

        const activeNav = document.querySelector('.nav-links li.active');
        const activeView = activeNav ? activeNav.dataset.view : 'dashboard';

        if (activeView === 'dashboard') renderGoals();
        else if (activeView === 'timeline') renderTimeline();
        else if (activeView === 'statistics') renderStatistics();
        else if (activeView === 'consistency') renderConsistency();

        updateStats();
        initFlipClock();
        setupEventListeners();
    }

    // === DATA LOADING ===
    async function loadPlannerGoals() {
        try {
            const response = await fetch('planner_goals.json?cb=' + Date.now());
            if (response.ok) {
                const plannerGoals = await response.json();
                let isUpdated = false;

                plannerGoals.forEach(pg => {
                    const existing = goals.find(g => g.id === pg.id);
                    if (!existing) {
                        pg.createdAt = Date.now();
                        goals.push(pg);
                        isUpdated = true;
                    } else if (existing.link !== pg.link) {
                        existing.link = pg.link;
                        isUpdated = true;
                    }
                });

                if (isUpdated) {
                    goals.sort((a, b) => b.createdAt - a.createdAt);
                    saveGoals();
                }
            }
        } catch (e) {
            console.error("Error loading planner goals:", e);
        }
    }

    // === ANTIGRAVITY EFFECTS ===
    function initAntigravityEffects() {
        const orbs = document.querySelectorAll('.bg-orb');
        const cards = document.querySelectorAll('.glass-panel');

        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            const xRatio = (x / window.innerWidth) - 0.5;
            const yRatio = (y / window.innerHeight) - 0.5;

            orbs.forEach((orb, i) => {
                const speed = (i + 1) * 30;
                orb.style.transform = `translate(${-xRatio * speed}px, ${-yRatio * speed}px) rotate(${i === 0 ? '-15deg' : '15deg'})`;
            });

            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const isHovered = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
                if (isHovered) {
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const tiltX = ((y - centerY) / (rect.height / 2)) * -2;
                    const tiltY = ((x - centerX) / (rect.width / 2)) * 2;
                    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
                    card.style.transition = 'transform 0.1s ease-out';
                } else {
                    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                    card.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                }
            });
        });

        const fabs = document.querySelectorAll('.btn-primary');
        let time = 0;
        function bobFabs() {
            time += 0.03;
            const yOffset = Math.sin(time) * 3;
            fabs.forEach((fab) => {
                if (!fab.matches(':hover')) {
                    fab.style.transform = `translateY(${yOffset}px)`;
                }
            });
            requestAnimationFrame(bobFabs);
        }
        bobFabs();
    }

    // === EVENT LISTENERS ===
    function setupEventListeners() {
        btnNewGoal.addEventListener('click', () => openModal());
        btnCloseModal.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
        formGoal.addEventListener('submit', handleFormSubmit);

        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentFilter = e.target.dataset.filter;
                renderGoals();
            });
        });

        const navItems = document.querySelectorAll('#sidebar-nav li');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const viewName = item.dataset.view;
                if (!viewName) return;
                navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                const views = document.querySelectorAll('.view-container');
                views.forEach(v => {
                    v.style.display = 'none';
                    v.classList.remove('active');
                });
                const activeView = document.getElementById(`view-${viewName}`);
                if (activeView) {
                    activeView.style.display = 'block';
                    activeView.classList.add('active');
                    const viewTitle = document.getElementById('view-title');
                    const viewSubtitle = document.getElementById('view-subtitle');
                    if (viewName === 'dashboard') {
                        viewTitle.textContent = 'Dashboard';
                        viewSubtitle.textContent = 'Track your progress and build momentum.';
                        renderGoals();
                    } else if (viewName === 'timeline') {
                        viewTitle.textContent = 'Timeline';
                        viewSubtitle.textContent = 'Chronological history of your goals.';
                        renderTimeline();
                    } else if (viewName === 'statistics') {
                        viewTitle.textContent = 'Statistics';
                        viewSubtitle.textContent = 'Deep dive into your performance.';
                        renderStatistics();
                    } else if (viewName === 'consistency') {
                        viewTitle.textContent = 'Consistency';
                        viewSubtitle.textContent = 'Visualize your daily momentum.';
                        renderConsistency();
                    }
                }
            });
        });

        goalsContainer.addEventListener('click', handleGoalActions);
    }

    // === LOGIC FUNCTIONS ===
    function openModal(goalToEdit = null) {
        if (goalToEdit) {
            modalTitle.textContent = 'Edit Goal';
            inputId.value = goalToEdit.id;
            inputTitle.value = goalToEdit.title;
            inputTarget.value = goalToEdit.target;
            inputUnit.value = goalToEdit.unit || '';
        } else {
            modalTitle.textContent = 'Create New Goal';
            formGoal.reset();
            inputId.value = '';
        }
        modalOverlay.classList.add('active');
        setTimeout(() => inputTitle.focus(), 100);
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        const title = inputTitle.value.trim();
        const target = parseFloat(inputTarget.value);
        const unit = inputUnit.value.trim();
        const id = inputId.value;
        if (!title || isNaN(target) || target <= 0) return;

        if (id) {
            const index = goals.findIndex(g => g.id === id);
            if (index !== -1) {
                goals[index].title = title;
                goals[index].target = target;
                goals[index].unit = unit;
                goals[index].completed = goals[index].current >= target;
                if (goals[index].current > target) goals[index].current = target;
            }
        } else {
            const newGoal = {
                id: generateId(),
                title,
                target,
                current: 0,
                unit,
                completed: false,
                subtopics: ['Video', 'Module', 'Question Practice'], // Default subtopics
                createdAt: Date.now()
            };
            goals.unshift(newGoal);
        }
        saveGoals();
        renderGoals();
        updateStats();
        closeModal();
    }

    function handleGoalActions(e) {
        const subjectHeader = e.target.closest('.subject-header');
        if (subjectHeader) {
            subjectHeader.closest('.subject-group').classList.toggle('expanded');
            return;
        }
        const chapterRow = e.target.closest('.chapter-row');
        if (!chapterRow) return;
        const goalId = chapterRow.dataset.id;
        if (e.target.closest('.lecture-box')) {
            const index = parseInt(e.target.closest('.lecture-box').dataset.index);
            toggleLectureProgress(goalId, index);
        } else if (e.target.closest('.btn-delete')) {
            if (confirm('Are you sure you want to delete this goal?')) deleteGoal(goalId);
        } else if (e.target.closest('.btn-edit')) {
            const goal = goals.find(g => g.id === goalId);
            if (goal) openModal(goal);
        }
    }

    function toggleLectureProgress(id, lectureIndex) {
        const index = goals.findIndex(g => g.id === id);
        if (index === -1) return;
        const goal = goals[index];
        if (goal.current === lectureIndex + 1) goal.current = lectureIndex;
        else goal.current = lectureIndex + 1;
        goal.completed = (goal.current >= goal.target);
        saveGoals();
        renderGoals();
        updateStats();
    }

    function deleteGoal(id) {
        goals = goals.filter(g => g.id !== id);
        saveGoals();
        renderGoals();
        updateStats();
    }

    // === RENDERING FUNCTIONS ===
    function renderGoals() {
        goalsContainer.innerHTML = '';
        const filtered = goals.filter(g => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'active') return !g.completed;
            if (currentFilter === 'completed') return g.completed;
            return true;
        });

        if (filtered.length === 0) {
            goalsContainer.innerHTML = '<div style="padding:48px; text-align:center; color:var(--text-muted);"><p>No goals found.</p></div>';
            return;
        }

        filtered.sort((a, b) => {
            const sA = a.sequence || Infinity;
            const sB = b.sequence || Infinity;
            if (sA !== sB) return sA - sB;
            return b.createdAt - a.createdAt;
        });

        const grouped = {};
        filtered.forEach(g => {
            const groupName = g.day || (g.title.includes(' - ') ? g.title.split(' - ')[0] : 'Other');
            const chapterDisplay = g.day ? g.title : (g.title.includes(' - ') ? g.title.split(' - ').slice(1).join(' - ') : g.title);
            if (!grouped[groupName]) grouped[groupName] = [];
            grouped[groupName].push({ ...g, chapterDisplay });
        });

        const sortedKeys = Object.keys(grouped).sort((a, b) => {
            if (a.startsWith('Day ') && b.startsWith('Day ')) return parseInt(a.split(' ')[1]) - parseInt(b.split(' ')[1]);
            return a.localeCompare(b);
        });

        sortedKeys.forEach(groupName => {
            const groupGoals = grouped[groupName];
            const subjectClone = subjectTemplate.content.cloneNode(true);
            const subjectGroup = subjectClone.querySelector('.subject-group');
            subjectGroup.classList.add('expanded');
            subjectClone.querySelector('.subject-name').textContent = groupName;
            const target = groupGoals.reduce((s, g) => s + g.target, 0);
            const current = groupGoals.reduce((s, g) => s + g.current, 0);
            const pct = target > 0 ? Math.round((current / target) * 100) : 0;
            subjectClone.querySelector('.subject-progress').textContent = `${current}/${target} (${pct}%)`;

            const contentDiv = subjectClone.querySelector('.subject-content');
            groupGoals.forEach((goal, idx) => {
                const chapterClone = chapterTemplate.content.cloneNode(true);
                const row = chapterClone.querySelector('.chapter-row');
                row.dataset.id = goal.id;
                chapterClone.querySelector('.chapter-name').textContent = goal.chapterDisplay;
                chapterClone.querySelector('.chapter-progress-text').textContent = `${goal.current}/${goal.target} (${goal.durationHours || goal.target * 2} hrs)`;
                if (goal.isPlannerGoal) chapterClone.querySelector('.planner-badge').style.display = 'inline-block';
                if (goal.link) {
                    const w = chapterClone.querySelector('.watch-link');
                    w.href = goal.link;
                    w.style.display = 'inline-flex';
                }
                const chks = chapterClone.querySelector('.lecture-checkboxes');
                for (let i = 0; i < goal.target; i++) {
                    const box = document.createElement('div');
                    box.className = 'lecture-box' + (i < goal.current ? ' checked' : '');
                    box.dataset.index = i;

                    let label = '';
                    if (goal.subtopics && goal.subtopics[i]) {
                        label = `<span style="margin-left:8px; font-size:12px; font-weight: 500; color: #a1a1aa;">${goal.subtopics[i]}</span>`;
                        box.style.display = 'flex';
                        box.style.alignItems = 'center';
                        box.style.width = 'auto'; // Disable hardcoded width & height
                        box.style.height = 'auto';
                        box.style.padding = '4px 12px 4px 4px';
                        box.style.borderRadius = '20px'; // pill shape
                    }

                    box.innerHTML = `<svg viewBox="0 0 24 24" style="width:24px; height:24px; flex-shrink: 0;"><polyline points="20 6 9 17 4 12"></polyline></svg>${label}`;
                    chks.appendChild(box);
                }
                row.style.opacity = '0';
                row.style.transform = 'scale(0.95)';
                row.style.transition = 'all 0.5s ease-out';
                setTimeout(() => {
                    row.style.opacity = '1';
                    row.style.transform = 'scale(1)';
                }, 30 * idx);
                contentDiv.appendChild(chapterClone);
            });
            goalsContainer.appendChild(subjectClone);
        });
    }

    function updateStats() {
        const total = goals.length;
        const completed = goals.filter(g => g.completed).length;
        animateValue(statTotal, 0, total, 500);
        animateValue(statProgress, 0, total - completed, 500);
        animateValue(statCompleted, 0, completed, 500);

        const gTarget = goals.reduce((s, g) => s + g.target, 0);
        const gCurrent = goals.reduce((s, g) => s + g.current, 0);
        const gPct = gTarget > 0 ? Math.round((gCurrent / gTarget) * 100) : 0;
        const mText = document.getElementById('master-progress-text');
        const mFill = document.getElementById('master-progress-fill');
        if (mText) mText.textContent = `${gPct}%`;
        if (mFill) mFill.style.width = `${gPct}%`;

        // Flip clock ticking is now handled by initFlipClock

        // Draw 180 Days Grid
        // Total days constraint is 180.
        const gridContainer = document.getElementById('days-grid');
        const passedLabel = document.getElementById('grid-passed-days');

        if (gridContainer && passedLabel) {
            const START_DATE = new Date('2026-03-05T00:00:00');
            const now = new Date();
            const passedMs = now - START_DATE;
            let daysPassed = Math.floor(passedMs / (1000 * 3600 * 24));
            if (daysPassed < 0) daysPassed = 0;
            if (daysPassed > 180) daysPassed = 180;

            passedLabel.textContent = daysPassed;

            // Only re-draw if empty to prevent re-rendering stutter, 
            // but for simplicity we draw once if empty, or just overwrite.
            gridContainer.innerHTML = '';
            for (let i = 0; i < 180; i++) {
                const sq = document.createElement('div');
                sq.className = 'day-square';
                if (i < daysPassed) {
                    sq.classList.add('passed');
                } else if (i === daysPassed) {
                    sq.classList.add('today');
                }
                gridContainer.appendChild(sq);
            }
        }
    }

    function initFlipClock() {
        const END_DATE = new Date('2026-09-01T00:00:00').getTime();
        const elDays = document.getElementById('flip-days');
        const elHours = document.getElementById('flip-hours');
        const elMins = document.getElementById('flip-mins');
        const elSecs = document.getElementById('flip-secs');

        function updateClock() {
            const now = new Date().getTime();
            let distance = END_DATE - now;

            if (distance < 0) {
                distance = 0;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (elDays) elDays.textContent = days.toString().padStart(2, '0');
            if (elHours) elHours.textContent = hours.toString().padStart(2, '0');
            if (elMins) elMins.textContent = minutes.toString().padStart(2, '0');
            if (elSecs) elSecs.textContent = seconds.toString().padStart(2, '0');
        }

        updateClock(); // Initial hit
        setInterval(updateClock, 1000); // Tick every second
    }

    function renderTimeline() {
        const container = document.getElementById('timeline-container');
        container.innerHTML = '';
        const sorted = [...goals].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        let html = '<div class="timeline">';
        sorted.forEach(g => {
            const date = new Date(g.createdAt).toLocaleDateString();
            html += `<div class="timeline-item" style="border-left:2px solid var(--accent-primary); padding-left:16px; margin-bottom:16px;">
                <p style="font-size:0.8rem; color:var(--text-muted);">${date}</p>
                <h4>${g.title}</h4>
                <p>Status: ${g.completed ? 'Completed' : 'Active'}</p>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
        container.style.padding = '24px';
    }

    function renderStatistics() {
        const container = document.getElementById('statistics-container');
        container.innerHTML = '';
        const stats = {};
        goals.forEach(g => {
            const sub = g.title.split(' - ')[0];
            if (!stats[sub]) stats[sub] = { target: 0, current: 0 };
            stats[sub].target += g.target;
            stats[sub].current += g.current;
        });
        let html = '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:16px;">';
        for (const [sub, data] of Object.entries(stats)) {
            const p = data.target > 0 ? Math.round((data.current / data.target) * 100) : 0;
            html += `<div class="glass-panel" style="padding:16px;">
                <h3>${sub}</h3>
                <p>Completion: ${p}%</p>
                <div style="width:100%; height:4px; background:rgba(0,0,0,0.3);"><div style="width:${p}%; height:100%; background:var(--accent-primary);"></div></div>
            </div>`;
        }
        html += '</div>';
        container.innerHTML = html;
        container.style.padding = '24px';
    }

    let chartInstance = null;

    function renderConsistency() {
        const ctx = document.getElementById('consistencyChart');
        if (!ctx) return;

        // Group `current` progress by Day
        const dayStats = {};
        let maxDay = 0;
        goals.forEach(g => {
            if (g.day) {
                const dayNum = parseInt(g.day.replace('Day ', ''), 10);
                if (!isNaN(dayNum)) {
                    if (!dayStats[dayNum]) dayStats[dayNum] = { target: 0, current: 0 };
                    dayStats[dayNum].target += g.target;
                    dayStats[dayNum].current += g.current;
                    if (dayNum > maxDay) maxDay = dayNum;
                }
            }
        });

        // To make the graph look good, we plot up to the last day with > 0 current, 
        // or a minimum of 7 days.
        let endDay = 14;
        for (let i = 1; i <= maxDay; i++) {
            if (dayStats[i] && dayStats[i].current > 0) {
                endDay = Math.max(endDay, i + 2); // show a few days ahead
            }
        }

        const labels = [];
        const dataPoints = [];
        for (let i = 1; i <= endDay; i++) {
            labels.push(`Day ${i}`);
            dataPoints.push(dayStats[i] ? dayStats[i].current : 0);
        }

        if (chartInstance) {
            chartInstance.destroy();
        }

        Chart.defaults.color = 'rgba(255, 255, 255, 0.7)';
        Chart.defaults.font.family = 'Inter';

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tasks Completed (Daily)',
                    data: dataPoints,
                    borderColor: '#a78bfa',
                    backgroundColor: 'rgba(167, 139, 250, 0.2)',
                    borderWidth: 3,
                    tension: 0.3,
                    fill: true,
                    pointBackgroundColor: '#a78bfa',
                    pointBorderColor: '#fff',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    }
                }
            }
        });
    }

    function saveGoals() { localStorage.setItem(STORAGE_KEY, JSON.stringify(goals)); }
    function generateId() { return Math.random().toString(36).substr(2, 9); }
    function animateValue(obj, start, end, duration) { obj.textContent = end; } // Simplified

    // === AUTHENTICATION ===
    const lockScreen = document.getElementById('lock-screen');
    const appWrapper = document.getElementById('app-wrapper');
    const passInput = document.getElementById('password-input');
    const btnUnlock = document.getElementById('btn-unlock');

    function unlockApp() {
        lockScreen.style.display = 'none';
        appWrapper.style.display = 'flex';
        appWrapper.style.opacity = '1';
        init();
        initAntigravityEffects();
    }

    if (localStorage.getItem('orbit_auth') === 'true') {
        unlockApp();
    } else {
        btnUnlock.addEventListener('click', () => {
            if (passInput.value.toLowerCase() === 'ricky') {
                localStorage.setItem('orbit_auth', 'true');
                unlockApp();
            } else {
                document.getElementById('password-error').style.display = 'block';
            }
        });
        passInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') btnUnlock.click(); });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}
