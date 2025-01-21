import {
  Card,
  Descriptions,
  Input,
  Modal,
  Switch,
  Tooltip,
  Typography,
  message,
} from "antd";
import React, { useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import instance from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { parseParams } from "../../utils/parseParams";

function PatientItem({ patient, onClick, refetch }) {
  const navigate = useNavigate();
  const imgUrl = `http://localhost:8000/patient_image/${patient?.image}`;
  const mutation = useMutation({
    mutationFn: async () => {
      await instance.put(`toggle-active`, { user_id: patient.user_id });
    },
    onError: (err, variables, context) => {
      setData(context);
    },
    onMutate: () => {
      message.loading({
        content: "Mengubah status pasien...",
        key: "hapusPasien",
      });
    },
    onSuccess: () => {
      refetch();
      message.success({
        content: "Berhasil mengubah status pasien!",
        key: "hapusPasien",
      });
    },
  });

  const calculateAge = (dob) => dayjs().diff(dayjs(dob), "year");

  return (
    <div className="cursor-pointer" onClick={() => onClick(patient)}>
      <div className="flex justify-center">
        <img
          className="h-[235px] w-[235px] object-cover rounded-full"
          alt="doctor"
          src={imgUrl}
        />
      </div>
      <div>
        <div className="flex justify-between items-center">
          <Typography.Title className="font-light text-primary" level={3}>
            {patient?.name}
          </Typography.Title>

          <div className="flex gap-5">
            <div
              onClick={(e) => {
                if (mutation.isPending) return;
                e.stopPropagation();
                navigate(`/admin/patients/${patient.id}/edit`);
              }}
              className="relative group"
            >
              <EditOutlined className="text-primary  text-lg cursor-pointer relative z-10" />
              <i className="absolute top-1/2 left-1/2 transform w-7 h-7 transition-all duration-100 rounded-full group-hover:bg-primary/20 z-0 -translate-x-1/2 -translate-y-1/2" />
            </div>
            {/* <div
              onClick={(e) => {
                if (mutation.isPending) return;

                e.stopPropagation();
                mutation.mutate();
              }}
              className="relative group"
            >
              <DeleteOutlined className="text-red-500 text-lg cursor-pointer" />
              <i className="absolute top-1/2 left-1/2 transform w-7 h-7 transition-all duration-100 rounded-full group-hover:bg-red-300/20 z-0 -translate-x-1/2 -translate-y-1/2" />
            </div> */}
          </div>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            // navigate(`/admin/patients/${patient.id}/edit`);
          }}
          className="w-full flex justify-between items-start"
        >
          <Typography.Text className="text-[#AAAAAA] block text-sm -mt-1">
            Age: {calculateAge(patient?.birth)}
          </Typography.Text>
          <Tooltip title="Status Pasien">
            <Switch
              loading={mutation.isPending}
              size="small"
              checked={patient?.user?.is_active}
              onChange={(e) => {
                mutation.mutate();
              }}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

function Loading() {
  return [1, 2, 3, 4].map((item) => (
    <Card className="w-full h-[500px]" key={item} loading />
  ));
}

export default function PatientList() {
  const [selectedData, setSelectedData] = React.useState(null);
  const [filter, setFilter] = useState({
    name: "",
  });
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["patient-list", filter],
    queryFn: async () => {
      const { data } = await instance.get(`patients?${parseParams(filter)}`);

      return data;
    },
  });

  const onChangeFilter = (property, value) => {
    setFilter({
      ...filter,
      [property]: value || "",
    });
  };

  const descriptionItems = [
    {
      label: "Nama",
      children: selectedData?.name,
    },
    {
      label: "Email",
      children: selectedData?.user?.email,
    },
  ];

  return (
    <div>
      <Typography.Title className="text-[#767676] tracking-tight" level={2}>
        SEMUA PASIEN
      </Typography.Title>

      <div className="flex mb-3 bg-[#F5F5F5] py-3 rounded-md px-4 flex-col md:flex-row items-center gap-2">
        <FilterOutlined className="text-xl text-[#767676] mr-2" />
        <Input.Search
          onSearch={(value) => onChangeFilter("name", value)}
          placeholder="Nama Pasien"
          className="w-full md:w-1/6"
          allowClear
        />
      </div>

      <div className="grid grid-cols-4 gap-5">
        {isLoading ? (
          <Loading />
        ) : (
          data?.map((item) => (
            <PatientItem
              onClick={(patient) => setSelectedData(patient)}
              key={item.id}
              refetch={refetch}
              patient={item}
            />
          ))
        )}
      </div>

      <Modal
        width={800}
        title="Detail Pasien"
        open={!!selectedData}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        onCancel={() => setSelectedData(null)}
      >
        <Descriptions
          bordered
          column={1}
          size="small"
          items={descriptionItems}
        />
      </Modal>
    </div>
  );
}
