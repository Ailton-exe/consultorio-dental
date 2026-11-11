<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // Comprobar que el usuario esté autenticado
        if (!$request->user()) {
            abort(401, 'Debes iniciar sesión para continuar.');
        }

        // Comprobar que tenga el rol de administrador
        if ($request->user()->role !== 'admin') {
            abort(403, 'No tienes permisos para acceder a esta sección.');
        }

        return $next($request);
    }
}
