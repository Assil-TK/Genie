import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Button, TextField, Typography, Card, CardContent } from "@mui/material";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/auth/reset-password/${token}`, {
        newPassword,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de la réinitialisation.");
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: "url('/assets/images/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card sx={{ width: 400, padding: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2, textAlign: "center", color: "#F39325", fontWeight: 'bold' }}>
            Réinitialiser votre mot de passe
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nouveau mot de passe"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#1B374C",
                color: "#FFF",
                borderRadius: 2,
                height: "40px"
              }}
            >
              Réinitialiser
            </Button>
          </form>
          {message && <Typography sx={{ mt: 2, textAlign: "center", color: "#F44336" }}>{message}</Typography>}
        </CardContent>
      </Card>
    </Box>

  );
};

export default ResetPassword;
