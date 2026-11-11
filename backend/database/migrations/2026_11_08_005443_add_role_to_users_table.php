<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // La columna ya la crea 2026_10_20_234802_add_role_to_users_table.
        if (Schema::hasColumn('users', 'role')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table->string('role')
                ->default('patient');
        });
    }

    public function down(): void
    {
        // No se elimina la columna: pertenece a la migración anterior.
    }
};
