import React, { useState, useEffect } from 'react';
import lampGif from '../assets/lamp (3).gif'; // Make sure the path is correct

const PreviewBox = () => {
  const [showIframe, setShowIframe] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIframe(true);
    }, 7000); // ⏱️ Show iframe after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '12px',
        height: '600px',
        width: '100%',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {showIframe ? (
        <iframe
          src="http://localhost:3000/filecontent3"
          title="Live Preview"
          width="100%"
          height="100%"
          style={{ border: 'none', display: 'block' }}
        />
      ) : (
        <img
          src={lampGif}
          alt="Loading animation"
          style={{
            width: '200px', // 🎯 Control width here
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      )}
    </div>
  );
};

export default PreviewBox;
