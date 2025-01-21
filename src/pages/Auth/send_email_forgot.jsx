import React, { useRef, useState } from "react";
import { UserIcon } from "@heroicons/react/16/solid";
import Logo from "../../assets/ImageLogin.png";
import Blob_1 from "../../assets/blob_1.png";
import Blob_2 from "../../assets/blob_2.png";
import { Button } from "antd";
import { useMutation } from "@tanstack/react-query";
import instance from "../../utils/axios";
import { toast } from "react-toastify";

export default function SendEmailForgotPassword() {
  const [email, setEmail] = useState("");
  const toastId = useRef(null);

  const mutation = useMutation({
    mutationFn: () => {
      return instance.post("/send-reset-password", { email });
    },

    onMutate: () => {
      toastId.current = toast("Mengirim Email...", {
        type: "info",
        isLoading: true,
      });
    },

    onSuccess: () => {
      toast.update(toastId.current, {
        render: "Email reset password berhasil dikirim ke email anda",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
    },

    onError: (error) => {
      console.log(error);
      toast.update(toastId.current, {
        render: error?.response?.data?.message || "Galat mengirim email",
        type: "error",
        isLoading: false,
      });
    },
  });

  return (
    <div className="flex relative justify-center items-center h-screen">
      <img
        src={Blob_1}
        alt="blob"
        className="absolute bottom-0 left-0 h-[80vh] z-[-1]"
      />
      <img
        src={Blob_2}
        alt="blob"
        className="absolute top-0 right-0 h-[80vh] z-[-1]"
      />

      <div className="px-8 py-24 bg-white shadow-md rounded-md items-center">
        <div className="w-full flex justify-between">
          <div className="w-1/2 pr-4">
            <img src={Logo} alt="star" />
          </div>
          <div className="w-1/2 pl-4">
            <h1 className="text-[24px] font-medium mb-[24px] text-center">
              Masukkan Email Anda
            </h1>
            <div className="mb-6 relative">
              <label htmlFor="email" className="block mb-1 text-[14px]">
                Email:
              </label>
              <div className="relative">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-4 rounded-[15px] text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#63A375]"
                  placeholder="Enter Your Email"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <UserIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="w-full flex justify-between">
              <div className="w-full mb-3">
                <Button
                  loading={mutation.isPending}
                  size="large"
                  block
                  type="primary"
                  className=""
                  onClick={() => mutation.mutate()}
                >
                  {mutation.isPending ? "Loading..." : "Reset Password"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
