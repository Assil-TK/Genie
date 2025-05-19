import React, { useEffect, useState} from 'react';
import { getAllProjects } from '../services/api';
import { useProject } from '../contexts/ProjectContext';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ProjectSelector = () => {
    const { activeProject, updateActiveProject } = useProject();
    const [projects, setProjects] = useState([]);
  
    useEffect(() => {
      getAllProjects()
        .then(setProjects)
        .catch(err => console.error(err));
    }, []);
  
    const handleChange = (e) => {
      updateActiveProject(e.target.value);
    };
  
    return (
      <FormControl fullWidth sx={{ m: 2 }}>
        <InputLabel>Projet actif</InputLabel>
        <Select
          value={activeProject?.id || ''}
          label="Projet actif"
          onChange={handleChange}
        >
          {projects.map(projet => (
            <MenuItem key={projet.id} value={projet.id}>
              {projet.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };
  
  export default ProjectSelector;