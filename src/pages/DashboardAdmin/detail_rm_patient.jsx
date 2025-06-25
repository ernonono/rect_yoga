import { useQuery } from "@tanstack/react-query";
import { Avatar, Card, Flex, Table, Tag, Typography } from "antd";
import React from "react";
import { useParams } from "react-router-dom";
import instance from "../../utils/axios";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { render } from "react-dom";

export default function DetailRMPatient() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["patient-medical-records", id],
    queryFn: async () => {
      const { data } = await instance.get(
        `/medical-records/registration/${id}`,
      );
      return data;
    },
  });

  const columns = [
    {
      title: "TANGGAL",
      key: "tanggal",
      align: "center",
      render: () => (
        <div className="flex flex-col text-[#555555] justify-center">
          <Typography.Text className=" font-semibold">
            {dayjs(data?.appointment_date).format("DD MMMM YYYY")}
          </Typography.Text>
          <Typography.Text className="font-light">
            {dayjs(data?.appointment_date).format("HH:mm")}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "DOKTER",
      align: "center",
      key: "dokter",
      render: () => (
        <div className="flex flex-col text-[#555555] justify-center">
          <Typography.Text className="font-semibold">
            {data.doctor.name}
          </Typography.Text>
          <Typography.Text className="font-light">
            {data.doctor.specialty}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "SAKIT",
      align: "center",
      key: "sakit",
      render: (_, record) => {
        const gejalaArr = record?.symptomps.split(",");

        return (
          <Flex gap="4px 0" wrap>
            {gejalaArr.map((item, index) => (
              <Tag color="blue" key={index} className="font-light">
                {item}
              </Tag>
            ))}
          </Flex>
        );
      },
    },
  ];

  return !isError ? (
    <div>
      <Typography.Title className="text-[#767676] tracking-tight" level={2}>
        HASIL REKAMAN MEDIS
      </Typography.Title>

      <Card
        loading={isLoading}
        style={{
          border: "1px solid #E8E8E8",
        }}
        styles={{
          header: {
            backgroundColor: "#F5F5F5",
            color: "#676767",
            textTransform: "uppercase",
          },
          body: { padding: "1.6rem" },
        }}
        title="DATA PASIEN"
      >
        <div className="w-full flex h-full">
          <div className="border-r w-[30%] border-[#E8E8E8] flex flex-col gap-2 items-center">
            <Avatar
              size={120}
              src={`http://localhost:8000/patient_image/${data?.patient?.image}`}
              icon={<UserOutlined />}
            />

            <Typography.Title className="font-light m-0 text-primary" level={4}>
              {data?.patient?.name}
            </Typography.Title>

            <Typography.Text className="uppercase text-[#D6DADF] font-bold">
              {data?.doctor?.poli?.name}
            </Typography.Text>

            {data?.payment_type === "bpjs" && (
              <Typography.Text className="uppercase text-[#D6DADF] font-bold">
                No. BPJS : {data?.patient?.bpjs}
              </Typography.Text>
            )}
          </div>

          <div className="py-5 px-10 w-[70%] grid grid-cols-3 gap-8">
            <div className="flex flex-col gap-1">
              <Typography.Text className="font-bold">NIK</Typography.Text>
              <Typography.Text>{data?.patient?.nik}</Typography.Text>
            </div>
            <div className="flex flex-col gap-1">
              <Typography.Text className="font-bold">
                Jenis Kelamin
              </Typography.Text>
              <Typography.Text>{data?.patient?.gender}</Typography.Text>
            </div>
            <div className="flex flex-col gap-1">
              <Typography.Text className="font-bold">Email</Typography.Text>
              <Typography.Text>{data?.patient?.user.email}</Typography.Text>
            </div>
            <div className="flex flex-col gap-1">
              <Typography.Text className="font-bold">Umur</Typography.Text>
              <Typography.Text>
                {dayjs().diff(data?.patient?.birth, "year") + " Tahun"}
              </Typography.Text>
            </div>
            <div className="flex flex-col gap-1">
              <Typography.Text className="font-bold">Alamat</Typography.Text>
              <Typography.Text>{data?.patient?.address}</Typography.Text>
            </div>
            <div className="flex flex-col gap-1">
              <Typography.Text className="font-bold">No HP</Typography.Text>
              <Typography.Text>{data?.patient?.phone}</Typography.Text>
            </div>
            <div className="flex flex-col gap-1">
              <Typography.Text className="font-bold">No BPJS</Typography.Text>
              <Typography.Text>{data?.patient?.bpjs}</Typography.Text>
            </div>
          </div>
        </div>
      </Card>

      <Table
        className="mt-10"
        bordered
        pagination={false}
        columns={columns}
        loading={isLoading}
        dataSource={data?.medical_records || []}
      />
    </div>
  ) : (
    <div>
      <h1>Terjadi kesalahan</h1>
    </div>
  );
}
