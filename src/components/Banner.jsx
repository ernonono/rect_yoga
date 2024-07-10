import React from "react";
import Background from "../assets/bg.png";

export default function Banner() {
  return (
    <div className="relative w-screen h-[595px]">
      <img src={Background} style={{ width: "100%", height: "595px" }} />
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="w-1/2">
          <p className="font-semibold text-[40px] text-white">PENDAFTARAN POLI</p>
          <p className="font-light text-[24px] text-white">Buat janji temu dengan mudah dan tepat</p>
        </div>
      </div>
    </div>
  );
}