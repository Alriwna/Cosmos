import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import './RedirectPortal.css';

// ─── Letter shape definitions (grid-based point sampling) ───────────────────
// Each letter is defined as a set of line segments in a normalized coordinate space
const LETTER_SHAPES = {
  E: [
    // Vertical bar (left side)
    ...Array.from({ length: 20 }, (_, i) => ({ x: -1.2, y: -1.2 + (2.4 * i) / 19 })),
    // Top horizontal bar
    ...Array.from({ length: 15 }, (_, i) => ({ x: -1.2 + (2.0 * i) / 14, y: 1.2 })),
    // Middle horizontal bar
    ...Array.from({ length: 12 }, (_, i) => ({ x: -1.2 + (1.6 * i) / 11, y: 0 })),
    // Bottom horizontal bar
    ...Array.from({ length: 15 }, (_, i) => ({ x: -1.2 + (2.0 * i) / 14, y: -1.2 })),
  ],
  H: [
    // Left vertical bar
    ...Array.from({ length: 20 }, (_, i) => ({ x: -1.2, y: -1.2 + (2.4 * i) / 19 })),
    // Right vertical bar
    ...Array.from({ length: 20 }, (_, i) => ({ x: 0.8, y: -1.2 + (2.4 * i) / 19 })),
    // Horizontal bar (middle)
    ...Array.from({ length: 14 }, (_, i) => ({ x: -1.2 + (2.0 * i) / 13, y: 0 })),
  ],
  P: [
    // Vertical bar (left side)
    ...Array.from({ length: 20 }, (_, i) => ({ x: -1.2, y: -1.2 + (2.4 * i) / 19 })),
    // Top horizontal bar
    ...Array.from({ length: 12 }, (_, i) => ({ x: -1.2 + (1.8 * i) / 11, y: 1.2 })),
    // Curved right side (top half)
    ...Array.from({ length: 10 }, (_, i) => ({ x: 0.6, y: 1.2 - (1.2 * i) / 9 })),
    // Middle horizontal bar
    ...Array.from({ length: 12 }, (_, i) => ({ x: -1.2 + (1.8 * i) / 11, y: 0 })),
  ],
  L: [
    // Vertical bar (left side)
    ...Array.from({ length: 20 }, (_, i) => ({ x: -1.2, y: -1.2 + (2.4 * i) / 19 })),
    // Bottom horizontal bar
    ...Array.from({ length: 15 }, (_, i) => ({ x: -1.2 + (2.0 * i) / 14, y: -1.2 })),
  ],
};

const SECTION_CONFIG = {
  events: {
    letter: 'E',
    name: 'Events',
    tagline: 'Community meetups, workshops & guest lectures',
    color1: '#9d4edd',
    color2: '#00ffff',
    emissive1: '#7b2cbf',
    emissive2: '#00e5ff',
  },
  hackathons: {
    letter: 'H',
    name: 'Hackathons',
    tagline: 'Builder registrations, team-building & submissions',
    color1: '#00ffff',
    color2: '#2196f3',
    emissive1: '#00e5ff',
    emissive2: '#1565c0',
  },
  puzzles: {
    letter: 'P',
    name: 'Puzzles',
    tagline: 'Cryptographical challenges & smart contract CTFs',
    color1: '#9d4edd',
    color2: '#ff6b9d',
    emissive1: '#7b2cbf',
    emissive2: '#ff3366',
  },
  learning: {
    letter: 'L',
    name: 'Learning',
    tagline: 'Curriculum guidelines, Web3 courses & AI models',
    color1: '#00ffff',
    color2: '#4ade80',
    emissive1: '#00e5ff',
    emissive2: '#22c55e',
  },
};

// ─── 3D Letter Particle System ──────────────────────────────────────────────
const LetterParticles = ({ letter, scrollProgress, color1, color2, emissive1, emissive2 }) => {
  const PARTICLE_COUNT = LETTER_SHAPES[letter]?.length || 50;
  const meshRef = useRef();
  const groupRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Target positions from letter shape
  const targets = useMemo(() => {
    const shape = LETTER_SHAPES[letter] || LETTER_SHAPES['E'];
    return shape.map(p => new THREE.Vector3(p.x, p.y, 0));
  }, [letter]);

  // Random scattered start positions
  const randoms = useMemo(() =>
    Array.from({ length: PARTICLE_COUNT }, () => new THREE.Vector3(
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 12,
    )),
  [PARTICLE_COUNT]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (!meshRef.current) return;

    // Use scroll progress for assembly
    const t = THREE.MathUtils.clamp(scrollProgress.current, 0, 1);
    const scatter = 1 - t;

    // Floating offsets (only when assembled)
    const floatY = Math.sin(elapsed * 0.8) * 0.08 * t;
    const floatX = Math.sin(elapsed * 0.5) * 0.04 * t;
    const floatZ = Math.cos(elapsed * 0.7) * 0.05 * t;

    targets.forEach((target, i) => {
      const r = randoms[i];

      // Lerp from scattered to assembled
      let px = r.x + (target.x - r.x) * t;
      let py = r.y + (target.y - r.y) * t;
      let pz = r.z + (target.z - r.z) * t;

      // Gentle drift when scattered
      px += Math.sin(elapsed * 0.7 + i * 0.3) * 0.1 * scatter;
      py += Math.cos(elapsed * 0.5 + i * 0.2) * 0.1 * scatter;

      // Floating oscillation when assembled
      py += floatY;
      px += floatX;
      pz += floatZ;

      // Per-particle subtle movement
      py += Math.sin(elapsed * 1.2 + i * 0.5) * 0.03 * t;

      dummy.position.set(px, py, pz);
      const s = 0.3 + t * 0.8;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;

    // Group rotation based on scroll
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(elapsed * 0.3) * 0.15 * t;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[null, null, PARTICLE_COUNT]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial
          color={color1}
          emissive={emissive1}
          emissiveIntensity={2.5}
          roughness={0.1}
          metalness={0.8}
        />
      </instancedMesh>
    </group>
  );
};

// ─── Background stars ────────────────────────────────────────────────────────
const PortalStars = () => {
  const starsRef = useRef();
  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.getElapsedTime() * 0.01;
    }
  });
  return (
    <group ref={starsRef}>
      <Stars radius={100} depth={50} count={2500} factor={4} saturation={0.5} fade speed={1} />
    </group>
  );
};

