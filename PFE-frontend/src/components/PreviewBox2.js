import React from 'react';

const PreviewBox = () => (
  <div
    style={{
      border: '1px solid #ddd',
      borderRadius: '12px',
      height: '600px',
      width: '100%',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
    }}
  >
    <iframe
      src="http://localhost:3000/filecontent2"
      title="Live Preview"
      width="100%"
      height="100%"
      style={{
        border: 'none',
        display: 'block',
      }}
    />
  </div>
);

export default PreviewBox;
