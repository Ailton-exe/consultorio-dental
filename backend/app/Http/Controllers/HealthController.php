<?php 

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller 
{    
    public function index()    
    {        
        try {
            DB::connection()->getPdo();
            
            return response()->json([ 
                'status' => 'ok',
                'message' => 'La API está funcionando correctamente.',
                'database' => 'connected',
            ]);
        } catch (\Throwable $exception) {
            return response()->json([
                'status' => 'error',
                'message' => 'La conexión con la base de datos no está disponible.',
                'database' => 'disconnected',
            ], 503);
        }
    } 
}