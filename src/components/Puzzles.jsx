import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Puzzles.css';

// ─── Simple Technical Quiz Data (10 Super Easy Questions) ──────────────────────
const TECHNICAL_QUESTIONS = [
  {
    question: "What is HTML primarily used for?",
    options: [
      "Creating and structuring web pages",
      "Editing video files",
      "Running server hardware",
      "Database storage"
    ],
    answer: 0,
    explanation: "HTML (HyperText Markup Language) is the standard language used to build and structure content on web pages."
  },
  {
    question: "Which file extension is used for Java source code files?",
    options: [".py", ".java", ".cpp", ".html"],
    answer: 1,
    explanation: "Java source code files end with the `.java` extension."
  },
  {
    question: "What is a variable in programming?",
    options: [
      "A container used to store data values",
      "A tool to measure internet speed",
      "A computer screen pixel",
      "A type of keyboard"
    ],
    answer: 0,
    explanation: "Variables act as containers that store data values (such as numbers or text) so they can be reused."
  },
  {
    question: "What are the two possible values of a boolean data type?",
    options: ["1 or 100", "yes or no", "true or false", "high or low"],
    answer: 2,
    explanation: "A boolean data type represents a binary logical state with only two values: `true` or `false`."
  },
  {
    question: "In Java, which statement prints text onto the screen?",
    options: ["console.log()", "System.out.println()", "print_text()", "echo"],
    answer: 1,
    explanation: "`System.out.println()` is used in Java to print a line of text to the console."
  },
  {
    question: "Which arithmetic symbol is used for addition in programming?",
    options: ["+", "-", "*", "/"],
    answer: 0,
    explanation: "The plus symbol `+` is the standard arithmetic operator used to add numbers or concatenate strings."
  },
  {
    question: "What does CSS stand for in web design?",
    options: [
      "Computer System Styles",
      "Cascading Style Sheets",
      "Creative Sheet Software",
      "Control Style System"
    ],
    answer: 1,
    explanation: "CSS stands for Cascading Style Sheets, which control the visual look, colors, and layout of web pages."
  },
  {
    question: "What is the main purpose of a loop in programming?",
    options: [
      "To repeat a block of code multiple times",
      "To turn off the computer",
      "To change font colors",
      "To connect to Wi-Fi"
    ],
    answer: 0,
    explanation: "Loops are used to execute a block of code repeatedly as long as a specified condition is met."
  },
  {
    question: "Which component of a computer stores temporary active memory?",
    options: [
      "Hard Drive",
      "RAM (Random Access Memory)",
      "Monitor",
      "Keyboard"
    ],
    answer: 1,
    explanation: "RAM is short-term temporary memory used by the computer to hold data actively being processed."
  },
  {
    question: "Which of the following is a web browser used to view web pages?",
    options: ["Google Chrome", "Java SDK", "Python IDLE", "MySQL Server"],
    answer: 0,
    explanation: "Google Chrome is a web browser used to view and navigate websites on the Internet."
  }
];

