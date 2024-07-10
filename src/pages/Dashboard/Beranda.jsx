import React from "react";
import Navbar from "../../components/Navbar";
import Banner from "../../components/banner3";
import tatacara from "../../assets/video.mp4";

export default function Beranda() {
  return (
    <div className="relative">
      <Navbar />
      <Banner />
      <div className="absolute mt-60 left-0 w-full text-center">
        <div className="font-black text-[#ADCEB7] text-[96px]">Tata Cara</div>
        <div className="flex flex-col justify-center">
        <div className="flex flex-row px-28 mt-24">
            <div className="flex flex-col items-center mx-10">
            <div className="bg-white border-gray-200 shadow-md p-4 h-[356px] w-[556px] rounded-[50px] flex items-center justify-center">
                <video controls autostart autoPlay src={tatacara.mp4} style={{ width: "70%", height: "70%" }} />
            </div>
            </div>
                <div className="md:w-1/2 md:pl-8 text-left mt-28">
                <h2 className="text-3xl font-bold mb-4">Tata cara Pendaftaran Online RS Lorem</h2>
                <p className="mb-4">
                Disini terdapat video untuk memberi tahu tata cara mendaftar pada sistem ini. 
                Silahkan menyimak video dengan baik jika belum paham dengan cara untuk mendaftar pada sistem ini.
                </p>
                </div>
        </div>
        </div>
        </div>
    </div>
  );
}
