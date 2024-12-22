import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Drawer,
  Input,
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

    {/* <Button
      icon={<FileAddOutlined />}
      onClick={() => onClick(data.id)}
      block
      className="mt-5"
      type="primary"
    >
      Tambah RM
    </Button> */}

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

const MedicalRecordTimeline = ({ data, onDelete, onEdit, deleteLoading }) => {
  const [open, setOpen] = useState([data?.rm?.map(() => false)]);
  const items = data?.rm?.map((item, idx) => ({
    children: (
      <Card
        size="small"
        title={
          <div className="w-full flex justify-between items-center">
            <span>{dayjs(item.date).format("DD MMMM YYYY")}</span>

            {/* <div className="flex gap-2">
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
            </div> */}
          </div>
        }
        className="mb-3"
      >
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
          Resep Obat
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
          title="Resep Obat"
        >
          <Input.TextArea
            value={item.prescription}
            rows={10}
            readOnly
            className="w-full"
          />
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
      label: "Tanggal Check Up",
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

      <Timeline reverse items={items} />
    </>
  );
};

function AppointmentDoctor() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [registrationId, setRegistrationId] = useState(null);
  const [dataRM, setDataRM] = useState(null);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: async () => {
      const { data } = await instance.get("/registrations");
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
        JADWAL JANJI
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

export default AppointmentDoctor;
