
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
        // Eliminar el índice único anterior si existe.
        DB::statement("
            DROP INDEX IF EXISTS
            appointments_appointment_date_start_time_unique
            ON appointments
        ");

        // Eliminar la columna generada si quedó de un intento anterior
        // que falló antes de completar la migración.
        DB::statement("
            ALTER TABLE appointments
            DROP COLUMN IF EXISTS active_slot_date
        ");

        // Las citas canceladas tendrán NULL en active_slot_date.
        // Las demás conservarán su fecha y estarán sujetas al índice único.
        DB::statement("
            ALTER TABLE appointments
            ADD COLUMN active_slot_date DATE
            GENERATED ALWAYS AS (
                CASE
                    WHEN status != 'cancelled'
                    THEN appointment_date
                    ELSE NULL
                END
            ) STORED
        ");

        // Impedir que dos citas no canceladas ocupen el mismo horario.
        DB::statement("
            CREATE UNIQUE INDEX appointments_active_slot_unique
            ON appointments (active_slot_date, start_time)
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar el índice nuevo.
        DB::statement("
            DROP INDEX IF EXISTS
            appointments_active_slot_unique
            ON appointments
        ");

        // Eliminar la columna generada.
        DB::statement("
            ALTER TABLE appointments
            DROP COLUMN IF EXISTS active_slot_date
        ");

        // Restaurar el índice único original.
        DB::statement("
            CREATE UNIQUE INDEX
            appointments_appointment_date_start_time_unique
            ON appointments (appointment_date, start_time)
        ");
    }
};
