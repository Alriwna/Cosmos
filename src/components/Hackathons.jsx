import React from 'react';

const Hackathons = () => {
  const hackathons = [
    {
      id: 1,
      title: 'Nexus Hackathon 2026',
      status: 'upcoming',
      description: 'Our flagship annual hackathon bringing together builders from all branches to solve real-world challenges.',
      dates: 'Oct 12 - Oct 14, 2026',
      prizes: '$5,000 Total Pool',
      teamSize: '2 - 4 Members',
    },
    {
      id: 2,
      title: 'AI Catalyst Mini Hack',
      status: 'live',
      description: 'A 24-hour sprint focused on building innovative AI-driven apps or agents using open-source models.',
      dates: 'July 25 - July 26, 2026',
      prizes: '$1,500 Total Pool',
      teamSize: 'Individual or Duo',
    },
  ];

  return (
    <>
      <h2>Hackathons</h2>
      <div className="hackathon-grid">
        {hackathons.map((hack) => (
          <div key={hack.id} className="glass-card hackathon-card">
            <div>
              <span
                className={`hackathon-badge ${
                  hack.status === 'live' ? 'badge-live' : 'badge-upcoming'
                }`}
              >
                {hack.status}
              </span>
              <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0 1rem 0', color: '#fff' }}>
                {hack.title}
              </h3>
              <p>{hack.description}</p>
            </div>
            <div>
              <ul className="hackathon-details">
                <li>
                  <strong>Dates:</strong> {hack.dates}
                </li>
                <li>
                  <strong>Prizes:</strong> {hack.prizes}
                </li>
                <li>
                  <strong>Team Size:</strong> {hack.teamSize}
                </li>
              </ul>
              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => alert(`Registration details for ${hack.title} will be sent to your email.`)}
              >
                {hack.status === 'live' ? 'Register Now' : 'Pre-Register'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Hackathons;
