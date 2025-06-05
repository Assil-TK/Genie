import React, { useState } from "react";
import {TextField,Button,Box,Card,CardContent,Typography, Snackbar, Alert} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../services/api";
import LoginButton from "../components/LoginButton";

const ADMIN_EMAIL = "pfeplatformisimahdia@gmail.com";

const AuthPage = ({ onLogin = () => {} }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isAdmin = formData.email === ADMIN_EMAIL;

    try {
      if (isRegister) {
        if (isAdmin) {
        setSnackbar({
            open: true,
            message: "L'admin ne peut pas s'inscrire.",
            severity: "warning",
          });          
          return;
        }

        await registerUser({ ...formData, role: "client" });
        setSnackbar({
          open: true,
          message: "Inscription réussie. Veuillez vous connecter.",
          severity: "success",
        });        
        setIsRegister(false);
        setFormData({ username: "", email: "", password: "" });
      } else {
        const response = await loginUser({ ...formData });
        localStorage.setItem("token", response.token);

        if (typeof onLogin === "function") onLogin();

        if (isAdmin) {
          navigate("/admin/tableau");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Une erreur est survenue.";
        setSnackbar({
        open: true,
        message: "Erreur : " + errorMessage,
        severity: "error",
      });
    }
  };

  const toggleAuthMode = () => {
    setIsRegister(!isRegister);
    setFormData({ username: "", email: "", password: "" });
  };

  return (
    <Box
      sx={{
        backgroundImage: "url('/assets/images/webdevelopment-.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Card
        sx={{
          width: { xs: "100%", sm: 400 },
          maxHeight: 600,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.56)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          borderRadius: 3,
          p: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#1B374C",
              mb: 1,
            }}
          >
            {isRegister ? "Inscription" : "Connexion"}
          </Typography>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <TextField
                label="Nom d'utilisateur"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                fullWidth
                margin="normal"
                required
              />
            )}

            <TextField
              label="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="Mot de passe"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              fullWidth
              margin="normal"
              required
            />

            {!isRegister && (
              <Box sx={{ textAlign: "right", mt: 1 }}>
                <Link
                  to="/login/forgot-password"
                  style={{ color: "#1B374C", fontSize: "0.85rem" }}
                >
                  Mot de passe oublié ?
                </Link>
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                marginBottom: -1,
                backgroundColor: "#1B374C",
                color: "#FFF",
                height: "45px",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "#10222f",
                },
              }}
            >
              {isRegister ? "S'inscrire" : "Se connecter"}
            </Button>

            {!isRegister && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <LoginButton />
              </Box>
            )}
          </form>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              onClick={toggleAuthMode}
              variant="outlined"
              sx={{
                borderColor: "#1B374C",
                color: "#1B374C",
                "&:hover": {
                  backgroundColor: "#F39325",
                  color: "#FFF",
                },
              }}
            >
              {isRegister
                ? "Déjà inscrit ? Se connecter"
                : "Pas encore inscrit ? Créer un compte"}
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: '100%', fontFamily: 'Poppins' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuthPage;