import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminRegisterPatient from "./pages/AdminRegisterPatient";
import AdminSchedules from "./pages/AdminSchedules";
import AdminAppointments from "./pages/AdminAppointments";
import AdminBookAppointment from "./pages/AdminBookAppointment";
import AvailableSchedules from "./pages/AvailableSchedules";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Rutas públicas */}
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Rutas exclusivas del administrador */}
                <Route path="/admin/register-patient" element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminRegisterPatient />
                    </ProtectedRoute>
                    }
                />

                <Route path="/admin/schedules" element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminSchedules />
                    </ProtectedRoute>
                }
                />

                <Route path="/admin/appointments" element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminAppointments />
                    </ProtectedRoute>
                }
                />

                <Route path="/admin/book-appointment" element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminBookAppointment />
                    </ProtectedRoute>
                }
                />

                {/* Rutas del paciente */}
                <Route path="/available-schedules" element={
                    <ProtectedRoute allowedRoles={["patient"]}>
                        <AvailableSchedules />
                    </ProtectedRoute>
                }
                />

                <Route path="/book-appointment" element={
                    <ProtectedRoute allowedRoles={["patient"]}>
                        <BookAppointment />
                    </ProtectedRoute>
                }
                />

                <Route path="/my-appointments" element={
                    <ProtectedRoute allowedRoles={["patient"]}>
                        <MyAppointments />
                    </ProtectedRoute>
                }
                />

                {/* Página no encontrada */}
                <Route path="*" element={<NotFound />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
