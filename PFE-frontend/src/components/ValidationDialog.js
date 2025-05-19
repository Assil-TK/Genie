import React from 'react';
import PreviewContainer from './PreviewContainer';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const ValidationDialog = ({ open, onClose, generatedJson, onValidate, onRectify }) => {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle>Prévisualisation de la page générée</DialogTitle>
        <DialogContent dividers>
          <PreviewContainer generatedJson={generatedJson} />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={onRectify}>
            Rectifier
          </Button>
          <Button variant="contained" color="primary" onClick={onValidate}>
            Valider
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ValidationDialog;
  