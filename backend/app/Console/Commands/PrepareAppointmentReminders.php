<?php

namespace App\Console\Commands;

use App\Models\Appointment;
use App\Models\AppointmentReminder;
use Illuminate\Console\Command;

class PrepareAppointmentReminders extends Command
{
    protected $signature = 'appointments:prepare-reminders';

    protected $description =
        'Genera recordatorios para citas confirmadas de las próximas 24 horas';

    public function handle(): int
    {
        $now = now();
        $limit = $now->copy()->addHours(24);

        $appointments = Appointment::where(
            'status',
            'confirmed'
        )->whereBetween('appointment_date', [
            $now->toDateString(),
            $limit->toDateString(),
        ])->get();

        $created = 0;

        foreach ($appointments as $appointment) {
            $appointmentDate = $appointment->appointment_date
                ->format('Y-m-d');

            $remindAt = \Carbon\Carbon::parse(
                $appointmentDate . ' ' . $appointment->start_time
            );

            if ($remindAt->lt($now) || $remindAt->gt($limit)) {
                continue;
            }

            $reminder = AppointmentReminder::firstOrCreate(
                [
                    'appointment_id' => $appointment->id,
                    'remind_at' => $remindAt,
                ],
                [
                    'status' => 'pending',
                ]
            );

            if ($reminder->wasRecentlyCreated) {
                $created++;
            }
        }

        $this->info("Recordatorios creados: {$created}");

        return self::SUCCESS;
    }
}
