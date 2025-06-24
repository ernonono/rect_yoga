import {
  Button,
  Calendar,
  Card,
  DatePicker,
  Descriptions,
  Drawer,
  Form,
  Input,
  Modal,
  Popover,
  Skeleton,
  Statistic,
  Tag,
  Typography,
} from "antd";
import React, { useState } from "react";
import {
  CalendarOutlined,
  PlusOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import instance from "../../utils/axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formatDate } from "../halaman/konfirmasi";

function DashboardDoctor() {
  const [form] = Form.useForm();
  const loggedinDoktor = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModalExport, setOpenModalExport] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["doctor-registration"],
    queryFn: async () => {
      const { data } = await instance.get("/registrations-doctor-agenda");
      return data;
    },
  });

  

  const mutation = useMutation({
    mutationFn: (form) => instance.post("/registrations", form),
    onSuccess: () => {
      toast.success("Agenda Berhasil Ditambahkan");
      setOpenDrawer(false);
      refetch();

      form.resetFields();
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Gagal menambahkan agenda");
    },
  });

  const getAppointments = (dateObj) => {
    return (
      data?.filter((item) => {
        const data = dayjs(item.appointment_date).format("DD MMMM YYYY");
        return data === dayjs(dateObj).format("DD MMMM YYYY");
      }) || []
    );
  };

  const getTotalAppointments = (value) => {
    return (
      data?.filter((item) => {
        const index = dayjs(item.appointment_date).month();
        return index === value.month();
      }) || []
    ).length;
  };

  const monthCellRender = (value) => {
    const dataLength = getTotalAppointments(value);
    return dataLength > 0 ? (
      <div className="notes-month">
        <p className="font-semibold">Total Registration</p>
        <section className="text-xl font-bold">{dataLength}</section>
      </div>
    ) : null;
  };

  const dateCellRender = (value) => {
    const data = getAppointments(value);

    const Content = ({ data }) => {
      const items =
        data.type === "appointment"
          ? [
              {
                label: "Patient Name",
                children: data.patient.name,
              },
              {
                label: "Patient Phone",
                children: data.patient.phone,
              },
              {
                label: "Payment Type",
                children: data.payment_type,
              },
              {
                label: "Status",
                children: (
                  <Tag color={data.status === "Selesai" ? "green" : "red"}>
                    {data.status}
                  </Tag>
                ),
              },
            ]
          : [
              {
                label: "Description",
                children: data.description,
              },
            ];
      return (
        <Descriptions
          bordered
          className="w-full"
          title={
            data.type === "appointment"
              ? "Appointment Details"
              : "Agenda Details"
          }
          items={items}
          column={1}
          size="small"
        />
      );
    };

    return data?.length > 0 ? (
      <div className="events flex flex-col gap-2">
        {data.map((item) => (
          <Popover
            key={item.id}
            content={<Content data={item} />}
            placement="topLeft"
          >
            <div
              onClick={() => {
                if (item.status === "Belum Selesai") return;

                navigate(`/doctor/appointments?identifier=${item.id}`);
              }}
              className={`${item.type === "agenda" ? "bg-orange-400" : "bg-primary"} px-2 text-white rounded-md text-xs`}
            >
              <div className="font-bold">
                {dayjs(item?.appointment_date).format("HH:mm")}
              </div>
              <div className="event-name">{item.description}</div>
            </div>
          </Popover>
        ))}
      </div>
    ) : (
      <Popover
        content={
          <Button
            onClick={() => {
              form.setFieldsValue({
                appointment_date: dayjs(value).hour(8).minute(0),
              });
              setOpenDrawer(true);
            }}
            type="primary"
            icon={<PlusOutlined />}
          >
            Add Agenda
          </Button>
        }
        placement="right"
      >
        <div className="events w-full h-full"></div>
      </Popover>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current, info);
    if (info.type === "month") return monthCellRender(current, info);
    return info.originNode;
  };

  const onFinish = (values) => {
    mutation.mutate({
      ...values,
      appointment_date: formatDate(values.appointment_date.toISOString()),
      doctor_id: loggedinDoktor.doctor_id,
      registry_date: formatDate(dayjs().toISOString()),
      type: "agenda",
    });
  };

  const handleDownloadData = async () => {
    try {
      const response = await instance.get(
        `/registrations-summary?start_date=${startDate}&end_date=${endDate}&doctor_id=${loggedinDoktor.doctor_id}`,
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "rekap_data_pasien.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      toast.error("Gagal mendownload data pasien");
    }
  };

  return (
    <div>
      <Typography.Title className="text-[#767676] tracking-tight" level={2}>
        DASHBOARD
      </Typography.Title>

      <div className="flex justify-between">
        <div className="w-full flex justify-start items-center gap-7 mb-6">
          <Card className="min-w-[250px]">
            <Statistic
              loading={isLoading}
              title="Total Registration"
              precision={0}
              value={data?.filter((item) => item.type === "appointment").length}
              valueStyle={{ color: "#3f8600" }}
              prefix={<CalendarOutlined />}
            />
          </Card>
          <Card className="min-w-[250px]">
            <Statistic
              loading={isLoading}
              title="Total Agenda"
              precision={0}
              value={data?.filter((item) => item.type === "agenda").length}
              valueStyle={{ color: "#3f8600" }}
              prefix={<CalendarOutlined />}
            />
          </Card>

          <Card>
          <Statistic
              loading={isLoading}
              title="Total Belum Selesai"
              precision={0}
              value={data?.filter((item) => item.status === "Belum Selesai").length}
              valueStyle={{ color: "#3f8600" }}
              prefix={<CalendarOutlined />}
              />
          </Card>

          <Card>
          <Statistic
              loading={isLoading}
              title="Total Selesai"
              precision={0}
              value={data?.filter((item) => item.status === "Selesai").length}
              valueStyle={{ color: "#3f8600" }}
              prefix={<CalendarOutlined />}
              />
          </Card>

          <Card>
          <Statistic
              loading={isLoading}
              title="Total Dibatalkan"
              precision={0}
              value={data?.filter((item) => item.status === "Dibatalkan").length}
              valueStyle={{ color: "#3f8600" }}
              prefix={<CalendarOutlined />}
              />
          </Card>

        </div>
        <Button
          onClick={() => setOpenModalExport(true)}
          type="primary"
          icon={<DownloadOutlined />}
        >
          Download Rekap Data Pasien
        </Button>
      </div>

      {isLoading ? <Skeleton active /> : <Calendar cellRender={cellRender} />}

      <Drawer
        title="Add Agenda"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Form onFinish={onFinish} form={form} layout="vertical">
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>

          <Form.Item label="Date and Time" name="appointment_date">
            <DatePicker showTime format="DD MM YYYY HH:mm" className="w-full" />
          </Form.Item>

          <Button
            onClick={() => form.submit()}
            loading={mutation.isPending}
            type="primary"
            htmlType="button"
          >
            Submit
          </Button>
        </Form>
      </Drawer>

      <Modal
        title="Download Rekap Data Pasien"
        open={openModalExport}
        onCancel={() => setOpenModalExport(false)}
        footer={
          <>
            <Button
              disabled={!startDate || !endDate}
              type="primary"
              onClick={handleDownloadData}
            >
              Download
            </Button>
          </>
        }
        width={800}
        centered
      >
        <label className="text-sm font-semibold">Pilih Bulan dan Tahun</label>
        <DatePicker.RangePicker
          picker="month"
          className="w-full mt-1"
          format="MM YYYY"
          onChange={(date) => {
            setStartDate(date[0]?.format("YYYY-MM-DD"));
            setEndDate(date[1]?.format("YYYY-MM-DD"));
          }}
        />
      </Modal>
    </div>
  );
}

export default DashboardDoctor;
