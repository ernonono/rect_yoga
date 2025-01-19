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
import axios from "axios";
import SearchObat from "../../components/SearchObat";

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

function AddRekamMedis() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [params, _] = useSearchParams();
  const [drugOptions, setDrugOptions] = React.useState([]);
  const { data, isLoading, error } = useQuery({
    queryKey: ["get-detail-registrasi", params.get("registration_id")],
    queryFn: async () => {
      const { data } = await instance.get(
        `/registrations-doctor/${params.get("registration_id")}`,
      );
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: (form) => instance.post("/medical-records", form),
    onSuccess: () => {
      toast.success("Rekam Medis Berhasil Ditambahkan");
      navigate("/doctor/appointments");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Gagal menambahkan rekam medis",
      );
    },
  });

  if (error) {
    return (
      <div>
        <Typography.Title level={2}>Oops there is an error!</Typography.Title>
        <Typography.Text>{error?.response?.data?.message}</Typography.Text>
      </div>
    );
  }

  const onFinish = (values) => {
    values.date = values.date.format("YYYY-MM-DD");
    values.registration_id = data.id;
    values.doctor_id = data.doctor_id;
    values.patient_id = data.patient_id;
    values.symptomps = values.symptomps.join(",");
    values.drug_code = JSON.stringify(values.drug_code);

    mutation.mutate(values);
  };

  return (
    <div>
      <Typography.Title className="text-[#767676] tracking-tight" level={2}>
        ADD REKAM MEDIS
      </Typography.Title>

      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <div className="w-full flex gap-5">
            <Card className="w-1/2">
              <Typography.Title level={4}>Patient</Typography.Title>
              <div className="flex gap-2">
                <span className="font-medium min-w-[100px]">Name</span>
                <Typography.Text>: {data?.patient?.name}</Typography.Text>
              </div>

              <div className="flex gap-2">
                <span className="font-medium min-w-[100px]">Blood Type</span>
                <Typography.Text>: {data?.patient?.blood_type}</Typography.Text>
              </div>

              <div className="flex gap-2">
                <span className="font-medium min-w-[100px]">Phone</span>
                <Typography.Text>: {data?.patient?.phone}</Typography.Text>
              </div>

              <div className="flex gap-2">
                <span className="font-medium min-w-[100px]">Age</span>
                <Typography.Text>
                  : {dayjs().diff(data?.patient?.birth, "year")} years
                </Typography.Text>
              </div>
            </Card>

            <Card className="w-1/2">
              <Typography.Title level={4}>Doctor</Typography.Title>

              <div className="flex gap-2">
                <span className="font-medium min-w-[100px]">Name</span>
                <Typography.Text>: {data?.doctor?.name}</Typography.Text>
              </div>

              <div className="flex gap-2">
                <span className="font-medium min-w-[100px]">Poli</span>
                <Typography.Text>: {data?.doctor?.poli?.name}</Typography.Text>
              </div>
            </Card>
          </div>

          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            className="mt-5 w-full"
          >
            <div className="w-full flex gap-4">
              <Form.Item
                className="w-1/4"
                label="Tanggal Konsultasi"
                name="date"
                initialValue={dayjs()}
              >
                <DatePicker className="w-full" />
              </Form.Item>

              <div className="w-3/4">
                <Form.Item
                  label="Gejala"
                  help="Jika pilihan gejala tidak ada, ketik gejala baru dan tekan enter"
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
                  help="Diagnosis penyakit pasien"
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
                  <SearchObat form={form} />
                </Form.Item>

                <Form.Item
                  label="Catatan Doktor"
                  name="prescription"
                  help="Catatan dokter untuk pasien saat pengambilan obat"
                  rules={[
                    {
                      required: true,
                      message: "Catatan Doktor tidak boleh kosong",
                    },
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

export default AddRekamMedis;
