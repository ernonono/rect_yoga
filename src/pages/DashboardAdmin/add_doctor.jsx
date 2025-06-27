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
import React, { useEffect, useState } from "react"; // Tambahkan useState
import {
  InboxOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  DeleteOutlined, // Tambahkan DeleteOutlined
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import instance from "../../utils/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const { Dragger } = Upload;

export default function AddDoctor() {
  const [form] = Form.useForm();
  const [image, setImage] = useState(null); // State untuk file gambar
  const [imageUrl, setImageUrl] = useState(null); // State untuk preview gambar
  const [suratIzin, setSuratIzin] = useState(null); // State untuk file surat izin
  const [suratIzinUrl, setSuratIzinUrl] = useState(null); // State untuk preview surat izin (URL objek)

  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["poli-list"],
    queryFn: async () => {
      const { data } = await instance.get("/polis");
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: (body) =>
      instance.post("/doctors", body, {
        headers: {
          "Content-Type": "multipart/form-data", // Penting untuk FormData
        },
      }),
    onSuccess: (res) => {
      toast.success("Berhasil menambahkan dokter");
      form.resetFields();
      setImage(null); // Reset state gambar
      setImageUrl(null); // Reset preview gambar
      setSuratIzin(null); // Reset state surat izin
      setSuratIzinUrl(null); // Reset preview surat izin
      navigate("/admin/doctors");
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

  // Props untuk Upload Komponen Foto Profil
  const uploadImageProps = {
    name: "image",
    showUploadList: false,
    beforeUpload: (file) => {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
      return false; // Mencegah Ant Design mengupload secara otomatis
    },
    onRemove: () => {
      setImage(null);
      setImageUrl(null);
      return true;
    },
  };

  // Props untuk Upload Komponen Surat Izin
  const uploadSuratIzinProps = {
    name: "surat_izin",
    showUploadList: false,
    beforeUpload: (file) => {
      setSuratIzin(file);
      setSuratIzinUrl(URL.createObjectURL(file));
      return false; // Mencegah Ant Design mengupload secara otomatis
    },
    onRemove: () => {
      setSuratIzin(null);
      setSuratIzinUrl(null);
      return true;
    },
  };

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

    // Append all form values
    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        let value = values[key];

        // Handle DatePicker values
        if (dayjs.isDayjs(value)) {
          value = value.format("YYYY-MM-DD");
        }

        // Handle nested JSON fields (education, actions)
        if (key === "education" || key === "actions") {
          if (Array.isArray(value)) {
            if (key === "education") {
              value = value.map((item) => ({
                ...item,
                start_year: dayjs.isDayjs(item.start_year)
                  ? item.start_year.format("YYYY")
                  : item.start_year,
                end_year: dayjs.isDayjs(item.end_year)
                  ? item.end_year.format("YYYY")
                  : item.end_year,
              }));
            }
            fd.append(key, JSON.stringify(value));
          } else if (value) {
            fd.append(key, value);
          }
        } else if (value !== null && value !== undefined) {
          fd.append(key, value);
        }
      }
    }

    // Append image file if present
    if (image) {
      fd.append("image", image);
    }

    // Append surat_izin file if present
    if (suratIzin) {
      fd.append("surat_izin", suratIzin);
    }

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
      <div className="flex items-center gap-3 mb-3">
        <Button
          onClick={() => navigate("/admin/doctosr")}
          icon={<ArrowLeftOutlined />}
        />
        <Typography.Title
          className="text-[#767676] tracking-tight m-0"
          level={2}
        >
          TAMBAH DOKTER
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
          <Form.Item label="Foto Profil" className="md:w-7/12 w-full">
            <Dragger {...uploadImageProps}>
              {image ? (
                <img
                  className="w-full h-48 object-contain"
                  src={URL.createObjectURL(image)}
                  alt="profil"
                />
              ) : imageUrl ? ( // Tambahkan ini jika Anda ingin tetap menampilkan preview setelah reset
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

          {/* New Field for Surat Izin */}
          <Form.Item label="Surat Izin" className="md:w-7/12 w-full">
            <Dragger {...uploadSuratIzinProps}>
              {suratIzin ? (
                <>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    File terpilih: {suratIzin.name}
                  </p>
                  <p className="ant-upload-hint">
                    {suratIzin.type.startsWith("image/") ? (
                      <img
                        className="w-full h-48 object-contain"
                        src={URL.createObjectURL(suratIzin)}
                        alt="surat izin preview"
                      />
                    ) : suratIzin.type === "application/pdf" ? (
                      // Untuk PDF, gunakan <embed> atau link download
                      // Catatan: <embed> mungkin tidak berfungsi di semua browser
                      <embed
                        src={URL.createObjectURL(suratIzin)}
                        type="application/pdf"
                        width="100%"
                        height="200px"
                      />
                    ) : (
                      <span>
                        Pratinjau tidak tersedia untuk jenis file ini.
                      </span>
                    )}
                  </p>
                </>
              ) : suratIzinUrl ? ( // Tambahkan ini jika Anda ingin tetap menampilkan preview setelah reset
                <>
                  {suratIzinUrl.endsWith(".pdf") ? (
                    <embed
                      src={suratIzinUrl}
                      type="application/pdf"
                      width="100%"
                      height="200px"
                    />
                  ) : (
                    <img
                      className="w-full h-48 object-contain mb-2"
                      src={suratIzinUrl}
                      alt="surat izin preview"
                    />
                  )}
                  <p className="ant-upload-text">
                    File terunggah: {suratIzinUrl.split("/").pop()}
                  </p>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      uploadSuratIzinProps.onRemove();
                    }}
                  >
                    Hapus Surat Izin
                  </Button>
                </>
              ) : (
                <>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Klik atau tarik file ke area ini untuk mengunggah Surat Izin
                    (PDF/Gambar)
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
          <Form.Item
            label="Kuota Pasien"
            name="quota"
            className="md:w-7/12 w-full"
          >
            <Input type="number" />
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
              onClick={() => {
                form.resetFields();
                setImage(null);
                setImageUrl(null);
                setSuratIzin(null);
                setSuratIzinUrl(null);
              }}
            >
              Reset
            </Button>
          </div>
        </Card>
      </Form>
    </>
  );
}
