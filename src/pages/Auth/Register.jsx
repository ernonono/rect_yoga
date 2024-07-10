import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon, UserIcon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/ImageLogin.png";
import Button from "../../components/Button";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  
  const handleLoginClick = () => {
    navigate ('/login')
  }

  useEffect(() => {
    document.title = "Register - YOGA ";
  }, []);

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
            <form>
            <div className="mb-6 relative">
                <label htmlFor="nama" className="block mb-1 text-[12px]">
                  Nama:
                </label>
                <div className="relative">
                  <input
                    type="nama"
                    id="nama"
                    name="nama"
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
                  <input
                    type="gender"
                    id="gender"
                    name="gender"
                    className="w-full px-2 py-2 rounded-[5px] text-[12px] border border-[#BBBBBB] focus:outline-none focus:border-[#63A375]"
                    placeholder="Enter your Gender"
                  />  
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <UserIcon className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="mb-6 relative">
                <label htmlFor="phone" className="block mb-1 text-[12px]">
                  No HP:
                </label>
                <div className="relative">
                  <input
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
                    type="birth"
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
              <div className="mb-6 relative">
                <label htmlFor="religion" className="block mb-1 text-[12px]">
                  Agama:
                </label>
                <div className="relative">
                  <input
                    type="religion"
                    id="religion"
                    name="religion"
                    className="w-full px-2 py-2 rounded-[5px] text-[12px] border border-[#BBBBBB] focus:outline-none focus:border-[#63A375]"
                    placeholder="Enter your Religion"
                  />  
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
                  <input
                    type="blood_type"
                    id="blood_type"
                    name="blood_type"
                    className="w-full px-2 py-2 rounded-[5px] text-[12px] border border-[#BBBBBB] focus:outline-none focus:border-[#63A375]"
                    placeholder="Enter your Blood type"
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
                    className="bg-[#63A375] w-full h-[48px]"
                    type="submit"
                  >
                    <span className="text-white">Register</span>
                  </Button>
                </div>
              </div>
            </form>
            <p className="text-center cursor-pointer" onClick={(handleLoginClick)}>
              Have an account?
              <span className="text-[#63A375]"> Login Here</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
