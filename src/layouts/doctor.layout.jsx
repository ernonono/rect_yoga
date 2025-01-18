import React, { useEffect, useRef, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  UserOutlined,
  CalendarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { capitalize } from "../components/Navbar";
import { useMutation } from "@tanstack/react-query";
import instance from "../utils/axios";
import { toast } from "react-toastify";
import { UserCircleIcon } from "@heroicons/react/16/solid";
import DoctorGuard from "../components/DoctorGuard";
const { Header, Sider, Content } = Layout;

const DoctorLayout = () => {
  const toastId = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const currentPath = window.location.pathname;

  const [showLogout, setShowLogout] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const mutation = useMutation({
    mutationFn: (form) => {
      return instance.post("/logout", form);
    },

    onMutate: () => {
      toastId.current = toast("Loading...", {
        type: "info",
        isLoading: true,
      });
    },

    onSuccess: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.update(toastId.current, {
        render: "Logout Success",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    },

    onError: (error) => {
      console.log(error);
      toast.update(toastId.current, {
        render: error?.response?.data?.message || "Logout Failed",
        type: "error",
        isLoading: false,
      });
    },
  });

  const menuItems = [
    {
      key: "/doctor",
      icon: <AppstoreOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/doctor"),
    },
    {
      key: "/doctor/appointments",
      icon: <CalendarOutlined />,
      label: "Jadwal Janji",
      onClick: () => navigate("/doctor/appointments"),
    },
    {
      key: "/doctor/profile",
      icon: <UserOutlined />,
      label: "Profil",
      onClick: () => navigate("/doctor/profile"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: () => mutation.mutate(),
    },
  ];

  useEffect(() => {
    const pageName = currentPath.split("/")[currentPath.split("/").length - 1];
    const parsedPageName = pageName.split("-").join(" ");
    document.title = capitalize(parsedPageName || "Dashboard");
  }, [currentPath]);

  return (
    <DoctorGuard>
      <Layout className="min-h-screen">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div
            onClick={() => setShowLogout(!showLogout)}
            className="flex cursor-pointer relative gap-3 py-5 items-center justify-center w-full "
          >
            <Avatar
              size={45}
              icon={<UserCircleIcon className="text-[#63A375]" />}
              src={
                user?.doctor?.image
                  ? `http://localhost:8000/doctor_image/${user.doctor.image}`
                  : null
              }
            />
            <div
              className="w-fit"
              style={{
                // whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100px",
                display: collapsed ? "none" : "block",
              }}
            >
              <p className="font-bold text-[16px] text-white leading-none">
                {user?.name || "guest"}
              </p>
              <span className="text-[14px] text-[#B5B5B5]">
                {capitalize(user?.role || "guest")}
              </span>
            </div>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[currentPath]}
            items={menuItems}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background:
                currentPath === "/doctor/profile" ? "" : colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </DoctorGuard>
  );
};
export default DoctorLayout;
