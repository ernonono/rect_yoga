import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import "react-calendar/dist/Calendar.css";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Poli from "./pages/Dashboard/Poli";
import Dokter from "./pages/halaman/dokter";
import Riwayat from "./pages/Dashboard/Riwayat";
import Beranda from "./pages/Dashboard/Beranda";
import PilihTanggal from "./pages/halaman/kalender";
import Konfirmasi from "./pages/halaman/konfirmasi";
import AuthGuard from "./components/AuthGuard";
import LoggedGuard from "./components/LoggedGuard";

function App() {
  return (
    <BrowserRouter>
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
          path="/poli"
          element={
            <AuthGuard>
              <Poli />
            </AuthGuard>
          }
        />
        <Route
          path="/dokter"
          element={
            <AuthGuard>
              <Dokter />
            </AuthGuard>
          }
        />
        <Route
          path="/riwayat"
          element={
            <AuthGuard>
              <Riwayat />
            </AuthGuard>
          }
        />
        <Route
          path="/beranda"
          element={
            <AuthGuard>
              <Beranda />
            </AuthGuard>
          }
        />
        <Route
          path="/tanggal"
          element={
            <AuthGuard>
              <PilihTanggal />
            </AuthGuard>
          }
        />
        <Route
          path="/konfirmasi"
          element={
            <AuthGuard>
              <Konfirmasi />
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
