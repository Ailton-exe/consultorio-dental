
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminPatientController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AppointmentManagementController;
use App\Http\Controllers\AppointmentReminderController;
use App\Http\Controllers\ManualAppointmentController;
use App\Http\Controllers\HealthController;

// Ruta de comprobación
Route::get('/health', [HealthController::class, 'index']);

// Registro e inicio de sesión
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas para usuarios autenticados
Route::middleware('auth:sanctum')->group(function () {

    // Obtener información del usuario autenticado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Horarios
    Route::get('/schedules', [ScheduleController::class, 'index']);

    // Citas del paciente
    Route::get('/available-slots', [AppointmentController::class, 'availableSlots']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/my-appointments', [AppointmentManagementController::class, 'mine']);
    Route::patch('/my-appointments/{appointment}/cancel', [AppointmentManagementController::class, 'cancelMine']);

    // Recordatorios del paciente
    Route::get('/my-reminders', [AppointmentReminderController::class, 'mine']);

    // Cerrar sesión
    Route::post('/logout', [AuthController::class, 'logout']);

});

// Rutas exclusivas para administradores
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

    // Gestión de pacientes
    Route::post('/patients', [AdminPatientController::class, 'store']);

    // Gestión de horarios
    Route::post('/schedules', [ScheduleController::class, 'store']);
    Route::put('/schedules/{schedule}', [ScheduleController::class, 'update']);

    // Gestión de citas
    Route::get('/appointments', [AppointmentManagementController::class, 'indexAdmin']);
    Route::patch('/appointments/{appointment}/status', [AppointmentManagementController::class, 'updateStatus']);
    Route::post('/appointments/manual', [ManualAppointmentController::class, 'store']);
});
