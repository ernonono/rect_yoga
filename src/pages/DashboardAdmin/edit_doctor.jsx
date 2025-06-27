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
import React, { useEffect, useState } from "react";
import {
  InboxOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "../../utils/axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const { Dragger } = Upload;

export default function EditDoctor() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [suratIzin, setSuratIzin] = useState(null);
  const [suratIzinUrl, setSuratIzinUrl] = useState(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["poli-list"],
    queryFn: async () => {
      const { data } = await instance.get("/polis");
      return data;
    },
  });

  // Query untuk mengambil data dokter yang akan diedit
  const {
    data: dataDoctor,
    isLoading: loadingDoctor,
    refetch: refetchDoctor, // Tambahkan refetch di sini
  } = useQuery({
    queryKey: ["doctor", id],
    queryFn: async () => {
      const { data } = await instance.get(`doctors/${id}`);
      return data;
    },
    enabled: !!id,
    // Agar data tidak di-cache terlalu lama dan selalu fresh setelah edit
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (dataDoctor) {
      const doctor = dataDoctor;

      const education =
        typeof doctor?.education === "string" && doctor.education
          ? JSON.parse(doctor.education)
          : doctor?.education || [];

      const actions =
        typeof doctor?.actions === "string" && doctor.actions
          ? JSON.parse(doctor.actions)
          : doctor?.actions || [];

      form.setFieldsValue({
        ...doctor,
        birthdate: doctor?.birthdate ? dayjs(doctor.birthdate) : null,
        actions: actions,
        education: education.map((item) => ({
          ...item,
          start_year: item.start_year ? dayjs(String(item.start_year)) : null,
          end_year: item.end_year ? dayjs(String(item.end_year)) : null,
        })),
      });

      if (doctor.image) {
        const url = `http://localhost:8000/doctor_image/${doctor.image}`;
        setImageUrl(url);
      } else {
        setImageUrl(null);
      }

      if (doctor.surat_izin) {
        const url = `http://localhost:8000/doctor_izin/${doctor.surat_izin}`;
        setSuratIzinUrl(url);
      } else {
        setSuratIzinUrl(null);
      }
    }
  }, [dataDoctor, form]);

  const uploadImageProps = {
    name: "image",
    showUploadList: false,
    beforeUpload: (file) => {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
      form.setFieldsValue({ image_removed: false });
      return false;
    },
    onRemove: () => {
      setImage(null);
      setImageUrl(null);
      form.setFieldsValue({ image_removed: true });
      return true;
    },
  };

  const uploadSuratIzinProps = {
    name: "surat_izin",
    showUploadList: false,
    beforeUpload: (file) => {
      setSuratIzin(file);
      setSuratIzinUrl(URL.createObjectURL(file));
      form.setFieldsValue({ surat_izin_removed: false });
      return false;
    },
    onRemove: () => {
      setSuratIzin(null);
      setSuratIzinUrl(null);
      form.setFieldsValue({ surat_izin_removed: true });
      return true;
    },
  };

  const mutation = useMutation({
    mutationFn: (body) =>
      instance.post(`/doctors/${id}`, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: (res) => {
      toast.success("Berhasil mengubah dokter");
      queryClient.invalidateQueries({ queryKey: ["doctors-list"] }); // Invalidate daftar dokter
      refetchDoctor(); // PENTING: Memuat ulang data dokter yang sedang diedit
      // navigate("/admin/doctor"); // BARIS INI DIHAPUS/DIKOMENTARI
    },

    onError: (error) => {
      console.error("Mutasi gagal:", error.response || error.message || error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Gagal mengubah dokter",
      );
    },
  });

  const profesiOptions = [
    { label: "Dokter Umum", value: "Dokter Umum" },
    { label: "Dokter Spesialis", value: "Dokter Spesialis" },
    { label: "Dokter Gigi", value: "Dokter Gigi" },
  ];

  const specialtyOptions = [
    { label: "Spesialis Anak", value: "Spesialis Anak" },
    { label: "Spesialis Bedah", value: "Spesialis Bedah" },
    { label: "Spesialis Gigi", value: "Spesialis Gigi" },
  ];

  const actionsOptions = [
    { label: "Konsultasi", value: "Konsultasi" },
    { label: "Operasi", value: "Operasi" },
    { label: "Pemeriksaan", value: "Pemeriksaan" },
    { label: "Cek Kesehatan", value: "Cek Kesehatan" },
  ];

  const onFinish = (values) => {
    const fd = new FormData();

    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        let value = values[key];

        if (dayjs.isDayjs(value)) {
          value = value.format("YYYY-MM-DD");
        }

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

    if (image) {
      fd.append("image", image);
    } else if (imageUrl === null && dataDoctor?.image) {
      fd.append("image_removed", "true");
    }

    if (suratIzin) {
      fd.append("surat_izin", suratIzin);
    } else if (suratIzinUrl === null && dataDoctor?.surat_izin) {
      fd.append("surat_izin_removed", "true");
    }

    fd.append("_method", "PUT");

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
          onClick={() => navigate("/admin/doctor")}
          icon={<ArrowLeftOutlined />}
        />
        <Typography.Title
          className="text-[#767676] tracking-tight m-0"
          level={2}
        >
          EDIT DOKTER
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
          style={{ border: "1px solid #E8E8E8" }}
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
            label="Password (Biarkan kosong jika tidak ingin mengubah)"
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
              ) : imageUrl ? (
                <>
                  <img
                    className="w-full h-48 object-contain mb-2"
                    src={imageUrl}
                    alt="profil"
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      uploadImageProps.onRemove();
                    }}
                  >
                    Hapus Foto
                  </Button>
                </>
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
              ) : suratIzinUrl ? (
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
          loading={loadingDoctor}
          style={{ border: "1px solid #E8E8E8" }}
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
          loading={loadingDoctor}
          style={{ border: "1px solid #E8E8E8" }}
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
                    style={{ display: "flex", marginBottom: 8 }}
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
          style={{ border: "1px solid #E8E8E8" }}
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
                // Reset form dan state preview ke kondisi awal dari dataDoctor
                if (dataDoctor) {
                  const doctor = dataDoctor;
                  form.setFieldsValue({
                    ...doctor,
                    birthdate: doctor?.birthdate
                      ? dayjs(doctor.birthdate)
                      : null,
                    actions:
                      typeof doctor?.actions === "string"
                        ? JSON.parse(doctor.actions)
                        : doctor?.actions || [],
                    education:
                      typeof doctor?.education === "string"
                        ? JSON.parse(doctor.education).map((item) => ({
                            ...item,
                            start_year: item.start_year
                              ? dayjs(String(item.start_year))
                              : null,
                            end_year: item.end_year
                              ? dayjs(String(item.end_year))
                              : null,
                          }))
                        : doctor?.education.map((item) => ({
                            ...item,
                            start_year: item.start_year
                              ? dayjs(String(item.start_year))
                              : null,
                            end_year: item.end_year
                              ? dayjs(String(item.end_year))
                              : null,
                          })) || [],
                  });
                  if (doctor.image) {
                    setImageUrl(
                      `http://localhost:8000/doctor_image/${doctor.image}`,
                    );
                    setImage(null); // Penting: Hapus file lokal jika reset ke yang dari server
                  } else {
                    setImageUrl(null);
                    setImage(null);
                  }
                  if (doctor.surat_izin) {
                    setSuratIzinUrl(
                      `http://localhost:8000/doctor_izin/${doctor.surat_izin}`,
                    );
                    setSuratIzin(null); // Penting: Hapus file lokal jika reset ke yang dari server
                  } else {
                    setSuratIzinUrl(null);
                    setSuratIzin(null);
                  }
                } else {
                  // Jika dataDoctor belum ada (misal halaman dimuat ulang dan data belum fetch)
                  form.resetFields();
                  setImage(null);
                  setImageUrl(null);
                  setSuratIzin(null);
                  setSuratIzinUrl(null);
                }
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
