<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class AppointmentManagementController extends Controller
{
    private function requireAdmin(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'No tienes permisos para administrar las citas.');
        }
    }
}
