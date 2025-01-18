import React, { useEffect, useRef, useState } from "react";
import Avatar from "../assets/Avatar2.jpg";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import instance from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { Button, Menu, Popover } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";

const link = [
  { text: "Beranda", path: "/beranda" },
  { text: "Daftar", path: "/poli" },
  { text: "Riwayat Pendaftaran", path: "/Riwayat" },
];

export const capitalize = (str) => {
  const strArr = str.split(" ");
  const capitalizeArr = strArr.map((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  return capitalizeArr.join(" ");
};

export default function Navbar() {
  const toastId = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const [showLogout, setShowLogout] = useState(false);
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
  const PopoverContent = () => {
    return (
      <Menu className="w-[200px]">
        <Menu.Item icon={<UserOutlined />}>
          <a href="/profile">Profile</a>
        </Menu.Item>
        <Menu.Item
          danger
          className="mt-5"
          onClick={() => mutation.mutate()}
          icon={<LogoutOutlined />}
        >
          Logout
        </Menu.Item>
      </Menu>
    );
  };

  const getImageUrl = (image_name) => {
    return `http://localhost:8000/patient_image/${image_name}`;
  };

  return (
    <div className="flex px-6 justify-between items-center bg-white shadow-sm py-5">
      <div className="flex flex-grow items-center justify-start ">
        {link.map((link, index) => (
          <a key={index} href={link.path}>
            <Button type="link" size="large">
              {link.text}
            </Button>
          </a>
        ))}
      </div>

      <Popover
        arrow={false}
        placement="bottomRight"
        trigger="click"
        content={<PopoverContent />}
      >
        <div className="flex cursor-pointer relative min-w-[150px] h-fit items-center pl-1 pr-6 py-1 rounded-full  border border-gray-100 bg-[#F9F9F9] ">
          <img
            src={
              user?.patient?.image ? getImageUrl(user.patient.image) : Avatar
            }
            alt="star"
            style={{ borderRadius: "50%", width: "45px", height: "45px" }}
            className="object-cover "
          />
          <div className="ml-3">
            <div className="font-bold text-sm text-[#292929]">
              {user?.name || "User"}
            </div>
            <div className="text-xs text-[#B5B5B5]">
              {capitalize(user?.role || "guest")}
            </div>
          </div>
        </div>
      </Popover>
    </div>
  );
}
