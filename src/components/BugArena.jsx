import React, { useState, useEffect, useRef, useCallback } from 'react';
import './BugArena.css';

// Cloud JSONBlob Registry for sharing 6-character keys across devices & admin syncing
const REGISTRY_URL = 'https://jsonblob.com/api/jsonBlob/019fe6b0-1590-7e54-997d-bb823c8085b4';

// Helper to generate a 6-character uppercase key (e.g. "2BF45V")
const generate6CharKey = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// ─── Language Definitions ───────────────────────────────────────────────────
const LANGUAGES = [
  { id: 'python', name: 'Python', ext: '.py' },
  { id: 'java', name: 'Java', ext: '.java' },
  { id: 'cpp', name: 'C++', ext: '.cpp' },
  { id: 'javascript', name: 'JavaScript', ext: '.js' },
  { id: 'c', name: 'C', ext: '.c' },
  { id: 'typescript', name: 'TypeScript', ext: '.ts' },
  { id: 'go', name: 'Go', ext: '.go' },
  { id: 'rust', name: 'Rust', ext: '.rs' },
  { id: 'kotlin', name: 'Kotlin', ext: '.kt' },
  { id: 'swift', name: 'Swift', ext: '.swift' },
  { id: 'php', name: 'PHP', ext: '.php' },
  { id: 'ruby', name: 'Ruby', ext: '.rb' },
  { id: 'csharp', name: 'C#', ext: '.cs' },
];

// ─── Keyword Sets for Syntax Highlighting ───────────────────────────────────
const LANGUAGE_KEYWORDS = {
  python: ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'return', 'import', 'from', 'as', 'try', 'except', 'finally', 'with', 'yield', 'lambda', 'pass', 'break', 'continue', 'and', 'or', 'not', 'in', 'is', 'None', 'True', 'False', 'print', 'self', 'raise', 'del', 'global', 'nonlocal', 'assert', 'async', 'await'],
  java: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'static', 'final', 'void', 'int', 'String', 'boolean', 'double', 'float', 'long', 'char', 'byte', 'short', 'new', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'throws', 'import', 'package', 'this', 'super', 'null', 'true', 'false', 'abstract', 'synchronized', 'volatile', 'enum'],
  cpp: ['#include', '#define', '#ifdef', '#ifndef', '#endif', 'using', 'namespace', 'std', 'class', 'struct', 'public', 'private', 'protected', 'virtual', 'override', 'static', 'const', 'constexpr', 'void', 'int', 'float', 'double', 'char', 'bool', 'string', 'auto', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'delete', 'nullptr', 'true', 'false', 'template', 'typename', 'sizeof', 'typedef', 'enum', 'cout', 'cin', 'endl'],
  javascript: ['const', 'let', 'var', 'function', 'class', 'extends', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'super', 'import', 'export', 'default', 'from', 'of', 'in', 'typeof', 'instanceof', 'null', 'undefined', 'true', 'false', 'async', 'await', 'yield', 'delete', 'void', 'console', 'log', 'map', 'filter', 'reduce', 'forEach', 'push', 'pop', 'shift', 'length', 'JSON', 'Math', 'Array', 'Object', 'Promise'],
  c: ['#include', '#define', '#ifdef', '#ifndef', '#endif', 'void', 'int', 'float', 'double', 'char', 'long', 'short', 'unsigned', 'signed', 'static', 'const', 'extern', 'struct', 'union', 'enum', 'typedef', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'sizeof', 'NULL', 'printf', 'scanf', 'malloc', 'free', 'calloc', 'realloc', 'main'],
  typescript: ['const', 'let', 'var', 'function', 'class', 'extends', 'implements', 'interface', 'type', 'enum', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'super', 'import', 'export', 'default', 'from', 'as', 'typeof', 'instanceof', 'null', 'undefined', 'true', 'false', 'async', 'await', 'void', 'string', 'number', 'boolean', 'any', 'unknown', 'never', 'readonly', 'abstract', 'public', 'private', 'protected', 'static', 'keyof', 'infer'],
  go: ['package', 'import', 'func', 'var', 'const', 'type', 'struct', 'interface', 'map', 'chan', 'go', 'defer', 'return', 'if', 'else', 'for', 'range', 'switch', 'case', 'break', 'continue', 'select', 'default', 'fallthrough', 'nil', 'true', 'false', 'int', 'float64', 'float32', 'string', 'bool', 'byte', 'error', 'make', 'len', 'cap', 'append', 'fmt', 'Println', 'Printf', 'Sprintf'],
  rust: ['fn', 'let', 'mut', 'const', 'static', 'struct', 'enum', 'impl', 'trait', 'pub', 'mod', 'use', 'crate', 'self', 'super', 'return', 'if', 'else', 'for', 'while', 'loop', 'match', 'break', 'continue', 'move', 'async', 'await', 'unsafe', 'where', 'type', 'as', 'in', 'ref', 'true', 'false', 'Some', 'None', 'Ok', 'Err', 'Box', 'Vec', 'String', 'Option', 'Result', 'println', 'macro_rules', 'derive'],
  kotlin: ['fun', 'val', 'var', 'class', 'object', 'interface', 'data', 'sealed', 'abstract', 'open', 'override', 'private', 'public', 'protected', 'internal', 'return', 'if', 'else', 'when', 'for', 'while', 'do', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'import', 'package', 'this', 'super', 'null', 'true', 'false', 'is', 'in', 'as', 'companion', 'init', 'suspend', 'coroutine', 'lateinit', 'by', 'lazy', 'inline', 'Int', 'String', 'Boolean', 'Double', 'Float', 'println'],
  swift: ['func', 'var', 'let', 'class', 'struct', 'enum', 'protocol', 'extension', 'typealias', 'import', 'return', 'if', 'else', 'guard', 'for', 'while', 'repeat', 'switch', 'case', 'break', 'continue', 'do', 'try', 'catch', 'throw', 'throws', 'rethrows', 'self', 'super', 'init', 'deinit', 'nil', 'true', 'false', 'public', 'private', 'internal', 'fileprivate', 'open', 'static', 'override', 'mutating', 'async', 'await', 'print', 'String', 'Int', 'Double', 'Bool', 'Array', 'Optional'],
  php: ['<?php', '?>', 'function', 'class', 'extends', 'implements', 'public', 'private', 'protected', 'static', 'const', 'var', 'new', 'return', 'if', 'else', 'elseif', 'for', 'foreach', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'echo', 'print', 'array', 'null', 'true', 'false', 'use', 'namespace', 'require', 'include', 'isset', 'unset', 'empty', 'die', 'exit'],
  ruby: ['def', 'class', 'module', 'end', 'if', 'elsif', 'else', 'unless', 'case', 'when', 'for', 'while', 'until', 'do', 'begin', 'rescue', 'ensure', 'raise', 'return', 'yield', 'block_given?', 'self', 'super', 'nil', 'true', 'false', 'and', 'or', 'not', 'require', 'include', 'extend', 'attr_accessor', 'attr_reader', 'attr_writer', 'puts', 'print', 'p', 'lambda', 'proc', 'new', 'initialize', 'each', 'map', 'select', 'inject'],
  csharp: ['using', 'namespace', 'class', 'interface', 'struct', 'enum', 'public', 'private', 'protected', 'internal', 'static', 'readonly', 'const', 'void', 'int', 'string', 'bool', 'float', 'double', 'decimal', 'char', 'byte', 'long', 'short', 'var', 'new', 'return', 'if', 'else', 'for', 'foreach', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'this', 'base', 'null', 'true', 'false', 'async', 'await', 'override', 'virtual', 'abstract', 'sealed', 'partial', 'get', 'set', 'value', 'typeof', 'nameof', 'is', 'as', 'in', 'out', 'ref', 'params', 'yield', 'Console', 'WriteLine'],
};