// ─── Ambient ring around the letter ──────────────────────────────────────────
const GlowRing = ({ scrollProgress, color }) => {
  const ringRef = useRef();
  useFrame((state) => {
    if (!ringRef.current) return;
    const elapsed = state.clock.getElapsedTime();
    const t = scrollProgress.current;
    ringRef.current.rotation.z = elapsed * 0.2;
    ringRef.current.scale.setScalar(0.5 + t * 1.2);
    ringRef.current.material.opacity = t * 0.3;
  });
  return (
    <mesh ref={ringRef} rotation={[0, 0, 0]}>
      <torusGeometry args={[2.2, 0.03, 8, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        transparent
        opacity={0}
        wireframe
      />
    </mesh>
  );
};

// ─── Main RedirectPortal Component ──────────────────────────────────────────
const RedirectPortal = ({ target, onAbort }) => {
  const config = SECTION_CONFIG[target] || SECTION_CONFIG.events;
  const scrollContainerRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  // Handle scroll inside the portal to control assembly progress
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      scrollProgressRef.current = progress;
      setDisplayProgress(Math.round(progress * 100));
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="redirect-overlay">
      {/* Full-screen 3D Canvas behind everything */}
      <div className="portal-canvas-bg">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={2} color={config.color1} />
          <pointLight position={[-5, -5, -5]} intensity={1.5} color={config.color2} />
          <directionalLight position={[0, 5, 5]} intensity={0.8} />

          <PortalStars />

          <LetterParticles
            letter={config.letter}
            scrollProgress={scrollProgressRef}
            color1={config.color1}
            color2={config.color2}
            emissive1={config.emissive1}
            emissive2={config.emissive2}
          />

          <GlowRing scrollProgress={scrollProgressRef} color={config.color1} />
        </Canvas>
      </div>

      {/* Scrollable content overlay */}
      <div className="portal-scroll-container" ref={scrollContainerRef}>
        {/* Top section: Section title */}
        <div className="portal-intro-section">
          <div className="portal-back-btn" onClick={onAbort}>
            <span className="back-arrow">←</span>
            <span>Back to Nexus</span>
          </div>
          <div className="portal-intro-content">
            <span className="portal-section-tag">{config.name} Portal</span>
            <h1 className="portal-section-title">
              {config.name}
            </h1>
            <p className="portal-section-tagline">{config.tagline}</p>
            <div className="scroll-hint-portal">
              <span>Scroll to reveal</span>
              <div className="scroll-arrow-container">
                <div className="scroll-arrow">↓</div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle spacer for scroll-driven assembly */}
        <div className="portal-scroll-spacer"></div>

        {/* Bottom section: assembled state — info cards */}
        <div className="portal-assembled-section">
          <div className="portal-progress-indicator">
            <div className="progress-ring-small">
              <svg width="60" height="60">
                <circle
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="3"
                  fill="transparent"
                  r="26"
                  cx="30"
                  cy="30"
                />
                <circle
                  stroke={config.color1}
                  strokeWidth="3"
                  fill="transparent"
                  r="26"
                  cx="30"
                  cy="30"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 26}`,
                    strokeDashoffset: `${2 * Math.PI * 26 * (1 - displayProgress / 100)}`,
                    transition: 'stroke-dashoffset 0.15s ease',
                    transform: 'rotate(-90deg)',
                    transformOrigin: '50% 50%',
                  }}
                />
              </svg>
              <span className="progress-number">{displayProgress}%</span>
            </div>
            <span className="progress-label">ASSEMBLY COMPLETE</span>
          </div>

          <div className="portal-info-cards">
            <div className="portal-info-card glass-card">
              <div className="info-card-icon" style={{ color: config.color1 }}>⚡</div>
              <h3>Launch Status</h3>
              <p>Portal connection established. {config.name} module loaded and ready for deployment.</p>
            </div>
            <div className="portal-info-card glass-card">
              <div className="info-card-icon" style={{ color: config.color2 }}>🔗</div>
              <h3>Coming Soon</h3>
              <p>The {config.name.toLowerCase()} section is currently under construction. Stay tuned for updates!</p>
            </div>
          </div>

          <button className="portal-return-btn" onClick={onAbort}>
            Return to Home
          </button>
        </div>
      </div>

      {/* Scanlines */}
      <div className="scanlines"></div>
    </div>
  );
};

export default RedirectPortal;
