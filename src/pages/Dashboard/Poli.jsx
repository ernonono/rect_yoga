import React from "react";
import Navbar from "../../components/Navbar";
import Banner from "../../components/Banner";
import Stetoskop from "../../assets/Stethoscope.png";
import { useNavigate } from "react-router-dom";
import useRegisterStore from "../../states/useRegister";
import instance from "../../utils/axios";
import { useQuery } from "@tanstack/react-query";

const fetchPoli = async () => {
  const {data} = await instance.get('/polis')
  return data
}

export default function Poli() {
  const navigate = useNavigate();
  const {data, error, isLoading} = useQuery({
    queryKey: ['polis'],
    queryFn: fetchPoli
  })
  const setPoli = useRegisterStore((state) => state.setPoli)

  const handlepoliClick = (poli,id) => {
    setPoli(poli,id)
    navigate("/dokter");
  };
  
  
  return (
    <div className="relative">
      <Navbar />
      <Banner />
      <div className="absolute mt-28 left-0 w-full text-center">
        <div className="font-black text-[#ADCEB7] text-[96px]">POLI</div>
        <div className="flex flex-col justify-center">
          <div className="grid grid-cols-3 gap-8 justify-center mt-10">
            {isLoading ? 'Loading...' : (
              data?.map((item) => (
            <div  onClick={() => handlepoliClick(item?.name, item?.id)} className="flex flex-col items-center mx-10 cursor-pointer">
              <div className="bg-white border-gray-200 shadow-md p-4 h-[356px] w-[356px] rounded-[50px] flex items-center justify-center">
                <img src={Stetoskop} style={{ width: "70%", height: "70%" }} />
              </div>
              <p className="font-black text-[30px] text-[#63A375] mt-4" type="text" 
             > 
              {item?.name}
              </p>
            </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
