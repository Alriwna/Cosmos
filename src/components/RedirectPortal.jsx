import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import './RedirectPortal.css';
import Puzzles from './Puzzles';
import BugArena from './BugArena';
import Events from './Events';
import team1 from '../assets/team1.jpg';
import team2 from '../assets/team2.jpg';
import team3 from '../assets/team3.jpg';
import team4 from '../assets/team4.jpg';
import team5 from '../assets/team5.jpg';
import team6 from '../assets/team6.jpg';
import jaya from '../assets/jaya.png';
import ashray from '../assets/ashray.png';
import lakshya from '../assets/lakshya.png';
import sakshi from '../assets/sakshi.png';
import chitransh from '../assets/chitransh.png';
import subid from '../assets/subid.png';
import etesh from '../assets/etesh.png';
import praval from '../assets/praval.png';
import samarth from '../assets/samarth.png';
import divyanshi from '../assets/divyanshi.png';
import aditya from '../assets/aditya.png';
import saumy from '../assets/saumy.png';
import mansi from '../assets/mansi.png';
import sumaiya from '../assets/sumaiya.png';
import kirti from '../assets/kirti.png';
import vanshika from '../assets/vanshika.png';

// Gamified Array Course
import ArrayCourse from './ArrayCourse';


// ─── Learning Page Content ────────────────────────────────────────────────────
const LEARNING_TABS = [
  {
    id: 'dsa',
    label: 'DSA Fundamentals',
    accent: '#00e5ff',
    courses: [
      {
        icon: '📊',
        title: 'Array',
        desc: 'Master array operations, searching, sorting, and solve classic interview problems like two-pointer and sliding window techniques.',
        level: 'Beginner → Intermediate',
        duration: '4 weeks',
        tag: 'Foundation',
        tagColor: '#22c55e',
      },
      {
        icon: '🔗',
        title: 'Linked List',
        desc: 'Understand singly & doubly linked lists, pointer manipulation, cycle detection, reversal, and merge operations.',
        level: 'Beginner → Intermediate',
        duration: '3 weeks',
        tag: 'Core DSA',
        tagColor: '#3b82f6',
      },
      {
        icon: '📚',
        title: 'Stack & Queue',
        desc: 'Learn LIFO & FIFO structures, implement using arrays and linked lists, and solve problems like balanced parentheses and BFS.',
        level: 'Beginner → Intermediate',
        duration: '3 weeks',
        tag: 'Essential',
        tagColor: '#a855f7',
      },
    ],
  },
  {
    id: 'webdev',
    label: 'Web Development',
    accent: '#f59e0b',
    courses: [
      {
        icon: '🌐',
        title: 'HTML, CSS & JavaScript',
        desc: 'Build the foundation of web development — structure pages with HTML, style with CSS, and add interactivity with JavaScript.',
        level: 'Beginner',
        duration: '4 weeks',
        tag: 'Foundation',
        tagColor: '#f59e0b',
      },
      {
        icon: '⚛️',
        title: 'React',
        desc: 'Learn component-based architecture, hooks, state management, routing, and build modern single-page applications.',
        level: 'Intermediate',
        duration: '5 weeks',
        tag: 'Frontend',
        tagColor: '#61dafb',
      },
      {
        icon: '🚀',
        title: 'MERN Stack',
        desc: 'Full-stack development with MongoDB, Express.js, React, and Node.js — from REST APIs to deployment.',
        level: 'Intermediate → Advanced',
        duration: '8 weeks',
        tag: 'Full Stack',
        tagColor: '#22c55e',
      },
      {
        icon: '🗄️',
        title: 'MySQL',
        desc: 'Learn relational database design, SQL queries, joins, indexing, and database optimization for real-world applications.',
        level: 'Beginner → Intermediate',
        duration: '3 weeks',
        tag: 'Database',
        tagColor: '#00758f',
      },
    ],
  },
];

