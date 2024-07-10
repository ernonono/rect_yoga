import React from "react";
import Background from "../assets/bg.png";

export default function Banner() {
  return (
    <div className="relative w-screen h-[595px]">
      <img src={Background} style={{ width: "100%", height: "595px" }} />
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="w-1/2">
          <p className="font-semibold text-[40px] text-white">Riwayat Pendaftaran Pasien</p>
          <p className="font-light text-[24px] text-white">Daftar Riwayat Pesanan Anda</p>
        </div>
      </div>
    </div>
  );
}