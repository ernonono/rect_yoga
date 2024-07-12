import React, { useEffect, useState } from "react";
import KalenderJanji from "../../components/Calendar";
import useRegisterStore from "../../states/useRegister";
import dayjs from "dayjs";
import CardDokter from "../../components/CardDokter";
import { useNavigate } from "react-router-dom";

function PilihTanggal({ open, onClose, onFinish }) {
  const { tanggal, setTanggal } = useRegisterStore((state) => state);
  const [time, setTime] = useState(tanggal ? dayjs(tanggal).hour() : 8);

  useEffect(() => {
    if (tanggal) {
      const addedTime = dayjs(tanggal).set("hour", time).toDate();
      setTanggal(addedTime);
    }
  }, [time]);

  return (
    <div
      className={`w-[75vw] rounded-lg bg-white z-[999]  absolute transition-all left-1/2 transform -translate-x-1/2 duration-100 ${!open ? "translate-y-[9999px]" : "translate-y-24"}`}
    >
      <div className="h-20 bg-[#63A375] rounded-t-lg flex items-center justify-between text-white px-5">
        <span className="font-bold text-xl">Pilih Tanggal</span>
        <span onClick={onClose} className="font-bold text-xl cursor-pointer">
          X
        </span>
      </div>
      <div className="my-10">
        <div className="flex gap-10 justify-center">
          <CardDokter />
          <div>
            <KalenderJanji />
            <p>
              Tanggal yang anda pilih:{" "}
              <b>{dayjs(tanggal).format("DD MMMM YYYY")}</b>
            </p>
            <div className="mt-5">
              <h2 className="text-lg font-semibold mb-2">Pilih Waktu</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTime(8)}
                  className={`px-3 py-2 border rounded-lg ${
                    time === 8 ? "bg-[#63A375] text-white" : ""
                  }`}
                >
                  08:00
                </button>
                <button
                  onClick={() => setTime(10)}
                  className={`px-3 py-2 border rounded-lg ${
                    time === 10 ? "bg-[#63A375] text-white" : ""
                  }`}
                >
                  10:00
                </button>
                <button
                  onClick={() => setTime(13)}
                  className={`px-3 py-2 border rounded-lg ${
                    time === 13 ? "bg-[#63A375] text-white" : ""
                  }`}
                >
                  13:00
                </button>
                <button
                  onClick={() => setTime(15)}
                  className={`px-3 py-2 border rounded-lg ${
                    time === 15 ? "bg-[#63A375] text-white" : ""
                  }`}
                >
                  15:00
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center mt-5">
          <button
            disabled={!tanggal}
            onClick={onFinish}
            className={`px-10 py-2 ${!tanggal || !time ? "bg-gray-500" : "bg-[#63A375]"} rounded-lg text-white`}
          >
            {tanggal && time
              ? "Daftar"
              : !tanggal
                ? "Pilih Tanggal"
                : "Pilih Waktu"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PilihTanggal;
