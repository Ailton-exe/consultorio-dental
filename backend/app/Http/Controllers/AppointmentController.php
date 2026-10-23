<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AppointmentController extends Controller
{
    /**
     * Duracion de cada cita en minutos.
     */
    private const APPOINTMENT_DURATION = 60;

    /**
     * Obtiene los horarios disponibles para una fecha.
     */
    private function getSlots(string $date): array
    {
        $days = [
            0 => 'domingo',
            1 => 'lunes',
            2 => 'martes',
            3 => 'miércoles',
            4 => 'jueves',
            5 => 'viernes',
            6 => 'sábado',
        ];

        $appointmentDate = Carbon::parse($date)->startOfDay();

        // No mostrar horarios de fechas anteriores.
        if ($appointmentDate->lt(Carbon::today())) {
            return [];
        }

        $dayName = $days[$appointmentDate->dayOfWeek];

        $schedules = Schedule::where('day', $dayName)->get();

        $slots = [];

        foreach ($schedules as $schedule) {
            $start = Carbon::parse(
                $date . ' ' . $schedule->start_time
            );

            $scheduleEnd = Carbon::parse(
                $date . ' ' . $schedule->end_time
            );

            // Avanzar en intervalos de una hora.
            while (
                $start->copy()
                    ->addMinutes(self::APPOINTMENT_DURATION)
                    ->lte($scheduleEnd)
            ) {
                $end = $start->copy()
                    ->addMinutes(self::APPOINTMENT_DURATION);

                // Excluir los horarios que ya comenzaron.
                if ($start->gt(now())) {
                    /*
                     * Una cita ocupa todo el intervalo.
                     * No basta con comparar solamente la hora inicial.
                     */
                    $occupied = Appointment::where(
                        'appointment_date',
                        $date
                    )
                        ->where('start_time', '<', $end->format('H:i:s'))
                        ->where('end_time', '>', $start->format('H:i:s'))
                        ->where('status', '!=', 'cancelled')
                        ->exists();

                    if (!$occupied) {
                        $slots[] = [
                            'start_time' => $start->format('H:i:s'),
                            'end_time' => $end->format('H:i:s'),
                        ];
                    }
                }

                $start->addMinutes(self::APPOINTMENT_DURATION);
            }
        }

        return $slots;
    }

    /**
     * GET /api/available-slots?date=YYYY-MM-DD
     */
    public function availableSlots(Request $request)
    {
        $validated = $request->validate([
            'date' => ['required', 'date_format:Y-m-d'],
        ]);

        $date = $validated['date'];

        return response()->json([
            'date' => $date,
            'slots' => $this->getSlots($date),
        ]);
    }

    /**
     * POST /api/appointments
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => [
                'required',
                'date_format:Y-m-d',
                'after_or_equal:today',
            ],
            'start_time' => [
                'required',
                'date_format:H:i',
            ],
        ]);

        $date = $validated['date'];
        $startTime = $validated['start_time'];

        $start = Carbon::createFromFormat(
            '!Y-m-d H:i',
            $date . ' ' . $startTime
        );

        $end = $start->copy()
            ->addMinutes(self::APPOINTMENT_DURATION);

        // Confirmar que el horario pertenezca a los disponibles.
        $availableSlots = $this->getSlots($date);

        $slotIsAvailable = collect($availableSlots)->contains(
            function (array $slot) use ($startTime) {
                return $slot['start_time'] === $startTime . ':00';
            }
        );

        if (!$slotIsAvailable) {
            return response()->json([
                'message' => 'El horario seleccionado no está disponible.',
            ], 409);
        }

        try {
            $appointment = DB::transaction(function () use (
                $request,
                $date,
                $start,
                $end
            ) {
                /*
                 * Revalidar dentro de la transaccion antes de insertar.
                 */
                $occupied = Appointment::where(
                    'appointment_date',
                    $date
                )
                    ->where('start_time', '<', $end->format('H:i:s'))
                    ->where('end_time', '>', $start->format('H:i:s'))
                    ->exists();

                if ($occupied) {
                    abort(409, 'El horario acaba de ser reservado.');
                }

                return Appointment::create([
                    'user_id' => $request->user()->id,
                    'appointment_date' => $date,
                    'start_time' => $start->format('H:i:s'),
                    'end_time' => $end->format('H:i:s'),
                    'status' => 'confirmed',
                ]);
            });

            return response()->json([
                'message' => 'La cita se reservó correctamente.',
                'appointment' => $appointment,
            ], 201);

        } catch (QueryException $e) {
            /*
             * La restriccion UNIQUE de MySQL protege contra
             * dos solicitudes que intenten guardar la misma cita.
             */
            if (
                in_array($e->errorInfo[1] ?? null, [1062, 19], true)
            ) {
                return response()->json([
                    'message' => 'El horario ya fue reservado.',
                ], 409);
            }

            throw $e;
        }
    }
}