// Comment patterns per language
const COMMENT_PATTERNS = {
  python: { line: '#', blockStart: null, blockEnd: null },
  ruby: { line: '#', blockStart: '=begin', blockEnd: '=end' },
  default: { line: '//', blockStart: '/*', blockEnd: '*/' },
};

// ─── Syntax Highlighter (Token-based) ───────────────────────────────────────
const highlightCode = (code, language) => {
  if (!code) return '';

  const escapeHtml = (str) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const keywords = new Set(LANGUAGE_KEYWORDS[language] || LANGUAGE_KEYWORDS.javascript);
  const commentConfig = COMMENT_PATTERNS[language] || COMMENT_PATTERNS.default;

  let tokenRegex;
  if (commentConfig.line === '#') {
    tokenRegex = /(\#[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+\.?\d*\b|\b[A-Za-z_#][A-Za-z0-9_]*\b|[{}[\]()])/g;
  } else {
    tokenRegex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+\.?\d*\b|\b[A-Za-z_#][A-Za-z0-9_]*\b|[{}[\]()])/g;
  }

  let result = '';
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(code.substring(lastIndex, match.index));
    }

    const token = match[0];
    const escapedToken = escapeHtml(token);

    if (token.startsWith('//') || token.startsWith('/*') || (commentConfig.line === '#' && token.startsWith('#') && !token.startsWith('#include') && !token.startsWith('#define') && !token.startsWith('#ifdef') && !token.startsWith('#ifndef') && !token.startsWith('#endif'))) {
      result += `<span class="syn-comment">${escapedToken}</span>`;
    } else if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) {
      result += `<span class="syn-string">${escapedToken}</span>`;
    } else if (/^\d+\.?\d*$/.test(token)) {
      result += `<span class="syn-number">${escapedToken}</span>`;
    } else if (keywords.has(token)) {
      result += `<span class="syn-keyword">${escapedToken}</span>`;
    } else if (/^[{}[\]()]$/.test(token)) {
      result += `<span class="syn-bracket">${escapedToken}</span>`;
    } else {
      result += escapedToken;
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < code.length) {
    result += escapeHtml(code.substring(lastIndex));
  }

  return result;
};

// ─── Neon Particle Background ───────────────────────────────────────────────
const NeonParticles = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  const initParticles = useCallback((canvas) => {
    const particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    for (let i = 0; i < count; i++) {
      const colors = ['#ff6b6b', '#00ffff', '#9d4edd', '#4ade80', '#f59e0b'];
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

      ctx.strokeStyle = 'rgba(255, 60, 60, 0.03)';
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      particlesRef.current.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.pulse += p.pulseSpeed;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

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
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
};

// ─── Toast Component ────────────────────────────────────────────────────────
const Toast = ({ message, type = 'success', onDone }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDone(), 2800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={`ba-toast ${type === 'error' ? 'ba-toast-error' : ''}`}>
      <span className="ba-toast-icon">{type === 'error' ? '✗' : '✓'}</span>
      <span>{message}</span>
    </div>
  );
};

// ─── Code Editor Component ──────────────────────────────────────────────────
const CodeEditor = ({ code, onChange, language, readOnly = false, teamInfo = null }) => {
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const lines = code ? code.split('\n') : [''];
  const lineCount = lines.length;

  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleInput = (e) => {
    if (!readOnly) {
      onChange(e.target.value);
    }
  };

  const handleTab = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (!readOnly) {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        const newCode = code.substring(0, start) + '  ' + code.substring(end);
        onChange(newCode);
        requestAnimationFrame(() => {
          e.target.selectionStart = e.target.selectionEnd = start + 2;
        });
      }
    }
  };

  const langObj = LANGUAGES.find(l => l.id === language) || LANGUAGES[0];

  return (
    <div className="ba-editor-terminal ba-fade-in">
      <div className="ba-editor-header">
        <div className="ba-editor-dots">
          <span className="ba-editor-dot-r" />
          <span className="ba-editor-dot-y" />
          <span className="ba-editor-dot-g" />
        </div>
        <div className="ba-editor-title-bar">
          {teamInfo
            ? `${teamInfo.team} — buggy_code${langObj.ext}`
            : `bug-arena — code${langObj.ext}`}
        </div>
        <div className="ba-editor-lang-badge">
          <span className="ba-lang-dot" />
          {langObj.name}
        </div>
      </div>

      {teamInfo && (
        <div className="ba-decoded-info">
          <span className="ba-decoded-team">
            🏷️ Team: {teamInfo.team}
          </span>
          <span className="ba-decoded-separator" />
          <span className="ba-decoded-lang">
            💻 {langObj.name}
          </span>
        </div>
      )}

      <div className="ba-editor-body">
        <div className="ba-line-numbers" ref={lineNumbersRef}>
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i} className="ba-line-num">{i + 1}</span>
          ))}
        </div>
        <div className="ba-code-container">
          <pre
            ref={highlightRef}
            className="ba-code-highlight"
            dangerouslySetInnerHTML={{ __html: highlightCode(code, language) + '\n' }}
          />
          <textarea
            ref={textareaRef}
            className={`ba-code-textarea ${readOnly ? 'ba-code-readonly' : ''}`}
            value={code}
            onChange={handleInput}
            onScroll={handleScroll}
            onKeyDown={handleTab}
            readOnly={readOnly}
            placeholder={readOnly ? '' : 'Write your buggy code here...\n\n// Remember: hide a subtle bug for the other team to find!'}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="ba-editor-footer">
        <div className="ba-editor-info">
          <span>📄 {lineCount} lines</span>
          <span>🔤 {code.length} chars</span>
          <span>💻 {langObj.name}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Main Bug Arena Component ───────────────────────────────────────────────
