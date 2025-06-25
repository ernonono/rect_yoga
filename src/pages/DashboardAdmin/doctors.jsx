import {
  Button,
  Card,
  Descriptions,
  Input,
  Modal,
  Select,
  Switch,
  Tooltip,
  Typography,
  message,
} from "antd";
import React, { useState } from "react";
import GambarDoktor from "../../assets/gambar_doktor.png";
import {
  FacebookOutlined,
  GooglePlusOutlined,
  LinkedinOutlined,
  XOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import instance from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { parseParams } from "../../utils/parseParams";
import DoctorProfileModal from "../../components/DoctorProfileModal";


export function SocialMediaButton({ icon, link }) {
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

function DoctorCard({ doctor, refetch, openModal }) {
  const navigate = useNavigate();
  const imgUrl = `http://localhost:8000/doctor_image/${doctor?.image}`;
  const mutation = useMutation({
    mutationFn: async () => {
      await instance.put(`toggle-active`, { user_id: doctor.user_id });
    },
    onError: (err, variables, context) => {
      setData(context);
    },
    onMutate: () => {
      message.loading({
        content: "Mengubah status dokter...",
        key: "hapusdokter",
      });
    },
    onSuccess: () => {
      refetch();
      message.success({
        content: "Berhasil mengubah status dokter!",
        key: "hapusdokter",
      });
    },
  });

  return (
    <Card
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
        <div className="flex justify-between items-center">
          <Typography.Title className="font-light text-primary" level={3}>
            {doctor?.name}
          </Typography.Title>
          <Tooltip title="Edit dokter">
            <div
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/doctors/${doctor.id}/edit`);
              }}
              className="relative group"
            >
              <EditOutlined className="text-primary  text-lg cursor-pointer relative z-10" />
              <i className="absolute top-1/2 left-1/2 transform w-7 h-7 transition-all duration-100 rounded-full group-hover:bg-primary/20 z-0 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </Tooltip>
        </div>
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
          <Tooltip title="Status dokter">
            <Switch
              loading={mutation.isPending}
              size="small"
              checked={doctor?.user?.is_active}
              onChange={() => mutation.mutate()}
            />
          </Tooltip>
        </div>
      </div>

      <Button
        onClick={() => openModal(doctor.id)}
        block
        type="primary"
        className="mt-3"
      >
        Lihat Profil
      </Button>
    </Card>
  );
}

function Loading() {
  return [1, 2, 3].map((item) => (
    <Card className="w-full h-[500px]" key={item} loading />
  ));
}

export default function DoctorList() {
  const [filter, setFilter] = useState({
    name: "",
    poli_id: "",
    specialty: "",
  });

  const [doctorId, setDoctorId] = useState(null);
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["doctor-list", filter],
    queryFn: async () => {
      const { data } = await instance.get(`doctors?${parseParams(filter)}`);

      return data;
    },
  });

  const { data: polis, isLoading: poliLoading } = useQuery({
    queryKey: ["polis"],
    queryFn: async () => {
      const { data } = await instance.get("/polis");

      const options = data.map((item) => ({
        label: item.name,
        value: item.id,
      }));

      return options;
    },
  });

  const onChangeFilter = (property, value) => {
    setFilter({
      ...filter,
      [property]: value || "",
    });
  };

  const handleAddDoctorClick = () => { // <-- TAMBAHKAN FUNGSI INI
    navigate('/admin/doctors/add'); // Sesuaikan dengan path rute AddDoctor Anda
  };

  return (
    <div>
      <Typography.Title className="text-[#767676] tracking-tight" level={2}>
        SEMUA DOKTOR
      </Typography.Title>

      <div className="flex mb-3 bg-[#F5F5F5] py-3 rounded-md px-4 flex-col md:flex-row items-center gap-2">
        <FilterOutlined className="text-xl text-[#767676] mr-2" />
        <Input.Search
          onSearch={(value) => onChangeFilter("name", value)}
          placeholder="Nama Doktor"
          className="w-full md:w-1/6"
          allowClear
        />
        <Input.Search
          onSearch={(value) => onChangeFilter("specialty", value)}
          placeholder="Spesialis Doktor"
          className="w-full md:w-1/6"
          allowClear
        />
        <Select
          onChange={(value) => onChangeFilter("poli_id", value)}
          placeholder="Poli"
          allowClear
          className="w-full md:w-1/6"
          loading={poliLoading}
          options={polis}
          showSearch
          optionFilterProp="label"
        />
        <Button
        type="primary" // Anda bisa mengubah tipe tombol (default, dashed, text, link)
        onClick={handleAddDoctorClick}
        className="w-full md:w-auto ml-auto" // ml-auto untuk mendorong tombol ke kanan (opsional)
      >
        Tambah Dokter
      </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {isLoading ? (
          <Loading />
        ) : (
          data?.map((item) => (
            <DoctorCard
              openModal={(id) => setDoctorId(id)}
              key={item.id}
              refetch={refetch}
              doctor={item}
            />
          ))
        )}
      </div>

      <DoctorProfileModal
        doctor_id={doctorId}
        onCancel={() => setDoctorId(null)}
      />
    </div>
  );
}
