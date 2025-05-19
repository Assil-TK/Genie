import React from 'react';

const EventAnnouncement = () => {
  return (
    <div style={{ fontFamily: 'Fira Sans', backgroundColor: '#F5F5F6', padding: '20px' }}>
      <h1 style={{ color: '#1B374C', marginBottom: '15px' }}>Announcement</h1>
      <p style={{ color: '#333', marginBottom: '15px' }}>Join us for the Annual Tech Conference on December 15th, 2023!</p>
      <button style={{ backgroundColor: '#F39325', color: '#fff', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
        Register Now
      </button>
    </div>
  );
};

export default EventAnnouncement;