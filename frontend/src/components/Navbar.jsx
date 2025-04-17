import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-amber-300 text-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">AirTicket 🛩️</span>
            </Link>
            <Link 
              to="/flights" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-amber-400 transition duration-150"
            >
              Vuelos
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm">Hola, {user.fullName || user.email}</span>
                <button 
                  onClick={handleLogout}
                  className="py-2 px-4 bg-amber-400 hover:bg-amber-500 rounded-md transition duration-150 ease-in-out text-gray-800"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="py-2 px-4 hover:bg-amber-400 rounded-md transition duration-150 ease-in-out"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="py-2 px-4 bg-amber-400 hover:bg-amber-500 rounded-md transition duration-150 ease-in-out text-gray-800"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 