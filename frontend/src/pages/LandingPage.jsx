import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlane, FaSearch, FaUser, FaShieldAlt } from 'react-icons/fa';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-amber-800 mb-6">
                            Viaja con AirTicket 🛩️
                        </h1>
                        <p className="text-xl md:text-2xl text-amber-600 mb-8">
                            Tu próximo destino está a un clic de distancia
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                to="/register"
                                className="px-8 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition duration-300 text-lg font-semibold"
                            >
                                Registrarse
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-3 bg-white text-amber-600 border-2 border-amber-500 rounded-lg hover:bg-amber-50 transition duration-300 text-lg font-semibold"
                            >
                                Iniciar Sesión
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="flex justify-center mb-4">
                                <FaSearch className="w-12 h-12 text-amber-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-amber-800 mb-2">
                                Búsqueda Fácil
                            </h3>
                            <p className="text-gray-600">
                                Encuentra los mejores vuelos con nuestra búsqueda intuitiva
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="flex justify-center mb-4">
                                <FaUser className="w-12 h-12 text-amber-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-amber-800 mb-2">
                                Gestión Personal
                            </h3>
                            <p className="text-gray-600">
                                Administra tus reservas y vuelos desde tu perfil
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="flex justify-center mb-4">
                                <FaShieldAlt className="w-12 h-12 text-amber-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-amber-800 mb-2">
                                Pago Seguro
                            </h3>
                            <p className="text-gray-600">
                                Transacciones seguras con Stripe
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-amber-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-amber-800 mb-4">
                        ¿Listo para tu próxima aventura?
                    </h2>
                    <p className="text-xl text-amber-600 mb-8">
                        Únete a nosotros y comienza a explorar el mundo
                    </p>
                    <Link
                        to="/register"
                        className="inline-block px-8 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition duration-300 text-lg font-semibold"
                    >
                        Crear Cuenta Gratis
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-amber-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">AirTicket</h3>
                            <p className="text-amber-100">
                                Tu compañero de viaje perfecto
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/flights" className="text-amber-100 hover:text-white">
                                        Buscar Vuelos
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/login" className="text-amber-100 hover:text-white">
                                        Iniciar Sesión
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/register" className="text-amber-100 hover:text-white">
                                        Registrarse
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">Contacto</h3>
                            <p className="text-amber-100">
                                ¿Necesitas ayuda? Contáctanos
                            </p>
                            <p className="text-amber-100">
                                Email: soporte@airticket.com
                            </p>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-amber-700 text-center">
                        <p className="text-amber-100">
                            © 2024 AirTicket. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage; 