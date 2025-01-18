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
} from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import {
  InboxOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import instance from "../../utils/axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const { Dragger } = Upload;

export default function EditProfileDoctor() {
  const [form] = Form.useForm();
  const [image, setImage] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState(null);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["poli-list"],
    queryFn: async () => {
      const { data } = await instance.get("/polis");

      return data;
    },
  });

  const { data: dataDoctor, isLoading: loadingDoctor } = useQuery({
    queryKey: ["doctor"],
    queryFn: async () => {
      const { data } = await instance.get(`users/me`);

      return data;
    },
  });

  useEffect(() => {
    if (dataDoctor) {
      const data = dataDoctor;
      const doctor = data.doctor;
      // set form values
      form.setFieldsValue({
        ...doctor,
        birthdate: doctor?.birthdate ? dayjs(doctor.birthdate) : null,
        email: data.email,
        actions: doctor?.actions ? JSON.parse(doctor.actions) : null,
        education: doctor?.education
          ? JSON.parse(doctor.education).map((item) => ({
              ...item,
              start_year: dayjs(item.start_year),
              end_year: dayjs(item.end_year),
            }))
          : null,
      });

      if (doctor.image) {
        const url = `http://localhost:8000/doctor_image/${doctor.image}`;
        setImageUrl(url);
      }
    }
  }, [dataDoctor]);

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
      form.resetFields();
      navigate("/doctor/profile");
    },

    onError: (error) => {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Gagal menambahkan profil",
      );
    },
  });

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
    if (values.education?.length > 0) {
      values.education = values.education.map((item) => ({
        ...item,
        start_year: dayjs(item.start_year).format("YYYY"),
        end_year: dayjs(item.end_year).format("YYYY"),
      }));
    }

    // objectKeys.forEach((key) => {
    //   switch (key) {
    //     case "image":
    //       if (image) {
    //         fd.append(key, image);
    //       }

    //       break;
    //     case "birthdate":
    //       fd.append(key, dayjs(values[key]).format("YYYY-MM-DD"));
    //       break;
    //     case "education":
    //       if (values[key]) {
    //         fd.append(key, JSON.stringify(values[key]));
    //       }

    //       break;
    //     case "actions":
    //       if (values[key]) {
    //         fd.append(key, JSON.stringify(values[key]));
    //       }
    //       break;
    //     default:
    //       if (values[key]) {
    //         fd.append(key, values[key]);
    //       }

    //       break;
    //   }
    // });

    values.birthdate = dayjs(values.birthdate).format("YYYY-MM-DD");
    values.education = values.education
      ? JSON.stringify(values.education)
      : null;
    values.actions = values.actions ? JSON.stringify(values.actions) : null;

    if (image) {
      // handle upload later
      const fd = new FormData();

      fd.append("doctor_id", id);
      fd.append("image", image);

      instance
        .post("/doctors/upload-image", fd, {
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

  return (
    <>
      <div className="flex items-center gap-3 mb-3">
        <Button
          onClick={() => navigate("/doctor/profile")}
          icon={<ArrowLeftOutlined />}
        />
        <Typography.Title
          className="text-[#767676] tracking-tight m-0"
          level={2}
        >
          EDIT PROFIL
        </Typography.Title>
      </div>
      <Form
        scrollToFirstError
        onFinish={onFinish}
        form={form}
        layout="vertical"
        className="flex flex-col gap-10"
      >
        <Card
          loading={loadingDoctor}
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
            // rules={required}
            label="Password"
            name="password"
            className="md:w-7/12 w-full"
          >
            <Input.Password />
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
        </Card>

        <Card
          loading={loadingDoctor}
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
            label="Tentang Dokter"
            name="about"
            className="md:w-7/12 w-full"
          >
            <Input.TextArea rows={4} />
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
          loading={loadingDoctor}
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
          loading={loadingDoctor}
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
