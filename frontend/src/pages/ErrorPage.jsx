import React from 'react';
import { Link, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="flex items-center justify-center min-h-screen bg-amber-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full border border-amber-200">
        <h1 className="text-3xl font-bold text-amber-600 mb-4">¡Oops!</h1>
        <p className="text-amber-800 mb-4">
          Lo sentimos, ha ocurrido un error inesperado.
        </p>
        <p className="text-sm text-amber-500 mb-6">
          {error?.statusText || error?.message || 'La página que buscas no existe.'}
        </p>
        <Link 
          to="/" 
          className="block text-center py-2 px-4 bg-amber-400 text-gray-800 rounded-md hover:bg-amber-500 transition"
        >
          Volver a la página de inicio
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;