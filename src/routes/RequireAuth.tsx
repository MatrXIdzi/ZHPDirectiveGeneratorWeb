import { Navigate, useLocation } from 'react-router-dom';
import { JSX } from 'react';

interface RequireAuthProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

const RequireAuth = ({ children, allowedRoles }: RequireAuthProps) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token || isTokenExpired(token)) {
    // Jeśli nie ma tokena lub jest nieważny → przerzuca na /login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles) {
    allowedRoles = [];
  }

  const userRoles = getUserRoles(token);
  const hasRequiredRole = userRoles.some(role => allowedRoles.includes(role));

  if (!hasRequiredRole) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Jeśli wszystko ok → pokazuje zawartość
  return children;
};

// Funkcja sprawdzająca czy token wygasł
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = decoded.exp * 1000;
    return expirationTime < Date.now(); 
  } catch (error) {
    return true; 
  }
};

// Funkcja wyciągająca role z tokena
const getUserRoles = (token: string): string[] => {
  try {
    const decoded: any = JSON.parse(atob(token.split('.')[1]));
    const roles = decoded.authorities;
    if (Array.isArray(roles)) {
      return roles;
    }
    console.log('Token roles:', roles);
    return roles ? [roles] : [];
  } catch (error) {
    return [];
  }
};

export default RequireAuth;
