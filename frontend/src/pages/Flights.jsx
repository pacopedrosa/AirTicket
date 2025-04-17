import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import FlightSearch from '../components/FlightSearch';
import FlightList from '../components/FlightList';
import Cookies from 'js-cookie';

const Flights = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                setLoading(true);
                const origin = searchParams.get('origin');
                const destination = searchParams.get('destination');
                const date = searchParams.get('date');

                if (origin && destination && date) {
                    const token = Cookies.get('jwt_token');
                    if (!token) {
                        navigate('/login');
                        return;
                    }

                    const response = await fetch(
                        `http://localhost:8000/api/flights?origin=${origin}&destination=${destination}&date=${date}`,
                        {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            }
                        }
                    );

                    if (!response.ok) {
                        if (response.status === 401) {
                            navigate('/login');
                            return;
                        }
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Error al cargar los vuelos');
                    }

                    const data = await response.json();
                    setFlights(data);
                    setError(null);
                }
            } catch (error) {
                console.error('Error:', error);
                setError('Error al cargar los vuelos. Por favor, inténtalo de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-amber-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-amber-800 text-center mb-8">
                        Encuentra tu vuelo perfecto
                    </h1>
                    
                    <FlightSearch />
                    
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                            <p className="mt-4 text-amber-700">Buscando vuelos...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-8">
                            {error}
                        </div>
                    ) : flights.length > 0 ? (
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-amber-800 mb-4">
                                Vuelos disponibles
                            </h2>
                            <FlightList flights={flights} />
                        </div>
                    ) : searchParams.toString() ? (
                        <div className="text-center py-8 text-amber-700">
                            No se encontraron vuelos para los criterios seleccionados.
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Flights;