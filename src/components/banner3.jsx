import React from "react";
import Background from "../assets/bg.png";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

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
          <h1 className="font-extrabold text-[70px] text-white">PENDAFTARAN</h1>
          <h1 className="font-extrabold text-[70px] text-white">
            ONLINE RS LOREM
          </h1>
          <p className="font-light text-[24px] text-white">
            Pendaftaran Online RS lorem, mendaftar rawat jalan dengan mudah dan
            praktis.
          </p>
          <div className="flex space-x-4">
            <Button
              onClick={handlebannerClick}
              type="primary"
              size="large"
              className="mt-7 px-14"
            >
              Daftar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
