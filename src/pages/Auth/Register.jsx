import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon, UserIcon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/ImageLogin.png";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import instance from "../../utils/axios";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    gender: "Laki-laki",
    religion: "Islam",
    blood_type: "A",
  });
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

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleNextStep = () => {
    if (step === 3) return;

    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    if (step === 1) return;

    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formArr = Object.entries(form);

    // Check if there is any empty form
    if (formArr.some(([key, value]) => !value) || formArr.length === 0) {
      return toast.error("Please fill all the form");
    }

    mutation.mutate(form);
  };

  const getFormByStep = (step) => {
    switch (step) {
      case 1: {
        return (
          <>
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
              <label htmlFor="gender" className="block mb-1 text-[12px]">
                Jenis Kelamin:
              </label>
              <div className="relative">
                <select
                  value={form?.gender || ""}
                  onChange={handleChange}
                  type="gender"
                  id="gender"
                  name="gender"
                  className="w-full px-2 py-2 rounded-[5px] text-[12px] border border-[#BBBBBB] focus:outline-none focus:border-[#63A375]"
                  placeholder="Enter your Gender"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <UserIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
          </>
        );
      }

      case 2: {
        return (
          <>
            <div className="mb-6 relative">
              <label htmlFor="phone" className="block mb-1 text-[12px]">
                No HP:
              </label>
              <div className="relative">
                <input
                  value={form?.phone || ""}
                  onChange={handleChange}
                  type="phone"
                  id="phone"
                  name="phone"
                  className="w-full px-2 py-2 rounded-[5px] text-[12px] border border-[#BBBBBB] focus:outline-none focus:border-[#63A375]"
                  placeholder="Enter your No HP"
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
              <label htmlFor="address" className="block mb-1 text-[12px]">
                Alamat:
              </label>
              <div className="relative">
                <input
                  value={form?.address || ""}
                  onChange={handleChange}
                  type="address"
                  id="address"
                  name="address"
                  className="w-full px-2 py-2 rounded-[5px] text-[12px] border border-[#BBBBBB] focus:outline-none focus:border-[#63A375]"
                  placeholder="Enter your Address"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <UserIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
          </>
        );
      }

      case 3: {
        return (
          <>
            <div className="mb-6 relative">
              <label htmlFor="religion" className="block mb-1 text-[12px]">
                Agama:
              </label>
              <div className="relative">
                <select
                  value={form?.religion || ""}
                  onChange={handleChange}
                  type="religion"
                  id="religion"
                  name="religion"
                  className="w-full px-2 py-2 rounded-[5px] text-[12px] border border-[#BBBBBB] focus:outline-none focus:border-[#63A375]"
                  placeholder="Enter your Religion"
                >
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Budha">Budha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>

                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <UserIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="mb-6 relative">
              <label htmlFor="nik" className="block mb-1 text-[12px]">
                NIK:
              </label>
              <div className="relative">
                <input
                  value={form?.nik || ""}
                  onChange={handleChange}
                  type="nik"
                  id="nnik"
                  name="nik"
                  className="w-full px-2 py-2 rounded-[5px] text-[12px] border border-[#BBBBBB] focus:outline-none focus:border-[#63A375]"
                  placeholder="Enter your NIK"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <UserIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="mb-6 relative">
              <label htmlFor="kk" className="block mb-1 text-[12px]">
                No Kartu Keluarga:
              </label>
              <div className="relative">
                <input
                  value={form?.kk || ""}
                  onChange={handleChange}
                  type="kk"
                  id="kk"
                  name="kk"
                  className="w-full px-2 py-2 rounded-[5px] text-[12px] border border-[#BBBBBB] focus:outline-none focus:border-[#63A375]"
                  placeholder="Enter your No KK"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <UserIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="mb-6 relative">
              <label htmlFor="blood_type" className="block mb-1 text-[12px]">
                Golongan Darah:
              </label>
              <div className="relative">
                <select
                  value={form?.blood_type || ""}
                  onChange={handleChange}
                  type="blood_type"
                  id="blood_type"
                  name="blood_type"
                  className="w-full px-2 py-2 rounded-[5px] text-[12px] border border-[#BBBBBB] focus:outline-none focus:border-[#63A375]"
                  placeholder="Enter your Blood type"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                </select>
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

            <div className="w-full flex justify-between">
              <div className="w-1/4 py-3 pr-4">
                <div className="mb-6 flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    name="remember"
                    className="mr-2 h-4 w-4"
                  />
                  <label htmlFor="remember" className="text-[12px]">
                    Remember me
                  </label>
                </div>
              </div>
              <div className="w-full pl-4">
                <Button
                  disabled={mutation.isLoading}
                  onClick={handleSubmit}
                  className={`${
                    mutation.isLoading ? "bg-gray-700" : "bg-[#63A375]"
                  } w-full h-[48px]`}
                  type="submit"
                >
                  <span className="text-white">
                    {mutation.isLoading ? "Loading..." : "Register"}
                  </span>
                </Button>
              </div>
            </div>
          </>
        );
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[1509px] p-8 bg-white shadow-md rounded-md items-center">
        <div className="w-full flex justify-between">
          <div className="w-1/2 pr-4">
            <img src={Logo} alt="star" />
          </div>
          <div className="w-1/2 pl-4">
            <h1 className="text-[24px] font-medium mb-[24px] text-center">
              Register Account
            </h1>
            <div>
              {getFormByStep(step)}

              <div className="w-full flex justify-between mb-3">
                <div className="w-1/4 py-3">
                  <div
                    className={`flex items-center justify-center gap-2 font-medium py-2 px-3 rounded-xl ${step === 1 ? "bg-gray-700/50" : "bg-[#63A375] cursor-pointer"}`}
                    onClick={handlePrevStep}
                  >
                    <span className="text-white">Back</span>
                  </div>
                </div>
                <div className="w-1/4 py-3">
                  <div
                    className={`flex items-center justify-center gap-2 font-medium py-2 px-3 rounded-xl ${step === 3 ? "bg-gray-700/50" : "bg-[#63A375] cursor-pointer"}`}
                    onClick={handleNextStep}
                  >
                    <span className="text-white">Next</span>
                  </div>
                </div>
              </div>
            </div>
            <p
              className="text-center cursor-pointer"
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
