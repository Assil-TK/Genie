import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";

function PageTwo() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#F5F5F6", fontFamily: "Fira Sans" }}>
      <Typography variant="h5">Page Two</Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        Go to Page 1
      </Button>
      <Typography variant="body1" gutterBottom>
        Bonjour Assil et Yasmine
      </Typography>
    </div>
  );
}

export default PageTwo;