const LearningContent = ({ onAbort, assemblyProgressRef }) => {
  const [activeTab, setActiveTab] = useState('dsa');
  const [gamifiedCourse, setGamifiedCourse] = useState(null);
  const currentTab = LEARNING_TABS.find(t => t.id === activeTab);
  const heroTitleRef = useRef(null);

  // When the hero title enters the viewport, animate the L particles 0 → 1
  useEffect(() => {
    const el = heroTitleRef.current;
    if (!el || !assemblyProgressRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          const startVal = assemblyProgressRef.current;
          const startTime = performance.now();
          const DURATION = 900; // ms

          const tick = (now) => {
            const raw = Math.min((now - startTime) / DURATION, 1);
            // Ease-out cubic
            const ease = 1 - Math.pow(1 - raw, 3);
            assemblyProgressRef.current = startVal + (1 - startVal) * ease;
            if (raw < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      // Trigger when the top of the heading crosses 15% from the bottom of the viewport
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [assemblyProgressRef]);

  return (
    <div className="lp-page">
      {/* Back button */}
      <div className="portal-back-btn" onClick={onAbort} style={{ position: 'fixed', top: '1.5rem', left: '2rem', zIndex: 1010 }}>
        <span className="back-arrow">←</span>
        <span>Back to Nexus</span>
      </div>

      {/* Hero */}
      <div className="lp-hero">
        <div className="lp-hero-badge">🎓 Nexus Learning Hub</div>
        <h1 className="lp-hero-title" ref={heroTitleRef}>Start Your Learning Today!</h1>
        <p className="lp-hero-sub">Curated curriculum designed for builders, engineers, and innovators.</p>

        {/* Tab bar */}
        <div className="lp-tabs">
          {LEARNING_TABS.map(tab => (
            <button
              key={tab.id}
              className={`lp-tab ${activeTab === tab.id ? 'lp-tab-active' : ''}`}
              style={activeTab === tab.id ? { '--tab-accent': tab.accent } : {}}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Course grid */}
      <div className="lp-grid">
        {currentTab.courses.map((course, i) => (
          <div key={i} className="lp-card glass-card">
            <div className="lp-card-header">
              <span className="lp-card-icon">{course.icon}</span>
              <span className="lp-card-tag" style={{ color: course.tagColor, borderColor: course.tagColor + '55', background: course.tagColor + '18' }}>
                {course.tag}
              </span>
            </div>
            <h3 className="lp-card-title">{course.title}</h3>
            <p className="lp-card-desc">{course.desc}</p>
            <div className="lp-card-meta">
              <span className="lp-meta-item">📊 {course.level}</span>
              <span className="lp-meta-item">⏱ {course.duration}</span>
            </div>
            <button
              className="lp-enroll-btn"
              style={{ '--btn-accent': currentTab.accent }}
              onClick={() => {
                if (course.title === 'Array') {
                  setGamifiedCourse('Array');
                } else {
                  alert(`Enrolling in: ${course.title}`);
                }
              }}
            >
              Enroll Now →
            </button>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="lp-footer-cta">
        <p className="lp-footer-text">More courses are being added every week. Stay tuned!</p>
        <button className="portal-return-btn" onClick={onAbort}>Return to Home</button>
      </div>

      {/* Gamified Overlay */}
      {gamifiedCourse === 'Array' && (
        <ArrayCourse onClose={() => setGamifiedCourse(null)} />
      )}
    </div>
  );
};

// ─── Family Page Content ──────────────────────────────────────────────────────
const TEAM_MEMBERS = [
  {
    name: "Aman Tiwari",
    role: "Founder",
    category: "leadership",
    badge: "LEADERSHIP",
    dept: "Computer Science & Engineering · Graduated",
    bio: "Visionary founder of Nexus Community. Dedicated to building an inclusive and advanced tech environment.",
    tags: ["Community Building", "Public Speaking", "Strategic Planning"],
    color: "#eab308", 
    linkedin: "https://www.linkedin.com/in/aman-tiwari-dev/",
    cropStyle: {
      backgroundImage: `url(${team1})`,
      backgroundSize: "260%",
      backgroundPosition: "50% 52%"
    }
  },
  {
    name: "Jaya Pandey",
    role: "Community Lead",
    category: "leadership",
    badge: "LEADERSHIP",
    dept: "Computer Science & Engineering · 4th Year",
    bio: "Leading community initiatives at Nexus. Passionate about driving impact and managing core operations.",
    tags: ["Public Relations", "Team Management", "Leadership"],
    color: "#eab308",
    linkedin: "https://www.linkedin.com/in/jaya-pandey-439204311/",
    cropStyle: {
      backgroundImage: `url(${jaya})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  },
  {
    name: "Ashray Dwivedi",
    role: "Community Co-Lead",
    category: "leadership",
    badge: "LEADERSHIP",
    dept: "Cyber Security · 4th Year",
    bio: "Supporting community vision and co-leading Nexus operations, workshops, and strategic relations.",
    tags: ["Strategic Growth", "Communication", "Technical Planning"],
    color: "#eab308",
    linkedin: "https://www.linkedin.com/in/ashray-dwivedi-b89295211/",
    cropStyle: {
      backgroundImage: `url(${ashray})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  },
  {
    name: "Subid Kant Nigam",
    role: "Technical Lead",
    category: "technical",
    badge: "TECHNICAL",
    dept: "Cyber Security · 4th Year",
    bio: "Passionate coder leading technical development and setting challenging milestones for the development team.",
    tags: ["Data Structures & Algorithms", "Full Stack Development", "Competitive Programming"],
    color: "#3b82f6", // Blue
    linkedin: "https://www.linkedin.com/in/subid-kant-nigam-3339142ab/",
    cropStyle: {
      backgroundImage: `url(${subid})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  },
  {
    name: "Etesh Singh",
    role: "Technical Co-Lead",
    category: "technical",
    badge: "TECHNICAL",
    dept: "Computer Science & Engineering · 4th Year",
    bio: "Driven developer and technical mentor focused on co-leading web development, framework setup, and core code reviews.",
    tags: ["Backend Development", "Node.js", "Express"],
    color: "#3b82f6",
    linkedin: "https://www.linkedin.com/in/etesh-singh-132675294/",
    cropStyle: {
      backgroundImage: `url(${etesh})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  },
  {
    name: "Lakshya Verma",
    role: "Technical Coordinator",
    category: "technical",
    badge: "TECHNICAL",
    dept: "Computer Science & Engineering · 2nd Year",
    bio: "Supporting technical operations, contest hosting, and website update cycles.",
    tags: ["C++", "HTML/CSS", "Git"],
    color: "#3b82f6",
    linkedin: "https://www.linkedin.com/in/lakshya-verma-448a50365/",
    cropStyle: {
      backgroundImage: `url(${lakshya})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  },
  {
    name: "Sakshi Kashyap",
    role: "Technical Coordinator",
    category: "technical",
    badge: "TECHNICAL",
    dept: "Computer Science & Engineering · 2nd Year",
    bio: "Assisting in technical bootcamps and workshops, maintaining system logs, and supporting code runs.",
    tags: ["Python", "DSA Basics", "Technical Writing"],
    color: "#3b82f6",
    linkedin: "https://www.linkedin.com/in/sakshi-kashyap-36a11238b/",
    cropStyle: {
      backgroundImage: `url(${sakshi})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  },
  {
    name: "Chitransh Singh",
    role: "Technical Coordinator",
    category: "technical",
    badge: "TECHNICAL",
    dept: "Computer Science & Engineering · 3rd Year",
    bio: "Supporting student training, code reviews, and hosting competitive programming hackathons.",
    tags: ["Competitive Programming", "C++ Algorithms", "Event Hosting"],
    color: "#3b82f6",
    linkedin: "https://www.linkedin.com/in/chitransh-singh-rathour-279b94352/",
    cropStyle: {
      backgroundImage: `url(${chitransh})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  },
  {
    name: "Kirti Srivastava",
    role: "Content Lead",
    category: "content_pr",
    badge: "CONTENT",
    dept: "Computer Science & Engineering · 4th Year",
    bio: "Creative writer managing content generation, placement resources documentation, and editorial cycles.",
    tags: ["Content Writing", "Technical Documentation", "Copywriting"],
    color: "#ec4899", // Pink
    linkedin: "https://www.linkedin.com/in/kirti-srivastava-2270a9331/",
    cropStyle: {
      backgroundImage: `url(${kirti})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  },
  {
    name: "Vanshika Saxena",
    role: "Event & PR Lead",
    category: "content_pr",
    badge: "CONTENT",
    dept: "Computer Science & Engineering · 3rd Year",
    bio: "Energetic and organized lead orchestrating coding contests, inter-college public events, and sponsorships.",
    tags: ["Event Management", "Public Relations", "Communication"],
    color: "#ec4899",
    linkedin: "https://www.linkedin.com/in/vanshika-saxena-039518329/",
    cropStyle: {
      backgroundImage: `url(${vanshika})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  },
  {
    name: "Praval Srivastav",
    role: "Content Coordinator",
    category: "content_pr",
    badge: "CONTENT",
    dept: "Computer Science & Engineering · 2nd Year",
    bio: "Drafting newsletters, placement experience summaries, and managing student notifications.",
    tags: ["Copywriting", "Creative Writing", "Blogging"],
    color: "#ec4899",
    linkedin: "https://www.linkedin.com/in/praval-srivastav-68017a381/",
    cropStyle: {
      backgroundImage: `url(${praval})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  },
  {
    name: "Samarth Singh",
    role: "Event & PR Coordinator",
    category: "content_pr",
    badge: "CONTENT",
    dept: "Computer Science & Engineering · 2nd Year",
    bio: "Actively organizing placement preparation schedules, hackathons, and guest speaker coordinates.",
    tags: ["Event Organization", "Public Relations", "Communication"],
    color: "#ec4899",
    linkedin: "https://www.linkedin.com/in/samarth-singh-057926367/",
    cropStyle: {
      backgroundImage: `url(${samarth})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  },
  {
    name: "Divyanshi Singh",
    role: "Content Coordinator",
    category: "content_pr",
    badge: "CONTENT",
    dept: "Computer Science & Engineering · 2nd Year",
    bio: "Supporting graphic text generation and review of social media copy layouts.",
    tags: ["Content Review", "Collaboration", "Microcopy"],
    color: "#ec4899",
    linkedin: "https://www.linkedin.com/in/divyanshi-singh-4ba9123b7/",
    cropStyle: {
      backgroundImage: `url(${divyanshi})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  },
  {
    name: "Aditya Nath Patel",
    role: "Content Coordinator",
    category: "content_pr",
    badge: "CONTENT",
    dept: "Computer Science & Engineering · 2nd Year",
    bio: "Structuring newsletters, technical documentation logs, and public media copy blocks.",
    tags: ["Newsletter Design", "Technical Logs", "Copywriting"],
    color: "#ec4899",
    linkedin: "https://www.linkedin.com/in/adityanathpatel/",
    cropStyle: {
      backgroundImage: `url(${aditya})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  },
  {
    name: "Saumy Chaurasia",
    role: "Content Coordinator",
    category: "content_pr",
    badge: "CONTENT",
    dept: "Computer Science & Engineering · 2nd Year",
    bio: "Coordinating content logs and media scheduling templates for promotional runs.",
    tags: ["Log Coordination", "Media Timelines", "Scheduling"],
    color: "#ec4899",
    linkedin: "https://www.linkedin.com/in/saumy-chaurasia/",
    cropStyle: {
      backgroundImage: `url(${saumy})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  },
  {
    name: "Mansi Ranjan",
    role: "Social Media Lead",
    category: "social_media",
    badge: "SOCIAL",
    dept: "Computer Science & Engineering · 4th Year",
    bio: "Digital strategist shaping Nexus's online presence, ensuring placement announcements visual templates look clean.",
    tags: ["Social Media Marketing", "Analytics", "Brand Growth"],
    color: "#22c55e", // Green
    linkedin: "https://www.linkedin.com/in/mansi-ranjan-6873113aa/",
    cropStyle: {
      backgroundImage: `url(${mansi})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  },
  {
    name: "Sumaiya Khan",
    role: "Social Media Co-Lead",
    category: "social_media",
    badge: "SOCIAL",
    dept: "Computer Science & Engineering · 3rd Year",
    bio: "Content creator co-managing visual branding and design posts, keeping target audience engaged daily.",
    tags: ["Graphic Design", "Scheduling", "Community Support"],
    color: "#22c55e",
    linkedin: "https://www.linkedin.com/in/sumaiya-khan-a9b017328/",
    cropStyle: {
      backgroundImage: `url(${sumaiya})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  }
];

const FamilyContent = ({ onAbort }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [animate, setAnimate] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredMembers = TEAM_MEMBERS.filter(member => {
    if (activeFilter === 'all') return true;
    return member.category === activeFilter;
  });

  const getFilterCounts = (category) => {
    if (category === 'all') return TEAM_MEMBERS.length;
    return TEAM_MEMBERS.filter(m => m.category === category).length;
  };

  const handleFilterChange = (filter) => {
    setAnimate(false);
    setActiveFilter(filter);
    setTimeout(() => setAnimate(true), 100);
  };

  const filters = [
    { id: 'all', label: 'All Members', color: '#00ffff' },
    { id: 'leadership', label: 'Leadership & Core', color: '#eab308' },
    { id: 'technical', label: 'Technical Team', color: '#3b82f6' },
    { id: 'content_pr', label: 'Content & PR', color: '#ec4899' },
    { id: 'social_media', label: 'Social Media', color: '#22c55e' }
  ];

  return (
    <div className="lp-page" style={{ padding: "0 2rem 5rem" }}>
      {/* Back button */}
      <div className="portal-back-btn" onClick={onAbort} style={{ position: "fixed", top: "1.5rem", left: "2rem", zIndex: 1010 }}>
        <span className="back-arrow">←</span>
        <span>Back to Nexus</span>
      </div>

      {/* Hero row with title and counts */}
      <div className="family-header-row">
        <div className="family-title-box">
          <span className="family-title-prefix">Meet the</span>
          <h1 className="family-main-title">People Behind Nexus</h1>
        </div>
        <div className="family-active-badge">
          <span className="badge-icon">👤</span>
          <span>{TEAM_MEMBERS.length} Active Team Members</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="family-tabs-container">
        {filters.map(filter => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              className={`family-tab ${isActive ? 'active' : ''}`}
              style={isActive ? { '--tab-color': filter.color } : {}}
              onClick={() => handleFilterChange(filter.id)}
            >
              <span className="family-tab-dot" style={{ backgroundColor: filter.color }} />
              <span>{filter.label}</span>
              <span className="family-tab-count">{getFilterCounts(filter.id)}</span>
            </button>
          );
        })}
      </div>

      {/* Members Grid */}
      <div className="family-grid-new">
        {filteredMembers.map((member, idx) => {
          const entryDir = idx % 2 === 0 ? 'pos-left' : 'pos-right';
          return (
            <div
              key={member.name}
              className={`family-card-new glass-card ${entryDir} ${animate ? 'visible' : ''}`}
              style={{ transitionDelay: `${(idx % 6) * 80}ms` }}
            >
              {/* Header row: Avatar and Pill */}
              <div className="card-header-row">
                <div
                  className="card-avatar"
                  style={{
                    borderColor: member.color,
                    boxShadow: `0 0 15px ${member.color}25`,
                    ...member.cropStyle
                  }}
                />
                <div
                  className="card-role-badge"
                  style={{
                    color: member.color,
                    borderColor: `${member.color}35`,
                    backgroundColor: `${member.color}0a`
                  }}
                >
                  {member.badge || member.category.toUpperCase().replace('_', ' ')}
                </div>
              </div>

              {/* Name, Subtitle & Dept */}
              <div className="card-info-box">
                <h3 className="card-name">{member.name}</h3>
                <div className="card-role-title" style={{ color: member.color }}>{member.role}</div>
                <div className="card-dept">{member.dept}</div>
                <p className="card-bio">{member.bio}</p>
              </div>

              {/* Skill Tags */}
              <div className="card-tags-row">
                {member.tags.slice(0, 3).map((tag, tIdx) => (
                  <span key={tIdx} className="card-tag-pill">{tag}</span>
                ))}
                {member.tags.length > 3 && (
                  <span className="card-tag-extra">+{member.tags.length - 3}</span>
                )}
              </div>

              {/* Card Footer: Social Icons and Profile CTA */}
              <div className="card-footer-row">
                <div className="card-social-icons">
                  {member.linkedin && (
                    <a href={member.linkedin} className="card-social-btn" target="_blank" rel="noopener noreferrer">
                      <span className="social-icon-in">in</span>
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="card-social-btn">
                      <span className="social-icon-mail">✉</span>
                    </a>
                  )}
                </div>
                <button
                  className="card-profile-btn"
                  style={{
                    borderColor: `${member.color}40`,
                    color: member.color
                  }}
                  onClick={() => setSelectedMember(member)}
                >
                  Profile →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Return button */}
      <div className="lp-footer-cta" style={{ marginTop: "4rem" }}>
        <button className="portal-return-btn" onClick={onAbort}>Return to Home</button>
      </div>

      {/* Detailed Profile View Modal */}
      {selectedMember && (
        <MemberDetailsModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </div>
  );
};

// ─── Detailed Profile Modal Component ──────────────────────────────────────
const MemberDetailsModal = ({ member, onClose }) => {
  if (!member) return null;

  return (
    <div className="member-modal-overlay">
      <div className="member-modal-container glass-card animate-zoom-in">
        {/* Close/Back Button */}
        <button className="member-modal-close" onClick={onClose}>
          <span className="close-arrow">←</span> Back to Team
        </button>

        {/* Header Profile Section */}
        <div className="member-modal-header">
          <div
            className="member-modal-avatar"
            style={{
              borderColor: member.color,
              boxShadow: `0 0 25px ${member.color}35`,
              ...member.cropStyle
            }}
          />
          <div className="member-modal-title-info">
            <span className="member-modal-dept" style={{ color: member.color }}>{member.dept}</span>
            <h2 className="member-modal-name">{member.name}</h2>
            <div className="member-modal-role">{member.role}</div>
            
            <div className="member-modal-socials">
              {member.linkedin && (
                <a href={member.linkedin} className="member-modal-social-btn" target="_blank" rel="noopener noreferrer">
                  <span className="social-icon-in">in</span>
                  <span>LinkedIn</span>
                </a>
              )}
              {member.instagram && (
                <a href={member.instagram} className="member-modal-social-btn" target="_blank" rel="noopener noreferrer">
                  <span className="social-icon-ig">📷</span>
                  <span>Instagram</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="member-modal-grid">
          {/* About Section */}
          <div className="member-modal-section modal-span-left">
            <h4 className="modal-section-title">ABOUT</h4>
            <div className="modal-section-card glass-card">
              <p>{member.bio || `Core member driving excellence at Nexus Technical Club.`}</p>
            </div>
          </div>

          {/* Projects Section */}
          <div className="member-modal-section modal-span-right">
            <h4 className="modal-section-title">PROJECTS</h4>
            <div className="modal-section-card glass-card project-card-layout">
              <span className="folder-icon">📁</span>
              <div>
                <h5 className="project-title">{member.projectTitle || "Nexus Outreach"}</h5>
                <p className="project-desc">{member.projectDesc || "Expanded community program to multiple colleges and departments."}</p>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="member-modal-section modal-span-left">
            <h4 className="modal-section-title">SKILLS & EXPERTISE</h4>
            <div className="modal-section-card glass-card skills-flex-layout">
              {member.tags.map((tag, idx) => (
                <span key={idx} className="card-tag-pill modal-skill-tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="member-modal-section modal-span-right">
            <h4 className="modal-section-title">ACHIEVEMENTS</h4>
            <div className="modal-section-card glass-card achievement-card-layout">
              <span className="trophy-icon">🏆</span>
              <div>
                <h5 className="achievement-title">{member.achievement || member.role}</h5>
                <p className="achievement-desc">Recognized core leader at Nexus Technical Club.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  family: {
    letter: 'F',
    name: 'Family',
    tagline: 'Meet the core team and builders of Nexus',
    color1: '#00ffff',
    color2: '#ff6b9d',
    emissive1: '#00e5ff',
    emissive2: '#ff3366',
  },
  bugarena: {
    letter: 'B',
    name: 'Bug Arena',
    tagline: 'Code exchange & bug hunting challenge',
    color1: '#ff6b6b',
    color2: '#00ffff',
    emissive1: '#ff3333',
    emissive2: '#00e5ff',
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
  // Separate progress ref for the learning portal — driven by IntersectionObserver
  // instead of scroll, so the L only assembles when the hero heading is visible.
  const assemblyProgressRef = useRef(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  // The ref that actually drives the 3D particles
  const activeProgressRef = target === 'learning' ? assemblyProgressRef : scrollProgressRef;

  // Reset learning assembly progress whenever the portal target changes
  useEffect(() => {
    assemblyProgressRef.current = 0;
  }, [target]);

  // Handle scroll inside the portal to control assembly progress (non-learning)
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
          <PortalStars />
        </Canvas>
      </div>

      {/* Scrollable content overlay */}
      <div className="portal-scroll-container" ref={scrollContainerRef}>

        {target === 'learning' ? (
          /* ── Learning: show content immediately, no intro / spacer ── */
          <LearningContent onAbort={onAbort} assemblyProgressRef={assemblyProgressRef} />
        ) : target === 'events' ? (
          /* ── Events: show events list with Quizathon as 1st event ── */
          <Events onAbort={onAbort} />
        ) : target === 'bugarena' ? (
          /* ── Bug Arena: code exchange & bug hunt ── */
          <BugArena onAbort={onAbort} />
        ) : target === 'puzzles' ? (
          /* ── Puzzles: show content immediately, no intro / spacer ── */
          <Puzzles onAbort={onAbort} />
        ) : target === 'family' ? (
          /* ── Family: show content immediately, no intro / spacer ── */
          <FamilyContent onAbort={onAbort} />
        ) : (
          /* ── Other portals: intro → scroll spacer → assembled cards ── */
          <>
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
          </>
        )}
      </div>

      {/* Scanlines */}
      <div className="scanlines"></div>
    </div>
  );
};

export default RedirectPortal;
