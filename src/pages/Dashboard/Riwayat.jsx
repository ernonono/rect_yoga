import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Banner from "../../components/banner2";
import { useNavigate } from "react-router-dom";
import instance from "../../utils/axios";
import dayjs from "dayjs";

import 'dayjs/locale/id'

dayjs.locale('id')

export default function Riwayat() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true)
  const [data,setData] = useState([])

  const fetchRegistration = async () => {
    try {
      const { data } = await instance.get("/registrations");
      setData(data)
      setIsLoading(false)
    } catch (error) {
      setData([])
      console.log(error)
    }
  };

  useEffect(() => {
    fetchRegistration()
  }, [])


  const handleRiwayatClick = () => {
    navigate("/beranda");
  };

  return (
    <div className="relative">
      <Navbar />
      <Banner />
      <div className="absolute pb-18 mt-28 left-0 w-full text-center">
        <div className="font-black text-[#ADCEB7] text-[96px]">RIWAYAT</div>
        {isLoading ? 'Loading...' : (
        <div className="grid grid-cols-2 gap-8 pb-28">
          {data?.map((item) => (
            <div className="flex flex-col items-center mx-10">
            <div className="bg-[#63A375] p-4  border-gray-200 shadow-md min-h-[200px] w-[600px] flex items-center text-left justify-left">
              <div className="text-white">
                <p className="font-semibold">Hari</p>
                <p className="text-sm">{dayjs(item?.appointment_date).format('dddd, DD MMMM YYYY')}</p>
                <p className="mt-4 font-semibold">Poli</p>
                <p className="text-sm">{item?.doctor?.poli?.name}</p>
                <p className="mt-2 font-semibold">Dokter</p>
                <p className="text-sm">{item?.doctor?.name}</p>
                <p className="mt-2 font-semibold">Status</p>
                <p className="text-sm">{item?.status}</p>
              </div>
            </div>
            <div className="bg-white p-4 w-[600px]  border-gray-200 shadow-md">
              <a href="#" className="text-[#63A375]  ">
                Lihat rekam medis
              </a>
            </div>
          </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
