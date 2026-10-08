<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminPatientController;
use App\Http\Controllers\ScheduleController;

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
