import React from "react";
import Navbar from "../../components/Navbar";
import Banner from "../../components/banner3";
import { useQuery } from "@tanstack/react-query";
import instance from "../../utils/axios";
import { Card } from "antd";

const VideoItem = ({ video }) => {
  const videoUrl = video.video
    ? `http://localhost:8000/healthcare_video/${video.video}`
    : null;

  return (
    <Card title={video.title} className="cursor-pointer" bordered={false}>
      <div className="flex gap-6">
        {videoUrl ? (
          <video className="w-1/2 rounded-md" controls src={videoUrl} />
        ) : (
          <div className="w-1/2 flex items-center justify-center bg-gray-100 text-gray-500 rounded-md">
            Tidak ada video
          </div>
        )}

        <div className="w-1/2">
          <p className="text-left">{video.description}</p>
        </div>
      </div>
    </Card>
  );
};

export default function Beranda() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["healthcare-list"],
    queryFn: async () => {
      const { data } = await instance.get("healthcares");
      return data;
    },
  });

  return (
    <div className="relative">
      <Navbar />
      <Banner />
      <div className="absolute mt-60 left-0 w-full text-center">
        <div className="font-black text-[#ADCEB7] text-[96px]">
          Layanan Kesehatan
        </div>

        <div className="grid grid-cols-1 gap-4 p-4">
          {isLoading && <div>Loading...</div>}
          {error && <div>Error...</div>}
          {data?.map((video) => (
            <VideoItem key={video.id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
}
