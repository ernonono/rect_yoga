import React from "react";
import duit from "../assets/duit.png";
import useRegisterStore from "../states/useRegister";

function PembayaranCard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const { tipe_pembayaran, setTipe_pembayaran } = useRegisterStore(
    (state) => state,
  );
  return (
    <div
      onClick={() => {
        if (!user.patient?.bpjs) return;
        setTipe_pembayaran("BPJS");
      }}
      className={`w-[342px] pb-4 mt-16 relative flex flex-col items-center  
      ${tipe_pembayaran === "BPJS" ? "bg-[#63A375] text-white cursor-pointer" 
      : !user.patient?.bpjs ? "bg-gray-200 text-gray-500" : "bg-white cursor-pointer text-black"} shadow-lg rounded-2xl`}
    >
      <div className="mt-2 flex justify-center">
        {tipe_pembayaran === "BPJS" ? (
          // 'gambar putih'
          <img src={duit} style={{ width: "150px", height: "130px" }} />
        ) : (
          <img src={duit} style={{ width: "150px", height: "130px" }} />
        )}
      </div>
      <p className="text-center font-bold ">
        {user.patient?.bpjs ? "BPJS" : "BPJS Tidak Tersedia"}
      </p>
      <p className="text-center ">
        {user.patient?.bpjs
          ? "Klik untuk memilih pembayaran BPJS"
          : "Harap isi nomor BPJS pada halaman profil terlebih dahulu"}
      </p>
    </div>
  );
}

export default PembayaranCard;
