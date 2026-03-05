// ActiveRecallMaster.jsx

const { useState, useEffect, useRef } = React;

const ActiveRecallMaster = () => {
    const [equations, setEquations] = useState({});
    const [quizData, setQuizData] = useState([]);
    const [infographic, setInfographic] = useState("");
    const [traps, setTraps] = useState([]);

    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(30);
    const [challengeActive, setChallengeActive] = useState(false);

    // Quiz State
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [failedFormulas, setFailedFormulas] = useState([]);

    const mermaidRef = useRef(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch Synced Equations & Summary
                const dataRes = await fetch('http://localhost:8000/api/data');
                const data = await dataRes.json();
                if (data.equations_by_chapter) {
                    setEquations(data.equations_by_chapter);
                }

                // Fetch Warning Zone Traps
                const trapsRes = await fetch('http://localhost:8000/api/errors');
                const trapsData = await trapsRes.json();
                if (trapsData.success) {
                    setTraps(trapsData.traps);
                }

                // Fetch Infographic (Mermaid)
                const infoRes = await fetch('http://localhost:8000/api/infographic', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topic: "current" })
                });
                const infoData = await infoRes.json();
                if (infoData.success) {
                    setInfographic(infoData.mermaid);
                }

                // Fetch Quiz
                const quizRes = await fetch('http://localhost:8000/api/quiz', {
                    method: 'POST'
                });
                const quizJson = await quizRes.json();
                if (quizJson.success && quizJson.quiz) {
                    setQuizData(quizJson.quiz);
                }

                setLoading(false);

                // Notify CachyOS deployment complete
                fetch('http://localhost:8000/api/notify');

            } catch (err) {
                console.error("Failed to load Active Recall data:", err);
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Render Mermaid when infographic state changes
    useEffect(() => {
        if (infographic && mermaidRef.current) {
            try {
                mermaid.mermaidAPI.render('mermaid-svg', infographic, (svgCode) => {
                    mermaidRef.current.innerHTML = svgCode;
                });
            } catch (e) {
                console.error("Mermaid parsing error", e);
                mermaidRef.current.innerHTML = `<p style="color:var(--accent-red)">Failed to render flowchart.</p><pre style="font-size:10px">${infographic}</pre>`;
            }
        }
    }, [infographic]);

    // Timer Logic for Challenge
    useEffect(() => {
        let timer = null;
        if (challengeActive && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0) {
            setChallengeActive(false);
            alert("Time's up! Blur removed.");
        }
        return () => clearInterval(timer);
    }, [challengeActive, timeLeft]);

    const handleQuizAnswer = (selectedIndex, correctIndex, formulaRef) => {
        if (selectedIndex === correctIndex) {
            setScore(prev => prev + 1);
        } else if (formulaRef) {
            // Track failed formula for red highlighting
            setFailedFormulas(prev => [...prev, formulaRef]);
        }

        if (currentQuestion + 1 < quizData.length) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setQuizFinished(true);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Formula copied to clipboard!");
    };

    const toggleReveal = (e) => {
        if (!challengeActive) {
            e.currentTarget.classList.toggle('revealed');
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Initializing Active Recall Protocols...</div>;
    }

    return (
        <div className="active-recall-master" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* TOP SECTION: The God-Sheet (Flowchart) */}
            <section className="glass-panel" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    The God-Sheet: Critical Flowchart
                </h2>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '16px', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
                    <div ref={mermaidRef} className="mermaid-container">
                        {infographic ? "Rendering chart..." : "No flowchart generated. Run /api/sync."}
                    </div>
                </div>
            </section>

            {/* MIDDLE SECTION: Grid (Formula Bank + Quiz) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>

                {/* 1. Formula Bank */}
                <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', maxHeight: '600px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Sub-1000 Formula Bank</h2>
                        <button
                            className="btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem', background: challengeActive ? 'var(--accent-red)' : 'var(--accent-purple)' }}
                            onClick={() => {
                                if (!challengeActive) {
                                    setTimeLeft(30);
                                    setChallengeActive(true);
                                    // ensure all are blurred
                                    document.querySelectorAll('.formula-blur-wrapper').forEach(el => el.classList.remove('revealed'));
                                } else {
                                    setChallengeActive(false);
                                }
                            }}
                        >
                            {challengeActive ? `Challenge Active: ${timeLeft}s` : "Start 30s Challenge"}
                        </button>
                    </div>

                    <div style={{ overflowY: 'auto', flex: 1, paddingRight: '8px' }}>
                        {Object.entries(equations).length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>No formulas synced yet.</p>
                        ) : (
                            Object.entries(equations).map(([chapter, eqs]) => (
                                <div key={chapter} style={{ marginBottom: '24px' }}>
                                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '12px' }}>
                                        {chapter}
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {eqs.map((eq, i) => {
                                            // Check if this formula failed in the quiz
                                            const isFailed = failedFormulas.some(f => eq.includes(f) || f.includes(eq));

                                            // Format eq for KaTeX (we inject it into DOM or handle manually)
                                            // For simplicity in React without a KaTeX wrapper component, we render the raw string
                                            // and let a global useEffect/observer process it if needed, OR just render beautiful code.

                                            return (
                                                <div
                                                    key={i}
                                                    className={`formula-row ${isFailed ? 'failed-highlight' : ''}`}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                        background: isFailed ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.03)',
                                                        padding: '12px', borderRadius: '8px',
                                                        border: isFailed ? '1px solid var(--accent-red)' : '1px solid transparent'
                                                    }}
                                                >
                                                    <div
                                                        className={`formula-blur-wrapper ${challengeActive ? 'locked' : ''}`}
                                                        onClick={toggleReveal}
                                                        style={{ flex: 1, overflowX: 'auto', cursor: challengeActive ? 'not-allowed' : 'pointer' }}
                                                    >
                                                        <div className="math-display">
                                                            {/* In a real KaTeX setup we'd render the math here directly. We'll use a monospaced block for robust fallback */}
                                                            <code style={{ fontSize: '1.1rem', color: '#a78bfa' }}>${eq}$</code>
                                                        </div>
                                                        <div className="blur-overlay">
                                                            <span>{challengeActive ? "🔒 Locked" : "Click to Reveal"}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="btn-icon small"
                                                        onClick={() => copyToClipboard(`$$${eq}$$`)}
                                                        style={{ marginLeft: '12px' }}
                                                        title="Copy LaTeX"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* 2. Active Recall Quiz */}
                <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', maxHeight: '600px' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        Daily Active Recall
                    </h2>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {quizData.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>No quiz available.</p>
                        ) : quizFinished ? (
                            <div style={{ textAlign: 'center', margin: 'auto' }}>
                                <h3 style={{ fontSize: '2rem', color: 'var(--accent-green)', marginBottom: '8px' }}>{score} / {quizData.length}</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Quiz Complete.</p>
                                {failedFormulas.length > 0 && (
                                    <p style={{ color: 'var(--accent-red)', fontSize: '0.9rem', marginTop: '16px' }}>
                                        Check the Formula Bank for highlighted weak spots.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="quiz-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                    Question {currentQuestion + 1} of {quizData.length}
                                </div>
                                <h3 style={{ fontSize: '1.1rem', lineHeight: '1.5', marginBottom: '24px', color: 'white' }}>
                                    {quizData[currentQuestion].question}
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
                                    {quizData[currentQuestion].options.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            className="quiz-option-btn"
                                            onClick={() => handleQuizAnswer(idx, quizData[currentQuestion].answer, quizData[currentQuestion].formula)}
                                            style={{
                                                padding: '16px',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '8px',
                                                color: 'var(--text-primary)',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* BOTTOM SECTION: The Warning Zone */}
            <section className="glass-panel warning-zone" style={{ padding: '24px', borderLeft: '4px solid var(--accent-red)' }}>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--accent-red)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    The Warning Zone: Error Log
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {traps.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>No traps logged for this topic.</p>
                    ) : (
                        traps.map((trap, i) => (
                            <div key={i} style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                <span style={{ color: 'var(--accent-red)', fontWeight: 'bold', marginRight: '8px' }}>Trap #{i + 1}:</span>
                                <span style={{ color: 'var(--text-primary)' }}>{trap.trap}</span>
                            </div>
                        ))
                    )}
                </div>
            </section>

        </div>
    );
};

// Mount the component when requested
window.mountActiveRecall = () => {
    const container = document.getElementById('view-activerecall');
    if (container) {
        const root = ReactDOM.createRoot(container);
        root.render(<ActiveRecallMaster />);
    }
};
