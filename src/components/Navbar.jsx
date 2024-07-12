import React, { useEffect, useRef, useState } from "react";
import Avatar from "../assets/Avatar2.jpg";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import instance from "../utils/axios";
import { useNavigate } from "react-router-dom";

const link = [
  { text: "Beranda", path: "/beranda" },
  { text: "Daftar", path: "/poli" },
  { text: "Riwayat Pendaftaran", path: "/Riwayat" },
];

const capitalize = (str) => {
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

  return (
    <div className="flex justify-between h-[100px]">
      <div className="flex flex-grow items-center justify-center">
        {link.map((link, index) => (
          <a
            key={index}
            href={link.path}
            className="mx-[10px] font-semibold text-[20px] text-[#63A375]"
          >
            {link.text}
          </a>
        ))}
      </div>

      <div
        onClick={() => setShowLogout(!showLogout)}
        className="flex cursor-pointer relative min-w-[150px] items-center bg-[#F9F9F9] rounded-[100px] py-2 px-4 mr-9"
      >
        <div className="p-2">
          <img
            src={Avatar}
            alt="star"
            style={{ borderRadius: "50%", width: "45px", height: "45px" }}
          />
        </div>
        <div className="ml-1">
          <div className="font-bold text-[16px] text-[#292929] mr-[8px]">
            {user?.name || "User"}
          </div>
          <div className="text-[14px] text-[#B5B5B5]">
            {capitalize(user?.role || "guest")}
          </div>
        </div>

        {showLogout && (
          <div
            onClick={() => mutation.mutate()}
            className="absolute z-[9999] right-0 top-7 mt-12 w-[200px]
            hover:bg-[#F9F9F9]
          bg-white shadow-md rounded-md p-4"
          >
            <div className="text-[14px] text-[#292929]">Logout</div>
          </div>
        )}
      </div>
    </div>
  );
}
