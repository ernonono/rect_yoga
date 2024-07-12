import React from "react";
import { Route, Routes } from "react-router-dom";
import DoctorLayout from "../layouts/doctor.layout";
import DashboardDoctor from "../pages/DashboardDoctor";
import DoctorAppointments from "../pages/DashboardDoctor/appointment";

function DoctorRoutes() {
  return (
    <Routes>
      <Route path="/doctor" element={<DoctorLayout />}>
        <Route index element={<DashboardDoctor />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="patients" element={<div>Doctor Patients</div>} />
      </Route>
    </Routes>
  );
}

export default DoctorRoutes;
