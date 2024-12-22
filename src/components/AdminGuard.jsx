import React from "react";
import { Navigate } from "react-router-dom";

const AdminGuard = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user != null ? user.role : null;
  const auth = token != null ? true : null;

  // Jika tidak ada token, maka redirect ke halaman login
  if (!auth) {
    return <Navigate to="/login" />;
  }

  // Jika role bukan doctor, maka redirect ke halaman beranda
  if (role !== "admin") {
    return <Navigate to="/beranda" />;
  }

  return children;
};

export default AdminGuard;
