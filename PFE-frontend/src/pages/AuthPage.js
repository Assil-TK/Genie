import React, { useState } from "react";
import logoWhite from "../assets/logoWhite.png";
import { keyframes } from "@mui/system";
import {
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../services/api";
import LoginButton from "../components/LoginButton";

const ADMIN_EMAIL = "pfeplatformisimahdia@gmail.com";
const gradientMove = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;
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
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        overflow: "hidden",
        background: 'linear-gradient(-45deg, #1e3c72,rgb(244, 162, 31), #84a5e4,rgb(246, 205, 123))',
backgroundSize: '400% 400%',
animation: `${gradientMove} 15s ease infinite`,

      }}
    >
      {/* Animated blob SVG */}
      <Box
        component="svg"
        viewBox="0 0 800 600"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "200%",
          height: "200%",
          transform: "translate(-50%, -50%)",
          zIndex: 0,
          opacity: 0.18,
        }}
      >
        <path fill="white">
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="
              M421.5 115.5C508.5 145 637 184.5 645.5 263.5C654 342.5 542 384.5 468 439.5C394 494.5 357.5 572.5 287.5 563.5C217.5 554.5 169.5 458.5 134.5 375C99.5 291.5 77.5 221.5 123.5 163C169.5 104.5 334.5 86 421.5 115.5Z;
              M400 140C480 160 620 190 630 270C640 350 530 390 450 450C370 510 340 580 270 570C200 560 150 470 120 390C90 310 60 230 110 160C160 90 320 120 400 140Z;
              M421.5 115.5C508.5 145 637 184.5 645.5 263.5C654 342.5 542 384.5 468 439.5C394 494.5 357.5 572.5 287.5 563.5C217.5 554.5 169.5 458.5 134.5 375C99.5 291.5 77.5 221.5 123.5 163C169.5 104.5 334.5 86 421.5 115.5Z
            "
          />
        </path>
      </Box>
      <Box
  sx={{
    position: "absolute",
    top: 20,
    left: 40,
    zIndex: 2,
  }}
>
  <img
    src={logoWhite}
    alt="Logo"
    style={{
      height: "40px",
      objectFit: "contain",
    }}
  />
</Box>


      {/* Auth Card (unchanged) */}
      <Card
        sx={{
          width: { xs: "100%", sm: 400 },
          maxHeight: 600,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.33)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          borderRadius: 3,
          p: 3,
          position: "relative",
          zIndex: 1,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              color: "rgb(27, 55, 97)",
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
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%", fontFamily: "Poppins" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuthPage;
