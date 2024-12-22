import { Card, Typography } from "antd";
import LogoPatient from "../../assets/icons/healthcare.png";
import LogoJadwal from "../../assets/icons/calendar.png";
import LogoDokter from "../../assets/icons/doctor.png";
import React from "react";

export default function DashboardAdmin() {
  return (
    <div>
      <Typography.Title className="text-[#767676] tracking-tight" level={2}>
        DASHBOARD
      </Typography.Title>

      <div className="grid grid-cols-3 gap-4">
        <Card title="Pasien">
          <img src={LogoPatient} alt="patient" className="mx-auto h-28" />
          <p className="text-right">
            <b>0</b> Pasien
          </p>
        </Card>
        <Card title="Jadwal Janji">
          <img src={LogoJadwal} alt="appointment" className="mx-auto h-28" />
          <p className="text-right">
            <b>0</b> Janji
          </p>
        </Card>
        <Card title="Jadwal Dokter">
          <img src={LogoDokter} alt="doctor" className="mx-auto h-28" />
          <p className="text-right">
            <b>0</b> Dokter
          </p>
        </Card>
      </div>
    </div>
  );
}
