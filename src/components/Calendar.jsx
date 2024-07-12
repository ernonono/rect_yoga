import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import useRegisterStore from "../states/useRegister";
import dayjs from "dayjs";

export default function KalenderJanji() {
  const [date, setDate] = useState(new Date());
  const { setTanggal } = useRegisterStore((state) => state);

  useEffect(() => {
    if (date) {
      setTanggal(
        dayjs(date).set("hour", 0).set("minute", 0).set("second", 0).toDate(),
      );
    }
  }, [date]);

  return (
    <div>
      <Calendar onChange={setDate} value={date} />
    </div>
  );
}
