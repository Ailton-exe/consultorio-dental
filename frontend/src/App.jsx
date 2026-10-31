import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminRegisterPatient from "./pages/AdminRegisterPatient";
import AdminSchedules from "./pages/AdminSchedules";
import AvailableSchedules from "./pages/AvailableSchedules";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import AdminAppointments from "./pages/AdminAppointments";
import AdminBookAppointment from "./pages/AdminBookAppointment";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/register-patient" element={<AdminRegisterPatient />} />
                <Route path="/admin/schedules" element={<AdminSchedules />} />
                <Route path="/available-schedules" element={<AvailableSchedules />} />
                <Route path="/book-appointment" element={<BookAppointment />} />
                <Route path="/my-appointments" element={<MyAppointments />} />
                <Route path="/admin/appointments" element={<AdminAppointments />} />
                <Route path="/admin/book-appointment" element={<AdminBookAppointment />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
