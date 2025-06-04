import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom"; // Ajoutez cette importation
import 'bootstrap/dist/css/bootstrap.min.css';


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter> 
      <CssBaseline />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
