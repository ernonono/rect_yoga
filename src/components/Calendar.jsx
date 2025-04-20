import { useEffect, useState } from "react";
import useRegisterStore from "../states/useRegister";
import dayjs from "dayjs";
import { Calendar, Skeleton } from "antd";
import instance from "../utils/axios";
import { toast } from "react-toastify";

export default function KalenderJanji() {
  const [date, setDate] = useState(dayjs().startOf("day").add(2, "day"));
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const { setTanggal, dokter_id } = useRegisterStore((state) => state);

  useEffect(() => {
    if (date) {
      setTanggal(
        dayjs(date).set("hour", 0).set("minute", 0).set("second", 0).toDate(),
      );
    }
  }, [date]);

  const getRegistrations = async (dokter_id) => {
    try {
      const response = await instance.get(
        `registrations-doctor-agenda/${dokter_id}`,
      );

      setRegistrations(response?.data || []);
      setLoading(false);
    } catch (error) {
      toast.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dokter_id) {
      getRegistrations(dokter_id);
    }
  }, [dokter_id]);

  const wrapperStyle = {
    width: 300,
    border: `1px solid rgb(240, 240, 240)`,
    borderRadius: 8,
  };
  
  return (
    <div style={wrapperStyle}>
      {loading ? (
        <Skeleton.Node
          style={{ width: 300, height: 320.89 }}
          active
          children={false}
        ></Skeleton.Node>
      ) : (
        <Calendar
          className="rounded-lg"
          validRange={[dayjs().startOf("days").add(2,"days"), dayjs().add(30, "days")]}
          disabledDate={(current) => {
            const found = registrations.find(
              (item) =>
                dayjs(item.appointment_date).isSame(current, "days") &&
                item.type === "agenda",
            );

            return found;
          }}
          fullscreen={false}
          onChange={(date) => setDate(date)}
          value={date}
        />
      )}
    </div>
  );
}
