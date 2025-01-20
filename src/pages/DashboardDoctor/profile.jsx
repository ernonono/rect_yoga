import {
  Avatar,
  Button,
  Card,
  Divider,
  List,
  Skeleton,
  Tooltip,
  Typography,
} from "antd";
import React from "react";
import {
  UserOutlined,
  HomeFilled,
  EditOutlined,
  FacebookOutlined,
  GooglePlusOutlined,
  LinkedinOutlined,
  XOutlined,
} from "@ant-design/icons";
import { SocialMediaButton } from "../DashboardAdmin/doctors";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import instance from "../../utils/axios";

export default function DoctorProfile() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["doctor-profile"],
    queryFn: async () => {
      const { data } = await instance.get(`users/me`);
      return data?.doctor;
    },
  });

  return (
    <div>
      <Typography.Title className="text-[#767676] tracking-tight" level={2}>
        DOCTOR PROFILE
      </Typography.Title>

      {isLoading ? (
        <Skeleton.Node active className="w-full h-[500px]">
          {" "}
        </Skeleton.Node>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 mt-6">
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
                <Tooltip title="Edit profil">
                  <Button
                    onClick={() => navigate("/doctor/profile/edit")}
                    className="rounded-full h-[40px] w-[40px]"
                  >
                    <EditOutlined />
                  </Button>
                </Tooltip>
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
                dataSource={
                  typeof data?.education === "string"
                    ? JSON.parse(data?.education || [])
                    : data?.education || []
                }
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
