import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminRegisterPatient from "./pages/AdminRegisterPatient";
import AdminSchedules from "./pages/AdminSchedules";
import AvailableSchedules from "./pages/AvailableSchedules";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/register-patient" element={<AdminRegisterPatient />} />
                <Route path="/admin/schedules" element={<AdminSchedules />} />
                <Route path="/available-schedules" element={<AvailableSchedules />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

