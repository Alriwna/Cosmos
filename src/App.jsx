import React, { useEffect, useRef, useState } from 'react';
import ThreeScene from './components/ThreeScene';
import { Canvas } from '@react-three/fiber';
import { NexusParticles } from './components/ThreeModels';
import RedirectPortal from './components/RedirectPortal';
import nexusLogo from './assets/nexus-logo.svg';

function App() {
  const scrollContainerRef = useRef(null);
  const [redirectTarget, setRedirectTarget] = useState(null);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Intersection Observer for fade-in sections and active nav link
  useEffect(() => {
    const sections = document.querySelectorAll('.fade-section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Fade in when visible
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }

          // Highlight active nav link
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              }
            });
          }
        });
      },
      { threshold: [0.1, 0.3] }
    );

    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* 3D Background Canvas */}
      <ThreeScene />

      {/* Navigation Header */}
      <nav className="navbar">
        <a href="#home" className="nav-logo" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img src={nexusLogo} alt="Nexus Logo" style={{ width: '28px', height: '28px' }} />
          <span>NEXUS</span>
        </a>
        <ul className="nav-links">
          <li>
            <a href="#home" className="active" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
              Home
            </a>
          </li>
          <li>
            <a href="#events" onClick={(e) => { e.preventDefault(); setRedirectTarget('events'); }}>
              Events
            </a>
          </li>
          <li>
            <a href="#hackathons" onClick={(e) => { e.preventDefault(); setRedirectTarget('hackathons'); }}>
              Hackathons
            </a>
          </li>
          <li>
            <a href="#puzzles" onClick={(e) => { e.preventDefault(); setRedirectTarget('puzzles'); }}>
              Puzzles
            </a>
          </li>
          <li>
            <a href="#learning" onClick={(e) => { e.preventDefault(); setRedirectTarget('learning'); }}>
              Learning
            </a>
          </li>
        </ul>
      </nav>

      {/* HTML Content Scroller */}
      <div className="scroll-container" ref={scrollContainerRef}>
        {/* ── HOME: fullscreen mouse-driven particle assembly ── */}
        <section id="home" className="fade-section visible" style={{
          height: '100vh',
          width: '100vw',
          maxWidth: '100vw',
          padding: 0,
          margin: 0,
          position: 'relative',
          display: 'block',
          overflow: 'hidden',
        }}>
          {/* Mouse-to-center hint */}
          <div style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: 20,
            animation: 'fadeInUp 1.4s ease 0.6s forwards',
            opacity: 0,
            pointerEvents: 'none',
          }}>
            <span style={{
              color: 'rgba(0,229,255,0.7)',
              fontSize: '0.78rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-tech)',
              textShadow: '0 0 12px rgba(0,229,255,0.5)',
            }}>
              Move cursor to centre
            </span>
            <div style={{
              width: 1,
              height: 36,
              background: 'linear-gradient(to bottom, rgba(0,229,255,0.7), transparent)',
              borderRadius: 2,
            }} />
          </div>

          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            style={{ background: 'transparent', width: '100%', height: '100%' }}
          >
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={2.5} color="#00ffff" />
            <pointLight position={[-10, -10, -10]} intensity={2.0} color="#9d4edd" />
            <pointLight position={[0, 0, 10]} intensity={1.5} color="#2196f3" />
            <directionalLight position={[0, 5, 5]} intensity={1.0} />
            <NexusParticles />
          </Canvas>
        </section>

        <footer>
          <p style={{ textTransform: 'capitalize' }}>© {new Date().getFullYear()} Nexus Technical Club. Built onchain &amp; in the nexus.</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--color-text-dim)' }}>
            All systems nominal. Prepared for launch.
          </p>
        </footer>
      </div>

      {/* Redirect Portal Overlay */}
      {redirectTarget && (
        <RedirectPortal target={redirectTarget} onAbort={() => setRedirectTarget(null)} />
      )}
    </>
  );
}

export default App;
