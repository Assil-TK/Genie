import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";

const PageTwo = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px", textAlign: "center", fontFamily: 'Fira Sans' }}>
      <Typography variant="h4">Page Two</Typography>
      <Button
        sx={{ mt: 2, backgroundColor: '#1B374C', color: '#FFF', '&:hover': { backgroundColor: '#F39325' } }}
        onClick={() => navigate("/")}
      >
        Go to Page One
      </Button>
      <Typography variant="body1" sx={{ mt: 1, color: '#1B374C' }}>
        Hellooo hmdlhhhh
      </Typography>
    </div>
  );
};

export default PageTwo;