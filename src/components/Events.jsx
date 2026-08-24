import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import quizWinners from '../assets/quizathon_winners.jpg';
import quiz1 from '../assets/quizathon1.jpg';
import quiz2 from '../assets/quizathon2.jpg';
import quiz3 from '../assets/quizathon3.jpg';
import quiz4 from '../assets/quizathon4.jpg';
import quiz5 from '../assets/quizathon5.jpg';

const Events = ({ onAbort }) => {
  const [activeImage, setActiveImage] = useState(null);

  const quizathonEvent = {
    title: 'Quiz-A-Thon 2026',
    badge: '🏆 FIRST-EVER EVENT',
    organizer: 'Organized by Nexus Technical Club Members',
  };

  const galleryImages = [
    {
      id: 0,
      src: quizWinners,
      title: '🎖️ Wall of Fame — Winners Poster',
      caption: 'Official Quiz-A-Thon Winners announcement poster highlighting the top rankers.',
    },
    {
      id: 1,
      src: quiz1,
      title: 'Platform Presentation (Vexta)',
      caption: 'Presenting Vexta — the in-house contest platform built by Nexus members.',
    },
    {
      id: 2,
      src: quiz2,
      title: 'Build • Code • Innovate',
      caption: 'Nexus Community key stage presentation setting the vision.',
    },
    {
      id: 3,
      src: quiz3,
      title: 'Core Registration Team',
      caption: 'Nexus core team members managing student registrations & desk operations.',
    },
    {
      id: 4,
      src: quiz4,
      title: 'Placement Assessment Rounds',
      caption: 'Enthusiastic student participation during the 3-round assessment.',
    },
    {
      id: 5,
      src: quiz5,
      title: 'Core Organizers Stage Photo',
      caption: 'The passionate organizing team behind the grand success of Quiz-A-Thon.',
    },
  ];

  return (
    <div className="lp-page" style={{ padding: '0 2rem 5rem' }}>
      {/* Back button if inside portal */}
      {onAbort && (
        <div
          className="portal-back-btn"
          onClick={onAbort}
          style={{ position: 'fixed', top: '1.5rem', left: '2rem', zIndex: 1010 }}
        >
          <span className="back-arrow">←</span>
          <span>Back to Nexus</span>
        </div>
      )}

      {/* Hero Section */}
      <div className="lp-hero">
        <div className="lp-hero-badge">⚡ Nexus Official Event</div>
        <h1 className="lp-hero-title">Nexus Events</h1>
        <p className="lp-hero-sub">
          Handcrafted and organized by the members of Nexus Technical Club.
        </p>
      </div>

      {/* Main Single Event Card: Quiz-A-Thon */}
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: '2.5rem',
            borderRadius: '24px',
            border: '2px solid rgba(0, 229, 255, 0.6)',
            background:
              'linear-gradient(135deg, rgba(0, 229, 255, 0.09) 0%, rgba(157, 78, 221, 0.09) 100%)',
            boxShadow: '0 0 45px rgba(0, 229, 255, 0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Header Badge & Organizer Tag */}
          <div
            style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#00ffff',
                  border: '1px solid rgba(0, 229, 255, 0.5)',
                  background: 'rgba(0, 229, 255, 0.15)',
                  boxShadow: '0 0 15px rgba(0, 229, 255, 0.3)',
                }}
              >
                {quizathonEvent.badge}
              </span>
              <span
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#eab308',
                  border: '1px solid rgba(234, 179, 8, 0.4)',
                  background: 'rgba(234, 179, 8, 0.1)',
                }}
              >
                👥 {quizathonEvent.organizer}
              </span>
            </div>
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: '2.8rem',
              fontWeight: 900,
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg, #ffffff 0%, #00ffff 60%, #9d4edd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {quizathonEvent.title}
          </h2>

          {/* Custom Description Block */}
          <div
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.05rem',
              lineHeight: 1.8,
              marginBottom: '3rem',
              maxWidth: '950px',
            }}
          >
            {/* Results Announcement Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.12) 0%, rgba(157, 78, 221, 0.15) 100%)',
                border: '1px solid rgba(0, 229, 255, 0.4)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem',
                boxShadow: '0 8px 32px rgba(0, 229, 255, 0.15)',
              }}
            >
              <p style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.8rem' }}>
                🎉 <strong style={{ color: '#00ffff' }}>The results are in!</strong> After a rigorous multi-stage battle covering <span style={{ color: '#00ffff', fontWeight: 700 }}>Aptitude</span>, <span style={{ color: '#00ffff', fontWeight: 700 }}>English Assessment</span>, and a high-intensity <span style={{ color: '#00ffff', fontWeight: 700 }}>Coding Challenge</span>, these brilliant minds have emerged at the top.
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', margin: 0 }}>
                It takes a unique blend of logic, communication, and technical grit to conquer this trifecta. Huge congratulations to our winners for setting the bar so high!
              </p>
            </div>

            {/* 🎖️ The Wall of Fame Section */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3
                style={{
                  fontSize: '1.6rem',
                  color: '#fbbf24',
                  marginBottom: '1.25rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  letterSpacing: '0.02em',
                }}
              >
                🎖️ 𝗧𝗵𝗲 𝗪𝗮𝗹𝗹 𝗼𝗳 𝗙𝗮𝗺𝗲
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {/* 1st Position */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(217, 119, 6, 0.08) 100%)',
                    border: '2px solid rgba(251, 191, 36, 0.7)',
                    borderRadius: '16px',
                    padding: '1.25rem 1.5rem',
                    boxShadow: '0 0 25px rgba(251, 191, 36, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: '#fbbf24',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: '0.4rem',
                    }}
                  >
                    🥇 𝟭𝘀𝘁 𝗣𝗼𝘀𝗶𝘁𝗶𝗼𝗻
                  </span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff' }}>
                    Srijan Pandey
                  </span>
                </div>

                {/* 2nd Position */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(203, 213, 225, 0.15) 0%, rgba(148, 163, 184, 0.08) 100%)',
                    border: '2px solid rgba(203, 213, 225, 0.7)',
                    borderRadius: '16px',
                    padding: '1.25rem 1.5rem',
                    boxShadow: '0 0 20px rgba(203, 213, 225, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: '#e2e8f0',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: '0.4rem',
                    }}
                  >
                    🥈 𝟮𝗻𝗱 𝗣𝗼𝘀𝗶𝘁𝗶𝗼𝗻
                  </span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff' }}>
                    SANCHIT SINGH
                  </span>
                </div>

                {/* 3rd Position */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.15) 0%, rgba(180, 83, 9, 0.08) 100%)',
                    border: '2px solid rgba(217, 119, 6, 0.7)',
                    borderRadius: '16px',
                    padding: '1.25rem 1.5rem',
                    boxShadow: '0 0 20px rgba(217, 119, 6, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: '#f59e0b',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: '0.4rem',
                    }}
                  >
                    🥉 𝟯𝗿𝗱 𝗣𝗼𝘀𝗶𝘁𝗶𝗼𝗻
                  </span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff' }}>
                    PRANSHU YADAV <span style={{ color: '#00ffff', fontWeight: 600, fontSize: '0.95rem' }}>&</span> Aniket Singh
                  </span>
                </div>
              </div>
            </div>

            {/* From the NEXUS Community Section */}
            <div
              style={{
                background: 'rgba(157, 78, 221, 0.12)',
                borderLeft: '4px solid #9d4edd',
                borderTop: '1px solid rgba(157, 78, 221, 0.3)',
                borderRight: '1px solid rgba(157, 78, 221, 0.3)',
                borderBottom: '1px solid rgba(157, 78, 221, 0.3)',
                padding: '1.5rem',
                borderRadius: '0 16px 16px 0',
                marginBottom: '2rem',
              }}
            >
              <h4
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#d8b4fe',
                  marginBottom: '0.6rem',
                }}
              >
                𝗙𝗿𝗼𝗺 𝘁𝗵𝗲 𝗡𝗘𝗫𝗨𝗦 𝗖𝗼𝗺𝗺𝘂𝗻𝗶𝘁𝘆:
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.7, margin: 0 }}>
                A massive shoutout to everyone who participated! Your commitment to bridging the gap between academic learning and placement readiness is what makes this community thrive. To our winners: wear this achievement with pride—you’ve proven you’re ready for the big leagues! 💼✨
              </p>
            </div>

            {/* Event Highlights & Structure */}
            <h3
              style={{
                fontSize: '1.3rem',
                color: '#00ffff',
                marginBottom: '1rem',
                fontWeight: 800,
              }}
            >
              𝗡𝗘𝗫𝗨𝗦 𝗧𝗲𝗰𝗵 𝗖𝗼𝗺𝗺𝘂𝗻𝗶𝘁𝘆 — 𝗝𝘂𝘀𝘁 𝗚𝗲𝘁𝘁𝗶𝗻𝗴 𝗦𝘁𝗮𝗿𝘁𝗲𝗱! 🔥
            </h3>

            <div
              style={{
                background: 'rgba(0, 229, 255, 0.05)',
                borderLeft: '4px solid #00ffff',
                padding: '1.2rem 1.5rem',
                borderRadius: '0 12px 12px 0',
                marginBottom: '1.5rem',
              }}
            >
              <p style={{ fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                What made it special?
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', marginBottom: '0.6rem' }}>
                A mini placement experience with 3 rounds:
              </p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#00ffff' }}>
                <li style={{ marginBottom: '0.3rem' }}>
                  <span style={{ color: '#fff' }}>Aptitude & Logical Thinking</span>
                </li>
                <li style={{ marginBottom: '0.3rem' }}>
                  <span style={{ color: '#fff' }}>English Assessment</span>
                </li>
                <li style={{ marginBottom: '0.3rem' }}>
                  <span style={{ color: '#fff' }}>Coding Challenge</span>
                </li>
              </ul>
            </div>

            <ul style={{ listStyleType: 'none', paddingLeft: '0', marginBottom: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ color: '#00ffff' }}>🔹</span> The event witnessed incredible student engagement
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ color: '#00ffff' }}>🔹</span> Introduced our vision through an interactive presentation
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ color: '#00ffff' }}>🔹</span> Built a strong foundation for a thriving tech community
              </li>
            </ul>

            {/* Hashtags */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              {[
                '#NEXUS',
                '#NexusCommunity',
                '#QuizAThon',
                '#TechWinners',
                '#CodingChallenge',
                '#PlacementPrep',
                '#SRMCEM',
                '#StudentLeaders',
                '#FutureEng',
              ].map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: 'rgba(0, 229, 255, 0.08)',
                    color: '#00ffff',
                    border: '1px solid rgba(0, 229, 255, 0.25)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Featured Winners Poster Card */}
          <div style={{ marginBottom: '3rem' }}>
            <h3
              style={{
                fontSize: '1.4rem',
                color: '#fff',
                marginBottom: '1rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}
            >
              <span>🖼️ Winners Announcement Poster</span>
            </h3>
            <div
              onClick={() => setActiveImage(galleryImages[0])}
              style={{
                maxWidth: '650px',
                margin: '0 auto',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '2px solid rgba(251, 191, 36, 0.6)',
                background: 'rgba(18, 18, 26, 0.9)',
                boxShadow: '0 0 35px rgba(251, 191, 36, 0.2)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 0 45px rgba(251, 191, 36, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 35px rgba(251, 191, 36, 0.2)';
              }}
            >
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img
                  src={quizWinners}
                  alt="Quiz-A-Thon Winners Poster"
                  style={{
                    width: '100%',
                    maxHeight: '600px',
                    objectFit: 'contain',
                    display: 'block',
                    background: '#0d0d15',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(8px)',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    color: '#fbbf24',
                    border: '1px solid rgba(251, 191, 36, 0.5)',
                    fontWeight: 700,
                  }}
                >
                  🔍 Click to expand poster
                </div>
              </div>
              <div style={{ padding: '1rem 1.25rem', textAlign: 'center', background: 'rgba(10, 10, 18, 0.95)' }}>
                <p style={{ color: '#fbbf24', fontWeight: 800, margin: 0, fontSize: '1rem' }}>
                  NEXUS: QUIZ-A-THON WINNERS POSTER
                </p>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  Celebrating our top rankers & multi-round stage winners
                </p>
              </div>
            </div>
          </div>

          {/* Event Gallery Section */}
          <div>
            <h3
              style={{
                fontSize: '1.4rem',
                color: '#fff',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontWeight: 800,
              }}
            >
              <span>📸 Event Gallery & Highlights</span>
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {galleryImages.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setActiveImage(img)}
                  style={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'rgba(18, 18, 26, 0.8)',
                    border: img.id === 0 ? '2px solid rgba(251, 191, 36, 0.6)' : '1px solid rgba(0, 229, 255, 0.3)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.borderColor = img.id === 0 ? '#fbbf24' : '#00ffff';
                    e.currentTarget.style.boxShadow = img.id === 0 ? '0 12px 30px rgba(251, 191, 36, 0.3)' : '0 12px 30px rgba(0, 229, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = img.id === 0 ? 'rgba(251, 191, 36, 0.6)' : 'rgba(0, 229, 255, 0.3)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
                  }}
                >
                  <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={img.src}
                      alt={img.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.5s ease',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '0.6rem',
                        right: '0.6rem',
                        background: 'rgba(0, 0, 0, 0.65)',
                        backdropFilter: 'blur(6px)',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        color: img.id === 0 ? '#fbbf24' : '#00ffff',
                        border: img.id === 0 ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid rgba(0, 229, 255, 0.4)',
                      }}
                    >
                      🔍 Click to expand
                    </div>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                      {img.title}
                    </h4>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem', lineHeight: 1.4 }}>
                      {img.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal rendered into document.body to bypass parent CSS constraints */}
      {activeImage &&
        createPortal(
          <div
            onClick={() => setActiveImage(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 999999,
              background: 'rgba(5, 5, 12, 0.93)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              padding: '1.5rem',
              boxSizing: 'border-box',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '90vw',
                maxHeight: '92vh',
                width: 'fit-content',
                background: 'rgba(18, 18, 26, 0.96)',
                borderRadius: '20px',
                border:
                  activeImage.id === 0
                    ? '2px solid rgba(251, 191, 36, 0.7)'
                    : '1px solid rgba(0, 229, 255, 0.5)',
                boxShadow:
                  activeImage.id === 0
                    ? '0 0 50px rgba(251, 191, 36, 0.4)'
                    : '0 0 50px rgba(0, 229, 255, 0.3)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                margin: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  gap: '1rem',
                }}
              >
                <div>
                  <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                    {activeImage.title}
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.65)',
                      fontSize: '0.85rem',
                      margin: '0.2rem 0 0',
                    }}
                  >
                    {activeImage.caption}
                  </p>
                </div>
                <button
                  onClick={() => setActiveImage(null)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              </div>
              <div
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  justify: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  flex: 1,
                }}
              >
                <img
                  src={activeImage.src}
                  alt={activeImage.title}
                  style={{
                    maxWidth: '85vw',
                    maxHeight: '75vh',
                    objectFit: 'contain',
                    borderRadius: '12px',
                    display: 'block',
                    margin: '0 auto',
                  }}
                />
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Footer Return Button */}
      {onAbort && (
        <div className="lp-footer-cta" style={{ marginTop: '4rem' }}>
          <button className="portal-return-btn" onClick={onAbort}>
            Return to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default Events;


