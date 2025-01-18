import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Typography,
  Upload,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import instance from "../../utils/axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";

const { Dragger } = Upload;

export default function UserProfile() {
  const [form] = Form.useForm();
  const [image, setImage] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const {
    data,
    isLoading: loadingPatient,
    refetch,
  } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await instance.get(`users/me`);

      return data;
    },
  });

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data.patient,
        ...data,
        birth: dayjs(data.birth),
      });

      if (data?.patient?.image) {
        setImageUrl(
          `http://localhost:8000/patient_image/${data?.patient?.image}`,
        );
      }
    }
  }, [data]);

  const uploadProps = {
    name: "file",
    showUploadList: false,
    action: null,
    onChange(info) {
      setImageUrl(null);
      setImage(info.file.originFileObj);
    },
  };

  const mutation = useMutation({
    mutationFn: (body) => instance.put(`users/update-profile`, body),
    onSuccess: (res) => {
      toast.success("Berhasil mengubah profil");
      localStorage.setItem("user", JSON.stringify(res.data || {}));
      refetch();
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Gagal mengubah profil",
      );
    },
  });

  const onFinish = (values) => {
    values.birth = dayjs(values.birth).format("YYYY-MM-DD");

    if (image) {
      // handle upload later
      const fd = new FormData();

      fd.append("patient_id", user.patient_id);
      fd.append("image", image);

      instance
        .post("/patients/upload-image", fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log("hasil upload", res);
        });
    }

    mutation.mutate(values);
  };

  const required = [
    {
      required: true,
      message: "Harap lengkapi data ini",
    },
  ];

  useEffect(() => {
    document.title = "Profile User";
  }, []);

  return (
    <>
      <Navbar />

      <div className="px-7 my-4">
        <Typography.Title className="text-[#767676] tracking-tight" level={2}>
          PROFILE
        </Typography.Title>
        <Form
          onFinish={onFinish}
          form={form}
          layout="vertical"
          className="flex flex-col gap-10"
        >
          <Card
            loading={loadingPatient}
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
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Tanggal Lahir"
              name="birth"
              className="md:w-7/12 w-full"
            >
              <DatePicker maxDate={dayjs()} className="w-full" />
            </Form.Item>
            <Form.Item
              label="Jenis Kelamin"
              name="gender"
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
              className="md:w-7/12 w-full"
            >
              <Select>
                <Select.Option value="A">A</Select.Option>
                <Select.Option value="B">B</Select.Option>
                <Select.Option value="AB">AB</Select.Option>
                <Select.Option value="O">O</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Foto Profil" className="md:w-7/12 w-full">
              <Dragger {...uploadProps}>
                {image ? (
                  <img
                    className="w-full h-48 object-contain"
                    src={URL.createObjectURL(image)}
                    alt="profil"
                  />
                ) : imageUrl ? (
                  <img
                    className="w-full h-48 object-contain"
                    src={imageUrl}
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
              name="address"
              className="md:w-7/12 w-full"
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label="Nomor Telepon"
              name="phone"
              className="md:w-7/12 w-full"
            >
              <Input
                onKeyDown={(event) => {
                  if (event.key === "Backspace") {
                    return;
                  }
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                prefix={"+62"}
              />
            </Form.Item>
            <Form.Item label="NIK" name="nik" className="md:w-7/12 w-full">
              <Input
                onKeyDown={(event) => {
                  if (event.key === "Backspace") {
                    return;
                  }
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              className="md:w-7/12 w-full"
            >
              <Select>
                <Select.Option value="lajang">Lajang</Select.Option>
                <Select.Option value="menikah">Menikah</Select.Option>
                <Select.Option value="duda">Duda</Select.Option>
                <Select.Option value="janda">Janda</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Agama"
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
                if (event.key === "Backspace") {
                  return;
                }
                if (!/[0-9]/.test(event.key)) {
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
                if (event.key === "Backspace") {
                  return;
                }
                if (!/[0-9]/.test(event.key)) {
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
            loading={loadingPatient}
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
            title="Informasi Akun"
          >
            <Form.Item label="Email" name="email" className="md:w-7/12 w-full">
              <Input type="email" />
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
      </div>
    </>
  );
}
