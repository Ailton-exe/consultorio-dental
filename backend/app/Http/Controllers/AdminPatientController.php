<?php 
namespace App\Http\Controllers; 

use App\Models\User; 
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Hash; 

class AdminPatientController extends Controller {
    public function store(Request $request)
    {        
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]); 
        $patient = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);
        
        return response()->json([ 
           'message' => 'Paciente registrado correctamente', 
           'patient' => $patient 
        ], 201);
    }   
}
