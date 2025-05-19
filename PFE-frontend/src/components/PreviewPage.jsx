// src/components/PreviewPage.jsx
import React from 'react';

const pages = require.context('../pages', false, /\.js$/);

const PreviewPage = ({ pageName }) => {
  if (!pageName) return <div>Sélectionnez une page à prévisualiser</div>;

  try {
    const Component = pages(`./${pageName}.js`).default;
    return (
      <div style={{ border: '1px solid #ccc', marginTop: '20px', padding: '20px' }}>
        <Component />
      </div>
    );
  } catch (error) {
    return <div style={{ color: 'red' }}>Erreur lors du chargement de {pageName}</div>;
  }
};

export default PreviewPage;

