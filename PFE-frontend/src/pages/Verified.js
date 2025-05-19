import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Verified = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Stocker le token dans le localStorage
      localStorage.setItem("token", token);

      // Rediriger automatiquement vers le Dashboard
      navigate("/admin/dashboard");
    } else {
      // Si pas de token, rediriger vers la page de connexion
      navigate("/login");
    }
  }, [navigate]);

  return <p>Vérification en cours...</p>;
};

export default Verified;
