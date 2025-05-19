import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = ({ role }) => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');

  // Si pas de token ou pas de données utilisateur
  if (!token || !userData) {
    return <Navigate to="/login" />;
  }

  const currentUser = JSON.parse(userData);

  // Debug temporaire
  console.log("Current user:", currentUser);

  // Vérification du rôle si nécessaire
  if (role && currentUser?.role !== role) {
    console.warn(`Access denied. Required: ${role}, but got: ${currentUser?.role}`);
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default RequireAuth;

