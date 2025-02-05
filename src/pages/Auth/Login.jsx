import { useRef, useState } from "react";
import { EyeIcon, EyeSlashIcon, UserIcon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/ImageLogin.png";
import Blob_1 from "../../assets/blob_1.png";
import Blob_2 from "../../assets/blob_2.png";
import { useMutation } from "@tanstack/react-query";
import instance from "../../utils/axios";
import { toast } from "react-toastify";
import { Button } from "antd";

export default function Login() {
  const toastId = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (form) => {
      return instance.post("/login", form);
    },

    onMutate: () => {
      toastId.current = toast("Loading...", {
        type: "info",
        isLoading: true,
      });
    },

    onSuccess: (res) => {
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data?.user || {}));
      toast.update(toastId.current, {
        render: "Login Success",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });

      setTimeout(() => {
        if (res.data?.user?.role === "admin") {
          navigate("/admin");
          return;
        }

        if (res.data?.user?.role === "doctor") {
          navigate("/doctor");
          return;
        }

        navigate("/beranda");
      }, 1500);
    },

    onError: (error) => {
      console.log(error);
      toast.update(toastId.current, {
        render: error?.response?.data?.message || "Login Failed",
        type: "error",
        isLoading: false,
      });
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = () => {
    mutation.mutate(form);
  };

  const handleChange = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };

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
              Login to Your Account
            </h1>
            <div className="mb-6 relative">
              <label htmlFor="email" className="block mb-1 text-[14px]">
                Email:
              </label>
              <div className="relative">
                <input
                  value={form.email}
                  onChange={handleChange}
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
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </div>
              </div>

              <div className="w-full flex justify-end">
                <Button
                  href="/send-reset-password"
                  type="link"
                  className="text-[#63A375] p-0 text-sm"
                >
                  Forgot Password?
                </Button>
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
                  onClick={handleLoginClick}
                >
                  {mutation.isPending ? "Loading..." : "Login"}
                </Button>
              </div>
            </div>
            <p
              className="text-center text-gray-500 text-sm cursor-pointer"
              onClick={handleRegisterClick}
            >
              Don't have an account?
              <span className="text-[#63A375]"> Register Here</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
