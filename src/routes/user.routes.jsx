import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import Dokter from "../pages/halaman/dokter";
import Riwayat from "../pages/Dashboard/Riwayat";
import Beranda from "../pages/Dashboard/Beranda";
import PilihTanggal from "../pages/halaman/kalender";
import Konfirmasi from "../pages/halaman/konfirmasi";
import Poli from "../pages/Dashboard/Poli";

function UserRoutes() {
  return (
    <Routes>
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
  );
}

export default UserRoutes;
