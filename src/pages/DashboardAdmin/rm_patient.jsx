import { useQuery } from "@tanstack/react-query";
import { Avatar, Button, Skeleton, Typography } from "antd";
import React from "react";
import instance from "../../utils/axios";
import { UserOutlined, FileTextOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const abbreviate = (name = "") => {
  const firstName = name.split(" ")[0];
  const lastNames = name
    .split(" ")
    .slice(1)
    .map((item) => item[0]);
  return `${firstName} ${lastNames.join(".")}`;
};

const SkeletonCards = () => (
  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3, 4, 5].map((item) => (
      <Skeleton.Node
        style={{ width: "100%", height: 200 }}
        active
        children={false}
        key={item}
      ></Skeleton.Node>
    ))}
  </div>
);

const CardData = ({ data, onRM }) => (
  <div className="bg-white flex flex-col justify-between min-h-[200px] p-5 rounded-lg shadow-md">
    <div className="flex gap-2 mb-3">
      <Avatar className="bg-primary" size={100} icon={<UserOutlined />} />
      <div className="flex flex-col ">
        <div>
          <Typography.Title className="m-0" level={4}>
            {abbreviate(data?.patient?.name)}
          </Typography.Title>
          <Typography.Text className="uppercase text-[#D6DADF] font-bold">
            {data?.doctor?.poli?.name || "Umum"}
          </Typography.Text>
        </div>

        <div className="flex flex-col gap-2 mt-3">
          <div className="flex gap-2">
            <span className="min-w-[100px]">Jenis Kelamin</span>
            <span>
              : <b>{data?.patient?.gender}</b>
            </span>
          </div>
          <div className="flex gap-2">
            <span className="min-w-[100px]">Telfon</span>
            <span>
              : <b>{data?.patient?.phone}</b>
            </span>
          </div>
        </div>
      </div>
    </div>

    <Button
      block
      icon={<FileTextOutlined />}
      className={`${data?.medical_records?.length === 0 ? "bg-gray-600/80" : "bg-primary hover:bg-primary/80"} text-white`}
      type="primary"
      onClick={() => {
        if (data?.medical_records?.length === 0) {
          toast.warning(
            "Tidak ada data rekam medis untuk pasien di tanggal ini",
          );
        } else {
          onRM(data.id);
        }
      }}
    >
      Detail
    </Button>
  </div>
);

function RekamMedisPatient() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: async () => {
      const { data } = await instance.get("/registrations");
      return data;
    },
  });

  const handleViewRM = (id) => {
    navigate(`/admin/patients/medical-records/${id}`);
  };

  return (
    <div>
      <Typography.Title className="text-[#767676] tracking-tight" level={2}>
        RIWAYAT PELAYANAN PASIEN
      </Typography.Title>

      {isLoading ? (
        <SkeletonCards />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {data?.map((item) => (
            <CardData key={item.id} data={item} onRM={handleViewRM} />
          ))}
        </div>
      )}
    </div>
  );
}

export default RekamMedisPatient;
