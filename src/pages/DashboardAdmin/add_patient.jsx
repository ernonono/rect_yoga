import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Typography,
  Upload,
  message,
} from "antd";
import dayjs from "dayjs";
import React from "react";
import {
  InboxOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import instance from "../../utils/axios";
import { toast } from "react-toastify";

const { Dragger } = Upload;

export default function AddPatient() {
  const [form] = Form.useForm();
  const [image, setImage] = React.useState(null);

  const uploadProps = {
    name: "file",
    showUploadList: false,
    action: null,
    onChange(info) {
      setImage(info.file.originFileObj);
    },
  };

  const mutation = useMutation({
    mutationFn: (body) =>
      instance.post("patients", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: () => {
      toast.success("Berhasil menambahkan pasien");
      form.resetFields();
      setImage(null);
    },

    onError: (error) => {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Gagal menambahkan pasien",
      );
    },
  });

  const onFinish = (values) => {
    const fd = new FormData();

    const objectKeys = Object.keys(values);

    objectKeys.forEach((key) => {
      switch (key) {
        case "image":
          if (values[key]) {
            fd.append(key, image);
          }

          break;
        case "birth":
          fd.append(key, dayjs(values[key]).format("YYYY-MM-DD"));
          break;
        default:
          if (values[key]) {
            fd.append(key, values[key]);
          }

          break;
      }
    });

    mutation.mutate(fd);
  };

  const required = [
    {
      required: true,
      message: "Harap lengkapi data ini",
    },
  ];

  return (
    <>
      <Typography.Title className="text-[#767676] tracking-tight" level={2}>
        TAMBAH PASIEN
      </Typography.Title>
      <Form
        onFinish={onFinish}
        form={form}
        layout="vertical"
        className="flex flex-col gap-10"
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
            label="Nama Lengkap"
            name="name"
            className="md:w-7/12 w-full"
            rules={required}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tanggal Lahir"
            name="birth"
            rules={required}
            className="md:w-7/12 w-full"
          >
            <DatePicker maxDate={dayjs()} className="w-full" />
          </Form.Item>
          <Form.Item
            label="Jenis Kelamin"
            name="gender"
            rules={required}
            className="md:w-7/12 w-full"
          >
            <Select>
              <Select.Option value="male">Laki-laki</Select.Option>
              <Select.Option value="female">Perempuan</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Golongan Darah"
            name="blood_type"
            rules={required}
            className="md:w-7/12 w-full"
          >
            <Select>
              <Select.Option value="A">A</Select.Option>
              <Select.Option value="B">B</Select.Option>
              <Select.Option value="AB">AB</Select.Option>
              <Select.Option value="O">O</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Foto Profil"
            name="image"
            className="md:w-7/12 w-full"
          >
            <Dragger {...uploadProps}>
              {image ? (
                <img
                  className="w-full h-48 object-contain"
                  src={URL.createObjectURL(image)}
                  alt="profil"
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

          <Form.Item
            label="Alamat"
            rules={required}
            name="address"
            className="md:w-7/12 w-full"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            rules={required}
            label="Nomor Telepon"
            name="phone"
            className="md:w-7/12 w-full"
          >
            <Input
              onKeyDown={(event) => {
                // backspace, delete, arrow keys, tab, enter, etc
                if (
                  !/[0-9]/.test(event.key) &&
                  event.key !== "Backspace" &&
                  event.key !== "Delete" &&
                  event.key !== "ArrowLeft" &&
                  event.key !== "ArrowRight" &&
                  event.key !== "Tab" &&
                  event.key !== "Enter"
                ) {
                  event.preventDefault();
                }
              }}
              prefix={"+62"}
            />
          </Form.Item>
          <Form.Item
            rules={required}
            label="NIK"
            name="nik"
            className="md:w-7/12 w-full"
          >
            <Input
              onKeyDown={(event) => {
                // backspace, delete, arrow keys, tab, enter, etc
                if (
                  !/[0-9]/.test(event.key) &&
                  event.key !== "Backspace" &&
                  event.key !== "Delete" &&
                  event.key !== "ArrowLeft" &&
                  event.key !== "ArrowRight" &&
                  event.key !== "Tab" &&
                  event.key !== "Enter"
                ) {
                  event.preventDefault();
                }
              }}
            />
          </Form.Item>
          <Form.Item label="Status" name="status" className="md:w-7/12 w-full">
            <Select>
              <Select.Option value="lajang">Lajang</Select.Option>
              <Select.Option value="menikah">Menikah</Select.Option>
              <Select.Option value="duda">Duda</Select.Option>
              <Select.Option value="janda">Janda</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Agama"
            rules={required}
            name="religion"
            className="md:w-7/12 w-full"
          >
            <Select>
              <Select.Option value="islam">Islam</Select.Option>
              <Select.Option value="kristen">Kristen</Select.Option>
              <Select.Option value="katolik">Katolik</Select.Option>
              <Select.Option value="hindu">Hindu</Select.Option>
              <Select.Option value="budha">Budha</Select.Option>
              <Select.Option value="konghucu">Konghucu</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            onKeyDown={(event) => {
              // backspace, delete, arrow keys, tab, enter, etc
              if (
                !/[0-9]/.test(event.key) &&
                event.key !== "Backspace" &&
                event.key !== "Delete" &&
                event.key !== "ArrowLeft" &&
                event.key !== "ArrowRight" &&
                event.key !== "Tab" &&
                event.key !== "Enter"
              ) {
                event.preventDefault();
              }
            }}
            label="Nomor orang rumah yang dapat dihubungi saat darurat "
            name="related_contact"
            className="md:w-7/12 w-full"
          >
            <Input />
          </Form.Item>
          <Form.Item
            onKeyDown={(event) => {
              // backspace, delete, arrow keys, tab, enter, etc
              if (
                !/[0-9]/.test(event.key) &&
                event.key !== "Backspace" &&
                event.key !== "Delete" &&
                event.key !== "ArrowLeft" &&
                event.key !== "ArrowRight" &&
                event.key !== "Tab" &&
                event.key !== "Enter"
              ) {
                event.preventDefault();
              }
            }}
            label="Nomor BPJS"
            name="bpjs"
            className="md:w-7/12 w-full"
          >
            <Input />
          </Form.Item>
        </Card>

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
          title="Informasi Akun Pasien"
        >
          <Form.Item
            label="Email"
            rules={required}
            name="email"
            className="md:w-7/12 w-full"
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            rules={required}
            label="Password"
            name="password"
            className="md:w-7/12 w-full"
          >
            <Input.Password />
          </Form.Item>

          <div className="flex gap-2">
            <Button
              loading={mutation.isPending}
              onClick={form.submit}
              type="primary"
              htmlType="button"
            >
              Simpan
            </Button>
            <Button
              loading={mutation.isPending}
              type="default"
              htmlType="reset"
            >
              Reset
            </Button>
          </div>
        </Card>
      </Form>
    </>
  );
}
