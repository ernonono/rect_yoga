import React, { useEffect, useRef, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  UserOutlined,
  CalendarOutlined,
  SettingOutlined,
  LogoutOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { capitalize } from "../components/Navbar";
import { useMutation } from "@tanstack/react-query";
import instance from "../utils/axios";
import { toast } from "react-toastify";
import { UserCircleIcon } from "@heroicons/react/16/solid";
import AdminGuard from "../components/AdminGuard";
const { Header, Sider, Content } = Layout;

const numStrArr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const AdminLayout = () => {
  const toastId = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const currentPath = window.location.pathname;

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
      key: "/admin",
      icon: <AppstoreOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/admin"),
    },
    {
      key: "/admin/appointments",
      icon: <CalendarOutlined />,
      label: "Jadwal Janji",
      onClick: () => navigate("/admin/appointments"),
    },
    {
      key: "/admin/doctors",
      icon: <UserOutlined />,
      label: "Doktor",
      children: [
        {
          key: "/admin/doctors",
          label: "Semua Doktor",
          onClick: () => navigate("/admin/doctors"),
        },
        
      ],
    },

    {
      key: "/admin/patients",
      icon: <UserOutlined />,
      label: "Pasien",
      children: [
        {
          key: "/admin/patients",
          label: "Semua Pasien",
          onClick: () => navigate("/admin/patients"),
        },
        
        {
          key: "/admin/patients/medical-records",
          label: "Rekam Medis",
          onClick: () => navigate("/admin/patients/medical-records"),
        },
      ],
    },
    {
      key: "/admin/poli",
      icon: <ShopOutlined />,
      label: "Poli",
      children: [
        {
          key: "/admin/poli",
          label: "Semua Poli",
          onClick: () => navigate("/admin/poli"),
        },
        
      ],
    },
    {
      key: "/admin/other",
      icon: <SettingOutlined />,
      label: "Lainnya",
      children: [
        {
          key: "/admin/other/schedule",
          label: "Jadwal Doktor",
          onClick: () => navigate("/admin/other/schedule"),
        },
        {
          key: "/admin/other/healthcare",
          label: "Pelayanan Kesehatan",
          onClick: () => navigate("/admin/other/healthcare"),
        },
      ],
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

    let title = "FASYANKES";

    if (numStrArr.includes(pageName[0])) {
      title = `Detail`;
    } else {
      title = capitalize(parsedPageName || "Dashboard");
    }

    document.title = title;
  }, [currentPath]);

  return (
    <AdminGuard>
      <Layout className="min-h-screen">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="flex cursor-pointer relative gap-3 py-5 items-center justify-center w-full ">
            <Avatar
              size={45}
              icon={<UserCircleIcon className="text-[#63A375]" />}
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
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </AdminGuard>
  );
};
export default AdminLayout;
