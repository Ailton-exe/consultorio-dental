<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Eliminar el índice único anterior.
        DB::statement(
            'DROP INDEX IF EXISTS appointments_appointment_date_start_time_unique'
        );

        // Permitir repetir un horario únicamente si
        // la cita anterior está cancelada.
        DB::statement("
            CREATE UNIQUE INDEX appointments_active_slot_unique
            ON appointments (appointment_date, start_time)
            WHERE status != 'cancelled'
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar el índice nuevo.
        DB::statement(
            'DROP INDEX IF EXISTS appointments_active_slot_unique'
        );

        // Restaurar la restricción original.
        DB::statement("
            CREATE UNIQUE INDEX appointments_appointment_date_start_time_unique
            ON appointments (appointment_date, start_time)
        ");
    }
};
