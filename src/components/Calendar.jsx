import {useEffect, useState} from 'react'
import Calendar from 'react-calendar'
import useRegisterStore from '../states/useRegister'

export default function KalenderJanji() {
    const [date, setDate] = useState(new Date())
    const { setTanggal} = useRegisterStore((state) => state)

    useEffect(() => {
        if (date) {
            setTanggal(date)
        }
    }, [date])

    return (
        <div>
            <Calendar  onChange={setDate} value={date} />
        </div>
    )
}