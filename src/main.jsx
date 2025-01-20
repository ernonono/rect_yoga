import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ConfigProvider } from "antd";

const queryClient = new QueryClient();

const themeConfig = {
  token: {
    colorPrimary: "#63a375",
    colorInfo: "#63a375",
  },
};

document.title = "Fasyankes";

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <ConfigProvider theme={themeConfig}>
      <App />
    </ConfigProvider>
    <ToastContainer />
  </QueryClientProvider>,
);
