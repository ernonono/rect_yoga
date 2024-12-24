import React from "react";
import Background from "../assets/bg.png";
import { useNavigate } from "react-router-dom";

export default function Banner() {
  const navigate = useNavigate();

  const handlebannerClick = () => {
    navigate("/poli");
  };
  return (
    <div className="relative w-full h-[595px]">
      <img src={Background} style={{ width: "100%", height: "750px" }} />
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="w-1/2">
          <h1 className="font-extrabold text-[40px] text-white">PENDAFTARAN</h1>
          <h1 className="font-extrabold text-[40px] text-white">
            ONLINE RS LOREM
          </h1>
          <p className="font-light text-[24px] text-white">
            Pendaftaran Online RS lorem, mendaftar rawat jalan dengan mudah dan
            praktis.
          </p>
          <div className="flex space-x-4">
            <button
              className="mt-10 bg-[#63A375] text-white py-2 px-4 rounded-lg hover:bg-green-500 h-[50px] w-[150px] transition duration-200"
              onClick={handlebannerClick}
            >
              Daftar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
