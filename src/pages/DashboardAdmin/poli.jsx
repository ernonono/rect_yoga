import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import instance from "../../utils/axios";
import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  Typography,
  notification,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { parseParams } from "../../utils/parseParams";
import { useNavigate } from "react-router-dom";

export default function Poli() {
  const [form] = Form.useForm();
  const [selected, setSelected] = React.useState(null);
  const [filter, setFilter] = useState({
    name: "",
    location: "",
  });
  const navigate = useNavigate();

  const { data, error, refetch, isFetching } = useQuery({
    queryKey: ["poli-list", filter],
    queryFn: async () => {
      const { data } = await instance.get(`polis?${parseParams(filter)}`);

      return data;
    },
  });

  const onChangeFilter = (property, value) => {
    setFilter({
      ...filter,
      [property]: value || "",
    });
  };
  const handleAddPoliClick = () => {
    navigate('/admin/add-poli'); // Ganti dengan path yang sesuai untuk halaman tambah poli Anda
  };

  const edit = useMutation({
    mutationFn: (form) => {
      return instance.put(`/polis/${selected.id}`, form);
    },
    onSuccess: () => {
      notification.success({
        message: "Berhasil mengubah data",
        description: "Data poli berhasil diubah",
      });
      setSelected(null);
      refetch();
    },
    onError: () => {
      notification.error({
        message: "Gagal mengubah data",
        description: "Terjadi kesalahan saat mengubah data",
      });
    },
  });

  const deletePoli = useMutation({
    mutationFn: (id) => {
      return instance.delete(`/polis/${id}`);
    },
    onSuccess: () => {
      notification.success({
        message: "Berhasil menghapus data",
        description: "Data poli berhasil dihapus",
      });
      setSelected(null);
      refetch();
    },
    onError: () => {
      notification.error({
        message: "Gagal menghapus data",
        description: "Terjadi kesalahan saat menghapus data",
      });
    },
  });

  const columns = [
    {
      title: "Nama Poli",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Lokasi",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Aksi",
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
        <div className="flex items-center space-x-2">
          <Button onClick={() => setSelected(record)} type="link" size="small">
            <EditOutlined />
          </Button>
          <Button
            onClick={() => deletePoli.mutate(id)}
            type="link"
            danger
            size="small"
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  if (error) {
    return <div>Error: {error?.message || "Terjadi Kesalahan"}</div>;
  }

  useEffect(() => {
    if (selected) {
      form.setFieldsValue(selected);
    }
  }, [selected]);

  return (
    <div>
      <Typography.Title className="text-[#767676] tracking-tight" level={2}>
        SEMUA POLI
      </Typography.Title>

      <div className="flex bg-[#F5F5F5] py-3 rounded-t-md px-4 flex-col md:flex-row items-center gap-2">
        <FilterOutlined className="text-xl text-[#767676] mr-2" />
        <Input.Search
          onSearch={(value) => onChangeFilter("name", value)}
          placeholder="Nama Poli"
          className="w-full md:w-1/6"
          allowClear
        />
        <Input.Search
          onSearch={(value) => onChangeFilter("location", value)}
          placeholder="Lokasi Poli"
          className="w-full md:w-1/6"
          allowClear
        />
        <Button
          type="primary"
          onClick={handleAddPoliClick} // Panggil fungsi navigasi saat tombol diklik
          className="w-full md:w-auto ml-auto" // ml-auto untuk mendorong tombol ke kanan
        >
          Tambah Poli
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        loading={isFetching}
        rowKey="id"
      />

      <Modal
        loading={edit.isPending}
        title="Edit Poli"
        open={!!selected}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => setSelected(null)}
      >
        <Form
          onFinish={(form) => edit.mutate(form)}
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="Nama Poli"
            name="name"
            rules={[{ required: true, message: "Nama Poli harus diisi" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Lokasi"
            name="location"
            rules={[{ required: true, message: "Lokasi harus diisi" }]}
          >
            <Input />
          </Form.Item>
        </Form>
        
      </Modal>
    </div>
  );
}
