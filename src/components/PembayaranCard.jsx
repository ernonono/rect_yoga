import React from 'react'
import duit from '../assets/duit.png'
import useRegisterStore from '../states/useRegister'

function PembayaranCard() {
  const {tipe_pembayaran, setTipe_pembayaran} =useRegisterStore((state) => state)
  return (
    <div
    onClick={() => {
      setTipe_pembayaran('BPJS')
    }}
    className={`w-[342px] cursor-pointer h-[200px] mt-16 pb-10 relative flex flex-col items-center  ${tipe_pembayaran ==='BPJS'?'bg-[#63A375] text-white':'bg-white text-black'} shadow-lg rounded-2xl`}>
      <div className='mt-2 justify-center'>
        {tipe_pembayaran === 'BPJS' ? (
          // 'gambar putih'
          <img src={duit} style={{ width: "150px", height: "130px" }}  />
          ) : (
            
            <img src={duit} style={{ width: "150px", height: "130px" }}  />
        )}
      </div>
      <p className='text-center font-bold '>BPJS</p>
      <p className='text-center '>Pembayaran pasien BPJS</p>
    </div>
    
  )
}

export default PembayaranCard
