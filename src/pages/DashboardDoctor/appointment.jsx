import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Descriptions,
  Drawer,
  Input,
  List,
  Modal,
  Skeleton,
  Timeline,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import instance from "../../utils/axios";
import {
  UserOutlined,
  FileTextOutlined,
  FileAddOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

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

const CardData = ({ data, onClick, onRM }) => (
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

    <Card
      title={<Typography.Text className="text-xs">Keluhan</Typography.Text>}
      className="mt-2"
      size="small"
    >
      <Typography.Text className="text-xs">{data.description}</Typography.Text>
    </Card>

    <Button
      icon={<FileAddOutlined />}
      onClick={() => onClick(data.id)}
      block
      className="mt-5"
      type="primary"
    >
      Tambah RM
    </Button>

    <Button
      block
      icon={<FileTextOutlined />}
      className={`mt-2 ${data?.medical_records?.length === 0 ? "bg-gray-600/80" : "bg-blue-600 hover:bg-blue-400"} text-white`}
      type="primary"
      color="info"
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
      Rekam Medis ({data?.medical_records?.length || 0})
    </Button>
  </div>
);

const MedicalRecordTimeline = ({
  data,
  onDelete,
  onEdit,
  deleteLoading,
  onSearch,
}) => {
  const [open, setOpen] = useState([data?.rm?.map(() => false)]);
  const items = data?.rm?.map((item, idx) => ({
    children: (
      <Card
        size="small"
        title={
          <div className="w-full flex justify-between items-center">
            <span>{item.rm_number}</span>

            <div className="flex gap-2">
              <Tooltip title="Edit Rekam Medis">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => onEdit(item.id)}
                  type="link"
                  size="large"
                />
              </Tooltip>

              <Tooltip title="Hapus Rekam Medis">
                <Button
                  danger
                  loading={deleteLoading}
                  onClick={() => onDelete(item.id)}
                  icon={<DeleteOutlined />}
                  type="link"
                  size="large"
                />
              </Tooltip>
            </div>
          </div>
        }
        className="mb-3"
      >
        <div className="flex gap-2 mb-2">
          <span className="font-semibold min-w-[60px]">Waktu Konsultasi</span>

          <div className="flex gap-2">
            <span>:</span>

            {dayjs(item.created_at).format("DD MMMM YYYY HH:mm")}
          </div>
        </div>
        <div className="flex gap-2 mb-2">
          <span className="font-semibold min-w-[60px]">Gejala</span>

          <div className="flex gap-2">
            <span>:</span>

            <ul>
              {item.symptomps.split(",").map((item, index) => (
                <li key={index}>- {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-2 mb-2">
          <span className="font-semibold min-w-[60px]">Diagnosa</span>
          <div className="flex gap-2">
            <span>:</span>
            <Typography.Text>{item.diagnosis}</Typography.Text>
          </div>
        </div>

        <Button
          className="mt-2"
          icon={<FileTextOutlined />}
          type="primary"
          onClick={() => {
            setOpen((prev) => {
              const newOpen = [...prev];
              newOpen[idx] = true;
              return newOpen;
            });
          }}
          size="small"
        >
          Pengambilan Obat
        </Button>

        <Modal
          width={800}
          okText="Tutup"
          cancelButtonProps={{ style: { display: "none" } }}
          open={open[idx]}
          onOk={() => {
            setOpen((prev) => {
              const newOpen = [...prev];
              newOpen[idx] = false;
              return newOpen;
            });
          }}
          onCancel={() => {
            setOpen((prev) => {
              const newOpen = [...prev];
              newOpen[idx] = false;
              return newOpen;
            });
          }}
          title="Instruksi Pengambilan Obat"
        >
          <Card title="Obat" size="small">
            <List
              size="small"
              dataSource={item?.drug_code ? JSON.parse(item.drug_code) : []}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<span>{index + 1}</span>}
                    title={item.name}
                    description={`Kode Obat: ${item.code}`}
                  />
                </List.Item>
              )}
            />
          </Card>
          <Card title="Catatan Dokter" className="mt-4" size="small">
            <Input.TextArea
              value={item.prescription}
              rows={7}
              readOnly
              variant="borderless"
              className="w-full"
            />
          </Card>
        </Modal>
      </Card>
    ),
  }));

  const descriptionItems = [
    {
      label: "Nama Pasien",
      children: data?.registration.patient.name,
    },
    {
      label: "Tanggal Janji",
      children: dayjs(data?.registration?.appointment_date).format(
        "dddd, D MMMM YYYY",
      ),
    },
  ];

  return (
    <>
      <Descriptions
        items={descriptionItems}
        className="mb-4"
        column={1}
        size="small"
      />

      <div className="flex mb-4 gap-6 items-center justify-between">
        <Input.Search onSearch={onSearch} placeholder="Cari Rekam Medis" />
        <DatePicker.RangePicker />
      </div>

      <Timeline reverse items={items} />
    </>
  );
};

function DoctorAppointments() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [registrationId, setRegistrationId] = useState(null);
  const [dataRM, setDataRM] = useState(null);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: async () => {
      const { data } = await instance.get("/registrations-doctor");
      return data;
    },
  });

  const deleteRM = useMutation({
    mutationFn: (id) => instance.delete(`/medical-records/${id}`),
    onSuccess: () => {
      toast.success("Rekam Medis Berhasil Dihapus", {
        position: "top-left",
      });
      refetch();
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Gagal menghapus rekam medis",
        {
          position: "top-left",
        },
      );
    },
  });

  const handleAddRM = (id) => {
    navigate(`/doctor/medical-record/add-rekam-medis?registration_id=${id}`);
  };

  const handleViewRM = (id) => {
    setParams({ identifier: id });
  };

  const handleEditRM = (id) => {
    navigate(`/doctor/medical-record/edit-rekam-medis?identifier=${id}`);
  };

  useEffect(() => {
    if (params.get("identifier")) {
      setRegistrationId(params.get("identifier"));
    } else {
      setRegistrationId(null);
      setDataRM(null);
    }
  }, [params]);

  useEffect(() => {
    if (registrationId && data) {
      const regis = data.find(
        (item) => item.id === parseInt(registrationId || "0"),
      );
      const rm = regis?.medical_records || [];

      setDataRM({
        registration: regis,
        rm,
      });
    }
  }, [registrationId, data]);

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
            <CardData
              onClick={handleAddRM}
              key={item.id}
              data={item}
              onRM={handleViewRM}
            />
          ))}
        </div>
      )}

      <Drawer
        title="Riwayat Rekam Medis"
        placement="right"
        width={500}
        closable={false}
        onClose={() => setParams({})}
        open={!!registrationId}
      >
        {dataRM?.length === 0 ? (
          <p>
            No medical records found for this patient. Please add medical
            records.
          </p>
        ) : (
          <MedicalRecordTimeline
            data={dataRM}
            deleteLoading={deleteRM.isPending}
            onDelete={deleteRM.mutate}
            onEdit={handleEditRM}
          />
        )}
      </Drawer>
    </div>
  );
}

export default DoctorAppointments;
