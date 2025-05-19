// components/FileTree.js
import React from 'react';

import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Collapse,
  Box,
  Typography
} from '@mui/material';
import {
  Folder,
  FolderOpen,
  InsertDriveFile,
  ExpandMore,
  ExpandLess,
  Edit,
  Add,
  Delete
} from '@mui/icons-material';

const FileTree = ({
  files,
  parentPath = '',
  openFolders,
  handleFileClick,
  handleEditClick,
  handleDeleteFile,
  toggleFolder,
  fileContent,
  handleNewFileClick
}) => {
  const editableParentFolders = ['pages', 'page', 'components', 'component'];
  const editableExtensions = ['.js', '.jsx'];

  const isEditable = (filePath) => {
    const parts = filePath.split('/').filter(Boolean);
    const parentFolder = parts[parts.length - 2];
    const fileName = parts[parts.length - 1];

    const hasValidParent = editableParentFolders.includes(parentFolder?.toLowerCase());
    const hasValidExtension = editableExtensions.some(ext => fileName.toLowerCase().endsWith(ext));

    return hasValidParent && hasValidExtension;
  };

  const getNewItemLabel = (folderName) => {
    const name = folderName.toLowerCase();
    if (name === 'page' || name === 'pages') return 'Nouvelle Page';
    if (name === 'component' || name === 'components') return 'Nouveau Composant';
    return 'Nouvel Élément';
  };

  const renderTree = (nodes, currentPath = '') => (
    <List component="nav" disablePadding>
      {(Array.isArray(nodes) ? nodes : []).map((file) => {
        const filePath = `${currentPath}/${file.name}`;
        const isOpen = openFolders[filePath];
        const isFolderEditable = editableParentFolders.includes(file.name.toLowerCase());

        if (file.type === 'file') {
          const showEdit = isEditable(filePath);
          return (
            <ListItem
              key={file.sha}
              secondaryAction={
                showEdit && (
                  <>
                    <IconButton edge="end" onClick={() => handleEditClick(filePath, fileContent)}>
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDeleteFile(filePath)}>
                      <Delete color="error" />
                    </IconButton>
                  </>
                )
              }
              sx={{ pl: 4 }}
              button
              onClick={() => handleFileClick(filePath)}
            >
              <ListItemIcon>
                <InsertDriveFile sx={{ color: showEdit ? '#90caf9' : '#ccc' }} />
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                primaryTypographyProps={{ color: showEdit ? 'textPrimary' : 'textSecondary' }}
              />
            </ListItem>
          );
        } else if (file.type === 'dir') {
          return (
            <React.Fragment key={file.sha}>
              <ListItem
                button
                onClick={() => toggleFolder(filePath)}
                sx={{ pl: 2 }}
              >
                <ListItemIcon>
                  {isOpen ? <FolderOpen color="primary" /> : <Folder color="primary" />}
                </ListItemIcon>
                <ListItemText primary={file.name} />
                {isOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Box sx={{ pl: 3 }}>
                  {isFolderEditable && (
                    <ListItem
                      sx={{ pl: 2, backgroundColor: '#f3e5f5', borderRadius: 1, mb: 1 }}
                      secondaryAction={
                        <IconButton edge="end" onClick={() => handleNewFileClick(filePath)}>
                          <Add sx={{ color: '#8e24aa' }} />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        <InsertDriveFile sx={{ color: '#ba68c8' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={getNewItemLabel(file.name)}
                        primaryTypographyProps={{ fontStyle: 'italic', color: '#6a1b9a' }}
                      />
                    </ListItem>
                  )}

                  {file.children && renderTree(file.children, filePath)}
                </Box>
              </Collapse>
            </React.Fragment>
          );
        }

        return null;
      })}
    </List>
  );

  return (
    <Box
      sx={{
        mx: 'auto',
        width: '80%',
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        p: 2,
        backgroundColor: '#fafafa',
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
        Explorateur de Fichiers
      </Typography>
      {renderTree(files, parentPath)}
    </Box>
  );
};

export default FileTree;
