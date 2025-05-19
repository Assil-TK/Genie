import React from 'react';

const AIPromptBox = ({ prompt, setPrompt, handleAIUpdate, loadingAI }) => (
  <div style={{ margin: '3rem 0 1rem 2rem' }}>
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

    <textarea
      id="ai-prompt"
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      rows={5}
      placeholder="Décrivez ce que vous souhaitez modifier dans le code..."
      style={{
        width: '100%',
        padding: '0.9rem',
        fontSize: '1rem',
        fontFamily: 'inherit',
        borderRadius: '8px',
        border: '1px solid #ccc',
        resize: 'none',
        marginBottom: '1rem',
        backgroundColor: '#fff',
      }}
    />

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
