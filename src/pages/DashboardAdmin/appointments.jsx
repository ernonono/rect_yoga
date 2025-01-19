import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Descriptions,
  Drawer,
  Empty,
  Input,
  List,
  Modal,
  Select,
  Skeleton,
  Timeline,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import instance from "../../utils/axios";
import {
  UserOutlined,
  FileTextOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { parseParams } from "../../utils/parseParams";
import debounce from "lodash/debounce";

const abbreviate = (name) => {
  const firstName = name.split(" ")[0];
  const lastNames = name
    .split(" ")
    .slice(1)
    .map((item) => item[0]);
  return `${firstName} ${lastNames.join(".")}`;
};

export const SkeletonCards = ({ noGrid = false }) =>
  noGrid ? (
    [1, 2, 3, 4, 5].map((item) => (
      <Skeleton.Node
        style={{ width: "100%", height: 200 }}
        active
        children={false}
        key={item}
      ></Skeleton.Node>
    ))
  ) : (
    <div className={"grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"}>
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
          {data?.doctor?.poli?.name || "Poli/Dokter tidak ditemukan"}
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
            <span>{item.rm_number}</span>
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
  const [filter, setFilter] = useState({
    patient_name: "",
    poli_id: "",
    start_date: "",
    end_date: "",
  });
  const [registrationId, setRegistrationId] = useState(null);
  const [dataRM, setDataRM] = useState(null);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["doctor-appointments", filter],
    queryFn: async () => {
      const { data } = await instance.get(
        `/registrations?${parseParams(filter)}`,
      );
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

  const onChangePoli = (value) =>
    setFilter({ ...filter, poli_id: value || "" });
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
        JADWAL JANJI
      </Typography.Title>

      <div className="flex mb-3 bg-[#F5F5F5] py-3 rounded-md px-4 flex-col md:flex-row items-center gap-2">
        <FilterOutlined className="text-xl text-[#767676] mr-2" />
        <Input.Search
          onSearch={onSearchName}
          placeholder="Nama Pasien"
          className="w-full md:w-1/6"
          allowClear
        />
        <Select
          onChange={onChangePoli}
          placeholder="Poli"
          allowClear
          className="w-full md:w-1/6"
          loading={poliLoading}
          options={polis}
          showSearch
          optionFilterProp="label"
        />
        <DatePicker.RangePicker
          allowClear
          onChange={onChangeDate}
          placeholder={["Tgl Awal", "Tgl Akhir"]}
          className="w-full md:w-1/6"
        />
      </div>

      {isLoading ? (
        <SkeletonCards />
      ) : data?.length === 0 ? (
        <Empty
          className="mt-12"
          description="Tidak ada data"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
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
