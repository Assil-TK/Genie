// Auto-generated preview
import '../components/blockNavigation';
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { styled } from "@mui/system";
import { Typography } from "@mui/material";
const image = "https://raw.githubusercontent.com/Assil-TK/test/main/src/pages/../assets/2024-02-05 (1).png";


const RedButton = styled(Button)({
  backgroundColor: 'red',
  '&:hover': {
    backgroundColor: '#F39325',
  },
});

function PageTwo() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px", textAlign: "center", backgroundColor: '#F5F5F6', fontFamily: 'Fira Sans' }}>
      <h1>Page Two</h1>
      <RedButton
        variant="contained"
        onClick={() => navigate("/")}
        sx={{ fontFamily: 'Fira Sans' }}
      >
        Go to Page 1
      </RedButton>
      <Typography sx={{ fontFamily: 'Fira Sans', color: '#1B374C' }}>Hello</Typography>
      <img src={image} alt="page2Pic" style={{ width: '200px', height: '200px' }} />
    </div>
  );
}

export default PageTwo;