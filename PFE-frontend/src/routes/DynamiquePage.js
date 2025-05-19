import React, { Suspense, lazy, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { trackVisit } from '../services/api';

const DynamiquePage = () => {
  const { pageName } = useParams(); 
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();

    const handleBeforeUnload = () => {
      const endTime = Date.now();
      trackVisit({
        pageName,
        startTime: startTimeRef.current,
        endTime: endTime,
      });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      const endTime = Date.now();
      trackVisit({
        pageName,
        startTime: startTimeRef.current,
        endTime: endTime,
    });
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };

  }, [pageName]); 


  if (!pageName) {
    return <div>Page non trouvée</div>;
  }

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const capitalizedPageName = capitalize(pageName);
  const PageComponent = lazy(() => import(`../pages/${capitalizedPageName}.js`));

  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <PageComponent />
    </Suspense>
  );
};

export default DynamiquePage;
