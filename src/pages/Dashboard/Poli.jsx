import React from "react";
import Navbar from "../../components/Navbar";
import Banner from "../../components/Banner";
import Stetoskop from "../../assets/Stethoscope.png";
import { useNavigate } from "react-router-dom";
import useRegisterStore from "../../states/useRegister";
import instance from "../../utils/axios";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { SkeletonCards } from "../DashboardAdmin/appointments";

const fetchPoli = async () => {
  const { data } = await instance.get("/polis");
  return data;
};

export default function Poli() {
  const navigate = useNavigate();
  const { data, error, isLoading } = useQuery({
    queryKey: ["polis"],
    queryFn: fetchPoli,
  });
  const setPoli = useRegisterStore((state) => state.setPoli);

  const handlepoliClick = (poli, id) => {
    setPoli(poli, id);
    navigate("/dokter");
  };

  return (
    <div className="relative">
      <Navbar />
      {/* <Banner /> */}
      <div className="w-full text-center pt-4 pb-16">
        <div className="flex justify-between mx-20 items-center">
          <ArrowLeftOutlined className="text-6xl opacity-0 pointer-events-none text-primary" />
          <div className="font-black text-[#ADCEB7] text-8xl">PILIH POLI</div>
          <ArrowRightOutlined className="text-8xl opacity-0 pointer-events-none text-primary" />
        </div>
        <div className="flex flex-col justify-center">
          <div className="grid grid-cols-3 gap-8 justify-center mx-20 mt-10">
            {isLoading ? (
              <SkeletonCards noGrid />
            ) : (
              data?.map((item) => (
                <Card
                  title={
                    <span className="text-2xl text-primary font-semibold">
                      {item?.name}
                    </span>
                  }
                  onClick={() => handlepoliClick(item?.name, item?.id)}
                  className=" items-center  cursor-pointer"
                >
                  <div className="flex justify-center items-center">
                    <img src={Stetoskop} className="w-[45%]" />
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
