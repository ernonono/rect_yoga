import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import instance from "../../utils/axios";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Skeleton,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import SearchObat from "../../components/SearchObat"; // Import SearchObat for consistency

const gejalaOptions = [
  "Demam",
  "Batuk",
  "Pusing",
  "Mual",
  "Muntah",
  "Diare",
  "Sesak Nafas",
  "Sakit Tenggorokan",
  "Sakit Kepala",
  "Sakit Perut",
];

function EditRekamMedis() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [params, _] = useSearchParams();

  const recordIdentifier = params.get("identifier");

  // Log untuk memastikan identifier ada
  console.log("Record Identifier from URL:", recordIdentifier);

  // Tambahkan kondisi untuk handle jika identifier tidak ada
  if (!recordIdentifier) {
    return (
      <div className="p-5 text-center">
        <Typography.Title level={2}>Error: ID Rekam Medis Tidak Ditemukan</Typography.Title>
        <Typography.Text>Mohon berikan ID rekam medis yang valid di URL.</Typography.Text>
        <Button className="mt-4" onClick={() => navigate('/some-default-path')}>
          Kembali ke Daftar Rekam Medis
        </Button>
      </div>
    );
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-detail-rm", recordIdentifier],
    queryFn: async () => {
      try {
        console.log(`Fetching medical record detail for ID: ${recordIdentifier}`);
        const { data } = await instance.get(
          `/medical-records/${recordIdentifier}`,
        );
        console.log("Medical record data fetched:", data);
        return data;
      } catch (err) {
        console.error("Error fetching medical record detail:", err.response || err.message || err);
        throw err; // Lempar error agar useQuery bisa menanganinya
      }
    },
    // Set initial data for the form once data is loaded
    onSuccess: (data) => {
      console.log("Setting form fields with data:", data);
      try {
        form.setFieldsValue({
          date: dayjs(data.date),
          symptomps: data.symptomps ? data.symptomps.split(",") : [], // Handle potential null/undefined
          diagnosis: data.diagnosis,
          drug_code: data.drug_code ? JSON.parse(data.drug_code) : [],
          dosis: data.dosis,
          prescription: data.prescription,
        });
        console.log("Form fields successfully set.");
      } catch (parseError) {
        console.error("Error parsing or setting form values:", parseError);
        toast.error("Gagal memuat data formulir. Periksa format data dari server.");
      }
    },
    // tambahkan onError untuk useQuery juga
    onError: (err) => {
      console.error("useQuery encountered an error:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Gagal memuat detail rekam medis.");
    }
  });

  const mutation = useMutation({
    mutationFn: (formValues) => // Ubah 'form' menjadi 'formValues' agar tidak ambigu
      instance.put(`/medical-records/${recordIdentifier}`, formValues),
    onSuccess: (response) => { // response dari server jika berhasil
      console.log("Update successful, server response:", response.data);
      toast.success("Rekam Medis Berhasil Diubah", {
        position: "top-left",
      });
      // Pastikan data ada sebelum mengakses registration_id
      if (data?.registration_id) {
        navigate(`/doctor/appointments?identifier=${data.registration_id}`);
      } else {
        // Jika tidak ada registration_id, navigasi ke halaman default
        navigate('/doctor/appointments');
        console.warn("registration_id not found, navigating to default appointments page.");
      }
    },

    onError: (err) => { // Ubah 'error' menjadi 'err'
      console.error("Mutation error:", err.response || err.message || err);
      toast.error(
        err.response?.data?.message || "Gagal mengubah rekam medis. Periksa koneksi atau log server.",
        {
          position: "top-left",
        },
      );
    },
  });

  // Tampilan Error utama jika useQuery gagal
  if (error) {
    return (
      <div className="p-5 text-center">
        <Typography.Title level={2}>Oops, terjadi kesalahan!</Typography.Title>
        <Typography.Text>
          Gagal memuat data rekam medis. Pesan Error:{" "}
          <pre className="text-red-500">
            {error?.response?.data?.message || error?.message || "Unknown error"}
          </pre>
        </Typography.Text>
        <Button className="mt-4" onClick={() => navigate('/some-default-path')}>
          Kembali ke Daftar Rekam Medis
        </Button>
      </div>
    );
  }

  const onFinish = (values) => {
    console.log("Form values submitted:", values);
    // Format the date to YYYY-MM-DD
    if (values.date) {
      values.date = values.date.format("YYYY-MM-DD");
    }
    // Join symptoms array into a comma-separated string
    if (values.symptomps) {
      values.symptomps = values.symptomps.join(",");
    }
    // Stringify drug_code array for storage (assuming it's an array of objects)
    if (values.drug_code) {
      values.drug_code = JSON.stringify(values.drug_code);
    }
    // 'dosis' is already a string from the input, so no special handling needed here.

    mutation.mutate(values);
  };

  return (
    <div>
      <Typography.Title className="text-[#767676] tracking-tight" level={2}>
        EDIT REKAM MEDIS
      </Typography.Title>

      {isLoading ? (
        <Skeleton active /> // Tambahkan prop active untuk skeleton yang bergerak
      ) : (
        <>
          <div className="w-full flex gap-5">
            <Card className="w-1/2">
              <Typography.Title level={4}>Patient</Typography.Title>
              <div className="flex gap-2">
                <span className="font-medium min-w-[100px]">Name</span>
                <Typography.Text>: {data?.patient?.name || 'N/A'}</Typography.Text>
              </div>

              <div className="flex gap-2">
                <span className="font-medium min-w-[100px]">Blood Type</span>
                <Typography.Text>: {data?.patient?.blood_type || 'N/A'}</Typography.Text>
              </div>

              <div className="flex gap-2">
                <span className="font-medium min-w-[100px]">Phone</span>
                <Typography.Text>: {data?.patient?.phone || 'N/A'}</Typography.Text>
              </div>

              <div className="flex gap-2">
                <span className="font-medium min-w-[100px]">Age</span>
                <Typography.Text>
                  : {data?.patient?.birth ? dayjs().diff(data.patient.birth, "year") + " years" : 'N/A'}
                </Typography.Text>
              </div>
            </Card>

            <Card className="w-1/2">
              <Typography.Title level={4}>Doctor</Typography.Title>

              <div className="flex gap-2">
                <span className="font-medium min-w-[100px]">Name</span>
                <Typography.Text>: {data?.doctor?.name || 'N/A'}</Typography.Text>
              </div>

              <div className="flex gap-2">
                <span className="font-medium min-w-[100px]">Poli</span>
                <Typography.Text>: {data?.doctor?.poli?.name || 'N/A'}</Typography.Text>
              </div>
            </Card>
          </div>

          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            className="mt-5 w-full"
            // initialValues are now set in onSuccess to ensure data is available
          >
            <div className="w-full flex gap-4">
              <Form.Item
                className="w-1/4"
                label="Tanggal Konsultasi"
                name="date"
                rules={[{ required: true, message: "Tanggal konsultasi tidak boleh kosong" }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>

              <div className="w-3/4">
                <Form.Item
                  label="Gejala"
                  name="symptomps"
                  rules={[
                    { required: true, message: "Gejala tidak boleh kosong" },
                  ]}
                >
                  <Select
                    mode="tags"
                    className="w-full"
                    placeholder="Select Gejala"
                    options={gejalaOptions.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  label="Diagnosis"
                  name="diagnosis"
                  rules={[
                    { required: true, message: "Diagnosis tidak boleh kosong" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Kode Obat"
                  name="drug_code"
                  className="w-full"
                  help="Format: Nama Obat (Kode Obat)"
                  rules={[
                    { required: true, message: "Kode Obat tidak boleh kosong" },
                  ]}
                >
                  {/* Assuming SearchObat can handle initial values correctly */}
                  <SearchObat form={form} />
                </Form.Item>

                {/* New Form.Item for Dosis Obat */}
                <Form.Item
                  label="Dosis Obat"
                  name="dosis"
                  help="Dosis penggunaan obat"
                  rules={[
                    { required: true, message: "Dosis obat tidak boleh kosong" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Resep"
                  name="prescription"
                  rules={[
                    { required: true, message: "Resep tidak boleh kosong" },
                  ]}
                >
                  <Input.TextArea rows={10} />
                </Form.Item>
              </div>
            </div>

            <Button
              loading={mutation.isPending}
              block
              type="primary"
              htmlType="submit"
            >
              Submit
            </Button>
          </Form>
        </>
      )}
    </div>
  );
}

export default EditRekamMedis;