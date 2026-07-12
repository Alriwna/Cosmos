import React, { useState } from 'react';

const Puzzles = () => {
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('none');

  const checkAnswer = (e) => {
    e.preventDefault();
    if (answer.trim().toLowerCase() === 'nexus') {
      setStatus('correct');
    } else {
      setStatus('incorrect');
    }
  };

  return (
    <>
      <h2>Weekly Puzzle Challenge</h2>
      <p style={{ textAlign: 'center', marginBottom: '2.5rem', maxWidth: '600px' }}>
        Unlock exclusive resources and bragging rights. Crack the system security key below.
      </p>
      
      <div className="puzzle-container">
        <div className="puzzle-terminal">
          <div className="terminal-header">
            <div className="terminal-dot dot-red"></div>
            <div className="terminal-dot dot-yellow"></div>
            <div className="terminal-dot dot-green"></div>
            <div className="terminal-title">nexus-terminal v1.0.4</div>
          </div>
          <div className="terminal-body">
            <div className="puzzle-prompt">
              $ cat encrypted_key.txt
            </div>
            <div className="puzzle-code">
              Cipher Type: Caesar (Shift +3){'\n'}
              Encrypted String: "QHAXV"
            </div>
            <div className="puzzle-prompt">
              $ enter_decrypted_key --value:
            </div>
            
            <form onSubmit={checkAnswer} className="puzzle-input-group">
              <input
                type="text"
                className="puzzle-input"
                placeholder="Type decrypted key..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <button type="submit" className="puzzle-submit">
                Decrypt
              </button>
            </form>

            {status !== 'none' && (
              <div className="puzzle-feedback">
                {status === 'correct' ? (
                  <span className="feedback-success">
                    ▶ ACCESS GRANTED: "NEXUS" verified. Decryption complete! Welcome to the club.
                  </span>
                ) : (
                  <span className="feedback-error">
                    ▶ ACCESS DENIED: Decryption failed. Key is invalid.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Puzzles;
