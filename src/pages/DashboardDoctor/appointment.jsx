import { useQuery } from "@tanstack/react-query";
import { Avatar, Button, Skeleton, Typography } from "antd";
import React from "react";
import instance from "../../utils/axios";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const abbreviate = (name) => {
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

const CardData = ({ data }) => (
  <div className="bg-white flex flex-col justify-between min-h-[200px] p-5 rounded-lg shadow-md">
    <div className="flex justify-between">
      <div className="flex flex-col justify-center items-center">
        <Avatar className="bg-primary" size={65} icon={<UserOutlined />} />
        <Typography.Title className="m-0" level={4}>
          {abbreviate(data.patient.name)}
        </Typography.Title>
      </div>
      <div className="flex flex-col justify-between items-end">
        <Typography.Title level={5}>
          {dayjs(data.appointment_date).format("DD MMMM YYYY")} |{" "}
          {dayjs(data.appointment_date).format("HH:mm")}
        </Typography.Title>
        <Typography.Text className="uppercase text-[#D6DADF] text-xl font-bold">
          {data.doctor.poli.name}
        </Typography.Text>
      </div>
    </div>

    <Button block className="mt-5" type="primary">
      + Tambah RM
    </Button>
  </div>
);

function DoctorAppointments() {
  const { data, isLoading } = useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: async () => {
      const { data } = await instance.get("/registrations-doctor");
      return data;
    },
  });

  return (
    <div>
      <Typography.Title className="text-[#767676] tracking-tight" level={2}>
        APPOINTMENTS
      </Typography.Title>

      {isLoading ? (
        <SkeletonCards />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((item) => (
            <CardData key={item.id} data={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorAppointments;
