<?php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\ResponseEvent;

class CorsListener
{
    public function onKernelResponse(ResponseEvent $event)
    {
        $response = $event->getResponse();
        $request = $event->getRequest();

        // Solo aplicar CORS a las rutas de la API
        if (strpos($request->getPathInfo(), '/api') === 0) {
            $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:5173');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
            $response->headers->set('Access-Control-Max-Age', '3600');

            // Si es una petición OPTIONS, responder inmediatamente
            if ($request->getMethod() === 'OPTIONS') {
                $response->setStatusCode(200);
                $response->setContent('');
            }
        }
    }
} 