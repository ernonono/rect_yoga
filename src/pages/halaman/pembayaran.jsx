import React, {useState} from 'react'
import useRegisterStore from '../../states/useRegister'
import CardPembayaran from '../../components/CardPembayaran'
import { useNavigate } from 'react-router-dom'
import PembayaranCard from '../../components/PembayaranCard'

function Pembayaran({open, onClose, onFinish}) {
  const {tipe_pembayaran} =useRegisterStore((state) => state)
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/konfirmasi")

    onClose()
    onFinish()
  }
  return (
    <div className={`w-[75vw] rounded-lg bg-white z-[999]  absolute transition-all left-1/2 transform -translate-x-1/2 duration-100 ${!open ? 'translate-y-[9999px]' : 'translate-y-24'}`}>
    <div className='h-20 bg-[#63A375] rounded-t-lg flex items-center justify-between text-white px-5'>
      <span className='font-bold text-xl'>Pilih Pembayaran</span>
      <span onClick={onClose} className='font-bold text-xl cursor-pointer'>X</span>
    </div>
    <div className='my-10'>
        <div className='flex gap-10 justify-center'>
        <button >
        <CardPembayaran />
        </button>
        <PembayaranCard />
        <div>
        </div>
        </div>
        <div className='w-full flex justify-center mt-5 gap-10'>
        <button onClick={onFinish} className='mt-4 px-10 py-2 bg-[#63A375] rounded-lg text-white'>
          Cancel
        </button>
        <button onClick={() => onClick()} className='mt-4 px-10 py-2 bg-[#63A375] rounded-lg text-white'>
          Selanjutnya
        </button>
        </div>

    </div>
    </ div>
  )
}

export default Pembayaran
