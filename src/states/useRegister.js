import {create} from 'zustand'
import {persist} from 'zustand/middleware'

const useRegisterStore = create(persist(
    (set) => ({
        poli: '',
        poli_id:'',
        dokter: '',
        dokter_id: '',
        tanggal: '',
        tipe_pembayaran: '',
        setPoli: (name, id) => set((state) => ({
            ...state,
            poli: name,
            poli_id: id,
        })),
        setDokter: (name, id) => set((state) => ({
            ...state,
            dokter: name,
            dokter_id: id,
        })),
        setTanggal: (tanggal) => set((state) => ({
            ...state,
            tanggal
        })),
        setTipe_pembayaran: (tipe_pembayaran) => set((state) => ({
            ...state,
            tipe_pembayaran
        })),
    }),
    {
        name: 'register-data'
    }
))

export default useRegisterStore