const BugArena = ({ onAbort }) => {
  const [phase, setPhase] = useState('create'); // 'create' | 'exchange' | 'hunt' | 'admin'
  const [teamName, setTeamName] = useState('');
  const [language, setLanguage] = useState('python');
  const [isSetup, setIsSetup] = useState(false);
  const [code, setCode] = useState('');
  const [createdBugs, setCreatedBugs] = useState([
    { id: 1, lineNumber: '', description: '' }
  ]);
  const [submittedKey, setSubmittedKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [importString, setImportString] = useState('');
  const [decodedData, setDecodedData] = useState(null);
  const [foundBugs, setFoundBugs] = useState([
    { id: 1, lineNumber: '', description: '', fix: '' }
  ]);
  const [reportGenerated, setReportGenerated] = useState(null);
  const [toast, setToast] = useState(null);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = '> Initializing Bug Arena Protocol...';

  // Admin Portal State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminUsernameInput, setAdminUsernameInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminActiveTab, setAdminActiveTab] = useState('teams'); // 'teams' | 'matcher'
  const [adminRegistryData, setAdminRegistryData] = useState(null);
  const [inspectingTeam, setInspectingTeam] = useState(null);
  const [isLoadingAdminData, setIsLoadingAdminData] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.substring(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchAdminRegistryData = async () => {
    setIsLoadingAdminData(true);
    try {
      const res = await fetch(REGISTRY_URL);
      const data = await res.json();
      setAdminRegistryData(data || {});
      showToast('Cloud registry data updated!');
    } catch (e) {
      showToast('Failed to fetch cloud registry data', 'error');
    }
    setIsLoadingAdminData(false);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUsernameInput.trim() === 'admin' && adminPasswordInput === 'nexusadmin2026') {
      setIsAdminLoggedIn(true);
      setAdminModalOpen(false);
      setPhase('admin');
      fetchAdminRegistryData();
      showToast('Welcome Admin! Portal unlocked.');
    } else {
      showToast('Invalid Username or Password!', 'error');
    }
  };

  const handleSetup = (e) => {
    e.preventDefault();
    if (!teamName.trim()) {
      showToast('Please enter a team name', 'error');
      return;
    }
    setIsSetup(true);
  };

  // ── Created Bugs Handlers (Creator Team) ──
  const addCreatedBug = () => {
    setCreatedBugs(prev => [...prev, { id: Date.now(), lineNumber: '', description: '' }]);
  };

  const removeCreatedBug = (id) => {
    if (createdBugs.length > 1) {
      setCreatedBugs(prev => prev.filter(b => b.id !== id));
    }
  };

  const updateCreatedBug = (id, field, value) => {
    setCreatedBugs(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  // ── Found Bugs Handlers (Hunter Team) ──
  const addFoundBug = () => {
    setFoundBugs(prev => [...prev, { id: Date.now(), lineNumber: '', description: '', fix: '' }]);
  };

  const removeFoundBug = (id) => {
    if (foundBugs.length > 1) {
      setFoundBugs(prev => prev.filter(b => b.id !== id));
    }
  };

  const updateFoundBug = (id, field, value) => {
    setFoundBugs(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  // ── Submit Code & Generate 6-Character Key ──
  const handleSubmitCode = async () => {
    if (!code.trim()) {
      showToast('Write some code before submitting!', 'error');
      return;
    }
    const validBugs = createdBugs.filter(b => b.description.trim());
    if (validBugs.length === 0) {
      showToast('Please enter at least one bug description!', 'error');
      return;
    }

    setIsSubmitting(true);
    const key = generate6CharKey();
    const payload = {
      team: teamName.trim() || 'Team Anonymous',
      language,
      code,
      createdBugs: validBugs,
      bugLineNumber: validBugs.map(b => b.lineNumber || 'N/A').join(', '),
      bugInfo: validBugs.map(b => b.description).join(' | '),
      key,
      timestamp: Date.now(),
    };

    // 1. Store in localStorage
    try {
      localStorage.setItem(`nexus_bug_${key}`, JSON.stringify(payload));
    } catch (e) {
      console.warn('LocalStorage warning:', e);
    }

    // 2. Sync to online JSONBlob registry
    try {
      const getRes = await fetch(REGISTRY_URL);
      const registry = (await getRes.json()) || {};
      registry[key] = payload;

      await fetch(REGISTRY_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registry),
      });
    } catch (err) {
      console.warn('Cloud registry sync error:', err);
    }

    setSubmittedKey(key);
    setIsSubmitting(false);
    showToast(`Code submitted with ${validBugs.length} bug(s)! Key: ${key}`);
  };

  // ── Decode 6-Character Key ──
  const handleDecodeKey = async () => {
    const rawInput = importString.trim();
    if (!rawInput) {
      showToast('Please enter a 6-character key to decode!', 'error');
      return;
    }

    setIsDecoding(true);
    const cleanKey = rawInput.toUpperCase();

    // Check 1: Is it a 6-character key in localStorage?
    const localData = localStorage.getItem(`nexus_bug_${cleanKey}`);
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        setDecodedData(parsed);
        setIsDecoding(false);
        setPhase('hunt');
        showToast(`Key "${cleanKey}" decoded! Code from Team "${parsed.team}" loaded.`);
        return;
      } catch (e) {
        console.warn('Local storage parse error:', e);
      }
    }

    // Check 2: Query Cloud Registry
    try {
      const getRes = await fetch(REGISTRY_URL);
      const registry = await getRes.json();
      if (registry && registry[cleanKey]) {
        const payload = registry[cleanKey];
        localStorage.setItem(`nexus_bug_${cleanKey}`, JSON.stringify(payload));
        setDecodedData(payload);
        setIsDecoding(false);
        setPhase('hunt');
        showToast(`Key "${cleanKey}" decoded! Code from Team "${payload.team}" loaded.`);
        return;
      }
    } catch (err) {
      console.warn('Cloud fetch error:', err);
    }

    // Check 3: Fallback Base64 string if long code was pasted
    if (rawInput.length > 20) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(rawInput))));
        if (decoded.team && decoded.language && decoded.code) {
          setDecodedData(decoded);
          setIsDecoding(false);
          setPhase('hunt');
          showToast(`Encoded payload decoded! Code from Team "${decoded.team}" loaded.`);
          return;
        }
      } catch (e) {
        // invalid Base64
      }
    }

    setIsDecoding(false);
    showToast(`Key "${cleanKey}" not found! Make sure the team submitted their code.`, 'error');
  };

  // ── Generate bug report ──
  const handleGenerateReport = async () => {
    const validFound = foundBugs.filter(b => b.description.trim());
    if (validFound.length === 0) {
      showToast('Describe at least one bug you found!', 'error');
      return;
    }

    const reviewer = teamName || 'Anonymous';
    const originalTeam = decodedData?.team || 'Unknown';
    const langName = LANGUAGES.find(l => l.id === decodedData?.language)?.name || decodedData?.language || 'Code';
    const timestamp = new Date().toLocaleString();

    let bugsSection = '';
    validFound.forEach((b, idx) => {
      bugsSection += `\n║ BUG #${idx + 1} (Line ${b.lineNumber || 'N/A'}):` +
        `\n║ ${b.description}` +
        (b.fix.trim() ? `\n║ Fix: ${b.fix}` : '') + '\n║ --------------------------------------------';
    });

    const reportText = `
╔══════════════════════════════════════════════╗
║           NEXUS BUG ARENA REPORT             ║
╠══════════════════════════════════════════════╣
║ Reviewer Team:    ${reviewer.padEnd(26)}║
║ Code Author:      ${originalTeam.padEnd(26)}║
║ Language:         ${langName.padEnd(26)}║
║ Bugs Reported:    ${validFound.length.toString().padEnd(26)}║
╠══════════════════════════════════════════════╣${bugsSection}
║ Submitted: ${timestamp.padEnd(33)}║
╚══════════════════════════════════════════════╝`.trim();

    setReportGenerated(reportText);

    // Sync report to cloud registry for Admin Matcher Tool
    const reportPayload = {
      id: 'R_' + Date.now(),
      reviewer,
      originalTeam,
      key: decodedData?.key || 'N/A',
      language: decodedData?.language || 'python',
      foundBugs: validFound,
      originalCreatedBugs: decodedData?.createdBugs || [],
      originalCode: decodedData?.code || '',
      timestamp: Date.now(),
    };

    try {
      const getRes = await fetch(REGISTRY_URL);
      const registry = (await getRes.json()) || {};
      const reports = registry.reports || [];
      reports.push(reportPayload);
      registry.reports = reports;
      await fetch(REGISTRY_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registry),
      });
    } catch (e) {
      console.warn('Cloud report sync error:', e);
    }

    navigator.clipboard.writeText(reportText).then(() => {
      showToast('Bug report generated & synced to Admin!');
    }).catch(() => {
      showToast('Bug report generated!');
    });
  };

  // ── Automated Bug Matcher Algorithm ──
  const evaluateBugMatch = (hunterReport, creatorTeamData) => {
    if (!hunterReport || !creatorTeamData) {
      return { status: 'MISMATCH', score: 0, label: '🔴 MISMATCH', details: 'Insufficient comparison data' };
    }

    const hunterBugs = hunterReport.foundBugs || [];
    const creatorBugs = creatorTeamData.createdBugs || [];

    if (hunterBugs.length === 0 || creatorBugs.length === 0) {
      return { status: 'MISMATCH', score: 0, label: '🔴 MISMATCH', details: 'No bug items registered for comparison' };
    }

    let perfectMatches = 0;
    let partialMatches = 0;

    hunterBugs.forEach(hBug => {
      const hLine = (hBug.lineNumber || '').toString().trim();
      const hDesc = (hBug.description || '').toLowerCase();

      creatorBugs.forEach(cBug => {
        const cLine = (cBug.lineNumber || '').toString().trim();
        const cDesc = (cBug.description || '').toLowerCase();

        const lineMatch = hLine && cLine && (hLine === cLine || hLine.includes(cLine) || cLine.includes(hLine));

        const hWords = hDesc.split(/\W+/).filter(w => w.length > 3);
        const cWords = cDesc.split(/\W+/).filter(w => w.length > 3);
        const wordMatchCount = hWords.filter(w => cWords.includes(w)).length;

        if (lineMatch && wordMatchCount >= 1) {
          perfectMatches++;
        } else if (lineMatch || wordMatchCount >= 2) {
          partialMatches++;
        }
      });
    });

    if (perfectMatches > 0) {
      return {
        status: 'PERFECT',
        score: perfectMatches * 100 + partialMatches * 50,
        label: '🟢 PERFECT MATCH',
        details: `${perfectMatches} bug(s) matched exact line number & description keywords!`
      };
    } else if (partialMatches > 0) {
      return {
        status: 'PARTIAL',
        score: partialMatches * 50,
        label: '🟡 PARTIAL MATCH',
        details: `${partialMatches} bug(s) matched line number or keyword description.`
      };
    } else {
      return {
        status: 'MISMATCH',
        score: 0,
        label: '🔴 MISMATCH',
        details: 'Reported bugs do not match creator\'s registered bugs.'
      };
    }
  };

  // ── Render phase content ──
  const renderCreatePhase = () => (
    <div className="ba-fade-in">
      <div className="ba-section-header">
        <div className="ba-section-line" />
        <h2 className="ba-section-title">🔧 Create Your Buggy Code</h2>
        <div className="ba-section-line" />
      </div>
      <p className="ba-section-desc">
        Write a piece of code in {LANGUAGES.find(l => l.id === language)?.name} that contains hidden bugs.
        Click <strong>Submit Bug Code</strong> to generate your unique 6-letter encrypted key!
      </p>

      {submittedKey ? (
        <div className="ba-submitted-card ba-fade-in">
          <div className="ba-submitted-body">
            <div style={{ fontSize: '2.2rem' }}>⚡</div>
            <h3 style={{ color: '#00ffff', margin: 0, fontSize: '1.4rem', fontFamily: 'Space Grotesk, sans-serif' }}>
              BUG SUBMITTED SUCCESSFULLY!
            </h3>
            <p className="ba-submitted-subtext">
              Here is your 6-letter encrypted key. Share this code with event hosts or rival teams to exchange your code.
            </p>
            
            <div className="ba-key-box">
              <span className="ba-key-display">{submittedKey}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
              <button
                className="ba-neon-btn ba-btn-cyan"
                onClick={() => {
                  navigator.clipboard.writeText(submittedKey);
                  showToast(`Key ${submittedKey} copied to clipboard!`);
                }}
              >
                <span className="ba-btn-icon">📋</span>
                Copy Key ({submittedKey})
              </button>
              <button
                className="ba-neon-btn ba-btn-green"
                onClick={() => setPhase('exchange')}
              >
                <span className="ba-btn-icon">🔄</span>
                Go to Exchange Portal
              </button>
              <button
                className="ba-neon-btn ba-btn-sm"
                onClick={() => setSubmittedKey('')}
              >
                ✏️ Edit Code
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <CodeEditor code={code} onChange={setCode} language={language} />

          {/* Bug Details Entry Form (Supports Multiple Bugs) */}
          <div className="ba-report-card" style={{ marginTop: '1.5rem', borderColor: 'rgba(255, 107, 107, 0.2)' }}>
            <div className="ba-report-header">
              <div className="ba-editor-dots">
                <span className="ba-editor-dot-r" />
                <span className="ba-editor-dot-y" />
                <span className="ba-editor-dot-g" />
              </div>
              <div className="ba-report-header-title" style={{ color: '#ff6b6b' }}>
                🐛 Register Hidden Bug Details ({createdBugs.length} Bug{createdBugs.length > 1 ? 's' : ''})
              </div>
            </div>
            <div className="ba-report-body" style={{ gap: '1.2rem' }}>
              {createdBugs.map((bug, index) => (
                <div key={bug.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingBottom: index < createdBugs.length - 1 ? '1rem' : 0, borderBottom: index < createdBugs.length - 1 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ff6b6b', fontFamily: 'Space Grotesk, sans-serif' }}>
                      BUG #{index + 1}
                    </span>
                    {createdBugs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCreatedBug(bug.id)}
                        style={{ background: 'transparent', border: 'none', color: '#ff5f56', cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                  <div className="ba-report-row">
                    <div className="ba-field-group" style={{ flex: 1 }}>
                      <label className="ba-field-label">
                        <span>🔢</span> Line #(s)
                      </label>
                      <input
                        type="text"
                        className="ba-line-input"
                        value={bug.lineNumber}
                        onChange={(e) => updateCreatedBug(bug.id, 'lineNumber', e.target.value)}
                        placeholder="e.g. 4 or 4, 9"
                        style={{ borderColor: 'rgba(255, 107, 107, 0.2)', color: '#ff6b6b', width: '100%', textAlign: 'left' }}
                      />
                    </div>
                    <div className="ba-field-group" style={{ flex: 3 }}>
                      <label className="ba-field-label">
                        <span>🐛</span> Bug Description / Explanation
                      </label>
                      <input
                        type="text"
                        className="ba-field-input"
                        value={bug.description}
                        onChange={(e) => updateCreatedBug(bug.id, 'description', e.target.value)}
                        placeholder="Describe what bug is here (e.g. Using 'number' instead of 'numbers')..."
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="ba-neon-btn ba-btn-sm"
                onClick={addCreatedBug}
                style={{ alignSelf: 'flex-start', background: 'rgba(255, 107, 107, 0.1)', borderColor: 'rgba(255, 107, 107, 0.3)', color: '#ff6b6b' }}
              >
                ➕ Add Another Bug
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', gap: '0.8rem', flexWrap: 'wrap' }}>
            <button
              className="ba-neon-btn"
              onClick={handleSubmitCode}
              disabled={!code.trim() || createdBugs.filter(b => b.description.trim()).length === 0 || isSubmitting}
            >
              <span className="ba-btn-icon">⚡</span>
              {isSubmitting ? 'Submitting & Encrypting...' : 'Submit Bug Code'}
            </button>
            <button
              className="ba-neon-btn ba-btn-cyan"
              onClick={() => setPhase('exchange')}
            >
              <span className="ba-btn-icon">🔄</span>
              Go to Exchange
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderExchangePhase = () => (
    <div className="ba-fade-in">
      <div className="ba-section-header">
        <div className="ba-section-line" />
        <h2 className="ba-section-title">🔄 Decode Rival Team's Code</h2>
        <div className="ba-section-line" />
      </div>
      <p className="ba-section-desc">
        Enter the 6-letter encrypted key (e.g. <code>2BF45V</code>) received from another team.
        Press Decode to unlock their code and start hunting!
      </p>

      <div className="ba-import-card">
        <div className="ba-editor-header">
          <div className="ba-editor-dots">
            <span className="ba-editor-dot-r" />
            <span className="ba-editor-dot-y" />
            <span className="ba-editor-dot-g" />
          </div>
          <div className="ba-editor-title-bar">decoder-terminal v1.0</div>
        </div>
        <div className="ba-import-body">
          <div className="ba-field-group">
            <label className="ba-field-label">
              <span>🗝️</span> Enter 6-Letter Encrypted Key
            </label>
            <input
              type="text"
              className="ba-field-input"
              value={importString}
              onChange={(e) => setImportString(e.target.value)}
              placeholder="e.g. 2BF45V"
              maxLength={40}
              style={{
                fontFamily: 'Space Grotesk, monospace',
                fontSize: '1.5rem',
                letterSpacing: '0.2em',
                textAlign: 'center',
                textTransform: 'uppercase',
                color: '#00ffff',
                borderColor: 'rgba(0, 255, 255, 0.4)',
                background: 'rgba(0, 0, 0, 0.6)'
              }}
            />
          </div>
          <div className="ba-import-actions" style={{ justifyContent: 'center' }}>
            <button
              className="ba-neon-btn ba-btn-cyan"
              onClick={handleDecodeKey}
              disabled={!importString.trim() || isDecoding}
            >
              <span className="ba-btn-icon">🔓</span>
              {isDecoding ? 'Decoding Key...' : 'Decode & Load Code'}
            </button>
            <button
              className="ba-neon-btn ba-btn-sm"
              onClick={() => setPhase('create')}
            >
              <span className="ba-btn-icon">←</span>
              Back to Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHuntPhase = () => (
    <div className="ba-fade-in">
      <div className="ba-section-header">
        <div className="ba-section-line" />
        <h2 className="ba-section-title">🐛 Hunt the Bug!</h2>
        <div className="ba-section-line" />
      </div>
      <p className="ba-section-desc">
        Review the code below from Team "{decodedData?.team}". Find the bug, identify the line,
        and submit your report!
      </p>

      {decodedData && (
        <>
          <CodeEditor
            code={decodedData.code}
            language={decodedData.language}
            readOnly
            teamInfo={{ team: decodedData.team }}
          />

          {/* Bug Report Form (Supports Multiple Bugs Found) */}
          <div className="ba-report-card" style={{ marginTop: '2rem' }}>
            <div className="ba-report-header">
              <div className="ba-editor-dots">
                <span className="ba-editor-dot-r" />
                <span className="ba-editor-dot-y" />
                <span className="ba-editor-dot-g" />
              </div>
              <div className="ba-report-header-title">
                🐛 Bug Report — filed by {teamName} ({foundBugs.length} Bug{foundBugs.length > 1 ? 's' : ''} Reported)
              </div>
            </div>
            <div className="ba-report-body" style={{ gap: '1.5rem' }}>
              {foundBugs.map((bug, index) => (
                <div key={bug.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingBottom: index < foundBugs.length - 1 ? '1.2rem' : 0, borderBottom: index < foundBugs.length - 1 ? '1px solid rgba(74, 222, 128, 0.1)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4ade80', fontFamily: 'Space Grotesk, sans-serif' }}>
                      REPORTED BUG #{index + 1}
                    </span>
                    {foundBugs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFoundBug(bug.id)}
                        style={{ background: 'transparent', border: 'none', color: '#ff5f56', cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                  <div className="ba-report-row">
                    <div className="ba-field-group" style={{ flex: 1 }}>
                      <label className="ba-field-label" style={{ color: '#4ade80' }}>
                        <span>🔢</span> Line #(s)
                      </label>
                      <input
                        type="text"
                        className="ba-line-input"
                        value={bug.lineNumber}
                        onChange={(e) => updateFoundBug(bug.id, 'lineNumber', e.target.value)}
                        placeholder="e.g. 7 or 7, 12"
                        style={{ width: '100%', textAlign: 'left' }}
                      />
                    </div>
                    <div className="ba-field-group" style={{ flex: 3 }}>
                      <label className="ba-field-label" style={{ color: '#4ade80' }}>
                        <span>📝</span> Bug Description
                      </label>
                      <input
                        type="text"
                        className="ba-field-input"
                        value={bug.description}
                        onChange={(e) => updateFoundBug(bug.id, 'description', e.target.value)}
                        placeholder="Describe the bug you found..."
                        style={{ borderColor: 'rgba(74, 222, 128, 0.1)' }}
                      />
                    </div>
                  </div>

                  <div className="ba-field-group">
                    <label className="ba-field-label" style={{ color: '#4ade80' }}>
                      <span>🔧</span> Suggested Fix (optional)
                    </label>
                    <textarea
                      className="ba-report-textarea"
                      value={bug.fix}
                      onChange={(e) => updateFoundBug(bug.id, 'fix', e.target.value)}
                      placeholder="How would you fix this bug? Write the corrected code or explain..."
                      style={{ minHeight: '70px' }}
                    />
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="ba-neon-btn ba-btn-sm"
                  onClick={addFoundBug}
                  style={{ background: 'rgba(74, 222, 128, 0.1)', borderColor: 'rgba(74, 222, 128, 0.3)', color: '#4ade80' }}
                >
                  ➕ Add Another Found Bug
                </button>

                <button
                  className="ba-neon-btn ba-btn-green"
                  onClick={handleGenerateReport}
                  disabled={foundBugs.filter(b => b.description.trim()).length === 0}
                >
                  <span className="ba-btn-icon">📋</span>
                  Generate & Copy Report
                </button>
              </div>
            </div>
          </div>

          {/* Generated Report Display */}
          {reportGenerated && (
            <div className="ba-report-summary ba-fade-in" style={{ marginTop: '1.5rem' }}>
              <div className="ba-report-header">
                <div className="ba-editor-dots">
                  <span className="ba-editor-dot-r" />
                  <span className="ba-editor-dot-y" />
                  <span className="ba-editor-dot-g" />
                </div>
                <div className="ba-report-header-title">
                  ✅ Report Generated
                </div>
              </div>
              <div className="ba-report-summary-body">
                <pre>{reportGenerated}</pre>
                <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    className="ba-neon-btn ba-btn-green ba-btn-sm"
                    onClick={() => {
                      navigator.clipboard.writeText(reportGenerated);
                      showToast('Report copied again!');
                    }}
                  >
                    📋 Copy Report
                  </button>
                  <button
                    className="ba-neon-btn ba-btn-cyan ba-btn-sm"
                    onClick={() => {
                      setDecodedData(null);
                      setImportString('');
                      setFoundBugs([{ id: 1, lineNumber: '', description: '', fix: '' }]);
                      setReportGenerated(null);
                      setPhase('exchange');
                    }}
                  >
                    🔄 Review Another Code
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  // ── Render Admin Dashboard ──
  const renderAdminDashboard = () => {
    const rawData = adminRegistryData || {};
    // Extract registered teams (keys that are 6-chars)
    const teamEntries = Object.entries(rawData)
      .filter(([k, v]) => k !== 'reports' && v && typeof v === 'object' && v.code)
      .map(([k, v]) => ({ key: k, ...v }));

    const reportsList = rawData.reports || [];

    return (
      <div className="ba-fade-in" style={{ width: '100%', maxWidth: '1050px' }}>
        {/* Admin Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              👑 ORGANIZER CONTROL PANEL
            </span>
            <h2 style={{ fontSize: '2rem', margin: '0.2rem 0 0', color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
              Nexus Admin Portal
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button
              className="ba-neon-btn ba-btn-sm"
              onClick={fetchAdminRegistryData}
              disabled={isLoadingAdminData}
              style={{ background: 'rgba(251, 191, 36, 0.1)', borderColor: 'rgba(251, 191, 36, 0.4)', color: '#fbbf24' }}
            >
              🔄 {isLoadingAdminData ? 'Syncing...' : 'Sync Registry Data'}
            </button>
            <button
              className="ba-neon-btn ba-btn-sm"
              onClick={() => {
                setIsAdminLoggedIn(false);
                setPhase('create');
                showToast('Admin logged out.');
              }}
              style={{ background: 'rgba(255, 95, 86, 0.1)', borderColor: 'rgba(255, 95, 86, 0.4)', color: '#ff5f56' }}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="ba-phase-bar" style={{ marginBottom: '2rem' }}>
          <button
            className={`ba-phase ${adminActiveTab === 'teams' ? 'ba-phase-active' : ''}`}
            onClick={() => setAdminActiveTab('teams')}
            style={{ color: adminActiveTab === 'teams' ? '#fbbf24' : '#6b6b8a' }}
          >
            <span>🔧 Creating Teams & Codes ({teamEntries.length})</span>
          </button>
          <div className="ba-phase-connector" />
          <button
            className={`ba-phase ${adminActiveTab === 'matcher' ? 'ba-phase-active' : ''}`}
            onClick={() => setAdminActiveTab('matcher')}
            style={{ color: adminActiveTab === 'matcher' ? '#fbbf24' : '#6b6b8a' }}
          >
            <span>🐛 Finding Teams Reports ({reportsList.length})</span>
          </button>
          <div className="ba-phase-connector" />
          <button
            className={`ba-phase ${adminActiveTab === 'compare' ? 'ba-phase-active' : ''}`}
            onClick={() => setAdminActiveTab('compare')}
            style={{ color: adminActiveTab === 'compare' ? '#fbbf24' : '#6b6b8a' }}
          >
            <span>⚖️ Side-by-Side Verification & Winner Decision</span>
          </button>
        </div>

        {/* TAB 1: Creating Teams (Code & Planted Bugs) */}
        {adminActiveTab === 'teams' && (
          <div className="ba-admin-dashboard ba-fade-in">
            <div className="ba-admin-header">
              <div className="ba-admin-header-title">🔧 Creating Teams — Submissions & Planted Bugs ({teamEntries.length})</div>
            </div>

            {teamEntries.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#7a7a9e' }}>
                <p>No code submissions yet. When teams submit their buggy code, their source code and planted bugs will appear here!</p>
              </div>
            ) : (
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {teamEntries.map((t) => (
                  <div key={t.key} style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(0, 255, 255, 0.15)', borderRadius: '16px', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.6rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00ffff', fontFamily: 'Space Grotesk, sans-serif' }}>
                          Team: {t.team}
                        </span>
                        <span className="ba-decoded-lang" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>
                          {LANGUAGES.find(l => l.id === t.language)?.name || t.language}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'Courier New', color: '#fbbf24', fontWeight: 800, fontSize: '1.1rem', background: 'rgba(251, 191, 36, 0.1)', padding: '0.3rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                        KEY: {t.key}
                      </span>
                    </div>

                    <CodeEditor
                      code={t.code}
                      language={t.language}
                      readOnly
                      teamInfo={{ team: t.team }}
                    />

                    <div style={{ marginTop: '1.2rem', background: 'rgba(255, 107, 107, 0.05)', border: '1px solid rgba(255, 107, 107, 0.2)', padding: '1.2rem', borderRadius: '12px' }}>
                      <h4 style={{ color: '#ff6b6b', margin: '0 0 0.8rem', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem' }}>
                        🐛 Planted Bugs Registered by Team "{t.team}" ({(t.createdBugs || []).length}):
                      </h4>
                      {(t.createdBugs || []).map((b, i) => (
                        <div key={i} style={{ background: 'rgba(0, 0, 0, 0.3)', borderLeft: '3px solid #ff6b6b', padding: '0.7rem 1rem', borderRadius: '0 8px 8px 0', marginBottom: '0.5rem' }}>
                          <span style={{ color: '#ff6b6b', fontWeight: 800, fontSize: '0.82rem', fontFamily: 'Space Grotesk, sans-serif' }}>
                            BUG #{i + 1} — Line #{b.lineNumber || 'N/A'}:
                          </span>
                          <p style={{ margin: '0.2rem 0 0', color: '#e4e4f0', fontSize: '0.88rem' }}>
                            {b.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Finding Teams (Submitted Reports & Found Bugs) */}
        {adminActiveTab === 'matcher' && (
          <div className="ba-admin-dashboard ba-fade-in">
            <div className="ba-admin-header">
              <div className="ba-admin-header-title">🐛 Finding Teams — Bug Reports & Fixes ({reportsList.length})</div>
            </div>

            {reportsList.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#7a7a9e' }}>
                <p>No bug reports submitted by finding teams yet.</p>
              </div>
            ) : (
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {reportsList.map((r, idx) => (
                  <div key={r.id || idx} style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(74, 222, 128, 0.2)', borderRadius: '16px', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.6rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4ade80', fontFamily: 'Space Grotesk, sans-serif' }}>
                          Finding Team: {r.reviewer}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: '#7a7a9e' }}>
                          hunted code of <strong>Team {r.originalTeam}</strong>
                        </span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#7a7a9e' }}>
                        {r.timestamp ? new Date(r.timestamp).toLocaleTimeString() : ''}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {(r.foundBugs || []).map((fb, i) => (
                        <div key={i} style={{ background: 'rgba(74, 222, 128, 0.05)', borderLeft: '3px solid #4ade80', padding: '0.8rem 1rem', borderRadius: '0 8px 8px 0' }}>
                          <span style={{ color: '#4ade80', fontWeight: 800, fontSize: '0.82rem', fontFamily: 'Space Grotesk, sans-serif' }}>
                            REPORTED BUG #{i + 1} — Line #{fb.lineNumber || 'N/A'}:
                          </span>
                          <p style={{ margin: '0.3rem 0 0.4rem', color: '#e4e4f0', fontSize: '0.88rem' }}>
                            <strong>Description:</strong> {fb.description}
                          </p>
                          {fb.fix && (
                            <p style={{ margin: 0, color: '#00ffff', fontSize: '0.85rem', fontFamily: 'Courier New, monospace' }}>
                              <strong>Proposed Fix:</strong> {fb.fix}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Side-by-Side Comparison & Winner Decision */}
        {adminActiveTab === 'compare' && (
          <div className="ba-admin-dashboard ba-fade-in">
            <div className="ba-admin-header">
              <div className="ba-admin-header-title">⚖️ Side-by-Side Verification & Winner Decision</div>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {reportsList.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#7a7a9e' }}>
                  <p>No hunt reports submitted yet. Once teams decode keys and submit reports, side-by-side comparisons will appear here for winner selection!</p>
                </div>
              ) : (
                reportsList.map((r, idx) => {
                  const creatorData = teamEntries.find(t => t.team === r.originalTeam || t.key === r.key);

                  return (
                    <div key={r.id || idx} style={{ background: 'rgba(10, 10, 25, 0.8)', border: '2px solid rgba(251, 191, 36, 0.3)', borderRadius: '16px', overflow: 'hidden' }}>
                      {/* Header bar */}
                      <div style={{ padding: '1rem 1.5rem', background: 'rgba(251, 191, 36, 0.08)', borderBottom: '1px solid rgba(251, 191, 36, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
                        <div>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            MATCH # {idx + 1}
                          </span>
                          <h3 style={{ margin: '0.2rem 0 0', color: '#fff', fontSize: '1.2rem', fontFamily: 'Space Grotesk, sans-serif' }}>
                            Finding Team: <span style={{ color: '#4ade80' }}>{r.reviewer}</span> vs Creating Team: <span style={{ color: '#ff6b6b' }}>{r.originalTeam}</span>
                          </h3>
                        </div>

                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                          <button
                            className="ba-neon-btn ba-btn-sm"
                            onClick={() => showToast(`🏆 Winner Declared: Team "${r.reviewer}"!`)}
                            style={{ background: 'rgba(74, 222, 128, 0.15)', borderColor: 'rgba(74, 222, 128, 0.5)', color: '#4ade80' }}
                          >
                            🥇 Award Winner: {r.reviewer}
                          </button>
                          <button
                            className="ba-neon-btn ba-btn-sm"
                            onClick={() => showToast(`🏆 Winner Declared: Team "${r.originalTeam}"!`)}
                            style={{ background: 'rgba(255, 107, 107, 0.15)', borderColor: 'rgba(255, 107, 107, 0.5)', color: '#ff6b6b' }}
                          >
                            🥇 Award Winner: {r.originalTeam}
                          </button>
                        </div>
                      </div>

                      {/* 2 Column Side-by-Side Comparison */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', padding: '1.5rem' }}>
                        {/* Column 1: Creating Team */}
                        <div style={{ background: 'rgba(255, 107, 107, 0.04)', border: '1px solid rgba(255, 107, 107, 0.2)', borderRadius: '12px', padding: '1.2rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ff6b6b', textTransform: 'uppercase' }}>
                              🔧 CREATING TEAM
                            </span>
                            <span style={{ fontWeight: 800, color: '#ff6b6b', fontSize: '1rem' }}>
                              {r.originalTeam}
                            </span>
                          </div>

                          <h5 style={{ color: '#a0a0c5', margin: '0 0 0.5rem', fontSize: '0.8rem' }}>Planted Bugs Registered:</h5>
                          {(creatorData?.createdBugs || []).length === 0 ? (
                            <p style={{ color: '#7a7a9e', fontSize: '0.85rem' }}>No bug details recorded.</p>
                          ) : (
                            (creatorData.createdBugs).map((cb, i) => (
                              <div key={i} style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '0.6rem 0.8rem', borderRadius: '8px', marginBottom: '0.5rem', borderLeft: '3px solid #ff6b6b' }}>
                                <span style={{ color: '#ff6b6b', fontWeight: 800, fontSize: '0.78rem' }}>
                                  Line #{cb.lineNumber || 'N/A'}:
                                </span>
                                <p style={{ margin: '0.1rem 0 0', color: '#e4e4f0', fontSize: '0.85rem' }}>
                                  {cb.description}
                                </p>
                              </div>
                            ))
                          )}

                          {creatorData?.code && (
                            <div style={{ marginTop: '1rem' }}>
                              <h5 style={{ color: '#a0a0c5', margin: '0 0 0.5rem', fontSize: '0.8rem' }}>Submitted Code:</h5>
                              <CodeEditor
                                code={creatorData.code}
                                language={creatorData.language || 'python'}
                                readOnly
                              />
                            </div>
                          )}
                        </div>

                        {/* Column 2: Finding Team */}
                        <div style={{ background: 'rgba(74, 222, 128, 0.04)', border: '1px solid rgba(74, 222, 128, 0.2)', borderRadius: '12px', padding: '1.2rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4ade80', textTransform: 'uppercase' }}>
                              🐛 FINDING TEAM
                            </span>
                            <span style={{ fontWeight: 800, color: '#4ade80', fontSize: '1rem' }}>
                              {r.reviewer}
                            </span>
                          </div>

                          <h5 style={{ color: '#a0a0c5', margin: '0 0 0.5rem', fontSize: '0.8rem' }}>Reported Bugs Found:</h5>
                          {(r.foundBugs || []).length === 0 ? (
                            <p style={{ color: '#7a7a9e', fontSize: '0.85rem' }}>No bugs reported.</p>
                          ) : (
                            (r.foundBugs).map((fb, i) => (
                              <div key={i} style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '0.6rem 0.8rem', borderRadius: '8px', marginBottom: '0.5rem', borderLeft: '3px solid #4ade80' }}>
                                <span style={{ color: '#4ade80', fontWeight: 800, fontSize: '0.78rem' }}>
                                  Reported Line #{fb.lineNumber || 'N/A'}:
                                </span>
                                <p style={{ margin: '0.1rem 0 0.2rem', color: '#e4e4f0', fontSize: '0.85rem' }}>
                                  {fb.description}
                                </p>
                                {fb.fix && (
                                  <p style={{ margin: 0, color: '#00ffff', fontSize: '0.8rem', fontFamily: 'Courier New, monospace' }}>
                                    Fix: {fb.fix}
                                  </p>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="ba-universe">
      <NeonParticles />

      <div className="ba-orb ba-orb-1" />
      <div className="ba-orb ba-orb-2" />
      <div className="ba-orb ba-orb-3" />

      <div className="ba-scanlines" />

      {/* Back Button */}
      <button className="ba-back-btn" onClick={onAbort}>
        <span className="ba-back-arrow">←</span>
        <span>Back to Nexus</span>
      </button>

      {/* Secret Admin Portal Login Button */}
      <button
        className="ba-admin-btn"
        onClick={() => {
          if (isAdminLoggedIn) {
            setPhase('admin');
            fetchAdminRegistryData();
          } else {
            setAdminModalOpen(true);
          }
        }}
      >
        <span>🔐 Admin Portal</span>
      </button>

      {/* Admin Login Modal */}
      {adminModalOpen && (
        <div className="ba-admin-overlay" onClick={() => setAdminModalOpen(false)}>
          <div className="ba-admin-card" onClick={(e) => e.stopPropagation()}>
            <div className="ba-admin-header">
              <div className="ba-admin-header-title">🔐 Admin Authentication</div>
              <button
                onClick={() => setAdminModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <form className="ba-setup-body" onSubmit={handleAdminLogin}>
              <div className="ba-field-group">
                <label className="ba-field-label" style={{ color: '#fbbf24' }}>
                  <span>👤</span> Admin Username
                </label>
                <input
                  type="text"
                  className="ba-field-input"
                  value={adminUsernameInput}
                  onChange={(e) => setAdminUsernameInput(e.target.value)}
                  placeholder="Username..."
                  style={{ borderColor: 'rgba(251, 191, 36, 0.3)' }}
                  autoFocus
                />
              </div>

              <div className="ba-field-group">
                <label className="ba-field-label" style={{ color: '#fbbf24' }}>
                  <span>🔑</span> Password
                </label>
                <input
                  type="password"
                  className="ba-field-input"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="Password..."
                  style={{ borderColor: 'rgba(251, 191, 36, 0.3)' }}
                />
              </div>

              <button
                type="submit"
                className="ba-neon-btn"
                style={{ background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(217, 119, 6, 0.15))', borderColor: 'rgba(251, 191, 36, 0.5)', color: '#fbbf24', alignSelf: 'center', marginTop: '0.5rem' }}
              >
                <span className="ba-btn-icon">🔓</span>
                Unlock Admin Portal
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="ba-content">
        <div className="ba-hero ba-fade-in">
          <div className="ba-badge">
            <span className="ba-badge-dot" />
            <span>NEXUS BUG ARENA</span>
          </div>

          <h1 className="ba-title">
            <span className="ba-title-line1">Hunt the</span>
            <span className="ba-title-line2">Bug</span>
          </h1>

          <p className="ba-typewriter">{typedText}<span className="ba-cursor">|</span></p>
          <p className="ba-subtitle">
            Create buggy code, submit to get a 6-letter key, exchange keys with rival teams, and decode to find bugs!
          </p>

          <button className="ba-rules-toggle" onClick={() => setRulesOpen(!rulesOpen)}>
            <span>📜 Event Rules & Instructions</span>
            <span className={`ba-rules-arrow ${rulesOpen ? 'ba-rules-arrow-open' : ''}`}>▼</span>
          </button>

          <div className={`ba-rules-panel ${rulesOpen ? 'ba-rules-panel-open' : ''}`}>
            <div className="ba-rules-content">
              <ul className="ba-rules-list">
                <li><span className="ba-rule-num">01</span> Each team writes code in their programming language containing hidden bugs.</li>
                <li><span className="ba-rule-num">02</span> Register the line numbers & bug explanations for your code.</li>
                <li><span className="ba-rule-num">03</span> Click <strong>Submit Bug Code</strong> to generate a 6-letter key (e.g. <code>2BF45V</code>).</li>
                <li><span className="ba-rule-num">04</span> Event hosts decide which 6-letter key goes to which rival team.</li>
                <li><span className="ba-rule-num">05</span> In the <strong>Exchange</strong> portal, enter the 6-letter key you received and press <strong>Decode</strong>.</li>
                <li><span className="ba-rule-num">06</span> Submit a Bug Report with the line numbers, descriptions, and suggested fixes.</li>
                <li><span className="ba-rule-num">07</span> The Admin Portal automatically verifies matches and calculates final team scores! 🏆</li>
              </ul>
            </div>
          </div>

          {isSetup && (
            <div className="ba-phase-bar">
              <button
                className={`ba-phase ${phase === 'create' ? 'ba-phase-active' : ''}`}
                onClick={() => setPhase('create')}
              >
                <span className="ba-phase-icon">🔧</span>
                <span>Create</span>
              </button>
              <div className="ba-phase-connector" />
              <button
                className={`ba-phase ${phase === 'exchange' ? 'ba-phase-active' : ''}`}
                onClick={() => setPhase('exchange')}
              >
                <span className="ba-phase-icon">🔄</span>
                <span>Exchange</span>
              </button>
              <div className="ba-phase-connector" />
              <button
                className={`ba-phase ${phase === 'hunt' ? 'ba-phase-active' : ''}`}
                onClick={() => { if (decodedData) setPhase('hunt'); }}
                disabled={!decodedData}
              >
                <span className="ba-phase-icon">🐛</span>
                <span>Hunt</span>
              </button>

              {isAdminLoggedIn && (
                <>
                  <div className="ba-phase-connector" />
                  <button
                    className={`ba-phase ${phase === 'admin' ? 'ba-phase-active' : ''}`}
                    onClick={() => { setPhase('admin'); fetchAdminRegistryData(); }}
                    style={{ color: phase === 'admin' ? '#fbbf24' : '#fbbf24', opacity: 0.9 }}
                  >
                    <span className="ba-phase-icon">👑</span>
                    <span>Admin</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="ba-main-area">
          {phase === 'admin' ? (
            renderAdminDashboard()
          ) : !isSetup ? (
            <div className="ba-fade-in">
              <div className="ba-section-header">
                <div className="ba-section-line" />
                <h2 className="ba-section-title">Team Configuration</h2>
                <div className="ba-section-line" />
              </div>
              <p className="ba-section-desc">
                Set up your team identity and choose your programming language before entering the arena.
              </p>

              <div className="ba-setup-card">
                <div className="ba-setup-header">
                  <div className="ba-setup-dots">
                    <span className="ba-setup-dot-r" />
                    <span className="ba-setup-dot-y" />
                    <span className="ba-setup-dot-g" />
                  </div>
                  <div className="ba-setup-title-bar">team-config v1.0</div>
                </div>
                <form className="ba-setup-body" onSubmit={handleSetup}>
                  <div className="ba-field-group">
                    <label className="ba-field-label">
                      <span>🏷️</span> Team Name
                    </label>
                    <input
                      type="text"
                      className="ba-field-input"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Enter your team name..."
                      maxLength={30}
                      autoFocus
                    />
                  </div>

                  <div className="ba-field-group">
                    <label className="ba-field-label">
                      <span>💻</span> Programming Language
                    </label>
                    <select
                      className="ba-field-select"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      {LANGUAGES.map(lang => (
                        <option key={lang.id} value={lang.id}>
                          {lang.name} ({lang.ext})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className="ba-neon-btn" style={{ alignSelf: 'center', marginTop: '0.5rem' }}>
                    <span className="ba-btn-icon">⚡</span>
                    Enter the Arena
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <>
              <div className="ba-team-badge">
                <span className="ba-team-badge-icon">⚡</span>
                {teamName} — {LANGUAGES.find(l => l.id === language)?.name}
              </div>

              {phase === 'create' && renderCreatePhase()}
              {phase === 'exchange' && renderExchangePhase()}
              {phase === 'hunt' && renderHuntPhase()}
            </>
          )}
        </div>

        <div className="ba-footer ba-fade-in">
          <div className="ba-footer-glow" />
          <p className="ba-footer-text">
            Bug Arena — A Nexus Technical Club Event. May the sharpest debugger win!
          </p>
          <button className="ba-return-btn" onClick={onAbort}>
            <span>↩</span> Return to Home
          </button>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default BugArena;
