import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Banner from "../../components/Banner";
import { useNavigate } from "react-router-dom";
import useRegisterStore from "../../states/useRegister";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import instance from "../../utils/axios";
import { toast } from "react-toastify";

export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = ("0" + (d.getMonth() + 1)).slice(-2);
  const day = ("0" + d.getDate()).slice(-2);
  const hours = ("0" + d.getHours()).slice(-2);
  const minutes = ("0" + d.getMinutes()).slice(-2);
  const seconds = ("0" + d.getSeconds()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default function Konfirmasi() {
  const user = JSON.parse(localStorage.getItem("user"));
  const { dokter, poli, tanggal, tipe_pembayaran, dokter_id, reset } =
    useRegisterStore((state) => state);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => {
      const newRegistration = {
        doctor_id: dokter_id,
        patient_id: user.patient.id,
        appointment_date: formatDate(dayjs(tanggal).toISOString()),
        payment_type: tipe_pembayaran,
        description: description || "-",
        is_canceled: 0,
        registry_date: formatDate(dayjs().toISOString()),
        status: "Belum Selesai",
      };

      return instance.post("/registrations", newRegistration);
    },

    onSuccess: () => {
      toast("Berhasil melakukan registrasi!", {
        type: "success",
      });
      reset();
      navigate("/riwayat");
    },

    onError: (error) => {
      let message = "Gagal melakukan registrasi, harap cek kembali data anda.";
      if (error.status === 400) {
        message = error.response?.data?.error_message;
      }
      toast(message, {
        type: "error",
      });
    },
  });

  const onClickKonfirmasi2 = () => {
    navigate("/dokter");
  };

  const onSubmit = () => {
    if (!description) {
      toast("Harap isi keluhan pasien", {
        type: "error",
      });
      return;
    }

    mutation.mutate();
  };
  return (
    <div className="relative">
      <Navbar />
      {/* <Banner /> */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-md rounded-3xl p-6 w-full max-w-4xl">
          <h1 className="text-xl font-bold mb-4">Konfirmasi Pendaftaran</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mt-5">
              <h2 className="text-lg font-semibold mb-2">Detail Layanan</h2>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="text-gray-600">Dokter Pemeriksa</p>
                <p className="font-medium">{dokter}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="text-gray-600">Tipe Layanan</p>
                <p className="font-medium">{poli}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="text-gray-600">Waktu</p>
                <p className="font-medium">
                  {dayjs(tanggal).format("DD MMMM YYYY | HH:mm")}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="text-gray-600">Tipe Pembayaran</p>
                <p className="font-medium">{tipe_pembayaran}</p>
              </div>
            </div>
            <div className="mt-5">
              <h2 className="text-lg font-semibold mb-2">Detail Pasien</h2>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{user?.email || ""}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="text-gray-600">Nama Pasien</p>
                <p className="font-medium">{user?.name || ""}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="text-gray-600">Jenis Kelamin</p>
                <p className="font-medium">{user?.patient?.gender || ""}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="text-gray-600">Alamat</p>
                <p className="font-medium">{user?.patient?.address || ""}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="text-gray-600">Keluhan</p>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-3 px-4 py-4 rounded-[15px] text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#63A375]"
                  placeholder="Tulis catatan..."
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={onClickKonfirmasi2}
            >
              Cancel
            </button>
            <button
              disabled={mutation.isPending}
              className={`${mutation.isPending ? "bg-gray-700" : mutation.isError ? "bg-red-600" : "bg-green-500"} text-white px-4 py-2 rounded-md`}
              onClick={onSubmit}
            >
              {mutation.isPending
                ? "Loading..."
                : mutation.isError
                  ? "Terjadi Kesalahan"
                  : "Daftar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
