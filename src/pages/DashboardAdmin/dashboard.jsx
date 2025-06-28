import { Card, Typography } from "antd";
import LogoPatient from "../../assets/icons/healthcare.png";
import LogoJadwal from "../../assets/icons/calendar.png";
import LogoDokter from "../../assets/icons/doctor.png";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import instance from "../../utils/axios";

export default function DashboardAdmin() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["get-dashboard"],
    queryFn: async () => {
      const { data } = await instance.get("/dashboard/card");
      return data;
    },
  });

  return (
    <div>
      <Typography.Title className="text-[#767676] tracking-tight" level={2}>
        DASHBOARD
      </Typography.Title>

      <div className="grid grid-cols-3 gap-4">
        <Card
          loading={isLoading}
          className="cursor-pointer"
          onClick={() => navigate("/admin/patients")}
          title="Pasien"
        >
          <img src={LogoPatient} alt="patient" className="mx-auto h-28" />
          <p className="text-right">
            <b>{data?.total_patient || 0}</b> Pasien
          </p>
        </Card>
        <Card
          loading={isLoading}
          className="cursor-pointer"
          title="Jadwal Janji"
          onClick={() => navigate("/admin/appointments")}
        >
          <img src={LogoJadwal} alt="appointment" className="mx-auto h-28" />
          <p className="text-right">
            <b>{data?.total_registration || 0}</b> Janji
          </p>
        </Card>
        <Card
          loading={isLoading}
          className="cursor-pointer"
          title="Dokter"
          onClick={() => navigate("/admin/Doctors")}
        >
          <img src={LogoDokter} alt="poli" className="mx-auto h-28" />
          <p className="text-right">
            <b>{data?.total_doctor || 0}</b> Dokter
          </p>
        </Card>
        <Card
          loading={isLoading}
          className="cursor-pointer"
          title="Poli"
          onClick={() => navigate("/admin/poli")}
        >
          <img src={LogoDokter} alt="poli" className="mx-auto h-28" />
          <p className="text-right">
            <b>{data?.total_poli || 0}</b> Poli
          </p>
        </Card>
      </div>
    </div>
  );
}
