/**
 * Orbit - Goal Tracker Logic (app.js)
 */

document.addEventListener('DOMContentLoaded', () => {
    // === STATE ===
    const STORAGE_KEY = 'orbit_goals_v1';
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
        await loadPlannerGoals();
        renderGoals();
        updateStats();
        setupEventListeners();

        // Populate dummy data if empty to show the UI initially
        if (goals.length === 0) {
            goals = [
                { id: generateId(), title: 'Read Books', target: 20, current: 5, unit: 'books', completed: false, createdAt: Date.now() },
                { id: generateId(), title: 'Run a Marathon', target: 42, current: 42, unit: 'km', completed: true, createdAt: Date.now() - 100000 },
                { id: generateId(), title: 'Drink Water', target: 100, current: 65, unit: 'days', completed: false, createdAt: Date.now() - 50000 }
            ];
            saveGoals();
            renderGoals();
            updateStats();
        }
    }

    // === DATA LOADING ===
    async function loadPlannerGoals() {
        try {
            const response = await fetch('planner_goals.json');
            if (response.ok) {
                const plannerGoals = await response.json();
                let isUpdated = false;

                plannerGoals.forEach(pg => {
                    // Check if this planner goal already exists in our state
                    const exists = goals.some(g => g.id === pg.id);
                    if (!exists) {
                        pg.createdAt = Date.now();
                        goals.push(pg);
                        isUpdated = true;
                    }
                });

                if (isUpdated) {
                    // Sort goals so newest (or newly imported) appear first
                    goals.sort((a, b) => b.createdAt - a.createdAt);
                    saveGoals();
                }
            }
        } catch (e) {
            console.error("Error saving goals:", e);
        }
    }

    // ==========================================
    // ANTIGRAVITY PREMIUM MICRO-INTERACTIONS
    // ==========================================

    function initAntigravityEffects() {
        // 1. Parallax background lens flares
        const orbs = document.querySelectorAll('.bg-orb');

        // 2. 3D Tilt on Cards (Subject Groups)
        const cards = document.querySelectorAll('.glass-panel');

        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;

            // Lens Flare Parallax (moves opposite to mouse slightly)
            const xRatio = (x / window.innerWidth) - 0.5;
            const yRatio = (y / window.innerHeight) - 0.5;

            orbs.forEach((orb, i) => {
                const speed = (i + 1) * 30; // Different depth planes
                orb.style.transform = `translate(${-xRatio * speed}px, ${-yRatio * speed}px) rotate(${i === 0 ? '-15deg' : '15deg'})`;
            });

            // 3D Tilt Effect on cards
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                // Only apply if mouse is near or over the card
                const isHovered = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

                if (isHovered) {
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    const tiltX = ((y - centerY) / (rect.height / 2)) * -2; // Max 2 degrees
                    const tiltY = ((x - centerX) / (rect.width / 2)) * 2;

                    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
                    card.style.transition = 'transform 0.1s ease-out';
                    card.style.zIndex = '10';
                } else {
                    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                    card.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    card.style.zIndex = '1';
                }
            });
        });

        // 3. Floating Action Buttons Bobbing (Zero Gravity)
        const fabs = document.querySelectorAll('.btn-primary');
        let time = 0;

        function bobFabs() {
            time += 0.03;
            const yOffset = Math.sin(time) * 3; // Bov up and down by 3px
            fabs.forEach((fab) => {
                // Only bob if not being explicitly hovered (which has its own transform)
                if (!fab.matches(':hover')) {
                    fab.style.transform = `translateY(${yOffset}px)`;
                }
            });
            requestAnimationFrame(bobFabs);
        }

        bobFabs();
    }

    // Call init to attach listeners when the DOM is ready and goals are rendered
    document.addEventListener('DOMContentLoaded', () => {
        // Other initializations happen earlier...
        // Give render a slight delay so DOM elements exist before attaching 3D effects
        setTimeout(initAntigravityEffects, 100);
    });

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

        // Sidebar Navigation View Switching
        const navItems = document.querySelectorAll('#sidebar-nav li');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const viewName = item.dataset.view;
                if (!viewName) return;

                // Update active nav link
                navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');

                // Switch Views
                const views = document.querySelectorAll('.view-container');
                views.forEach(v => {
                    v.style.display = 'none';
                    v.classList.remove('active');
                });
                const activeView = document.getElementById(`view-${viewName}`);
                if (activeView) {
                    activeView.style.display = 'block';
                    activeView.classList.add('active');

                    // Update Header Title depending on view
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

        // Use event delegation for goal cards/checkboxes
        goalsContainer.addEventListener('click', handleGoalActions);
    }

    // === MODAL LOGIC ===
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
            // Edit existing
            const index = goals.findIndex(g => g.id === id);
            if (index !== -1) {
                goals[index].title = title;
                goals[index].target = target;
                goals[index].unit = unit;
                // Re-evaluate completion status if target changes
                goals[index].completed = goals[index].current >= target;
                if (goals[index].current > target) goals[index].current = target;
            }
        } else {
            // Create new
            const newGoal = {
                id: generateId(),
                title,
                target,
                current: 0,
                unit,
                completed: false,
                createdAt: Date.now()
            };
            goals.unshift(newGoal); // Add to beginning
        }

        saveGoals();
        renderGoals();
        updateStats();
        closeModal();
    }

    // === GOAL ACTIONS LOGIC ===
    function handleGoalActions(e) {
        // Toggle Accordion
        const subjectHeader = e.target.closest('.subject-header');
        if (subjectHeader) {
            const group = subjectHeader.closest('.subject-group');
            group.classList.toggle('expanded');
            return;
        }

        const chapterRow = e.target.closest('.chapter-row');
        if (!chapterRow) return;

        const goalId = chapterRow.dataset.id;
        const btnDelete = e.target.closest('.btn-delete');
        const btnEdit = e.target.closest('.btn-edit');
        const lectureBox = e.target.closest('.lecture-box');

        if (lectureBox) {
            const index = parseInt(lectureBox.dataset.index);
            toggleLectureProgress(goalId, index);
        } else if (btnDelete) {
            if (confirm('Are you sure you want to delete this goal?')) {
                deleteGoal(goalId);
            }
        } else if (btnEdit) {
            const goal = goals.find(g => g.id === goalId);
            if (goal) openModal(goal);
        }
    }

    function toggleLectureProgress(id, lectureIndex) {
        const index = goals.findIndex(g => g.id === id);
        if (index === -1) return;

        const goal = goals[index];
        // If clicking a checkbox, we set the progress to that index + 1
        // If it's already at that exact progress, uncheck it (progress = index)
        if (goal.current === lectureIndex + 1) {
            goal.current = lectureIndex;
        } else {
            goal.current = lectureIndex + 1;
        }

        goal.completed = (goal.current >= goal.target);
        saveGoals();

        // Re-render to update the checkboxes and text
        renderGoals();
        updateStats();

        // Ensure the subject accordion stays expanded after re-render if it was
        // Simple heuristic: just re-render, we'll lose accordion state unless we track it
        // A full framework handles this better, but we can manage it.
    }

    function deleteGoal(id) {
        goals = goals.filter(g => g.id !== id);
        saveGoals();
        renderGoals();
        updateStats();
    }

    // === RENDERING ===
    function renderGoals() {
        goalsContainer.innerHTML = '';

        const filteredGoals = goals.filter(goal => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'active') return !goal.completed;
            if (currentFilter === 'completed') return goal.completed;
            return true;
        });

        if (filteredGoals.length === 0) {
            goalsContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--text-muted);">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 16px; opacity: 0.5;">
                        <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p>No goals found in this view.</p>
                </div>`;
            return;
        }

        // Sort by sequence if available, falling back to createdAt
        filteredGoals.sort((a, b) => {
            const seqA = a.sequence !== undefined ? a.sequence : Infinity;
            const seqB = b.sequence !== undefined ? b.sequence : Infinity;
            if (seqA !== seqB) {
                return seqA - seqB;
            }
            return b.createdAt - a.createdAt;
        });

        // Group by Subject
        const grouped = {};

        filteredGoals.forEach(goal => {
            let subject = "Other";
            let chapter = goal.title;

            if (goal.title.includes(' - ')) {
                const parts = goal.title.split(' - ');
                subject = parts[0];
                chapter = parts.slice(1).join(' - ');
            }

            if (!grouped[subject]) grouped[subject] = [];

            // Pass the split chapter name for rendering
            grouped[subject].push({ ...goal, chapterDisplay: chapter });
        });

        // Render Subjects
        for (const [subjectName, subjectGoals] of Object.entries(grouped)) {
            const subjectClone = subjectTemplate.content.cloneNode(true);
            const subjectGroup = subjectClone.querySelector('.subject-group');

            // Auto-expand if active filter is applied, or default to expand for better visibility
            subjectGroup.classList.add('expanded');

            subjectClone.querySelector('.subject-name').textContent = subjectName;

            const totalTarget = subjectGoals.reduce((sum, g) => sum + g.target, 0);
            const totalCurrent = subjectGoals.reduce((sum, g) => sum + g.current, 0);
            const percentage = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

            subjectClone.querySelector('.subject-progress').textContent = `${totalCurrent}/${totalTarget} (${percentage}%)`;

            const contentDiv = subjectClone.querySelector('.subject-content');

            // Render Chapters within Subject
            subjectGoals.forEach((goal, index) => {
                const chapterClone = chapterTemplate.content.cloneNode(true);
                const chapterRow = chapterClone.querySelector('.chapter-row');

                chapterRow.dataset.id = goal.id;

                chapterClone.querySelector('.chapter-name').textContent = goal.chapterDisplay;
                chapterClone.querySelector('.chapter-progress-text').textContent = `${goal.current} / ${goal.target} ${goal.unit}`;

                if (goal.isPlannerGoal) {
                    chapterClone.querySelector('.planner-badge').style.display = 'inline-block';
                }

                const checkboxesDiv = chapterClone.querySelector('.lecture-checkboxes');

                // Render Checkboxes
                for (let i = 0; i < goal.target; i++) {
                    const box = document.createElement('div');
                    box.className = 'lecture-box' + (i < goal.current ? ' checked' : '');
                    box.dataset.index = i;
                    box.title = `Lecture ${i + 1}`;
                    box.innerHTML = `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                    checkboxesDiv.appendChild(box);
                }

                // Add Cubic-Bezier Scale-In arrival animation to the chapter row
                chapterRow.style.opacity = '0';
                chapterRow.style.transform = 'scale(0.95) translateY(10px)';
                chapterRow.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';

                setTimeout(() => {
                    chapterRow.style.opacity = '1';
                    chapterRow.style.transform = 'scale(1) translateY(0)';
                }, 50 * index); // Staggered arrival

                contentDiv.appendChild(chapterClone);
            });

            goalsContainer.appendChild(subjectClone);
        }
    }

    function updateStats() {
        const total = goals.length;
        const completed = goals.filter(g => g.completed).length;
        const inProgress = total - completed;

        animateValue(statTotal, parseInt(statTotal.textContent), total, 500);
        animateValue(statProgress, parseInt(statProgress.textContent), inProgress, 500);
        animateValue(statCompleted, parseInt(statCompleted.textContent), completed, 500);

        // Update Master Progress Bar
        const globalTarget = goals.reduce((sum, g) => sum + g.target, 0);
        const globalCurrent = goals.reduce((sum, g) => sum + g.current, 0);
        const globalPercentage = globalTarget > 0 ? Math.round((globalCurrent / globalTarget) * 100) : 0;

        const masterText = document.getElementById('master-progress-text');
        const masterFill = document.getElementById('master-progress-fill');

        if (masterText && masterFill) {
            animateValue(masterText, parseInt(masterText.textContent) || 0, globalPercentage, 500, '%');
            masterFill.style.width = `${globalPercentage}%`;
        }

        // Update Deadline Countdown
        const deadlineDate = new Date('2026-03-25T00:00:00');
        const now = new Date();
        const timeDiff = deadlineDate.getTime() - now.getTime();
        const daysRemainingStr = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
        const daysEl = document.getElementById('days-remaining');
        if (daysEl) {
            animateValue(daysEl, parseInt(daysEl.textContent) || 0, daysRemainingStr, 500);
        }
    }

    // === TIMELINE & STATISTICS RENDERERS ===
    function renderTimeline() {
        const timelineContainer = document.getElementById('timeline-container');
        timelineContainer.innerHTML = '';

        // Sort goals by creation date, newest first
        const sorted = [...goals].sort((a, b) => b.createdAt - a.createdAt);

        if (sorted.length === 0) {
            timelineContainer.innerHTML = '<p style="padding: 24px; color: var(--text-muted); text-align: center;">No history available.</p>';
            return;
        }

        let html = '<div class="timeline">';
        sorted.forEach(goal => {
            const date = new Date(goal.createdAt).toLocaleDateString();
            const statusColor = goal.completed ? 'var(--accent-green)' : 'var(--accent-primary)';
            html += `
                <div class="timeline-item" style="border-left: 2px solid ${statusColor}; padding-left: 16px; margin-bottom: 24px; position: relative;">
                    <div style="position: absolute; left: -6px; top: 0; width: 10px; height: 10px; border-radius: 50%; background: ${statusColor};"></div>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">${date}</p>
                    <h4 style="font-weight: 500; font-size: 1rem; color: var(--text-primary); margin-bottom: 4px;">${goal.title}</h4>
                    <p style="font-size: 0.9rem; color: var(--text-secondary);">Target: ${goal.target} ${goal.unit}</p>
                </div>
            `;
        });
        html += '</div>';
        timelineContainer.innerHTML = html;
        timelineContainer.style.padding = '24px';
    }

    function renderStatistics() {
        const statsContainer = document.getElementById('statistics-container');
        statsContainer.innerHTML = '';

        // Calculate grouping by primary subject
        const subjectStats = {};
        goals.forEach(g => {
            const sub = g.title.includes(' - ') ? g.title.split(' - ')[0] : 'Other';
            if (!subjectStats[sub]) {
                subjectStats[sub] = { count: 0, current: 0, target: 0, completed: 0 };
            }
            subjectStats[sub].count++;
            subjectStats[sub].target += g.target;
            subjectStats[sub].current += g.current;
            if (g.completed) subjectStats[sub].completed++;
        });

        let html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 24px;">';
        for (const [sub, data] of Object.entries(subjectStats)) {
            const percentage = data.target > 0 ? Math.round((data.current / data.target) * 100) : 0;
            html += `
                <div class="stat-card glass-panel" style="display: flex; flex-direction: column; gap: 12px; padding: 24px; border-radius: 12px;">
                    <h3 style="color: var(--accent-primary); font-weight: 500; font-size: 1.1rem;">${sub}</h3>
                    <div style="display: flex; justify-content: space-between; color: var(--text-secondary); font-size: 0.9rem;">
                        <span>Chapters: ${data.count}</span>
                        <span>Comp: ${data.completed}</span>
                    </div>
                    <div style="margin-top: 8px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 0.85rem; color: var(--text-primary);">
                            <span>Progress</span>
                            <span>${percentage}%</span>
                        </div>
                        <div style="width: 100%; height: 6px; background: rgba(0,0,0,0.5); border-radius: 3px; overflow: hidden;">
                            <div style="width: ${percentage}%; height: 100%; background: var(--grad-primary); border-radius: 3px;"></div>
                        </div>
                    </div>
                </div>
            `;
        }
        html += '</div>';
        statsContainer.innerHTML = html;
        statsContainer.style.padding = '24px';
    }

    // === UTILS ===
    function saveGoals() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    }

    function generateId() {
        return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    }

    // Sweet number counting animation
    function animateValue(obj, start, end, duration, suffix = '') {
        if (start === end) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start) + suffix;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Kickoff
    init();
});
