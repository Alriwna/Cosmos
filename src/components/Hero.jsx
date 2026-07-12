import React from 'react';

const Hero = ({ onExplore }) => {
  return (
    <section id="home">
      <div className="hero-content">
        <span className="hero-tag">Welcome to Nexus Tech Club</span>
        <h1>Innovating Onchain & Beyond</h1>
        <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
          We are a community of developers, designers, and creators building the future. Join us to learn, build hackathons, solve weekly puzzles, and access premium resource repositories.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => onExplore('events')}>
            Explore Events
          </button>
          <button className="btn-secondary" onClick={() => onExplore('puzzles')}>
            Solve Puzzles
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
