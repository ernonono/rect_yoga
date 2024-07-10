import React from "react";
import Avatar from "../assets/Avatar2.jpg";


const link = [
  { text: "Beranda", path: '/beranda' },
  { text: "Daftar", path: '/poli' },
  { text: "Riwayat Pendaftaran", path:'/Riwayat' },
];

export default function Navbar() {
  return (
    <div className="flex justify-between h-[100px]">
      <div className="flex flex-grow items-center justify-center">
        {link.map((link, index) => (
          <a
            key={index}
            href={link.path}
            className="mx-[10px] font-semibold text-[20px] text-[#63A375]"
          >
            {link.text}
          </a>
        ))}
      </div>
      
      <div className="flex items-center bg-[#F9F9F9] rounded-[100px] py-2 px-4 mr-9">
        <div className="p-2">
          <img
            src={Avatar}
            alt="star"
            style={{ borderRadius: "50%", width: "45px", height: "45px" }}
          />
        </div>
        <div className="ml-1">
          <div className="font-bold text-[16px] text-[#292929] mr-[8px]">
            Nadiah Hatta M
          </div>
          <div className="text-[14px] text-[#B5B5B5]">Super Admin</div>
        </div>
      </div>
    </div>
  );
}
