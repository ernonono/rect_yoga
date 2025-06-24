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
  Tag,
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
  FilterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { parseParams } from "../../utils/parseParams";

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

const getTagColor = (status) => {
  switch (status) {
    case "Belum Selesai":
      return "yellow";
    case "Selesai":
      return "green";
    case "Dibatalkan":
      return "red";
    default:
      return "blue";
  }
};

const CardData = ({ data, onClick, onRM, onHistoryRM }) => (
  <div className="bg-white flex flex-col justify-between min-h-[200px] p-5 rounded-lg shadow-md">
    <div className="flex justify-between">
      <div className="flex flex-col justify-center items-center">
        <Avatar className="bg-primary" size={65} icon={<UserOutlined />} />
        <Typography.Title className="m-0" level={4}>
          {abbreviate(data.patient.name)}
        </Typography.Title>
      </div>
      <div className="flex flex-col justify-between items-end">
        <div>
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-primary text-xs text-white rounded-full flex items-center justify-center mr-2">
              #{data.queue_number}
            </div>
            <Typography.Title className="m-0" level={5}>
              {dayjs(data.appointment_date).format("DD MMMM YYYY")} |{" "}
              {dayjs(data.appointment_date).format("HH:mm")}
            </Typography.Title>
          </div>
          <div className="flex justify-end">
            <Tag className="m-0" color={getTagColor(data.status)}>
              {data.status}
            </Tag>
          </div>
        </div>
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
      disabled={data?.status === "Dibatalkan"}
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

    <Button
      block
      icon={<FileTextOutlined />}
      className={`mt-2 bg-blue-600 hover:bg-blue-400 text-white`}
      type="primary"
      color="info"
      onClick={() => {
        if (!data?.patient?.id) {
          toast.warning("Tidak ada data pasien untuk rekam medis ini");
        } else {
          onHistoryRM(data.patient.id);
        }
      }}
    >
      Riwayat Rekam Medis
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

            <div
              className={`flex gap-2 ${data?.registration ? "block" : "hidden"}`}
            >
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
      children: data?.registration?.patient?.name || data?.patient.name || "-",
    },
  ];

  if (data?.registration) {
    descriptionItems.push({
      label: "Tanggal Janji",
      children: dayjs(data?.registration?.appointment_date).format(
        "dddd, D MMMM YYYY",
      ),
    });
  }

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
  const [patientId, setPatientId] = useState(null);
  const [dataRM, setDataRM] = useState(null);
  const [dataHistoryRM, setDataHistoryRM] = useState(null);
  const [filter, setFilter] = useState({
    patient_name: "",
    start_date: "",
    end_date: "",
  });
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["doctor-appointments", filter],
    queryFn: async () => {
      const { data } = await instance.get(
        `/registrations-doctor?${parseParams(filter)}`,
      );
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

  const handleViewHistoryRM = (id) => {
    setParams({ patient_id: id });
  };

  const handleEditRM = (id) => {
    navigate(`/doctor/medical-record/edit-rekam-medis?identifier=${id}`);
  };

  useEffect(() => {
    if (params.get("identifier")) {
      setRegistrationId(params.get("identifier"));
    } else if (params.get("patient_id")) {
      setPatientId(params.get("patient_id"));
      setRegistrationId(null);
    } else {
      setRegistrationId(null);
      setPatientId(null);
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

  useEffect(() => {
    const getHistoryRM = async () => {
      if (patientId) {
        const { data } = await instance.get(
          `/medical-records?patient_id=${patientId}`,
        );

        const { data: pasien } = await instance.get(`/patients/${patientId}`);

        setDataHistoryRM({
          patient: pasien,
          rm: data,
        });
      } else {
        setDataHistoryRM(null);
      }
    };

    if (patientId) {
      getHistoryRM();
    }
  }, [patientId]);

  const onChangeDate = (value) => {
    if (value) {
      setFilter({
        ...filter,
        start_date: value[0].format("YYYY-MM-DD"),
        end_date: value[1].format("YYYY-MM-DD"),
      });
    } else {
      setFilter({
        ...filter,
        start_date: "",
        end_date: "",
      });
    }
  };
  const onSearchName = (v) => setFilter({ ...filter, patient_name: v || "" });

  return (
    <div>
      <Typography.Title className="text-[#767676] tracking-tight" level={2}>
        APPOINTMENTS
      </Typography.Title>

      <div className="flex mb-3 bg-[#F5F5F5] py-3 rounded-md px-4 flex-col md:flex-row items-center gap-2">
        <FilterOutlined className="text-xl text-[#767676] mr-2" />
        <Input.Search
          onSearch={onSearchName}
          placeholder="Nama Pasien"
          className="w-full md:w-1/6"
          allowClear
        />

        <div className="flex gap-2 w-full md:w-2/6">
          <DatePicker.RangePicker
            allowClear
            onChange={onChangeDate}
            placeholder={["Tgl Awal", "Tgl Akhir"]}
          />
          <Button
            onClick={() => {
              setFilter({
                ...filter,
                start_date: dayjs().format("YYYY-MM-DD"),
                end_date: dayjs().format("YYYY-MM-DD"),
              });
            }}
            type="text"
            className="text-xs text-gray-400"
          >
            Data hari ini
          </Button>
        </div>
      </div>

      {isLoading ? (
        <SkeletonCards />
      ) : (
        <div className="flex flex-col gap-10">
          {["Belum Selesai", "Selesai", "Dibatalkan"].map((status) => (
            <div
              key={status}
              className="pb-6 border-b border-gray-500 last:border-none"
            >
              <Typography.Title level={4} className="text-gray-500">
                {status}
              </Typography.Title>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 mt-2">
                {data
                  ?.filter((item) => item.status === status)
                  .map((item) => (
                    <CardData
                      onClick={handleAddRM}
                      key={item.id}
                      data={item}
                      onRM={handleViewRM}
                      onHistoryRM={handleViewHistoryRM}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Drawer
        title="Rekam Medis Janji Temu"
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

      <Drawer
        title="Riwayat Rekam Medis Pasien"
        placement="right"
        width={500}
        closable={false}
        onClose={() => setParams({})}
        open={!!patientId}
      >
        {dataRM?.length === 0 ? (
          <p>
            No medical records found for this patient. Please add medical
            records.
          </p>
        ) : (
          <MedicalRecordTimeline
            data={dataHistoryRM}
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
