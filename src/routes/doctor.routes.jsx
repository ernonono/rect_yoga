import React from "react";
import { Route, Routes } from "react-router-dom";
import DoctorLayout from "../layouts/doctor.layout";
import DashboardDoctor from "../pages/DashboardDoctor";
import DoctorAppointments from "../pages/DashboardDoctor/appointment";
import AddRekamMedis from "../pages/DashboardDoctor/add_rm";
import EditRekamMedis from "../pages/DashboardDoctor/edit_rm";
import DoctorProfile from "../pages/DashboardDoctor/profile";
import EditProfileDoctor from "../pages/DashboardDoctor/edit_profile";

function DoctorRoutes() {
  return (
    <Routes>
      <Route path="/doctor" element={<DoctorLayout />}>
        <Route index element={<DashboardDoctor />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="profile" element={<DoctorProfile />} />
        <Route path="profile/edit" element={<EditProfileDoctor />} />
        <Route
          path="medical-record/add-rekam-medis"
          element={<AddRekamMedis />}
        />
        <Route
          path="medical-record/edit-rekam-medis"
          element={<EditRekamMedis />}
        />
      </Route>
    </Routes>
  );
}

export default DoctorRoutes;
