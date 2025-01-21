import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoggedGuard from "../components/LoggedGuard";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import SendEmailForgotPassword from "../pages/Auth/send_email_forgot";
import ResetPassword from "../pages/Auth/reset_password";

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
      <Route
        path="/send-reset-password"
        element={
          <LoggedGuard>
            <SendEmailForgotPassword />
          </LoggedGuard>
        }
      />
      <Route
        path="/reset-password"
        element={
          <LoggedGuard>
            <ResetPassword />
          </LoggedGuard>
        }
      />
    </Routes>
  );
}

export default AuthRoutes;
