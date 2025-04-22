import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const MyFlights = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyFlights = async () => {
            try {
                const token = Cookies.get('jwt_token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch('http://localhost:8000/api/user/flights', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/login');
                        return;
                    }
                    throw new Error('Error al cargar los vuelos');
                }

                const data = await response.json();
                setFlights(data);
            } catch (error) {
                console.error('Error:', error);
                setError('Error al cargar tus vuelos. Por favor, inténtalo de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyFlights();
    }, [navigate]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-amber-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-amber-800 text-center mb-8">
                        Mis Vuelos
                    </h1>
                    
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                            <p className="mt-4 text-amber-700">Cargando tus vuelos...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-8">
                            {error}
                        </div>
                    ) : flights.length > 0 ? (
                        <div className="space-y-4">
                            {flights.map((flight) => (
                                <div key={flight.id} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-amber-800">{flight.origin}</div>
                                            <div className="text-sm text-gray-500">{formatDate(flight.departure_date)}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm text-gray-500">Vuelo: {flight.flight_number}</div>
                                            <div className="w-full h-px bg-amber-300 my-2"></div>
                                            <div className="text-sm text-gray-500">Estado: Confirmado</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-amber-800">{flight.destination}</div>
                                            <div className="text-sm text-gray-500">{formatDate(flight.arrival_date)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-amber-700">
                            No tienes vuelos reservados.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyFlights;