import React, { useEffect, useState } from "react";
import KalenderJanji from "../../components/Calendar";
import useRegisterStore from "../../states/useRegister";
import dayjs from "dayjs";
import CardDokter from "../../components/CardDokter";
import { Modal, Skeleton } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import instance from "../../utils/axios";
import { useQuery } from "@tanstack/react-query";

function PilihTanggal({ open, onClose, onFinish }) {
  const { tanggal, setTanggal, dokter_id } = useRegisterStore((state) => state);
  const [time, setTime] = useState(tanggal ? dayjs(tanggal).hour() : 8);

  const { data: quota, isLoading: quotaLoading } = useQuery({
    queryKey: ["quota", tanggal, dokter_id],
    queryFn: async () => {
      const { data } = await instance.get(
        `/registrations-quota?date=${dayjs(tanggal).format("YYYY-MM-DD")}&doctor_id=${dokter_id}`,
      );
      return data;
    },
  });

  useEffect(() => {
    if (tanggal) {
      const addedTime = dayjs(tanggal).set("hour", time).toDate();
      setTanggal(addedTime);
    }
  }, [time]);

  const getTextColor = (quota) => {
    if (quota > 5) {
      return "text-green-500";
    }

    if (quota >= 3) {
      return "text-yellow-500";
    }

    if (quota > 0) {
      return "text-red-500";
    }
  };

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
                {quotaLoading ? (
                  <>
                    <Skeleton.Node
                      active
                      className="w-[142px] h-[61.6px]"
                      children={<div />}
                    />
                    <Skeleton.Node
                      active
                      className="w-[142px] h-[61.6px]"
                      children={<div />}
                    />
                    <Skeleton.Node
                      active
                      className="w-[142px] h-[61.6px]"
                      children={<div />}
                    />
                    <Skeleton.Node
                      active
                      className="w-[142px] h-[61.6px]"
                      children={<div />}
                    />
                  </>
                ) : (
                  Object.keys(quota || {}).map(
                    (key) =>
                      quota[key] > 0 && (
                        <button
                          key={key}
                          onClick={() => setTime(Number(key))}
                          className={`px-3 py-2 border rounded-lg  ${
                            time === Number(key)
                              ? "bg-[#63A375] text-white"
                              : ""
                          }`}
                        >
                          <p>{`${key.padStart(2, "0")}:00`}</p>

                          <span
                            className={`text-xs ${time === Number(key) ? "text-white" : getTextColor(quota?.[key])}`}
                          >
                            Kuota tersisa: {quota?.[key]}
                          </span>
                        </button>
                      ),
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center mt-6">
          <button
            disabled={!tanggal || !time || quotaLoading}
            onClick={onFinish}
            className={`px-10 py-2 ${!tanggal || !time || quotaLoading ? "bg-gray-300 cursor-not-allowed" : "bg-[#63A375]"} rounded-lg text-white`}
          >
            {tanggal && time && !quotaLoading
              ? "Daftar"
              : !tanggal
                ? "Pilih Tanggal"
                : quotaLoading
                  ? "Loading..."
                  : "Pilih Waktu"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default PilihTanggal;
