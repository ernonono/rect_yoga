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
import React, { useEffect } from "react";
import {
  InboxOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import instance from "../../utils/axios";
import { toast } from "react-toastify";

const { Dragger } = Upload;

export default function AddDoctor() {
  const [form] = Form.useForm();
  const [image, setImage] = React.useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["poli-list"],
    queryFn: async () => {
      const { data } = await instance.get("/polis");
      return data;
    },
  });

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
      instance.post("doctors", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: (res) => {
      toast.success("Berhasil menambahkan dokter");
      form.resetFields();
    },

    onError: (error) => {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Gagal menambahkan dokter",
      );
    },
  });

  useEffect(() => {
    form.setFieldsValue({
      quota: [
        {
          day: "Senin",
          quota: 10,
        },
      ],
    });
  }, []);

  const profesiOptions = [
    {
      label: "Dokter Umum",
      value: "Dokter Umum",
    },
    {
      label: "Dokter Spesialis",
      value: "Dokter Spesialis",
    },
    {
      label: "Dokter Gigi",
      value: "Dokter Gigi",
    },
  ];

  const specialtyOptions = [
    {
      label: "Spesialis Anak",
      value: "Spesialis Anak",
    },
    {
      label: "Spesialis Bedah",
      value: "Spesialis Bedah",
    },
    {
      label: "Spesialis Gigi",
      value: "Spesialis Gigi",
    },
  ];

  const actionsOptions = [
    {
      label: "Konsultasi",
      value: "Konsultasi",
    },
    {
      label: "Operasi",
      value: "Operasi",
    },
    {
      label: "Pemeriksaan",
      value: "Pemeriksaan",
    },
    {
      label: "Cek Kesehatan",
      value: "Cek Kesehatan",
    },
  ];

  const onFinish = (values) => {
    const fd = new FormData();

    const objectKeys = Object.keys(values);

    if (values.education?.length > 0) {
      values.education = values.education.map((item) => ({
        ...item,
        start_year: dayjs(item.start_year).format("YYYY"),
        end_year: dayjs(item.end_year).format("YYYY"),
      }));
    }

    objectKeys.forEach((key) => {
      switch (key) {
        case "image":
          if (values[key]) {
            fd.append(key, image);
          }

          break;
        case "birthdate":
          fd.append(key, dayjs(values[key]).format("YYYY-MM-DD"));
          break;
        case "education":
          if (values[key]) {
            fd.append(key, JSON.stringify(values[key]));
          }

          break;
        case "actions":
          if (values[key]) {
            fd.append(key, JSON.stringify(values[key]));
          }
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
        TAMBAH DOKTOR
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
          <Form.Item label="NIK" name="nik" className="md:w-7/12 w-full">
            <Input />
          </Form.Item>
          <Form.Item
            label="Tanggal Lahir"
            name="birthdate"
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
          <Form.Item label="Alamat" name="address" className="md:w-7/12 w-full">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Nomor Telepon"
            name="phone_number"
            className="md:w-7/12 w-full"
          >
            <Input prefix={"+62"} />
          </Form.Item>
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
          title="Informasi Profesional"
        >
          <Form.Item
            rules={required}
            label="Poli"
            name="poli_id"
            className="md:w-7/12 w-full"
          >
            <Select
              loading={isLoading}
              showSearch
              optionFilterProp="label"
              options={data?.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Tentang Dokter"
            name="about"
            className="md:w-7/12 w-full"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Profesi"
            name="profession"
            className="md:w-7/12 w-full"
          >
            <Select
              showSearch
              optionFilterProp="label"
              options={profesiOptions}
            />
          </Form.Item>
          <Form.Item
            label="Spesialisasi Dokter"
            name="specialty"
            className="md:w-7/12 w-full"
          >
            <Select
              showSearch
              optionFilterProp="label"
              options={specialtyOptions}
            />
          </Form.Item>
          <Form.Item
            label="Deskripsi Spesialisasi"
            name="specialty_description"
            className="md:w-7/12 w-full"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Aksi Dokter"
            name="actions"
            className="md:w-7/12 w-full"
          >
            <Select
              mode="tags"
              showSearch
              optionFilterProp="label"
              options={actionsOptions}
            />
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
          title="Informasi Pendidikan"
        >
          <Form.List name="education">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: "flex",
                      marginBottom: 8,
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "institution"]}
                      rules={[
                        {
                          required: true,
                          message: "Harap masukkan nama institusi",
                        },
                      ]}
                    >
                      <Input className="w-[340px]" placeholder="Institusi" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "start_year"]}
                      rules={[
                        {
                          required: true,
                          message: "Harap masukkan tahun mulai",
                        },
                      ]}
                    >
                      <DatePicker picker="year" placeholder="Tahun Mulai" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "end_year"]}
                      rules={[
                        {
                          required: true,
                          message: "Harap masukkan tahun akhir",
                        },
                      ]}
                    >
                      <DatePicker picker="year" placeholder="Tahun Akhir" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    htmlType="button"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Tambah Data Pendidikan
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
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
          title="Informasi Sosial Media"
        >
          <Form.Item
            label="Facebook URL"
            name="facebook_link"
            className="md:w-7/12 w-full"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Twitter URL"
            name="twitter_link"
            className="md:w-7/12 w-full"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Google Plus URL"
            name="google_plus_link"
            className="md:w-7/12 w-full"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Linkedin URL"
            name="linkedin_link"
            className="md:w-7/12 w-full"
          >
            <Input />
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
