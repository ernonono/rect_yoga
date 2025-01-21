import React, { useRef, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import Logo from "../../assets/ImageLogin.png";
import Blob_1 from "../../assets/blob_1.png";
import Blob_2 from "../../assets/blob_2.png";
import { Button } from "antd";
import { useMutation } from "@tanstack/react-query";
import instance from "../../utils/axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    password: "",
    confirm_password: "",
    email: params.get("email"),
    token: params.get("token"),
  });
  const toastId = useRef(null);

  const handleChange = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };

  const mutation = useMutation({
    mutationFn: () => {
      return instance.post("/reset-password", form);
    },

    onMutate: () => {
      toastId.current = toast("Mengubah password...", {
        type: "info",
        isLoading: true,
      });
    },

    onSuccess: () => {
      toast.update(toastId.current, {
        render: "Password berhasil diubah, silahkan login",
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
        render: error?.response?.data?.message || "Gagal mengubah password",
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
              Reset Password
            </h1>
            <div className="mb-6 relative">
              <label htmlFor="password" className="block mb-1 text-[14px]">
                Password:
              </label>
              <div className="relative">
                <input
                  value={form.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="w-full px-4 py-4 rounded-[15px] text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#63A375]"
                  placeholder="Enter Your Password"
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </div>
              </div>
            </div>
            <div className="mb-6 relative">
              <label htmlFor="password" className="block mb-1 text-[14px]">
                Konfirmasi Password:
              </label>
              <div className="relative">
                <input
                  value={form.confirm_password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="confirm_password"
                  className="w-full px-4 py-4 rounded-[15px] text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#63A375]"
                  placeholder="Enter Your Confirmation Password"
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
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
                  onClick={() => {
                    if (form.password !== form.confirm_password) {
                      toast("Password tidak sama", { type: "error" });
                      return;
                    }

                    mutation.mutate();
                  }}
                >
                  {mutation.isPending ? "Loading..." : "Submit"}
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <Button href="/login" type="link" className="text-sm">
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
