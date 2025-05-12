import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-amber-300 text-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">AirTicket 🛩️</span>
            </Link>
            <button
              onClick={toggleMenu}
              className="ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:bg-amber-400 focus:outline-none md:hidden"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link 
              to="/flights" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-amber-400 transition duration-150"
            >
              Vuelos
            </Link>
            {user && (
              <>
                <Link 
                  to="/my-flights" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-amber-400 transition duration-150"
                >
                  Mis Vuelos
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="px-3 py-2 rounded-md text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 transition duration-150"
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
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

        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/flights" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-400 transition duration-150"
              onClick={() => setIsMenuOpen(false)}
            >
              Vuelos
            </Link>
            {user && (
              <>
                <Link 
                  to="/my-flights" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-400 transition duration-150"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mis Vuelos
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="block px-3 py-2 rounded-md text-base font-medium bg-amber-500 text-white hover:bg-amber-600 transition duration-150"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            )}
            {user ? (
              <>
                <div className="px-3 py-2 text-sm text-gray-700">
                  Hola, {user.fullName || user.email}
                </div>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-amber-400 hover:bg-amber-500 transition duration-150 ease-in-out text-gray-800"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-400 transition duration-150 ease-in-out"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-amber-400 hover:bg-amber-500 transition duration-150 ease-in-out text-gray-800"
                  onClick={() => setIsMenuOpen(false)}
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