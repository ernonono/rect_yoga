import React, {useState} from 'react'
import KalenderJanji from '../../components/Calendar'
import useRegisterStore from '../../states/useRegister'
import dayjs from 'dayjs'
import CardDokter from '../../components/CardDokter'
import { useNavigate } from 'react-router-dom'

function PilihTanggal({open, onClose, onFinish}) {
  const {tanggal} =useRegisterStore((state) => state)
  const navigate = useNavigate()
  
  return (
    <div className={`w-[75vw] rounded-lg bg-white z-[999]  absolute transition-all left-1/2 transform -translate-x-1/2 duration-100 ${!open ? 'translate-y-[9999px]' : 'translate-y-24'}`}>
    <div className='h-20 bg-[#63A375] rounded-t-lg flex items-center justify-between text-white px-5'>
      <span className='font-bold text-xl'>Pilih Tanggal</span>
      <span onClick={onClose} className='font-bold text-xl cursor-pointer'>X</span>
    </div>
    <div className='my-10'>
        <div className='flex gap-10 justify-center'>

        <CardDokter />
        <div>
      <KalenderJanji />
      <p>Tanggal yang anda pilih: <b>{dayjs(tanggal).format('DD MMMM YYYY')}</b></p>
        </div>
        </div>

      <div className='w-full flex justify-center mt-5'>
        <button onClick={onFinish} className=' px-10 py-2 bg-[#63A375] rounded-lg text-white'>
          Daftar
        </button>
      </div>
    </div>
    </ div>
  )
}

export default PilihTanggal
