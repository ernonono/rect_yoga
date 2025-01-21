import React from "react";
import Navbar from "../../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Avatar, Card, Divider, List, Skeleton, Typography } from "antd";
import { SocialMediaButton } from "../DashboardAdmin/doctors";
import {
  FacebookOutlined,
  GooglePlusOutlined,
  LinkedinOutlined,
  UserOutlined,
  XOutlined,
  HomeFilled,
} from "@ant-design/icons";
import instance from "../../utils/axios";

export default function ProfileDokter() {
  const { id } = useParams();
  const [education, setEducation] = React.useState([]);
  const { data, isLoading } = useQuery({
    queryKey: ["doctor", id],
    queryFn: async () => {
      const { data } = await instance.get(`/doctors/${id}`);

      const education =
        typeof data.education === "string"
          ? JSON.parse(data.education)
          : data?.education || [];
      setEducation(education);

      return data;
    },
  });

  return (
    <div>
      <Navbar />
      {isLoading ? (
        <div className="max-w-6xl mx-auto mt-6">
          <Skeleton.Node active className="w-full h-[700px]">
            {" "}
          </Skeleton.Node>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 mt-6">
          <div className="w-full md:w-1/4 flex flex-col items-center">
            <Avatar
              icon={<UserOutlined />}
              size={150}
              src={
                data?.image
                  ? `http://localhost:8000/doctor_image/${data?.image}`
                  : null
              }
              className="mb-4"
            />

            <div className="flex flex-col items-center mb-8">
              <span className="text-[#767676] font-light text-2xl">
                {data?.name}
              </span>
              <span className="text-[#AAAAAA] font-light text-lg">
                {data?.poli?.name}
              </span>
            </div>

            <div className="flex w-full items-center gap-2 py-3 px-8 bg-[#E8E8E8] text-[#878787]">
              <HomeFilled />

              <span>{data?.address}</span>
            </div>

            <div className="flex gap-3 mt-4 items-center">
              {data?.facebok_link && (
                <SocialMediaButton
                  link={data?.facebok_link}
                  icon={<FacebookOutlined />}
                />
              )}
              {data?.twitter_link && (
                <SocialMediaButton
                  link={data?.twitter_link}
                  icon={<XOutlined />}
                />
              )}
              {data?.google_plus_link && (
                <SocialMediaButton
                  link={data?.google_plus_link}
                  icon={<GooglePlusOutlined />}
                />
              )}
              {data?.linkedin_link && (
                <SocialMediaButton
                  link={data?.linkedin_link}
                  icon={<LinkedinOutlined />}
                />
              )}
            </div>
          </div>

          <Card className="w-full md:w-3/4">
            <div>
              <div className="flex items-center justify-between">
                <Typography.Title className="font-light" level={4}>
                  {data?.specialty}
                </Typography.Title>
              </div>
              <Typography.Text>{data?.specialty_description}</Typography.Text>
            </div>

            <Divider />

            <div>
              <Typography.Title className="font-light" level={4}>
                Tentang Dokter
              </Typography.Title>
              <Typography.Text>{data?.about}</Typography.Text>
            </div>

            <Divider />

            <div>
              <Typography.Title className="font-light" level={4}>
                Pendidikan
              </Typography.Title>

              <List
                itemLayout="horizontal"
                dataSource={education}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.institution}
                      description={`${item.start_year} - ${item.end_year}`}
                    />
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
