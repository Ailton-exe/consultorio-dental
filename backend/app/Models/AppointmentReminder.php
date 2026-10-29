<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppointmentReminder extends Model
{
    protected $fillable = [
        'appointment_id',
        'remind_at',
        'sent_at',
        'status',
    ];

    protected $casts = [
        'remind_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }
}
