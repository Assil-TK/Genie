import React, { act, useEffect, useState } from 'react';
import { fetchFileList } from '../services/api';
import EditablePreview from './EditablePreview';
import { Alert, Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import {useProject} from '../contexts/ProjectContext';
import ProjectSelector from './ProjectSelector';

const PageSelector = () => {
  const [files, setFiles] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const {activeProject} = useProject();
  useEffect(() => {
      const loadFiles = async () => {
        if (!activeProject) return;
        try {
          const fileList = await fetchFileList(activeProject);
          setFiles(fileList);
        } catch (err) {
            console.error('Erreur chargement des pages', err);
        }
      };
      loadFiles();
    }, [activeProject]);

  return (
    <Box sx={{ padding: '2rem', textAlign: 'center' }}>
      <Typography variant='h4' sx={{fontFamily:'Poppins', color:'#F39325',  marginBottom: '1.5rem'}} >Modification de pages</Typography>
      <ProjectSelector />
      {!activeProject ? (
        <Alert severity="warning" sx={{ maxWidth: 500, margin: '0 auto' }}>
          Aucun projet sélectionné. Veuillez sélectionner un projet pour modifier ses pages.
        </Alert>
      ) : (
        <>
      <FormControl fullWidth sx={{ maxWidth: 400, margin: '0 auto' }}>
                <InputLabel id="select-page-label">Choisir une page</InputLabel>
                <Select
                    labelId="select-page-label"
                    value={selectedPage}
                    onChange={(e) => setSelectedPage(e.target.value)}
                    label="Choisir une page"
                    sx={{
                        padding: '10px', 
                        backgroundColor: '#f5f5f5', 
                        borderRadius: '8px',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px', 
                            fontSize: '16px',
                            fontFamily: 'Poppins, sans-serif'
                        },
                        '& .MuiSelect-icon': {
                            color: '#F39325',
                        },
                    }}
                >
                    <MenuItem value="">-- Choisir une page --</MenuItem>
                    {files.map((file) => (
                        <MenuItem key={file} value={file}>{file}</MenuItem>
                    ))}
                </Select>
            </FormControl>
      {selectedPage && <EditablePreview pageName={selectedPage} />}
      </>
      )}
    </Box>
  );
};

export default PageSelector;
