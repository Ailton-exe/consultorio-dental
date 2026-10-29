<?php

namespace App\Http\Controllers;

use App\Models\AppointmentReminder;
use Illuminate\Http\Request;

class AppointmentReminderController extends Controller
{
    public function mine(Request $request)
    {
        $reminders = AppointmentReminder::where(
            'status',
            'pending'
        )->whereHas('appointment', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id)
                ->where('status', 'confirmed');
        })->with('appointment')
          ->orderBy('remind_at')
          ->get();

        return response()->json([
            'reminders' => $reminders,
        ]);
    }
}
