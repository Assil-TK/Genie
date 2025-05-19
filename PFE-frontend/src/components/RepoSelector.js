// components/RepoSelector.js
import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const RepoSelector = ({ repos, selectedRepo, onSelectRepo }) => {
  return (
    <Box sx={{ mb: 2, maxWidth: 800, mx: 'auto' ,marginTop:8}}>
      <Typography variant="h5" align="center" sx={{ fontWeight: 'bold',fontFamily: 'Fira Sans, sans-serif', color: 'grey', mb: 2 }}>
        Sélectionnez un dépôt
      </Typography>

      <FormControl fullWidth>
        <InputLabel id="repo-select-label">Dépôt</InputLabel>
        <Select
          labelId="repo-select-label"
          value={selectedRepo}
          label="Dépôt"
          onChange={(e) => onSelectRepo(e.target.value)}
          sx={{
            borderRadius: 2,
            backgroundColor: 'white',
            boxShadow: 1,
          }}
        >
          <MenuItem value="">
            <em>-- Sélectionner un dépôt --</em>
          </MenuItem>
          {repos.map((repo) => (
            <MenuItem key={repo.id} value={repo.name}>
              {repo.name} ({repo.private ? 'Privé' : 'Public'})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default RepoSelector;
