import {
  Calendar,
  Card,
  Descriptions,
  Popover,
  Skeleton,
  Statistic,
  Tag,
  Typography,
} from "antd";
import React from "react";
import { CalendarOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import instance from "../../utils/axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

function DoctorSchedule() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["registrations"],
    queryFn: async () => {
      const { data } = await instance.get("/registrations");
      return data;
    },
  });

  const getAppointments = (dateObj) => {
    return (
      data?.filter((item) => {
        const data = dayjs(item.appointment_date).format("DD MMMM YYYY");
        return data === dayjs(dateObj).format("DD MMMM YYYY");
      }) || []
    );
  };

  const getTotalAppointments = (value) => {
    return (
      data?.filter((item) => {
        const index = dayjs(item.appointment_date).month();
        return index === value.month();
      }) || []
    ).length;
  };

  const monthCellRender = (value) => {
    console.log(value);
    const dataLength = getTotalAppointments(value);
    return dataLength > 0 ? (
      <div className="notes-month">
        <p className="font-semibold">Total Registration</p>
        <section className="text-xl font-bold">{dataLength}</section>
      </div>
    ) : null;
  };

  const dateCellRender = (value) => {
    const data = getAppointments(value);

    const Content = ({ data }) => {
      const items = [
        {
          label: "Patient Name",
          children: data.patient.name,
        },
        {
          label: "Patient Phone",
          children: data.patient.phone,
        },
        {
          label: "Payment Type",
          children: data.payment_type,
        },
        {
          label: "Status",
          children: (
            <Tag color={data.status === "Belum Selesai" ? "red" : "green"}>
              {data.status}
            </Tag>
          ),
        },
      ];
      return (
        <Descriptions
          bordered
          className="w-full"
          title="Appointment Details"
          items={items}
          column={1}
          size="small"
        />
      );
    };

    return (
      <div className="events">
        {data.map((item) => (
          <Popover
            key={item.id}
            content={<Content data={item} />}
            placement="topLeft"
          >
            <div
              onClick={() => {
                if (item.status === "Belum Selesai") return;

                navigate(`/doctor/appointments?identifier=${item.id}`);
              }}
              className="bg-primary px-2 text-white rounded-md"
            >
              <div className="font-bold">
                {dayjs(item?.appointment_date).format("HH:mm")}
              </div>
              <div className="event-name">{item.description}</div>
            </div>
          </Popover>
        ))}
      </div>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current, info);
    if (info.type === "month") return monthCellRender(current, info);
    return info.originNode;
  };

  return (
    <div>
      <Typography.Title className="text-[#767676] tracking-tight" level={2}>
        JADWAL DOKTOR
      </Typography.Title>

      <div className="w-full flex justify-start items-center gap-7 mb-6">
        <Card className="min-w-[250px]">
          <Statistic
            loading={isLoading}
            title="Total Registration"
            precision={0}
            value={data?.length}
            valueStyle={{ color: "#3f8600" }}
            prefix={<CalendarOutlined />}
          />
        </Card>
      </div>

      {isLoading ? <Skeleton active /> : <Calendar cellRender={cellRender} />}
    </div>
  );
}

export default DoctorSchedule;
