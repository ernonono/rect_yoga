import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/admin.layout";
import DashboardAdmin from "../pages/DashboardAdmin/dashboard";
import AppointmentDoctor from "../pages/DashboardAdmin/appointments";
import DoctorList from "../pages/DashboardAdmin/doctors";
import AddDoctor from "../pages/DashboardAdmin/add_doctor";
import PatientList from "../pages/DashboardAdmin/patients";
import AddPatient from "../pages/DashboardAdmin/add_patient";
import RekamMedisPatient from "../pages/DashboardAdmin/rm_patient";
import DoctorSchedule from "../pages/DashboardAdmin/doctor_schedule";
import Healthcare from "../pages/DashboardAdmin/healtcare";
import EditDoctor from "../pages/DashboardAdmin/edit_doctor";
import EditPatient from "../pages/DashboardAdmin/edit_patient";
import DetailRMPatient from "../pages/DashboardAdmin/detail_rm_patient";

export default function AdminRoutes({}) {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardAdmin />} />
        <Route path="appointments" element={<AppointmentDoctor />} />

        <Route path="doctors" element={<DoctorList />} />
        <Route path="doctors/add" element={<AddDoctor />} />
        <Route path="doctors/:id/edit" element={<EditDoctor />} />

        <Route path="patients" element={<PatientList />} />
        <Route path="patients/add" element={<AddPatient />} />
        <Route path="patients/:id/edit" element={<EditPatient />} />
        <Route
          path="patients/medical-records"
          element={<RekamMedisPatient />}
        />
        <Route
          path="patients/medical-records/:id"
          element={<DetailRMPatient />}
        />

        <Route path="other/schedule" element={<DoctorSchedule />} />
        <Route path="other/healthcare" element={<Healthcare />} />
      </Route>
    </Routes>
  );
}