// ─── Neon Particle Background ────────────────────────────────────────────────
const NeonParticles = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  const initParticles = useCallback((canvas) => {
    const particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    for (let i = 0; i < count; i++) {
      const colors = ['#00ffff', '#ff6b9d', '#9d4edd', '#4ade80', '#f59e0b'];
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3 - 0.15,
        size: Math.random() * 2.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      particlesRef.current = initParticles(canvas);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Perspective grid
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.04)';
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Particles
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const glow = (Math.sin(p.pulse) + 1) * 0.5;
        const currentOpacity = p.opacity * (0.5 + glow * 0.5);
        const currentSize = p.size * (0.8 + glow * 0.4);

        ctx.save();
        ctx.globalAlpha = currentOpacity;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

// ─── Interactive Quiz Component ──────────────────────────────────────────────
const QuizSection = ({ title, questions }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState([]);

  const handleOptionSelect = (optIndex) => {
    if (showFeedback) return;
    setSelectedOpt(optIndex);
  };

  const handleAnswerSubmit = () => {
    if (selectedOpt === null) return;
    const isCorrect = selectedOpt === questions[currentIdx].answer;
    if (isCorrect) setScore(prev => prev + 1);
    setHistory(prev => [...prev, selectedOpt]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setShowFeedback(false);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
    setHistory([]);
  };

  const progressPercent = ((currentIdx) / questions.length) * 100;
  const currentQuestion = questions[currentIdx];

  const getGrade = () => {
    const ratio = score / questions.length;
    if (ratio === 1) return { title: "Perfect Score! 🌟", desc: "Fantastic job! You got 10/10 on basic technical knowledge.", emoji: "🏆" };
    if (ratio >= 0.7) return { title: "Great Job! 👍", desc: "Good effort! You answered most questions correctly.", emoji: "🎯" };
    return { title: "Keep Going! 💪", desc: "Review the explanations below to learn these core tech concepts.", emoji: "📚" };
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  if (finished) {
    const grade = getGrade();
    return (
      <div className="pz-quiz-card pz-fade-in">
        <div className="pz-results-container">
          {/* Animated Trophy */}
          <div className="pz-trophy-glow">{grade.emoji}</div>
          <h2 className="pz-results-title">{title} — Complete</h2>
          <div className="pz-score-display">
            <span className="pz-score-num">{score}</span>
            <span className="pz-score-divider">/</span>
            <span className="pz-score-total">{questions.length}</span>
          </div>
          <div className="pz-grade-box">
            <strong>{grade.title}</strong>
            <p>{grade.desc}</p>
          </div>
          <button className="pz-neon-btn" onClick={resetQuiz}>
            <span className="pz-btn-icon">↻</span> Retake Quiz
          </button>
        </div>

        {/* Review */}
        <div className="pz-review-section">
          <h3 className="pz-review-heading">
            <span className="pz-review-icon">📋</span> Performance Review
          </h3>
          {questions.map((q, idx) => {
            const userChoice = history[idx];
            const isUserCorrect = userChoice === q.answer;
            return (
              <div key={idx} className={`pz-review-item ${isUserCorrect ? 'pz-review-correct' : 'pz-review-wrong'}`}>
                <div className="pz-review-q-header">
                  <span className={`pz-review-badge ${isUserCorrect ? '' : 'pz-badge-wrong'}`}>
                    {isUserCorrect ? '✓' : '✗'}
                  </span>
                  <span className="pz-review-q-text">Q{idx + 1}: {q.question}</span>
                </div>
                <div className="pz-review-answers">
                  <div className={`pz-review-ans ${isUserCorrect ? 'pz-ans-correct' : 'pz-ans-wrong'}`}>
                    Your Answer: {q.options[userChoice]}
                  </div>
                  {!isUserCorrect && (
                    <div className="pz-review-ans pz-ans-correct">
                      Correct: {q.options[q.answer]}
                    </div>
                  )}
                </div>
                <div className="pz-review-expl">
                  <strong>💡 </strong>{q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="pz-quiz-card pz-fade-in">
      {/* Header */}
      <div className="pz-quiz-header">
        <div className="pz-q-counter">
          <span className="pz-q-label">Question</span>
          <span className="pz-q-number">{currentIdx + 1}</span>
          <span className="pz-q-of">of {questions.length}</span>
        </div>
        <div className="pz-score-chip">
          <span className="pz-chip-icon">⚡</span> {score} pts
        </div>
      </div>

      {/* Progress */}
      <div className="pz-progress-track">
        <div className="pz-progress-fill" style={{ width: `${progressPercent}%` }}>
          <div className="pz-progress-glow" />
        </div>
        {/* Step dots */}
        <div className="pz-progress-dots">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`pz-dot ${i < currentIdx ? 'pz-dot-done' : ''} ${i === currentIdx ? 'pz-dot-active' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="pz-question-box">
        <h3 className="pz-question-text">{currentQuestion.question}</h3>
      </div>

      {/* Options */}
      <div className="pz-options-grid">
        {currentQuestion.options.map((option, idx) => {
          let stateClass = '';
          if (showFeedback) {
            if (idx === currentQuestion.answer) stateClass = 'pz-opt-correct';
            else if (idx === selectedOpt) stateClass = 'pz-opt-wrong';
            else stateClass = 'pz-opt-dim';
          } else if (idx === selectedOpt) {
            stateClass = 'pz-opt-selected';
          }

          return (
            <button
              key={idx}
              className={`pz-option ${stateClass}`}
              onClick={() => handleOptionSelect(idx)}
              disabled={showFeedback}
            >
              <span className="pz-opt-label">{optionLabels[idx]}</span>
              <span className="pz-opt-text">{option}</span>
              {showFeedback && idx === currentQuestion.answer && (
                <span className="pz-opt-check">✓</span>
              )}
              {showFeedback && idx === selectedOpt && idx !== currentQuestion.answer && (
                <span className="pz-opt-cross">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showFeedback && (
        <div className="pz-explanation pz-slide-up">
          <div className="pz-expl-icon">💡</div>
          <div className="pz-expl-text">
            <strong>Explanation</strong>
            <p>{currentQuestion.explanation}</p>
          </div>
        </div>
      )}

      {/* Action Button */}
      {!showFeedback ? (
        <button
          className="pz-neon-btn"
          onClick={handleAnswerSubmit}
          disabled={selectedOpt === null}
          style={{ opacity: selectedOpt === null ? 0.45 : 1 }}
        >
          Submit Answer
        </button>
      ) : (
        <button className="pz-neon-btn pz-btn-next" onClick={handleNext}>
          {currentIdx + 1 < questions.length ? 'Next Question →' : 'Finish Quiz 🎉'}
        </button>
      )}
    </div>
  );
};

// ─── Main Puzzles Component ──────────────────────────────────────────────────
const Puzzles = ({ onAbort }) => {
  const [activeTab, setActiveTab] = useState('weekly');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('none');
  const [typedText, setTypedText] = useState('');
  const fullText = '> Initializing NEXUS Challenge Hub...';

  // Typewriter effect for title
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.substring(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const checkAnswer = (e) => {
    e.preventDefault();
    if (answer.trim().toLowerCase() === 'nexus') {
      setStatus('correct');
    } else {
      setStatus('incorrect');
    }
  };

  return (
    <div className="pz-universe">
      {/* Animated Background */}
      <NeonParticles />

      {/* Ambient Glow Orbs */}
      <div className="pz-orb pz-orb-1" />
      <div className="pz-orb pz-orb-2" />
      <div className="pz-orb pz-orb-3" />

      {/* Scan Lines Overlay */}
      <div className="pz-scanlines" />

      {/* Back Button */}
      <button className="pz-back-btn" onClick={onAbort}>
        <span className="pz-back-arrow">←</span>
        <span>Back to Nexus</span>
      </button>

      {/* Main Content */}
      <div className="pz-content">
        {/* Hero Section */}
        <div className="pz-hero pz-fade-in">
          <div className="pz-badge">
            <span className="pz-badge-dot" />
            <span>NEXUS CHALLENGE HUB</span>
          </div>

          <h1 className="pz-title">
            <span className="pz-title-line1">Crack the</span>
            <span className="pz-title-line2">Enigma</span>
          </h1>

          <p className="pz-typewriter">{typedText}<span className="pz-cursor">|</span></p>
          <p className="pz-subtitle">
            Engage your mind with cipher puzzles and technical quizzes.
          </p>

          {/* Tab Controls */}
          <div className="pz-tab-bar">
            <button
              className={`pz-tab ${activeTab === 'weekly' ? 'pz-tab-active' : ''}`}
              onClick={() => setActiveTab('weekly')}
            >
              <span className="pz-tab-icon">🔐</span>
              <span className="pz-tab-label">Weekly Challenge</span>
            </button>
            <button
              className={`pz-tab ${activeTab === 'technical' ? 'pz-tab-active' : ''}`}
              onClick={() => setActiveTab('technical')}
            >
              <span className="pz-tab-icon">⚙️</span>
              <span className="pz-tab-label">Technical Quiz</span>
            </button>
          </div>
        </div>

        {/* Challenge Content */}
        <div className="pz-main-area">
          {activeTab === 'weekly' && (
            <div className="pz-fade-in">
              <div className="pz-section-header">
                <div className="pz-section-line" />
                <h2 className="pz-section-title">Weekly Puzzle Challenge</h2>
                <div className="pz-section-line" />
              </div>
              <p className="pz-section-desc">
                Unlock exclusive resources and bragging rights. Crack the system security key below.
              </p>

              {/* Neon Terminal */}
              <div className="pz-terminal-wrapper">
                <div className="pz-terminal">
                  <div className="pz-term-header">
                    <div className="pz-term-dots">
                      <span className="pz-dot-r" />
                      <span className="pz-dot-y" />
                      <span className="pz-dot-g" />
                    </div>
                    <div className="pz-term-title">nexus-terminal v1.0.4</div>
                    <div className="pz-term-status">
                      <span className="pz-status-dot" /> LIVE
                    </div>
                  </div>

                  <div className="pz-term-body">
                    <div className="pz-term-line">
                      <span className="pz-term-prompt">$</span>
                      <span className="pz-term-cmd">cat encrypted_key.txt</span>
                    </div>

                    <div className="pz-cipher-box">
                      <div className="pz-cipher-label">
                        <span className="pz-cipher-icon">🔒</span> ENCRYPTED PAYLOAD
                      </div>
                      <div className="pz-cipher-content">
                        <div className="pz-cipher-row">
                          <span className="pz-cipher-key">Cipher Type</span>
                          <span className="pz-cipher-val">Caesar (Shift +3)</span>
                        </div>
                        <div className="pz-cipher-row">
                          <span className="pz-cipher-key">Encrypted String</span>
                          <span className="pz-cipher-val pz-cipher-encoded">"QHAXV"</span>
                        </div>
                      </div>
                    </div>

                    <div className="pz-term-line">
                      <span className="pz-term-prompt">$</span>
                      <span className="pz-term-cmd">enter_decrypted_key --value:</span>
                    </div>

                    <form onSubmit={checkAnswer} className="pz-term-input-row">
                      <span className="pz-input-caret">▶</span>
                      <input
                        type="text"
                        className="pz-term-input"
                        placeholder="Type decrypted key..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                      />
                      <button type="submit" className="pz-decrypt-btn">
                        <span>DECRYPT</span>
                        <span className="pz-btn-spark" />
                      </button>
                    </form>

                    {status !== 'none' && (
                      <div className={`pz-term-result ${status === 'correct' ? 'pz-result-ok' : 'pz-result-fail'}`}>
                        {status === 'correct' ? (
                          <>
                            <span className="pz-result-icon">✓</span>
                            <span>ACCESS GRANTED — "NEXUS" verified. Decryption complete! Welcome to the club.</span>
                          </>
                        ) : (
                          <>
                            <span className="pz-result-icon">✗</span>
                            <span>ACCESS DENIED — Decryption failed. Key is invalid.</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="pz-fade-in">
              <div className="pz-section-header">
                <div className="pz-section-line" />
                <h2 className="pz-section-title">Technical Quiz</h2>
                <div className="pz-section-line" />
              </div>
              <p className="pz-section-desc">
                Test your foundational tech knowledge with 10 beginner-level questions.
              </p>
              <QuizSection key="technical" title="Technical Quiz" questions={TECHNICAL_QUESTIONS} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pz-footer pz-fade-in">
          <div className="pz-footer-glow" />
          <p className="pz-footer-text">New challenges and quizzes are loaded every week. Stay sharp!</p>
          <button className="pz-return-btn" onClick={onAbort}>
            <span>↩</span> Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Puzzles;
