import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Table, Typography } from "antd";
import React, { useRef } from "react";
import instance from "../../utils/axios";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

export default function Healthcare() {
  const toastId = useRef(null);
  const [form] = Form.useForm();
  const [edit] = Form.useForm();
  const [open, setOpen] = React.useState(false);
  const [dataEdit, setDataEdit] = React.useState(null);
  const [video, setVideo] = React.useState(null);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["healthcare"],
    queryFn: async () => {
      const { data } = await instance.get("healthcares");
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async (values) =>
      await instance.post("healthcares", values, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onMutate: () => {
      toastId.current = toast("Harap tunggu file sedang di upload...", {
        type: "info",
        isLoading: true,
      });
    },
    onSuccess: () => {
      toast.update(toastId.current, {
        render: "Berhasil menambahkan data",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      refetch();
      form.resetFields();
      setVideo(null);
      setOpen(false);
    },
    onError: () => {
      toast.update(toastId.current, {
        render: "Gagal menambahkan data",
        type: "error",
        isLoading: false,
      });
    },
  });

  const deleteData = useMutation({
    mutationFn: async (id) => await instance.delete(`healthcares/${id}`),
    onMutate: () => {
      toastId.current = toast("Menghapus data...", {
        type: "info",
        isLoading: true,
      });
    },
    onSuccess: () => {
      toast.update(toastId.current, {
        render: "Berhasil menghapus data",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      refetch();
    },
    onError: () => {
      toast.update(toastId.current, {
        render: "Gagal menghapus data",
        type: "error",
        isLoading: false,
      });
    },
  });

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append("service_name", values.service_name);
    formData.append("title", values.title);
    formData.append("service", values.service);
    formData.append("description", values.description);
    formData.append("video", video);

    create.mutate(formData);
  };

  const put = useMutation({
    mutationFn: async (values) =>
      await instance.put(`healthcares/${dataEdit.id}`, values),
    onMutate: () => {
      toastId.current = toast("Harap tunggu file sedang di upload...", {
        type: "info",
        isLoading: true,
      });
    },
    onSuccess: () => {
      toast.update(toastId.current, {
        render: "Berhasil mengubah data",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      refetch();
      edit.resetFields();
      setVideo(null);
      setDataEdit(null);
    },
    onError: () => {
      toast.update(toastId.current, {
        render: "Gagal mengubah data",
        type: "error",
        isLoading: false,
      });
    },
  });

  const columns = [
    {
      title: "Nama Layanan",
      dataIndex: "service_name",
      key: "service_name",
    },
    {
      title: "Judul",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Layanan",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Deskripsi",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Video",
      dataIndex: "video",
      key: "video",
      render: (text, record) => (
        <video
          className="h-[100px] object-cover"
          src={`http://localhost:8000/healthcare_video/${record.video}`}
          controls
        />
      ),
    },
    {
      title: "Aksi",
      key: "action",
      render: (text, record) => (
        <div className="flex gap-2">
          <Button
            onClick={() => {
              edit.setFieldsValue(record);
              setDataEdit(record);
            }}
            type="primary"
          >
            Edit
          </Button>
          <Button
            onClick={() => deleteData.mutate(record.id)}
            danger
            loading={deleteData.isLoading}
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  const uploadProps = {
    name: "file",
    showUploadList: false,
    action: null,
    accept: "video/*",
    onChange(info) {
      setVideo(info.file.originFileObj);
    },
  };

  const onFinishEdit = (values) => {
    if (video) {
      const formData = new FormData();
      formData.append("healthcare_id", dataEdit.id);
      formData.append("video", video);

      instance.post("healthcares/upload-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    put.mutate(values);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <Typography.Title className="text-[#767676] tracking-tight" level={2}>
          LAYANAN KESEHATAN
        </Typography.Title>

        <Button onClick={() => setOpen(true)} type="primary">
          + Tambah Data
        </Button>
      </div>

      <Table bordered columns={columns} dataSource={data} loading={isLoading} />

      <Modal
        width={1000}
        title="Tambah Data"
        open={open}
        onClose={() => {
          if (create.isPending) return;

          setOpen(false);
        }}
        onCancel={() => {
          if (create.isPending) return;

          setOpen(false);
        }}
        onOk={() => form.submit()}
        okText="Simpan"
        cancelText="Batal"
        okButtonProps={{ loading: create.isPending }}
        cancelButtonProps={{ disabled: create.isPending }}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            className="w-[70%]"
            label="Nama Layanan"
            name="service_name"
            rules={[{ required: true, message: "Nama Layanan harus diisi" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            className="w-[70%]"
            label="Judul"
            name="title"
            rules={[{ required: true, message: "Judul harus diisi" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            className="w-[70%]"
            label="Layanan"
            name="service"
            rules={[{ required: true, message: "Layanan harus diisi" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            className="w-[70%]"
            label="Deskripsi"
            name="description"
            rules={[{ required: true, message: "Deskripsi harus diisi" }]}
          >
            <Input.TextArea rows={4} placeholder="Deskripsi" />
          </Form.Item>

          <Form.Item
            label="Video"
            name="video"
            rules={[{ required: true, message: "Harap upload video" }]}
          >
            <Dragger className="flex justify-center" {...uploadProps}>
              {video ? (
                <video
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="h-[300px]  object-cover"
                  src={URL.createObjectURL(video)}
                  controls
                />
              ) : (
                <>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Klik atau tarik file ke area ini untuk mengunggah
                  </p>
                </>
              )}
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        width={1000}
        title="Edit Data"
        open={!!dataEdit}
        onClose={() => {
          if (edit.isPending) return;

          setDataEdit(null);
        }}
        onCancel={() => {
          if (edit.isPending) return;

          setDataEdit(null);
        }}
        onOk={() => edit.submit()}
        okText="Simpan"
        cancelText="Batal"
        okButtonProps={{ loading: edit.isPending }}
        cancelButtonProps={{ disabled: edit.isPending }}
      >
        <Form layout="vertical" form={edit} onFinish={onFinishEdit}>
          <Form.Item
            className="w-[70%]"
            label="Nama Layanan"
            name="service_name"
            rules={[{ required: true, message: "Nama Layanan harus diisi" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            className="w-[70%]"
            label="Judul"
            name="title"
            rules={[{ required: true, message: "Judul harus diisi" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            className="w-[70%]"
            label="Layanan"
            name="service"
            rules={[{ required: true, message: "Layanan harus diisi" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            className="w-[70%]"
            label="Deskripsi"
            name="description"
            rules={[{ required: true, message: "Deskripsi harus diisi" }]}
          >
            <Input.TextArea rows={4} placeholder="Deskripsi" />
          </Form.Item>

          <Form.Item
            label="Video"
            // name="video"
            rules={[{ required: true, message: "Harap upload video" }]}
          >
            <Dragger className="flex justify-center" {...uploadProps}>
              {video ? (
                <video
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="h-[300px]  object-cover"
                  src={URL.createObjectURL(video)}
                  controls
                />
              ) : dataEdit?.video ? (
                <video
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="h-[300px]  object-cover"
                  src={`http://localhost:8000/healthcare_video/${dataEdit?.video}`}
                  controls
                />
              ) : (
                <>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Klik atau tarik file ke area ini untuk mengunggah
                  </p>
                </>
              )}
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
