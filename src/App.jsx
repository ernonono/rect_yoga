import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "react-calendar/dist/Calendar.css";
import UserRoutes from "./routes/user.routes";
import AuthRoutes from "./routes/auth.routes";
import DoctorRoutes from "./routes/doctor.routes";
import AdminRoutes from "./routes/admin.routes";

function App() {
  return (
    <BrowserRouter>
      <AuthRoutes />
      <UserRoutes />
      <DoctorRoutes />
      <AdminRoutes />
    </BrowserRouter>
  );
}

export default App;
