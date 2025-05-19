import React, { useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, List, ListItem, ListItemText } from "@mui/material";

const CustomTreeView = ({ data, onSelect }) => {
  // useState(id : booléen)
  const [openItems, setOpenItems] = useState({});

  // Inverse l'état d'ouverture d'un nœud
  const handleToggle = (id) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // afficher treeview
  const renderTree = (nodes) => {
    return nodes.map((node) => (
      <React.Fragment key={node.id}>
        <ListItem
          button
          onClick={(e) => {
            //éviter des déclenchements multiples
            e.stopPropagation();
            if (node.children && node.children.length > 0) {
              handleToggle(node.id);
            } else {
              console.log("Page selectionnée :", node)
              onSelect && onSelect(node);
            }
          }}
        >
          <ListItemText primary={node.label || "sans nom"} />
          {node.children && node.children.length > 0 && (openItems[node.id] ? <ExpandLess /> : <ExpandMore />)}
        </ListItem>
        {/* Si le nœud a des enfants, on les affiche récursivement dans un Collapse */}
        {node.children && node.children.length > 0 && (
          <Collapse in={openItems[node.id]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {renderTree(node.children)}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    ));
  };

  return <List>{renderTree(data)}</List>;
};

export default CustomTreeView;