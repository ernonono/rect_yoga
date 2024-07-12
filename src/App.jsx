import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "react-calendar/dist/Calendar.css";
import UserRoutes from "./routes/user.routes";
import AuthRoutes from "./routes/auth.routes";
import DoctorRoutes from "./routes/doctor.routes";

function App() {
  return (
    <BrowserRouter>
      <AuthRoutes />
      <UserRoutes />
      <DoctorRoutes />
    </BrowserRouter>
  );
}

export default App;
