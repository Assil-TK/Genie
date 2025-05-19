import React from "react";
import { Container, Typography, Button, Box, Card, CardMedia, CardContent, Accordion, AccordionSummary, AccordionDetails, Paper, Grid, AppBar, Toolbar, Icon, List, ListItem } from "@mui/material"; 
import EditableWrapper from "../components/EditableWrapper";
import { Link } from "react-router-dom";
//pour la creation des pages
export const createElementFromJson = (element, key) => {
  if (!element || !element.type) return null;

  const componentsMap = {
    container: Container,
    typography: Typography,
    button: Button,
    box: Box,
    card: Card,
    grid: Grid,
    image: "img",
    paper: Paper,
    cardmedia: CardMedia,
    cardcontent: CardContent,
    accordion: Accordion,
    accordionsummary:AccordionSummary,
    accordiondetails: AccordionDetails,
    appBar: AppBar,
    toolBar: Toolbar,
    link: Link,
    icon: Icon,
    list: List,
    listitem: ListItem,
  };

  const Component = componentsMap[element.type.toLowerCase()] || "div";

  let children = element.children;
  if (typeof children === "string") {
    children = children; // Assurer que le texte est affiché
  } else if (Array.isArray(children)) {
    children = children.map((child, index) => createElementFromJson(child, `${key}-${index}`));
  }
  return (
    <Component key={key} {...element.props}>
      {children}
     
    </Component>
  );
};
//pour le mode edit : les elements enveloppés
export const 
createEditableElementFromJson = (element, path = "0", onSelect, onAdd, onDuplicate) => {
  if (!element || !element.type) return null;

  const componentsMap = {
    container: Container,
    paper: Paper,
    typography: Typography,
    button: Button,
    box: Box,
    card: Card,
    grid: Grid,
    image: "img",
    cardmedia: CardMedia,
    cardcontent: CardContent,
    accordion: Accordion,
    accordionsummary: AccordionSummary,
    accordiondetails: AccordionDetails,
    appBar: AppBar,
    link: Link,
    toolBar: Toolbar,
    icon: Icon,
    list: List,
    listitem: ListItem,
  };

  const Component = componentsMap[element.type.toLowerCase()] || "div";
  
  let children = null;
  if (typeof element.children === "string") {
    children = element.children;
  } else if (Array.isArray(element.children)) {
    children = element.children.map((child, index) =>
      createEditableElementFromJson(child, `${path}-${index}`, onSelect, onAdd, onDuplicate)
    );
  }
  const isContainer = element.type.toLowerCase() === "container";
  return (
    <EditableWrapper 
    onEdit={(e) => { e && e.stopPropagation(); onSelect && onSelect(path, element); }}
    onDuplicate={() => onDuplicate && onDuplicate(path, element)}
    onAdd={() => onAdd && onAdd(path)}
    isContainer={isContainer}
    key={path}
    >
      <Component {...element.props}>
        {children}
      </Component>
    </EditableWrapper>
   
  );
};
