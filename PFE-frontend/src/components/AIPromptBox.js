import React from 'react';

const AIPromptBox = ({ prompt, setPrompt, handleAIUpdate, loadingAI, children }) => (
  <div style={{ margin: '3rem 0 1rem 2rem', position: 'relative' }}>
    <label
      htmlFor="ai-prompt"
      style={{
        fontWeight: '600',
        fontSize: '2rem',
        marginBottom: '0.5rem',
        display: 'block',
        fontFamily: 'Fira Sans, sans-serif',
        color: 'orange',
        textAlign: 'center',
      }}
    >
      Modifier avec l'IA
    </label>

    <div style={{ position: 'relative' }}>
      <textarea
        id="ai-prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        placeholder="Décrivez ce que vous souhaitez modifier dans le code..."
        style={{
          width: '100%',
          padding: '0.9rem 2.5rem 0.9rem 0.9rem', // padding-right to make room for icon
          fontSize: '1rem',
          fontFamily: 'inherit',
          borderRadius: '30px',
          border: '1px solid #ccc',
          resize: 'none',
          marginBottom: '1rem',
          backgroundColor: '#fff',
          boxSizing: 'border-box',
        }}
      />

      {/* 📎 Icon inside textarea box, bottom-right */}
      <div
        style={{
          position: 'absolute',
          bottom: '22px',
          right: '12px',
          right: '-3px',
          zIndex: 2,
        }}
      >
        {children}
      </div>
    </div>

    <div style={{ textAlign: 'center' }}>
      <button
        onClick={handleAIUpdate}
        disabled={loadingAI}
        style={{
          padding: '0.6rem 1.2rem',
          fontSize: '1rem',
          backgroundColor: loadingAI ? '#888' : '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: loadingAI ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.3s ease',
        }}
      >
        {loadingAI ? 'Traitement...' : 'Génerer'}
      </button>
    </div>
  </div>
);

export default AIPromptBox;
