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

export default function Dokter() {
  const navigate = useNavigate();
  const { poli, poli_id, setDokter } = useRegisterStore((state) => state);
  const [open, setOpen] = useState(false);
  const [openPembayaran, setOpenPembayaran] = useState(false);
  const { data, error, isLoading } = useQuery({
    queryKey: ["dokters"],
    queryFn: async () => {
      const { data } = await instance.get(`doctors?poli_id=${poli_id}`);
      return data;
    },
  });

  const onClickDokter = (dokter, id) => {
    setDokter(dokter, id);
    setOpen(true);
  };

  return (
    <div className="relative">
      <Navbar />
      <Banner />

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
        onFinish={() => setOpenPembayaran(false)}
        onClose={() => setOpenPembayaran(false)}
        open={openPembayaran}
      />
      <div className="absolute mt-28 left-0 w-full text-center">
        <div className="font-black text-[#ADCEB7] text-[96px] uppercase">
          DOKTER {poli}
        </div>
        <div className="grid grid-cols-3 mt-10 gap-8">
          {isLoading
            ? "Loading..."
            : data?.map((item) => (
                <div className="flex flex-col items-center mx-10">
                  <div className="bg-white border-gray-200 shadow-md p-4 h-[356px] w-[500px] rounded-[50px] text-center m-2">
                    <div className="flex justify-center mb-4">
                      <img
                        src={doctor}
                        style={{ width: "30%", height: "30%" }}
                      />
                    </div>
                    <div className="text-center">
                      <h2 className="text-lg font-bold">{item.name}</h2>
                      <p className="text-gray-500">(Semua Jenis Pembayaran)</p>
                    </div>
                    <button
                      onClick={() => onClickDokter(item.name, item.id)}
                      className="mt-4 bg-[#63A375] text-white py-2 px-4 rounded-lg hover:bg-green-500 h-[50x] w-[400px] transition duration-200"
                    >
                      Daftar
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
