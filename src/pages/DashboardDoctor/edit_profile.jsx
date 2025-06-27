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
  DeleteOutlined, // Tambahkan DeleteOutlined untuk tombol hapus
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // Tambahkan useQueryClient
import instance from "../../utils/axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom"; // useParams tidak terpakai di sini, bisa dihapus jika tidak ada ID di URL

const { Dragger } = Upload;

export default function EditProfileDoctor() {
  const [form] = Form.useForm();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [suratIzin, setSuratIzin] = useState(null); // State untuk surat izin file object
  const [suratIzinUrl, setSuratIzinUrl] = useState(null); // State untuk URL surat izin (preview)

  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Inisialisasi useQueryClient

  // Fetch data poli (tidak ada perubahan signifikan di sini)
  const { data, isLoading } = useQuery({
    queryKey: ["poli-list"],
    queryFn: async () => {
      const { data } = await instance.get("/polis");
      return data;
    },
  });

  // Fetch data dokter yang sedang login
  const { data: dataDoctor, isLoading: loadingDoctor } = useQuery({
    queryKey: ["doctor-profile"], // Ubah queryKey agar lebih spesifik
    queryFn: async () => {
      const { data } = await instance.get(`users/me`);
      return data;
    },
  });

  // Effect untuk mengisi form saat data dokter selesai di-fetch
  useEffect(() => {
    if (dataDoctor) {
      const data = dataDoctor;
      const doctor = data.doctor;

      // Pastikan education di-parse jika string
      const education =
        typeof doctor?.education === "string" && doctor.education // Tambahkan cek untuk memastikan bukan string kosong
          ? JSON.parse(doctor.education)
          : doctor?.education || [];

      // Pastikan actions di-parse jika string
      const actions =
        typeof doctor?.actions === "string" && doctor.actions // Tambahkan cek untuk memastikan bukan string kosong
          ? JSON.parse(doctor.actions)
          : doctor?.actions || [];

      // Set form values
      form.setFieldsValue({
        ...doctor,
        birthdate: doctor?.birthdate ? dayjs(doctor.birthdate) : null, // Set null jika tidak ada birthdate
        email: data.email, // Ambil email dari data user, bukan doctor
        actions: actions,
        education: education.map((item) => ({
          ...item,
          start_year: item.start_year ? dayjs(String(item.start_year)) : null, // Konversi ke dayjs, pastikan string
          end_year: item.end_year ? dayjs(String(item.end_year)) : null, // Konversi ke dayjs, pastikan string
        })),
      });

      // Set image preview
      if (doctor?.image) {
        const url = `http://localhost:8000/doctor_image/${doctor.image}`;
        setImageUrl(url);
      } else {
        setImageUrl(null); // Pastikan null jika tidak ada gambar
      }

      // Set surat izin preview
      if (doctor?.surat_izin) {
        const url = `http://localhost:8000/doctor_izin/${doctor.surat_izin}`; // Sesuaikan path jika berbeda
        setSuratIzinUrl(url);
      } else {
        setSuratIzinUrl(null); // Pastikan null jika tidak ada surat izin
      }
    }
  }, [dataDoctor]); // Tambahkan form sebagai dependency agar effect jalan saat form ready

  // Props untuk Upload Komponen Foto Profil
  const uploadImageProps = {
    name: "image",
    showUploadList: false,
    beforeUpload: (file) => {
      setImage(file); // Simpan file object untuk dikirim nanti
      setImageUrl(URL.createObjectURL(file)); // Untuk preview langsung
      form.setFieldsValue({ image_removed: false }); // Reset flag jika upload baru
      return false; // Mencegah Ant Design mengupload secara otomatis
    },
    onRemove: () => {
      // Menangani penghapusan gambar yang sudah ada
      setImage(null);
      setImageUrl(null);
      form.setFieldsValue({ image_removed: true }); // Set flag untuk memberitahu backend bahwa gambar dihapus
      return true;
    },
  };

  // Props untuk Upload Komponen Surat Izin
  const uploadSuratIzinProps = {
    name: "surat_izin",
    showUploadList: false,
    beforeUpload: (file) => {
      setSuratIzin(file); // Simpan file object untuk dikirim nanti
      setSuratIzinUrl(URL.createObjectURL(file)); // Untuk preview langsung
      form.setFieldsValue({ surat_izin_removed: false }); // Reset flag jika upload baru
      return false; // Mencegah Ant Design mengupload secara otomatis
    },
    onRemove: () => {
      // Menangani penghapusan surat izin yang sudah ada
      setSuratIzin(null);
      setSuratIzinUrl(null);
      form.setFieldsValue({ surat_izin_removed: true }); // Set flag
      return true;
    },
  };

  const mutation = useMutation({
    mutationFn: (body) =>
      instance.post(`users/update-profile`, body, {
        // Gunakan POST untuk FormData
        headers: {
          "Content-Type": "multipart/form-data", // Penting untuk FormData
        },
      }),
    onSuccess: (res) => {
      toast.success("Berhasil mengubah profil");
      // Invalidate queries agar data terbaru diambil kembali dari server
      queryClient.invalidateQueries({ queryKey: ["doctor-profile"] });
      // queryClient.invalidateQueries({ queryKey: ["doctor"] }); // Jika ada queryKey lain yang terkait
      // navigate("/doctor/profile"); // Mungkin tidak perlu navigasi setelah update profil
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Gagal memperbarui profil",
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
            // Konversi tahun dayjs di education menjadi string
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
            // If it's already a string JSON (from initial form values), just append it
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
    } else if (imageUrl === null && dataDoctor?.doctor?.image) {
      // Jika gambar dihapus dari form dan sebelumnya ada
      fd.append("image_removed", "true");
    }

    // Append surat_izin file if present
    if (suratIzin) {
      fd.append("surat_izin", suratIzin);
    } else if (suratIzinUrl === null && dataDoctor?.doctor?.surat_izin) {
      // Jika surat izin dihapus dari form dan sebelumnya ada
      fd.append("surat_izin_removed", "true");
    }

    // Penting: _method PUT untuk Laravel saat pakai FormData
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
                      e.stopPropagation(); // Mencegah Dragger membuka dialog file
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
              onClick={() => {
                form.resetFields();
                setImage(null);
                setImageUrl(null);
                setSuratIzin(null);
                setSuratIzinUrl(null);
                // Re-fetch data untuk mengisi ulang form dengan data asli setelah reset
                if (dataDoctor) {
                  const doctor = dataDoctor.doctor;
                  form.setFieldsValue({
                    ...doctor,
                    birthdate: doctor?.birthdate
                      ? dayjs(doctor.birthdate)
                      : null,
                    email: dataDoctor.email,
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
                  }
                  if (doctor.surat_izin) {
                    setSuratIzinUrl(
                      `http://localhost:8000/doctor_izin/${doctor.surat_izin}`,
                    );
                  }
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
