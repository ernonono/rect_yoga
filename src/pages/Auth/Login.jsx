import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon, UserIcon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/ImageLogin.png";
import Button from "../../components/Button";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = () => {
    navigate("/beranda");
  };

  useEffect(() => {
    document.title = "Login - YOGA ";
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
              Login to Your Account
            </h1>
            <div className="mb-6 relative">
                <label htmlFor="email" className="block mb-1 text-[14px]">
                  Nama:
                </label>
                <div className="relative">
                  <input
                    type="nama"
                    id="nama"
                    name="nama"
                    className="w-full px-4 py-4 rounded-[15px] text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#63A375]"
                    placeholder="Enter your name"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <UserIcon className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="mb-6 relative">
                <label htmlFor="email" className="block mb-1 text-[14px]">
                  Email:
                </label>
                <div className="relative">
                  <input
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
                    <label htmlFor="remember" className="text-[14px]">
                      Remember me
                    </label>
                  </div>
                </div>
                <div className="w-full pl-4">
                  <Button
                    className="bg-[#63A375] w-full h-[48px]"
                    onClick={handleLoginClick}
                  >
                    <span className="text-white">Login</span>
                  </Button>
                </div>
              </div>
            <p
              className="text-center cursor-pointer"
              onClick={handleRegisterClick}
            >
              Dont have an account?
              <span className="text-[#63A375]"> Register Here</span>
            </p>
            <div className="flex flex-grow mt-28 justify-end">
              <div className="w-[100px] pl-4">
                <Button className="bg-[#63A375] w-full h-[48px]">
                  <span className="text-white text-[12px]">Login as Admin</span>
                </Button>
              </div>
              <div className="w-[100px] pl-4">
                <Button className="bg-[#63A375] w-full h-[48px]">
                  <span className="text-white text-[12px]">Login as Docter</span>
                </Button>
              </div>
              <div className="w-[100px] pl-4">
                <Button className="bg-[#63A375] w-full h-[48px]">
                  <span className="text-white text-[12px]">Login as User</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
