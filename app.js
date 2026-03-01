/**
 * Orbit - Goal Tracker Logic (app.js)
 */

const startApp = () => {
    // === STATE ===
    const STORAGE_KEY = 'orbit_goals_v7'; // 6hr Progressive Roadmap
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

        updateStats();
        setupEventListeners();
    }

    // === DATA LOADING ===
    async function loadPlannerGoals() {
        try {
            const response = await fetch('planner_goals.json');
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
                    box.innerHTML = `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
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

        const deadline = new Date('2026-03-25');
        const diff = Math.max(0, Math.ceil((deadline - new Date()) / (1000 * 3600 * 24)));
        const daysEl = document.getElementById('days-remaining');
        if (daysEl) daysEl.textContent = diff;

        const remHrs = goals.reduce((s, g) => s + (!g.completed ? (g.target - g.current) * (g.durationHours ? (g.durationHours / g.target) : 2) : 0), 0);
        const hpd = diff > 0 ? (remHrs / diff).toFixed(1) : remHrs.toFixed(1);
        const hpdEl = document.getElementById('hours-per-day');
        if (hpdEl) hpdEl.textContent = hpd;
        const watchEl = document.getElementById('total-watch-time');
        if (watchEl) watchEl.textContent = remHrs.toFixed(1);
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
