import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Banner from "../../components/Banner";
import doctor from "../../assets/doctor.png";
import useRegisterStore from "../../states/useRegister";
import { useNavigate } from "react-router-dom";
import PilihTanggal from "./kalender";
import Pembayaran from "./pembayaran";
import instance from "../../utils/axios";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { SkeletonCards } from "../DashboardAdmin/appointments";

export default function Dokter() {
  const navigate = useNavigate();
  const { poli, poli_id, setDokter, setDokterData } = useRegisterStore(
    (state) => state,
  );
  const [open, setOpen] = useState(false);
  const [openPembayaran, setOpenPembayaran] = useState(false);
  const { data, error, isLoading } = useQuery({
    queryKey: ["dokters"],
    queryFn: async () => {
      const { data } = await instance.get(`doctors?poli_id=${poli_id}`);
      return data;
    },
  });

  const onClickDokter = (dokter, id, data) => {
    setDokterData(data);

    setDokter(dokter, id);
    setOpen(true);
  };

  const getUrl = (imgName) => {
    const imgUrl = `http://localhost:8000/doctor_image/${imgName}`;
    return imgUrl;
  };

  return (
    <div className="relative">
      <Navbar />
      {/* <Banner /> */}

      <div
        className={`bg-black/15 absolute w-screen h-screen z-[900] ${open || openPembayaran ? "block" : "hidden"}`}
      ></div>
      <PilihTanggal
        onFinish={() => {
          setOpen(false);
          setOpenPembayaran(true);
        }}
        onClose={() => setOpen(false)}
        open={open}
      />
      <Pembayaran
        onFinish={() => {
          setOpenPembayaran(false);
          setOpen(true);
        }}
        onClose={() => setOpenPembayaran(false)}
        open={openPembayaran}
      />
      <div className="pt-4 pb-16 w-full text-center">
        <div className="flex justify-between mx-20 items-center">
          <ArrowLeftOutlined
            onClick={() => navigate("/poli")}
            className="text-6xl  text-primary"
          />
          <div className="font-black text-[#ADCEB7] uppercase text-8xl">
            DOKTER {poli}
          </div>
          <ArrowRightOutlined className="text-8xl opacity-0 pointer-events-none text-primary" />
        </div>
        <div className="grid grid-cols-3 mt-10 mx-20 gap-8">
          {isLoading ? (
            <SkeletonCards noGrid />
          ) : (
            data?.map((item) => (
              <Card className="flex flex-col items-center ">
                <div className="flex justify-center mb-4">
                  <img
                    className="rounded-md"
                    src={item?.image ? getUrl(item.image) : doctor}
                    style={{ width: "30%", height: "30%" }}
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-lg font-bold">{item.name}</h2>
                  <p className="font-semibold text-gray-600">
                    {item.specialty}
                  </p>
                  <p className="text-gray-500">(Semua Jenis Pembayaran)</p>
                </div>
                <Button
                  size="large"
                  block
                  type="primary"
                  onClick={() => onClickDokter(item.name, item.id, item)}
                  className="mt-6"
                >
                  Daftar
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
