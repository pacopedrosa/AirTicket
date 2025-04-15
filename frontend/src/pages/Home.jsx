import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto border border-amber-200">
        <h1 className="text-3xl font-bold text-amber-800 mb-4">
          Bienvenido a la aplicación
        </h1>
        
        {user ? (
          <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
            <p className="text-lg text-amber-800">
              ¡Hola, <span className="font-semibold">{user.email}</span>! Has iniciado sesión correctamente.
            </p>
            <p className="mt-2 text-amber-700">
              Esta es una página protegida que solo pueden ver los usuarios autenticados.
            </p>
          </div>
        ) : (
          <p className="text-amber-700">
            Por favor, inicia sesión para acceder a todas las funcionalidades.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;