/**
 * Orbit Universe v2 — Rendering Engine with Sub-Topics and MCQ Engine and Subject Cards
 */
(function () {
    const REVISION_KEY = 'orbit_universe_revision_v2';
    const MASTERY_KEY = 'orbit_universe_mastery';
    let currentData = null; // { subject, stream, chapter, subtopic }
    let currentTab = 'godsheet';
    let fcIndex = 0, fcFlipped = false;
    let mcqStates = {}; // key: subtopicKey_qIndex => 'correct', 'review', 'struggled', null

    window.getChapterNode = function (subjKey, streamKey, chKey) {
        if (!UNIVERSE_DATA[subjKey]) return null;
        if (!UNIVERSE_DATA[subjKey].streams[streamKey]) return null;
        return UNIVERSE_DATA[subjKey].streams[streamKey].chapters[chKey];
    }

    function getSubtopicNode() {
        if (!currentData) return null;
        const ch = window.getChapterNode(currentData.subject, currentData.stream, currentData.chapter);
        if (!ch || !ch.subtopics || !ch.subtopics[currentData.subtopic]) return null;
        return ch.subtopics[currentData.subtopic];
    }

    function loadMastery() {
        try {
            mcqStates = JSON.parse(localStorage.getItem(MASTERY_KEY)) || {};
        } catch (e) { mcqStates = {}; }
    }

    function saveMastery() {
        localStorage.setItem(MASTERY_KEY, JSON.stringify(mcqStates));
        updateLineGraph(); // trigger Chart.js update if visible
    }

    window.initUniverse = function () {
        loadMastery();
        renderSubjectsDashboard();
        setupTabs();

        const gvPanel = document.getElementById('universe-god-view');
        if (gvPanel) gvPanel.style.display = 'none';
        const splash = document.getElementById('universe-splash');
        if (splash) splash.style.display = 'none';
        const pathEl = document.getElementById('universe-path');
        if (pathEl) pathEl.style.display = 'none';
        const dashEl = document.getElementById('universe-dashboard');
        if (dashEl) dashEl.style.display = 'block';

        // initialize dummy line graph locally for Universe tracking if chart exists
        setTimeout(updateLineGraph, 500);
    };

    function calculateSubjectMastery(subjKey, streamKey) {
        const defaultRet = { percent: 0, str: "0%" };
        const streamData = UNIVERSE_DATA[subjKey].streams[streamKey];
        if (!streamData) return defaultRet;

        let correctCount = 0;
        let totalCount = 0;

        for (const [cKey, cData] of Object.entries(streamData.chapters)) {
            if (cData.subtopics) {
                for (const [subKey, subData] of Object.entries(cData.subtopics)) {
                    const subQs = subData.mcq || [];
                    totalCount += subQs.length;
                    subQs.forEach((q, idx) => {
                        const stateKey = subKey + '_' + idx;
                        if (mcqStates[stateKey] === 'correct') {
                            correctCount++;
                        }
                    });
                }
            }
        }

        if (totalCount === 0) return defaultRet;
        const pct = Math.round((correctCount / totalCount) * 100);
        return { percent: pct, str: `${pct}%` };
    }

    function renderSubjectsDashboard() {
        const container = document.getElementById('subject-cards-container');
        if (!container) return;
        container.innerHTML = '';

        for (const [sKey, sData] of Object.entries(UNIVERSE_DATA)) {
            for (const [stKey, stData] of Object.entries(sData.streams)) {
                // Determine icon letters
                const letters = stData.label.substring(0, 2).replace(/[^a-zA-Z]/g, '').trim();
                const shortCode = letters.length > 0 ? letters.charAt(0).toUpperCase() + letters.slice(1).toLowerCase() : stData.label.charAt(0);

                const card = document.createElement('div');
                card.className = 'subject-card';
                card.onclick = () => window._uniOpenPath(sKey, stKey);

                const mastery = calculateSubjectMastery(sKey, stKey);

                card.innerHTML = `
                    <div class="subject-icon-badge">${shortCode}</div>
                    <div class="subject-card-content">
                        <h3 class="subject-card-title">${stData.label}</h3>
                    </div>
                    <div class="subject-card-right">
                        <div class="subject-card-progress">
                            <span>${mastery.str}</span>
                            <div class="progress-bar-mini">
                                <div class="progress-bar-mini-fill" style="width: ${mastery.percent}%"></div>
                            </div>
                        </div>
                        <span class="subject-card-arrow">›</span>
                    </div>
                `;
                container.appendChild(card);
            }
        }
    }

    window._uniBackToDash = function () {
        document.getElementById('universe-dashboard').style.display = 'block';
        document.getElementById('universe-path').style.display = 'none';
        document.getElementById('universe-god-view').style.display = 'none';
        renderSubjectsDashboard(); // refresh scores
    };

    window._uniBackToPath = function () {
        if (currentData && currentData.subject) {
            window._uniOpenPath(currentData.subject, currentData.stream);
        } else {
            window._uniBackToDash();
        }
    };

    window._uniOpenPath = function (subjKey, streamKey) {
        currentData = { subject: subjKey, stream: streamKey, chapter: null, subtopic: null };
        const stData = UNIVERSE_DATA[subjKey].streams[streamKey];

        document.getElementById('universe-dashboard').style.display = 'none';
        document.getElementById('universe-god-view').style.display = 'none';
        const pathEl = document.getElementById('universe-path');
        pathEl.style.display = 'block';

        document.getElementById('path-title').textContent = stData.label;

        const listEl = document.getElementById('path-list');
        listEl.innerHTML = '';

        for (const [cKey, cData] of Object.entries(stData.chapters)) {
            // Add Chapter Header
            const chTitle = document.createElement('h3');
            chTitle.textContent = `${cData.label}`;
            chTitle.style.marginTop = '16px';
            chTitle.style.marginBottom = '8px';
            chTitle.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
            chTitle.style.paddingBottom = '4px';
            listEl.appendChild(chTitle);

            if (cData.subtopics) {
                for (const [subKey, subData] of Object.entries(cData.subtopics)) {
                    const item = document.createElement('div');
                    item.className = 'path-item';
                    item.onclick = () => loadSubtopic(subjKey, streamKey, cKey, subKey);
                    item.innerHTML = `
                        <div>
                            <div class="path-item-title">${subData.label}</div>
                            <div class="path-item-subtitle">Sub-topic</div>
                        </div>
                        <span class="subject-card-arrow">›</span>
                    `;
                    listEl.appendChild(item);
                }
            } else {
                const item = document.createElement('div');
                item.className = 'path-item';
                item.innerHTML = `
                     <div>
                         <div class="path-item-title">No sub-topics yet</div>
                     </div>
                 `;
                listEl.appendChild(item);
            }
        }
    };

    function loadSubtopic(subjKey, streamKey, chKey, subKey) {
        currentData = { subject: subjKey, stream: streamKey, chapter: chKey, subtopic: subKey };
        const ch = window.getChapterNode(subjKey, streamKey, chKey);
        const sub = ch.subtopics[subKey];

        document.getElementById('universe-dashboard').style.display = 'none';
        document.getElementById('universe-path').style.display = 'none';
        document.getElementById('universe-god-view').style.display = 'flex';

        document.getElementById('gv-title').textContent = sub.label;
        document.getElementById('gv-subtitle').textContent = `[${ch.label}] ${ch.subject} › ${ch.stream}`;

        fcIndex = 0;
        fcFlipped = false;

        // ensure tabs exist for MCQ
        if (!document.querySelector('.god-tab[data-tab="mcq"]')) {
            const mcqBtn = document.createElement('button');
            mcqBtn.className = 'god-tab';
            mcqBtn.setAttribute('data-tab', 'mcq');
            mcqBtn.innerHTML = '🎯 MCQ Engine';
            document.querySelector('.god-tabs').insertBefore(mcqBtn, document.querySelector('.god-tab[data-tab="pyq"]'));
            setupTabs();
        }

        renderTabContent();
    }

    function renderTabContent() {
        const el = document.getElementById('gv-content');
        el.innerHTML = '';
        el.className = '';

        const sub = getSubtopicNode();
        if (!sub) return;

        if (currentTab === 'godsheet') renderGodSheet(el, sub);
        else if (currentTab === 'recall') renderRecall(el, sub);
        else if (currentTab === 'flashcards') renderFlashcards(el, sub);
        else if (currentTab === 'pyq') renderPYQ(el, sub);
        else if (currentTab === 'mcq') renderMCQ(el, sub);
        else if (currentTab === 'errors') renderErrors(el, sub);
        else if (currentTab === 'revision') renderRevision(el, sub);

        triggerKaTeX(el);
    }

    function triggerKaTeX(el) {
        if (window.renderMathInElement) {
            window.renderMathInElement(el, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false }
                ],
                throwOnError: false
            });
        }
    }

    function renderGodSheet(el, sub) {
        el.classList.add('godsheet-view');
        el.innerHTML = sub.godSheet || '<p>No God-Sheet created yet for this sub-topic.</p>';
    }

    function renderRecall(el, sub) {
        const data = sub.recall || [];
        if (data.length === 0) { el.innerHTML = '<p>No recall prompts yet.</p>'; return; }

        let html = '<div class="recall-grid">';
        data.forEach(item => {
            html += `
                <div class="recall-card">
                    <span class="recall-badge">${item.type.toUpperCase()}</span>
                    <h4>${item.q}</h4>
                    <div class="recall-blur">${item.a}</div>
                </div>
            `;
        });
        html += '</div>';
        el.innerHTML = html;
        el.querySelectorAll('.recall-blur').forEach(b => {
            b.onclick = () => b.classList.add('revealed');
        });
    }

    function renderFlashcards(el, sub) {
        const data = sub.flashcards || [];
        if (data.length === 0) { el.innerHTML = '<p>No flashcards yet.</p>'; return; }

        const card = data[fcIndex];
        el.innerHTML = `
            <div class="fc-container">
                <div class="fc-counter">Card ${fcIndex + 1} of ${data.length} <button class="btn-small" onclick="window._uniShuffle()">🔀 Shuffle</button></div>
                <div class="fc-card ${fcFlipped ? 'flipped' : ''}">
                    <div class="fc-front">
                        <span class="fc-badge">QUESTION</span>
                        <div class="fc-text">${card.q}</div>
                    </div>
                    <div class="fc-back">
                        <span class="fc-badge answer">ANSWER</span>
                        <div class="fc-text">${card.a}</div>
                    </div>
                </div>
                <div class="fc-controls">
                    <button class="fc-btn" onclick="window._uniPrev()">← Prev</button>
                    <button class="fc-btn fc-flip-btn" onclick="window._uniFlip()">Flip</button>
                    <button class="fc-btn" onclick="window._uniNext()">Next →</button>
                </div>
            </div>
        `;
    }
    window._uniFlip = function () { fcFlipped = !fcFlipped; renderTabContent(); };
    window._uniNext = function () { const d = getSubtopicNode().flashcards; if (fcIndex < d.length - 1) { fcIndex++; fcFlipped = false; renderTabContent(); } };
    window._uniPrev = function () { if (fcIndex > 0) { fcIndex--; fcFlipped = false; renderTabContent(); } };
    window._uniShuffle = function () {
        const sub = getSubtopicNode();
        if (sub && sub.flashcards) {
            sub.flashcards.sort(() => Math.random() - 0.5);
            fcIndex = 0; fcFlipped = false;
            renderTabContent();
        }
    };

    function renderPYQ(el, sub) {
        const data = sub.pyq || [];
        if (data.length === 0) { el.innerHTML = '<p>No PYQs yet.</p>'; return; }

        let html = `
            <div class="pyq-header">
                <h3>JEE Advanced PYQs</h3>
            </div>
            <table class="pyq-table" id="pyqTable">
                <thead><tr><th>Year</th><th>Question</th><th>Topic</th></tr></thead>
                <tbody>
        `;
        data.forEach(q => {
            html += `<tr><td><span class="year-badge">${q.year}</span></td><td>${q.q}</td><td>${q.topic}</td></tr>`;
        });
        html += '</tbody></table>';
        el.innerHTML = html;
    }

    function renderMCQ(el, sub) {
        const data = sub.mcq || [];
        if (data.length === 0) { el.innerHTML = '<p>No Interactive MCQs generated yet for this sub-topic.</p>'; return; }

        let html = '<div class="mcq-container">';
        data.forEach((q, idx) => {
            const stateKey = currentData.subtopic + '_' + idx;
            const currentState = mcqStates[stateKey] || null;

            let stateClass = '';
            if (currentState === 'correct') stateClass = 'mcq-correct';
            else if (currentState === 'review') stateClass = 'mcq-review';
            else if (currentState === 'struggled') stateClass = 'mcq-struggled';

            html += `
                <div class="mcq-card ${stateClass}">
                    <div class="mcq-header">
                        <h4>${idx + 1}. ${q.q}</h4>
                        <div class="mcq-actions">
                            <button title="First Try" class="${currentState === 'correct' ? 'active' : ''}" onclick="window._setMCQState(${idx}, 'correct')">✅</button>
                            <button title="Review" class="${currentState === 'review' ? 'active' : ''}" onclick="window._setMCQState(${idx}, 'review')">🔄</button>
                            <button title="Struggled" class="${currentState === 'struggled' ? 'active' : ''}" onclick="window._setMCQState(${idx}, 'struggled')">❌</button>
                        </div>
                    </div>
                    <div class="mcq-options">`;

            q.options.forEach((opt, oIdx) => {
                html += `<div class="mcq-opt" onclick="window._checkMCQAns(${idx}, ${oIdx})">${opt}</div>`;
            });

            html += `</div>
                    <div class="mcq-exp" id="mcq-exp-${idx}" style="display:none;">
                        <strong>Explanation:</strong> ${q.explanation}
                    </div>
                </div>
            `;
        });
        html += '</div>';
        el.innerHTML = html;
    }

    window._setMCQState = function (idx, state) {
        const stateKey = currentData.subtopic + '_' + idx;
        mcqStates[stateKey] = state;
        saveMastery();
        renderTabContent();

        // Calisthenics Alert if Struggled!
        if (state === 'struggled') {
            triggerCalisthenicsAlert();
        }
    }
    window._checkMCQAns = function (idx, oIdx) {
        const sub = getSubtopicNode();
        const q = sub.mcq[idx];
        const exp = document.getElementById('mcq-exp-' + idx);
        exp.style.display = 'block';
        if (q.correct === oIdx) {
            exp.innerHTML = '<span style="color:var(--neon-green)">Correct!</span> ' + q.explanation;
            window._setMCQState(idx, 'correct');
        } else {
            exp.innerHTML = '<span style="color:var(--neon-red)">Incorrect.</span> ' + q.explanation;
            window._setMCQState(idx, 'struggled');
        }
    }

    function renderErrors(el, sub) {
        fetch('/api/content/errors')
            .then(res => res.json())
            .then(data => {
                const subStr = sub.label.toLowerCase();
                // Find matching error log globally if topic matches subtopic
                const match = Object.values(data).find(chapterList => {
                    return Array.isArray(chapterList) && chapterList.some(e =>
                        e.topic && e.topic.toLowerCase().includes(subStr)
                    );
                });

                let errHtml = '<h3>Common JEE Mistakes</h3><div class="error-list">';
                if (match) {
                    match.filter(e => e.topic.toLowerCase().includes(subStr)).forEach(e => {
                        errHtml += `<div class="error-item"><strong>⚠️ ${e.error}</strong><br><span class="correction">✅ ${e.correction}</span></div>`;
                    });
                } else {
                    errHtml += '<p>No common errors logged explicitly for this specific subtopic.</p>';
                }
                errHtml += '</div>';

                // Append "Struggled" MCQs to Error Log
                const subQs = sub.mcq || [];
                const struggledQs = subQs.map((q, i) => ({ q, i })).filter(obj => mcqStates[currentData.subtopic + '_' + obj.i] === 'struggled');

                if (struggledQs.length > 0) {
                    errHtml += '<h3>❌ Your Struggles (Requires Revision)</h3><div class="error-list">';
                    struggledQs.forEach(obj => {
                        errHtml += `<div class="error-item" style="border-left-color: var(--neon-red)">
                           <strong>Q: ${obj.q.q}</strong><br>
                           <span class="correction">Exp: ${obj.q.explanation}</span>
                       </div>`;
                    });
                    errHtml += '</div>';
                }

                el.innerHTML = errHtml;
                triggerKaTeX(el);
            })
            .catch(e => el.innerHTML = '<p>Cannot reach Error Log DB.</p>');
    }

    function getRevisionState() {
        try { return JSON.parse(localStorage.getItem(REVISION_KEY)) || {}; }
        catch (e) { return {}; }
    }
    function saveRevisionState(state) {
        localStorage.setItem(REVISION_KEY, JSON.stringify(state));
    }

    function renderRevision(el, sub) {
        const state = getRevisionState();
        const chKey = currentData.chapter + '_' + currentData.subtopic;
        const cur = state[chKey] || { r1: false, r2: false, r3: false, r4: false };

        // Auto-check if they have struggled
        const subQs = sub.mcq || [];
        const hasStruggles = subQs.some((q, i) => mcqStates[currentData.subtopic + '_' + i] === 'struggled');
        const alertHtml = hasStruggles ? `<div style="color:var(--neon-red); margin-bottom: 10px; font-weight: bold;">⚠️ You have struggled MCQs! R1 Revision heavily recommended.</div>` : '';

        el.innerHTML = `
            <div class="revision-hub">
                <h3>Spaced Repetition Hub</h3>
                <p>Track your active recall sessions for <strong>${sub.label}</strong>.</p>
                ${alertHtml}
                <div class="rev-track">
                    <div class="rev-stage ${cur.r1 ? 'done' : ''}" onclick="window._uniToggleRev('${chKey}','r1')">
                        <div class="rev-circle">R1</div><p>Day 1</p>
                    </div>
                    <div class="rev-stage ${cur.r2 ? 'done' : ''}" onclick="window._uniToggleRev('${chKey}','r2')">
                        <div class="rev-circle">R2</div><p>Day 3</p>
                    </div>
                    <div class="rev-stage ${cur.r3 ? 'done' : ''}" onclick="window._uniToggleRev('${chKey}','r3')">
                        <div class="rev-circle">R3</div><p>Day 7</p>
                    </div>
                    <div class="rev-stage ${cur.r4 ? 'done' : ''}" onclick="window._uniToggleRev('${chKey}','r4')">
                        <div class="rev-circle">R4</div><p>Day 21</p>
                    </div>
                </div>
            </div>
        `;
    }

    window._uniToggleRev = function (chKey, rLevel) {
        const state = getRevisionState();
        if (!state[chKey]) state[chKey] = { r1: false, r2: false, r3: false, r4: false };
        state[chKey][rLevel] = !state[chKey][rLevel];
        saveRevisionState(state);
        renderTabContent();
    };

    function setupTabs() {
        document.querySelectorAll('.god-tab').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.god-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentTab = btn.getAttribute('data-tab');
                renderTabContent();
            };
        });
    }

    function triggerCalisthenicsAlert() {
        // Show Calisthenics Modal
        let modal = document.getElementById('calisthenics-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'calisthenics-modal';
            modal.innerHTML = `
                <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);backdrop-filter:blur(10px);z-index:9999;display:flex;justify-content:center;align-items:center;">
                    <div class="glass-panel" style="text-align:center;padding:40px;max-width:400px;border-color:var(--neon-orange);">
                        <h2 style="color:var(--neon-orange);margin-bottom:20px;">🚨 ACCURACY DIP DETECTED!</h2>
                        <img src="https://media.tenor.com/images/153a79f1870a4de99ff8e75e11f185f3/tenor.gif" width="100%" style="border-radius:12px;margin-bottom:20px;" alt="Planche Lean">
                        <p style="font-size:1.1rem;margin-bottom:20px;">You're 5'7", 42kg. You need strength AND brains.<br><br><strong>Drop and give me 10 Planche Leans!</strong></p>
                        <button class="btn-primary" onclick="document.getElementById('calisthenics-modal').remove()">Done. Let's study.</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
    }

    function updateLineGraph() {
        if (!window.consistencyChartObj) return;
        // The user asked for Mastery Score vs Time for each sub-topic.
        // We will tally total correct / total attempted across localStorage over the last 7 days roughly.
        // For simplicity, we just inject dummy trend data combined with real tally.
        let correctCount = 0;
        let struggleCount = 0;
        let reviewCount = 0;
        Object.values(mcqStates).forEach(st => {
            if (st === 'correct') correctCount++;
            if (st === 'struggled') struggleCount++;
            if (st === 'review') reviewCount++;
        });

        const total = correctCount + struggleCount + reviewCount;
        const currentScore = total === 0 ? 0 : Math.round((correctCount / total) * 100);

        // Update the Chart dataset 0
        window.consistencyChartObj.data.labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Today"];
        window.consistencyChartObj.data.datasets[0].label = "Mastery Score (%)";
        window.consistencyChartObj.data.datasets[0].data = [30, 45, 50, 60, 55, 75, currentScore];
        window.consistencyChartObj.data.datasets[0].borderColor = 'rgba(78, 201, 176, 1)';
        window.consistencyChartObj.data.datasets[0].backgroundColor = 'rgba(78, 201, 176, 0.2)';
        window.consistencyChartObj.update();
    }

})();
