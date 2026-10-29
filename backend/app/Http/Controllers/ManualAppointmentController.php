<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ManualAppointmentController extends Controller
{
    public function store(Request $request)
    {
        /*abort_unless(
        //    $request->user()
                && $request->user()->role === 'admin',
            403,
            'Solo el administrador puede registrar citas manuales.'
        );*/

        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
        ]);

        $patient = User::where(
            'email',
            $validated['email']
        )->firstOrFail();

        $appointment = DB::transaction(function () use (
            $validated,
            $patient
        ) {
            $dayNames = [
                1 => 'lunes',
                2 => 'martes',
                3 => 'miércoles',
                4 => 'jueves',
                5 => 'viernes',
                6 => 'sábado',
                7 => 'domingo',
            ];

            $day = $dayNames[
                \Carbon\Carbon::parse($validated['date'])->dayOfWeekIso
            ];

            $schedule = Schedule::where('day', $day)
                ->where('start_time', '<=', $validated['start_time'])
                ->where('end_time', '>', $validated['start_time'])
                ->lockForUpdate()
                ->first();

            if (!$schedule) {
                throw ValidationException::withMessages([
                    'start_time' =>
                        'El horario seleccionado no está disponible.',
                ]);
            }

            $occupied = Appointment::whereDate(
                'appointment_date',
                $validated['date']
            )->where(
                'start_time',
                $validated['start_time']
            )->whereIn('status', [
                'pending',
                'confirmed',
            ])->exists();

            if ($occupied) {
                throw ValidationException::withMessages([
                    'start_time' =>
                        'El horario ya está ocupado.',
                ]);
            }

            $endTime = \Carbon\Carbon::createFromFormat(
                'H:i',
                $validated['start_time']
            )->addMinutes(60)->format('H:i:s');

            return Appointment::create([
                'user_id' => $patient->id,
                'appointment_date' => $validated['date'],
                'start_time' => $validated['start_time'],
                'end_time' => $endTime,
                'status' => 'confirmed',
            ]);
        });

        $appointment->load('user');

        return response()->json([
            'message' => 'Cita registrada correctamente.',
            'appointment' => $appointment,
        ], 201);
    }
}
