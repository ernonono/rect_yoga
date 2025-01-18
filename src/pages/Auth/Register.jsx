import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon, UserIcon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/ImageLogin.png";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import instance from "../../utils/axios";
import { Button } from "antd";
import Blob_1 from "../../assets/blob_1.png";
import Blob_2 from "../../assets/blob_2.png";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (payload) => {
      return instance.post("/register", payload);
    },

    onSuccess: () => {
      toast("Berhasil melakukan registrasi!", {
        type: "success",
      });

      navigate("/login");
    },

    onError: (error) => {
      console.log(error);
      toast(
        error?.response?.data?.message ||
          "Gagal melakukan registrasi, harap cek kembali data anda.",
        {
          type: "error",
        },
      );
    },
  });

  useEffect(() => {
    console.log(form);
    if (
      !form.email ||
      !form.password ||
      !form.name ||
      !form.confirmPassword ||
      !form.birth
    ) {
      setIsValid(false);
      return;
    }

    setIsValid(true);
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword,
    );
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formArr = Object.entries(form);

    // Check if there is any empty form
    if (formArr.some(([_, value]) => !value) || formArr.length === 0) {
      return toast.error("Please fill all the form");
    }

    // check if password and confirm password is match
    if (form.password !== form.confirmPassword) {
      return toast.error("Password and Confirm Password must be same");
    }

    // check if email is valid
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return toast.error("Email is not valid");
    }

    // password min 8 character
    if (form.password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    mutation.mutate(form);
  };
  return (
    <div className="flex justify-center relative items-center h-screen">
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
      <div className="p-8 bg-white shadow-md rounded-md items-center">
        <div className="w-full flex justify-between">
          <div className="w-1/2 pr-4">
            <img src={Logo} alt="star" />
          </div>
          <div className="w-1/2 pl-4">
            <h1 className="text-[24px] font-medium mb-[24px] text-center">
              Register Account
            </h1>
            <div>
              <div className="mb-6 relative">
                <label htmlFor="name" className="block mb-1 text-[12px]">
                  Nama:
                </label>
                <div className="relative">
                  <input
                    value={form?.name || ""}
                    onChange={handleChange}
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-2 py-2 rounded-[5px] text-[12px] border border-[#BBBBBB] focus:outline-none focus:border-[#63A375]"
                    placeholder="Enter your name"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <UserIcon className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="mb-6 relative">
                <label htmlFor="birth" className="block mb-1 text-[12px]">
                  Tanggal Lahir:
                </label>
                <div className="relative">
                  <input
                    value={form?.birth || ""}
                    onChange={handleChange}
                    type="date"
                    id="birth"
                    name="birth"
                    className="w-full px-2 py-2 rounded-[5px] text-[12px] border border-[#BBBBBB] focus:outline-none focus:border-[#63A375]"
                    placeholder="Enter your Birth"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <UserIcon className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="mb-6 relative">
                <label htmlFor="email" className="block mb-1 text-[12px]">
                  Email:
                </label>
                <div className="relative">
                  <input
                    value={form?.email || ""}
                    onChange={handleChange}
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-2 py-2 rounded-[5px] text-[12px] border border-[#BBBBBB] focus:outline-none focus:border-[#63A375]"
                    placeholder="Enter Your Email"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <UserIcon className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="mb-6 relative">
                <label htmlFor="password" className="block mb-1 text-[12px]">
                  Password:
                </label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="w-full px-2 py-2 rounded-[5px] text-[12px] border border-[#BBBBBB] focus:outline-none focus:border-[#63A375]"
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
              </div>
              <div className="mb-6 relative">
                <label htmlFor="password" className="block mb-1 text-[12px]">
                  Konfirmasi Password:
                </label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    type={showConfirmPassword ? "text" : "password"}
                    id="password"
                    name="confirmPassword"
                    className="w-full px-2 py-2 rounded-[5px] text-[12px] border border-[#BBBBBB] focus:outline-none focus:border-[#63A375]"
                    placeholder="Enter Your Password"
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </div>

              <Button
                disabled={!isValid}
                loading={mutation.isPending}
                onClick={handleSubmit}
                block
                size="large"
                type="primary"
                className="mb-3"
              >
                Register
              </Button>
            </div>
            <p
              className="text-center text-gray-500 text-sm cursor-pointer"
              onClick={handleLoginClick}
            >
              Have an account?
              <span className="text-[#63A375]"> Login Here</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
