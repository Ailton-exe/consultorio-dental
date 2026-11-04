<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointment_reminders', function (Blueprint $table) {
            $table->id();

            $table->foreignId('appointment_id')
                ->constrained('appointments')
                ->cascadeOnDelete();

            $table->dateTime('remind_at');

            $table->dateTime('sent_at')->nullable();

            $table->string('status')->default('pending');

            $table->timestamps();

            $table->unique(
                ['appointment_id', 'remind_at'],
                'appointment_reminders_unique'
            );

            $table->index(['status', 'remind_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointment_reminders');
    }
};
