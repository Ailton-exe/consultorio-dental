<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminPatientController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AppointmentManagementController;
use App\Http\Controllers\AppointmentReminderController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/patients', [AdminPatientController::class, 'store']);

Route::get('/schedules', [ScheduleController::class, 'index'])
    ->middleware('auth:sanctum');

Route::post('/admin/schedules', [ScheduleController::class, 'store'])
    ->middleware('auth:sanctum'); 
    
Route::put('/admin/schedules/{schedule}', [ScheduleController::class, 'update'])
    ->middleware('auth:sanctum');

// Rutas para las citas
Route::middleware('auth:sanctum')->group(function () {
    Route::get(
        '/available-slots',
        [AppointmentController::class, 'availableSlots']
    );

    Route::post(
        '/appointments',
        [AppointmentController::class, 'store']
    );

    Route::get(
        '/my-appointments', 
        [AppointmentManagementController::class, 'mine',]
    );
    
    Route::patch(
        '/my-appointments/{appointment}/cancel', 
        [AppointmentManagementController::class, 'cancelMine',]
    );
    
    Route::get(
        '/admin/appointments',
        [AppointmentManagementController::class, 'indexAdmin',]
    );
    
    Route::patch(
        '/admin/appointments/{appointment}/status',
        [AppointmentManagementController::class, 'updateStatus',]
    );

    Route::post(
        '/admin/appointments/manual', 
        [ManualAppointmentController::class,'store',]
    );

    Route::get(
        '/my-reminders', 
        [AppointmentReminderController::class,'mine',]
    );
});