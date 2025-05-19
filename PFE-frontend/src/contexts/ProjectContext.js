import React, { createContext, useContext, useState, useEffect } from 'react';
import { getActiveProject, setActiveProject as apiSetActiveProject } from '../services/api';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    getActiveProject()
      .then(setActiveProject)
      .catch(() => setActiveProject(null));
  }, []);

  const updateActiveProject = async (projectId) => {
    const project = await apiSetActiveProject(projectId);
    setActiveProject(project);
  };

  return (
    <ProjectContext.Provider value={{ activeProject, updateActiveProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
