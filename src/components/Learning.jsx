import React, { useState } from 'react';

const Learning = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Web3', 'AI & ML', 'Cybersecurity', 'Web Dev'];

  const resources = [
    {
      id: 1,
      title: 'Solidity & Smart Contract Developer Path',
      description: 'A complete developer road map to writing secure, optimized smart contracts on Ethereum.',
      category: 'Web3',
      link: '#',
      level: 'Intermediate',
    },
    {
      id: 2,
      title: 'Introduction to Neural Networks & PyTorch',
      description: 'Understand the mathematical foundations of neural networks and build your first models in PyTorch.',
      category: 'AI & ML',
      link: '#',
      level: 'Beginner',
    },
    {
      id: 3,
      title: 'OWASP Top 10 Web App Security Risks',
      description: 'A deep dive into common web application vulnerabilities and how to prevent them during development.',
      category: 'Cybersecurity',
      link: '#',
      level: 'Advanced',
    },
    {
      id: 4,
      title: 'Mastering Modern React & Three.js',
      description: 'Learn how to combine React, Vite, and Three.js using React Three Fiber to build stunning 3D websites.',
      category: 'Web Dev',
      link: '#',
      level: 'Advanced',
    },
    {
      id: 5,
      title: 'Large Language Models (LLMs) API Tutorial',
      description: 'Step-by-step instructions on orchestrating multi-agent systems using OpenAI, Anthropic, and Gemini APIs.',
      category: 'AI & ML',
      link: '#',
      level: 'Intermediate',
    },
  ];

  const filteredResources = resources.filter((res) => {
    const matchesSearch = res.title.toLowerCase().includes(search.toLowerCase()) || 
                          res.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || res.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <h2>Learning Resources</h2>
      
      <div className="learning-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search learning materials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <div className="filter-tags">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-tag ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="learning-grid">
        {filteredResources.length > 0 ? (
          filteredResources.map((res) => (
            <div key={res.id} className="glass-card learning-card">
              <span className="learning-card-tag">{res.category}</span>
              <h3 style={{ fontSize: '1.3rem', margin: '0.5rem 0' }}>{res.title}</h3>
              <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}>{res.description}</p>
              
              <div className="learning-card-meta">
                <span style={{ color: 'var(--color-text-dim)' }}>Level: {res.level}</span>
                <a href={res.link} className="learning-card-link" onClick={(e) => {
                  e.preventDefault();
                  alert(`Accessing ${res.title}. Link placeholder.`);
                }}>
                  View Material →
                </a>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--color-text-dim)', padding: '2rem' }}>
            No resources match your search criteria.
          </div>
        )}
      </div>
    </>
  );
};

export default Learning;
