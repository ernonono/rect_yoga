import React from "react";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem("token");
  const auth = token != null ? true : null;

  // If has token, return outlet in other case return navigate to login page

  return auth ? children : <Navigate to="/login" />;
};

export default AuthGuard;
