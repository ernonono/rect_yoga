import { useMutation } from "@tanstack/react-query";
import { Button, Card, Form, Input, Typography, notification } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../utils/axios";

export default function AddPoli() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const create = useMutation({
    mutationFn: (form) => instance.post("/polis", form),
    onSuccess: () => {
      notification.success({
        message: "Berhasil menambahkan data",
        description: "Data poli berhasil ditambahkan",
      });
      form.resetFields();
      navigate("/admin/poli");
    },
    onError: () => {
      notification.error({
        message: "Gagal menambahkan data",
        description: "Terjadi kesalahan saat menambahkan data",
      });
    },
  });

  return (
    <div>
      <Typography.Title className="text-[#767676] tracking-tight" level={2}>
        TAMBAH POLI
      </Typography.Title>
      <Form
        onFinish={(form) => create.mutate(form)}
        form={form}
        layout="vertical"
      >
        <Card
          style={{
            border: "1px solid #E8E8E8",
          }}
          styles={{
            header: {
              backgroundColor: "#F5F5F5",
              color: "#676767",
              textTransform: "uppercase",
            },
          }}
          title="Informasi"
        >
          <Form.Item
            label="Nama Poli"
            name="name"
            rules={[
              {
                required: true,
                message: "Harap lengkapi data ini",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Lokasi"
            name="location"
            rules={[
              {
                required: true,
                message: "Harap lengkapi data ini",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <div className="flex gap-2">
            <Button
              loading={create.isPending}
              onClick={form.submit}
              type="primary"
              htmlType="button"
            >
              Simpan
            </Button>
            <Button loading={create.isPending} type="default" htmlType="reset">
              Reset
            </Button>
          </div>
        </Card>
      </Form>
    </div>
  );
}
