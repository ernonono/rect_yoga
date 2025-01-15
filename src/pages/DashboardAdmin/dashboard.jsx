import { Card, Typography } from "antd";
import LogoPatient from "../../assets/icons/healthcare.png";
import LogoJadwal from "../../assets/icons/calendar.png";
import LogoDokter from "../../assets/icons/doctor.png";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  return (
    <div>
      <Typography.Title className="text-[#767676] tracking-tight" level={2}>
        DASHBOARD
      </Typography.Title>

      <div className="grid grid-cols-3 gap-4">
        <Card
          className="cursor-pointer"
          onClick={() => navigate("/admin/patients")}
          title="Pasien"
        >
          <img src={LogoPatient} alt="patient" className="mx-auto h-28" />
          <p className="text-right">
            <b>0</b> Pasien
          </p>
        </Card>
        <Card
          className="cursor-pointer"
          title="Jadwal Janji"
          onClick={() => navigate("/admin/appointments")}
        >
          <img src={LogoJadwal} alt="appointment" className="mx-auto h-28" />
          <p className="text-right">
            <b>0</b> Janji
          </p>
        </Card>
        <Card
          className="cursor-pointer"
          title="Dokter"
          onClick={() => navigate("/admin/doctors")}
        >
          <img src={LogoDokter} alt="doctor" className="mx-auto h-28" />
          <p className="text-right">
            <b>0</b> Dokter
          </p>
        </Card>
      </div>
    </div>
  );
}
