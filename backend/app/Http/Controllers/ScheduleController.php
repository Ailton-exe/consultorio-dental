<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Schedule;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([ 'date' => 'required|date',]);
        $date = $request->date;
        $days = [
            0 => 'domingo',
            1 => 'lunes',
            2 => 'martes',
            3 => 'miércoles',
            4 => 'jueves',
            5 => 'viernes',
            6 => 'sábado',
        ];

        $day = $days[date('w', strtotime($date))];
        
        $schedules = Schedule::where('day', $day)
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'date' => $date,
            'day' => $day,
            'schedules' => $schedules,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'day' => 'required|string',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);
        
        $schedule = Schedule::create($validated);
        
        return response()->json([
            'message' => 'Horario guardado correctamente',
            'schedule' => $schedule,
        ], 201);    
    }
    
    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'day' => 'required|string',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);        
        
        $schedule->update($validated);
        
        return response()->json([
            'message' => 'Horario actualizado correctamente',
            'schedule' => $schedule,
        ]);
    }
}
