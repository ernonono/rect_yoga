import React, { useState } from "react";
import useRegisterStore from "../../states/useRegister";
import CardPembayaran from "../../components/CardPembayaran";
import { useNavigate } from "react-router-dom";
import PembayaranCard from "../../components/PembayaranCard";
import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";

function Pembayaran({ open, onClose, onFinish }) {
  const { tipe_pembayaran } = useRegisterStore((state) => state);
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/konfirmasi");

    onClose();
    onFinish();
  };
  return (
    <Modal
      width={1000}
      title={
        <h1 className="text-lg font-semibold text-white">Pilih Pembayaran</h1>
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
        },

        footer: {
          display: "none",
        },
      }}
    >
      <div className="py-10">
        <div className="flex gap-10 justify-center">
          <button>
            <CardPembayaran />
          </button>
          <PembayaranCard />
          <div></div>
        </div>
        <div className="w-full flex justify-center mt-5 gap-10">
          <button
            onClick={onFinish}
            className="mt-4 px-10 py-2 bg-[#63A375] rounded-lg text-white"
          >
            Kembali
          </button>
          <button
            onClick={() => onClick()}
            className="mt-4 px-10 py-2 bg-[#63A375] rounded-lg text-white"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default Pembayaran;
