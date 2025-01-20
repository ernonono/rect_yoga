import React from "react";
import doctor from "../assets/doctor.png";
import useRegisterStore from "../states/useRegister";
import { Button } from "antd";

function CardDokter() {
  const { dokter, poli, dokter_data } = useRegisterStore((state) => state);
  const getUrl = (imgName) => {
    const imgUrl = `http://localhost:8000/doctor_image/${imgName}`;
    return imgUrl;
  };
  return (
    <div className="w-[342px] pb-10 relative flex flex-col items-center  bg-white shadow-lg">
      <div className="z-0 bg-[#63A375] rounded-t-xl h-[155px] absolute w-[342px]"></div>
      <div className="relative z-10 mt-[45px] bg-white w-[196px] h-[196px] flex justify-center items-center rounded-full shadow-lg">
        <img
          className="rounded-full w-full h-full object-cover"
          src={dokter_data?.image ? getUrl(dokter_data.image) : doctor}
        />
      </div>

      <p className="text-center font-bold mt-4">{dokter}</p>
      <p className="text-center ">{poli}</p>
      <Button
        target="_blank"
        className="text-center"
        href={`/profil-dokter/${dokter_data.id}`}
        type="link"
      >
        Lihat profil
      </Button>
    </div>
  );
}

export default CardDokter;
