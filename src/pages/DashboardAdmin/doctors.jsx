import { Card, Descriptions, Modal, Typography, message } from "antd";
import React from "react";
import GambarDoktor from "../../assets/gambar_doktor.png";
import {
  FacebookOutlined,
  GooglePlusOutlined,
  LinkedinOutlined,
  XOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import instance from "../../utils/axios";
import { useNavigate } from "react-router-dom";

function SocialMediaButton({ icon, link }) {
  return (
    <a
      onClick={(e) => e.stopPropagation()}
      about="_blank"
      href={link}
      className="w-[30px] h-[30px] hover:bg-primary hover:text-white transition-all duration-75 text-primary relative flex items-center justify-center border border-primary rounded-full"
    >
      <i className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
        {icon}
      </i>
    </a>
  );
}

function DoctorCard({ doctor, onClick, refetch }) {
  const navigate = useNavigate();
  const imgUrl = `http://localhost:8000/doctor_image/${doctor?.image}`;
  const mutation = useMutation({
    mutationFn: async () => {
      await instance.delete(`doctors/${doctor.id}`);
    },
    onError: (err, variables, context) => {
      setData(context);
    },
    onMutate: () => {
      message.loading({
        content: "Menghapus dokter...",
        key: "deleteDoctor",
      });
    },
    onSuccess: () => {
      refetch();
      message.success({
        content: "Berhasil menghapus dokter!",
        key: "deleteDoctor",
      });
    },
  });

  return (
    <Card
      className="cursor-pointer"
      onClick={() => onClick(doctor)}
      bordered={false}
      cover={
        <img
          className="h-[324px] w-full object-cover"
          alt="doctor"
          src={imgUrl}
        />
      }
    >
      <div>
        <Typography.Title className="font-light text-primary" level={3}>
          {doctor?.name}
        </Typography.Title>
        <Typography.Text className="text-[#AAAAAA] block -mt-3 mb-2">
          {doctor?.specialty}
        </Typography.Text>
        <Typography.Text className="text-[#AAAAAA] block -mt-3 mb-2">
          {doctor?.poli?.name}
        </Typography.Text>
      </div>

      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-3 items-center">
          {doctor?.facebok_link && (
            <SocialMediaButton
              link={doctor?.facebok_link}
              icon={<FacebookOutlined />}
            />
          )}
          {doctor?.twitter_link && (
            <SocialMediaButton link="https://x.com" icon={<XOutlined />} />
          )}
          {doctor?.google_plus_link && (
            <SocialMediaButton
              link={doctor?.google_plus_link}
              icon={<GooglePlusOutlined />}
            />
          )}
          {doctor?.linkedin_link && (
            <SocialMediaButton
              link={doctor?.linkedin_link}
              icon={<LinkedinOutlined />}
            />
          )}
        </div>

        <div className="flex gap-5">
          <div className="relative group">
            <EditOutlined
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/doctors/${doctor.id}/edit`);
              }}
              className="text-primary  text-lg cursor-pointer relative z-10"
            />
            <i className="absolute top-1/2 left-1/2 transform w-7 h-7 transition-all duration-100 rounded-full group-hover:bg-primary/20 z-0 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="relative group">
            <DeleteOutlined
              onClick={(e) => {
                e.stopPropagation();
                mutation.mutate();
              }}
              className="text-red-500 text-lg cursor-pointer"
            />
            <i className="absolute top-1/2 left-1/2 transform w-7 h-7 transition-all duration-100 rounded-full group-hover:bg-red-300/20 z-0 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function Loading() {
  return [1, 2, 3].map((item) => (
    <Card className="w-full h-[500px]" key={item} loading />
  ));
}

export default function DoctorList() {
  const [selectedData, setSelectedData] = React.useState(null);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["doctor-list"],
    queryFn: async () => {
      const { data } = await instance.get("doctors");

      return data;
    },
  });

  const descriptionItems = [
    {
      label: "Nama",
      children: selectedData?.name,
    },
    {
      label: "Spesialis",
      children: selectedData?.specialty,
    },
    {
      label: "Poli",
      children: selectedData?.poli?.name,
    },
    {
      label: "Email",
      children: selectedData?.user?.email,
    },
    {
      label: "Nomor Telepon",
      children: selectedData?.phone_number,
    },
    {
      label: "Alamat",
      children: selectedData?.address,
    },
    {
      label: "Pendidikan",
      children: selectedData?.education && (
        <ul>
          {JSON.parse(selectedData?.education)?.map((item) => (
            <li>
              - {item.institution} ({item.start_year} - {item.end_year})
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title className="text-[#767676] tracking-tight" level={2}>
        SEMUA DOKTOR
      </Typography.Title>

      <div className="grid grid-cols-3 gap-4">
        {isLoading ? (
          <Loading />
        ) : (
          data?.map((item) => (
            <DoctorCard
              onClick={(doctor) => setSelectedData(doctor)}
              key={item.id}
              refetch={refetch}
              doctor={item}
            />
          ))
        )}
      </div>

      <Modal
        width={800}
        title="Detail Doktor"
        open={!!selectedData}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        onCancel={() => setSelectedData(null)}
      >
        <Descriptions
          bordered
          column={1}
          size="small"
          items={descriptionItems}
        />
      </Modal>
    </div>
  );
}
