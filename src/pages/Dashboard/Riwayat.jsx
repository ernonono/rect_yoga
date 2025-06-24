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
  List,
  Modal,
  Tag,
  Timeline,
  Typography,
} from "antd";

import { FileTextOutlined, DownloadOutlined } from "@ant-design/icons";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

dayjs.locale("id");

const MedicalRecordTimeline = ({ data, onDelete, onEdit, deleteLoading }) => {
  const [open, setOpen] = useState([...data?.rm?.map(() => false)]);
  const downloadPdf = async () => {
    const element = document.getElementById("capture");
    if (!element) return;

    const canvas = await html2canvas(element, {
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      unit: "in",
      format: [14, 10], // A4 size in inches (14in x 10in)
    });
    pdf.addImage(imgData, "PNG", 0.1, 0.1); // A4 size in mm
    pdf.save(
      `instruksi_pengambilan_obat_${data.registration.patient.name}.pdf`,
    );
  };
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
          title={
            <div className="flex justify-between items-center mr-5">
              <span></span>

              <Button
                type="primary"
                size="small"
                onClick={() => {
                  downloadPdf();
                }}
                icon={<DownloadOutlined />}
              >
                Download Instruksi
              </Button>
            </div>
          }
        >
          <div className="border p-5" id="capture">
            <p className="text-lg text-center mb-2">Pengambilan Obat</p>
            <Card title={<p className="pb-2">Obat</p>} size="small">
              <List
                size="small"
                dataSource={item?.drug_code ? JSON.parse(item.drug_code) : []}
                renderItem={(
                  drug,
                  index, // Changed 'item' to 'drug' for clarity within renderItem
                ) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<span>{index + 1}</span>}
                      title={drug.name}
                      description={`Kode Obat: ${drug.code}`}
                    />
                  </List.Item>
                )}
              />
            </Card>

            {/* Tambahkan Card baru untuk Dosis Obat di sini */}
            <Card
              title={<p className="pb-2">Dosis Obat</p>}
              className="mt-4"
              size="small"
            >
              <Input.TextArea
                value={item.dosis || "Belum ada dosis"} // Display dosis, provide a fallback if null
                rows={3} // Sesuaikan jumlah baris sesuai kebutuhan
                readOnly
                variant="borderless"
                className="w-full"
              />
            </Card>

            <Card
              title={<p className="pb-2">Catatan Dokter</p>}
              className="mt-4"
              size="small"
            >
              <Input.TextArea
                value={item.prescription}
                rows={7}
                readOnly
                variant="borderless"
                className="w-full"
              />
            </Card>
          </div>
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
      label: "Jam Janji",
      children: dayjs(data?.registration?.appointment_date).format("HH:mm"),
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
  const [dataBelumSelesai, setDataBelumSelesai] = useState([]);
  const [dataSelesai, setDataSelesai] = useState([]);
  const [dataBatal, setDataBatal] = useState([]);

  const handleViewRM = (id) => {
    setParams({ identifier: id });
  };

  const fetchRegistration = async () => {
    try {
      const { data } = await instance.get("/registrations");
      console.log("Data dari API:", data);
      setDataBelumSelesai(data.belum_selesai);
      setDataSelesai(data.selesai);
      setDataBatal(data.dibatalkan);
      setIsLoading(false);
    } catch (error) {
      setDataBelumSelesai([]);
      setDataSelesai([]);
      setDataBatal([]);
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
    if (registrationId && dataBelumSelesai) {
      const regis = dataBelumSelesai.find(
        (item) => item.id === parseInt(registrationId || "0"),
      );
      const rm = regis?.medical_records || [];

      setDataRM({
        registration: regis,
        rm,
      });
    }
    if (registrationId && dataSelesai) {
      const regis = dataSelesai.find(
        (item) => item.id === parseInt(registrationId || "0"),
      );
      const rm = regis?.medical_records || [];

      setDataRM({
        registration: regis,
        rm,
      });
    }
  }, [registrationId, dataBelumSelesai, dataSelesai]);

  const handleCancel = async (id) => {
    if (!window.confirm("Yakin ingin membatalkan pendaftaran ini?")) return;
    try {
      const { data } = await instance.delete(`/registrations/${id}`);
      alert(data.message);
      await fetchRegistration();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal membatalkan.");
    }
  };

  useEffect(() => {
    fetchRegistration();
  }, []);

  return (
    <div className="relative">
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
          <p>No medical records found. Please wait for your medical records.</p>
        )}
      </Drawer>

      <Navbar />
      {/* <Banner /> */}
      <div className="pb-18 mt-10 text-center">
        <div className="font-black text-[#ADCEB7] text-[96px]">RIWAYAT</div>

        <div className="font-black text-left text-[#ADCEB7] text-[48px] mx-16">
          Belum selesai
        </div>
        {isLoading ? (
          "Loading..."
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-16 pb-28 justify-start">
            {dataBelumSelesai?.map((item) => (
              <div
                key={item.id}
                className=" rounded-xl border border-gray-200 shadow-md min-h-[100px] w-full max-w-[428px] overflow-hidden"
              >
                <div className="flex flex-col items-center">
                  <div className="bg-[#ffb627] p-4 border-gray-200 shadow-md w-full flex text-left justify-start relative">
                    <div className="text-white">
                      <p className="font-semibold">Hari</p>
                      <p className="text-sm">
                        {dayjs(item?.appointment_date).format(
                          "dddd, DD MMMM YYYY",
                        )}
                      </p>
                      <p className="mt-4 font-semibold">Sesi Janji</p>
                      <p className="text-sm">
                        {dayjs(item?.appointment_date).format("HH:mm")}{" "}
                        {/* Format 24 jam */}
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
                    className="bg-white p-4 w-full cursor-pointer border-gray-200 shadow-md "
                  >
                    <span className="text-[#63A375]  ">
                      Lihat rekam medis ({item?.medical_records?.length || 0})
                    </span>
                  </div>
                  <div
                    onClick={() => handleCancel(item.id)}
                    className="bg-[#ffb627] hover:bg-yellow-600  p-4 w-full cursor-pointer border-gray-200 shadow-md"
                  >
                    <span className="text-white ">Batal Daftar</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="font-black text-left text-[#ADCEB7] text-[48px] mx-16">
          Selesai
        </div>
        {isLoading ? (
          "Loading..."
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-16 pb-28 justify-start">
            {dataSelesai?.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-gray-200 shadow-md min-h-[200px] w-full max-w-[428px] overflow-hidden"
              >
                <div className="flex flex-col items-center">
                  <div className="bg-[#63A375] p-4 border-gray-200 shadow-md w-full flex text-left justify-start relative">
                    <div className="text-white">
                      <p className="font-semibold">Hari</p>
                      <p className="text-sm">
                        {dayjs(item?.appointment_date).format(
                          "dddd, DD MMMM YYYY",
                        )}
                      </p>
                      <p className="mt-4 font-semibold">Sesi Janji</p>
                      <p className="text-sm">
                        {dayjs(item?.appointment_date).format("HH:mm")}{" "}
                        {/* Format 24 jam */}
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
                    className="bg-white p-4 w-full cursor-pointer border-gray-200 shadow-md"
                  >
                    <span className="text-[#63A375]  ">
                      Lihat rekam medis ({item?.medical_records?.length || 0})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="font-black text-left text-[#ADCEB7] text-[48px] mx-16">
          Dibatalkan
        </div>
        {isLoading ? (
          "Loading..."
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-16 pb-28 justify-start">
            {dataBatal?.map((item, index) => (
              <div
                key={item.id}
                className="rounded-xl border border-gray-200 shadow-md min-h-[200px] w-full max-w-[428px] overflow-hidden"
              >
                <div className="flex flex-col items-center">
                  <div className="bg-[#c3423f] p-4 border-gray-200 shadow-md w-full flex text-left justify-start relative">
                    <div className="text-white">
                      <p className="font-semibold">Hari</p>
                      <p className="text-sm">
                        {dayjs(item?.appointment_date).format(
                          "dddd, DD MMMM YYYY",
                        )}
                      </p>
                      <p className="mt-4 font-semibold">Sesi Janji</p>
                      <p className="text-sm">
                        {dayjs(item?.appointment_date).format("HH:mm")}{" "}
                        {/* Format 24 jam */}
                      </p>
                      <p className="mt-4 font-semibold">Poli</p>
                      <p className="text-sm">{item?.doctor?.poli?.name}</p>
                      <p className="mt-2 font-semibold">Dokter</p>
                      <p className="text-sm">{item?.doctor?.name}</p>
                      <p className="mt-2 font-semibold">Status</p>
                      <p className="text-sm">{item?.status}</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 w-full border-gray-200 shadow-md">
                    <span className="text-[#63A375]">
                      Pendaftaran Dibatalkan
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
