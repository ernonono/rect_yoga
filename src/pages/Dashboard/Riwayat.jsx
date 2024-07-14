import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Banner from "../../components/banner2";
import { useNavigate, useSearchParams } from "react-router-dom";
import instance from "../../utils/axios";
import dayjs from "dayjs";

import "dayjs/locale/id";
import {
  Button,
  Card,
  Descriptions,
  Drawer,
  Input,
  Modal,
  Tag,
  Timeline,
  Typography,
} from "antd";

import { FileTextOutlined } from "@ant-design/icons";

dayjs.locale("id");

const MedicalRecordTimeline = ({ data, onDelete, onEdit, deleteLoading }) => {
  const [open, setOpen] = useState([data?.rm?.map(() => false)]);
  const items = data?.rm?.map((item, idx) => ({
    children: (
      <Card
        size="small"
        title={
          <div className="w-full flex justify-between items-center">
            <span>{dayjs(item.date).format("DD MMMM YYYY")}</span>
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
      children: data?.registration?.patient?.name,
    },
    {
      label: "Tanggal Check Up",
      children: dayjs(data?.registration?.appointment_date).format(
        "dddd, D MMMM YYYY",
      ),
    },
    {
      label: "Poli",
      children: data?.registration?.doctor?.poli?.name,
    },
    {
      label: "Dokter",
      children: data?.registration?.doctor?.name,
    },
    {
      label: "Status",
      children: (
        <Tag
          color={
            data?.registration?.status === "Belum Selesai" ? "red" : "green"
          }
        >
          {data?.registration?.status}
        </Tag>
      ),
    },
  ];

  return (
    <>
      <Descriptions
        items={descriptionItems}
        className="mb-4"
        column={1}
        bordered
        size="small"
      />

      <Timeline reverse items={items} />
    </>
  );
};

export default function Riwayat() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [registrationId, setRegistrationId] = useState(null);
  const [dataRM, setDataRM] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  const handleViewRM = (id) => {
    setParams({ identifier: id });
  };

  const fetchRegistration = async () => {
    try {
      const { data } = await instance.get("/registrations");
      setData(data);
      setIsLoading(false);
    } catch (error) {
      setData([]);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRegistration();
  }, []);

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
    <div className="relative">
      <Navbar />
      <Banner />
      <div className="pb-18 mt-28 text-center">
        <div className="font-black text-[#ADCEB7] text-[96px]">RIWAYAT</div>
        {isLoading ? (
          "Loading..."
        ) : (
          <div className="grid grid-cols-2 gap-8 pb-28">
            {data?.map((item) => (
              <div className="flex flex-col items-center mx-10">
                <div className="bg-[#63A375] p-4  border-gray-200 shadow-md min-h-[200px] w-[600px] flex items-center text-left justify-left">
                  <div className="text-white">
                    <p className="font-semibold">Hari</p>
                    <p className="text-sm">
                      {dayjs(item?.appointment_date).format(
                        "dddd, DD MMMM YYYY",
                      )}
                    </p>
                    <p className="mt-4 font-semibold">Poli</p>
                    <p className="text-sm">{item?.doctor?.poli?.name}</p>
                    <p className="mt-2 font-semibold">Dokter</p>
                    <p className="text-sm">{item?.doctor?.name}</p>
                    <p className="mt-2 font-semibold">Status</p>
                    <p className="text-sm">{item?.status}</p>
                  </div>
                </div>
                <div
                  onClick={() => handleViewRM(item.id)}
                  className="bg-white p-4 w-[600px] cursor-pointer border-gray-200 shadow-md"
                >
                  <span className="text-[#63A375]  ">
                    Lihat rekam medis ({item?.medical_records?.length || 0})
                  </span>
                </div>
              </div>
            ))}

            <Drawer
              title="Riwayat Rekam Medis"
              placement="right"
              width={500}
              closable={false}
              onClose={() => setParams({})}
              open={!!registrationId}
            >
              {dataRM?.rm?.length > 0 ? (
                <MedicalRecordTimeline data={dataRM} />
              ) : (
                <p>
                  No medical records found. Please wait for your medical
                  records.
                </p>
              )}
            </Drawer>
          </div>
        )}
      </div>
    </div>
  );
}
