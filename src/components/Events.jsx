import React from 'react';

const Events = () => {
  const events = [
    {
      id: 1,
      title: 'Decentralized Apps (dApps) Workshop',
      date: 'July 15, 2026',
      description: 'Learn how to build smart contracts, deploy them on chain, and connect a React frontend.',
      align: 'left',
    },
    {
      id: 2,
      title: 'Guest Lecture: The Rise of AI Agents',
      date: 'August 02, 2026',
      description: 'A deep dive into Autonomous AI agents, prompt engineering, and LLM integrations in production.',
      align: 'right',
    },
    {
      id: 3,
      title: 'Hackathon Prep & Ideation Session',
      date: 'August 20, 2026',
      description: 'Form teams, pitch ideas, and get mentorship ahead of the upcoming Nexus Hackathon.',
      align: 'left',
    },
    {
      id: 4,
      title: 'Intro to CTF & Cyber Security',
      date: 'September 05, 2026',
      description: 'Hands-on training session on web security, cryptography, and reverse engineering basics.',
      align: 'right',
    },
  ];

  return (
    <>
      <h2>Upcoming Events</h2>
      <div className="timeline" style={{ width: '100%' }}>
        {events.map((event) => (
          <div key={event.id} className={`timeline-item ${event.align}`}>
            <div className="timeline-content">
              <div className="timeline-date">{event.date}</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>
                {event.title}
              </h3>
              <p style={{ fontSize: '0.95rem' }}>{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Events;
