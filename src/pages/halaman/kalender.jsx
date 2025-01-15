import React, { useEffect, useState } from "react";
import KalenderJanji from "../../components/Calendar";
import useRegisterStore from "../../states/useRegister";
import dayjs from "dayjs";
import CardDokter from "../../components/CardDokter";
import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";

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
    <Modal
      width={1000}
      title={
        <h1 className="text-lg font-semibold text-white">Pilih Tanggal</h1>
      }
      centered
      okButtonProps={{ hidden: true }}
      open={open}
      onClose={onClose}
      onCancel={onClose}
      closeIcon={<CloseOutlined className="text-white" />}
      styles={{
        header: {
          backgroundColor: "#63A375",
          height: 55,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
        },
        content: {
          padding: 0,
          paddingRight: 0,
          paddingBottom: 16,
        },

        footer: {
          display: "none",
        },
      }}
    >
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

        <div className="w-full flex justify-center mt-6">
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
    </Modal>
  );
}

export default PilihTanggal;
