import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoggedGuard from "../components/LoggedGuard";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route
        path="/login"
        element={
          <LoggedGuard>
            <Login />
          </LoggedGuard>
        }
      />
      <Route
        path="/register"
        element={
          <LoggedGuard>
            <Register />
          </LoggedGuard>
        }
      />
    </Routes>
  );
}

export default AuthRoutes;
