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
  const { data, isLoading, error } = useQuery({
    queryKey: ["get-detail-rm", params.get("identifier")],
    queryFn: async () => {
      const { data } = await instance.get(
        `/medical-records/${params.get("identifier")}`,
      );
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: (form) =>
      instance.put(`/medical-records/${params.get("identifier")}`, form),
    onSuccess: () => {
      toast.success("Rekam Medis Berhasil Diubah");
      navigate(`/doctor/appointments?identifier=${data.registration_id}`);
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
    values.symptomps = values.symptomps.join(",");

    mutation.mutate(values);
  };

  return (
    <div>
      <Typography.Title className="text-[#767676] tracking-tight" level={2}>
        EDIT REKAM MEDIS
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
            initialValues={{
              date: dayjs(data.date),
              symptomps: data.symptomps.split(","),
              diagnosis: data.diagnosis,
              prescription: data.prescription,
            }}
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
