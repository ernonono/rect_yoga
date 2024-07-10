import React from 'react'
import doctor from '../assets/doctor.png'
import useRegisterStore from '../states/useRegister'

function CardDokter() {
  const {dokter,poli} =useRegisterStore((state) => state)
  return (
    <div className='w-[342px] pb-10 relative flex flex-col items-center  bg-white shadow-lg'>
      <div className='z-0 bg-[#63A375] rounded-t-xl h-[155px] absolute w-[342px]'></div>
      <div className='relative z-10 mt-[45px] bg-white w-[196px] h-[196px] flex justify-center items-center rounded-full shadow-lg'>
        <img src={doctor}   />
      </div>

      <p className='text-center font-bold mt-4'>{dokter}</p>
      <p className='text-center '>{poli}</p>
      <p className='text-center '>Semua Jenis Pembayaran</p>
    </div>
  )
}

export default CardDokter
