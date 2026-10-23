<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class AppointmentManagementController extends Controller
{
    /**
     * GET /api/my-appointments
     * Mostrar las citas del paciente que inició sesión.
     */
    public function mine(Request $request)
    {
        return response()->json([
        'usuario_autenticado' => $request->user(),
        'id_usuario' => $request->user()->id,
        'citas' => Appointment::all()
        ]);
        $appointments = Appointment::where(
            'user_id',
            $request->user()->id
        )
            ->orderBy('appointment_date')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'appointments' => $appointments
        ]);
    }

    /**
     * PATCH /api/my-appointments/{appointment}/cancel
     * Cancelar una cita propia que todavía no ha ocurrido.
     */
    public function cancelMine(
        Request $request,
        Appointment $appointment
    ) {
        // Verificar que la cita pertenezca al usuario autenticado.
        if ($appointment->user_id !== $request->user()->id) {
            abort(403, 'No puedes cancelar una cita que no te pertenece.');
        }

        // No permitir cancelar citas que ya fueron canceladas.
        if ($appointment->status === 'cancelled') {
            return response()->json([
                'message' => 'Esta cita ya está cancelada.'
            ], 422);
        }

        // Verificar que la fecha y hora de la cita sean futuras.
        $appointmentDateTime = Carbon::parse(
            $appointment->appointment_date->format('Y-m-d')
            . ' '
            . $appointment->start_time
        );

        if (!$appointmentDateTime->isFuture()) {
            return response()->json([
                'message' => 'No puedes cancelar una cita que ya comenzó o pasó.'
            ], 422);
        }

        $appointment->update([
            'status' => 'cancelled'
        ]);

        return response()->json([
            'message' => 'La cita se canceló correctamente.',
            'appointment' => $appointment->fresh()
        ]);
    }

    /**
     * GET /api/admin/appointments
     * Mostrar todas las citas al administrador.
     */
    public function indexAdmin(Request $request)
    {
        $this->requireAdmin($request);

        $appointments = Appointment::with('user')
            ->orderBy('appointment_date')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'appointments' => $appointments
        ]);
    }

    /**
     * PATCH /api/admin/appointments/{appointment}/status
     * Actualizar el estado de una cita.
     */
    public function updateStatus(
        Request $request,
        Appointment $appointment
    ) {
        $this->requireAdmin($request);

        $validated = $request->validate([
            'status' => [
                'required',
                'string',
                Rule::in([
                    'pending',
                    'confirmed',
                    'cancelled',
                    'completed'
                ])
            ]
        ]);

        $appointment->update([
            'status' => $validated['status']
        ]);

        return response()->json([
            'message' => 'El estado de la cita se actualizó correctamente.',
            'appointment' => $appointment->fresh()->load('user')
        ]);
    }

    /**
     * Verificar que el usuario tenga el rol de administrador.
     */
    private function requireAdmin(Request $request)
    {
        if (!$request->user() || $request->user()->role !== 'admin') {
            abort(403, 'No tienes permisos para administrar las citas.');
        }
    }
}
