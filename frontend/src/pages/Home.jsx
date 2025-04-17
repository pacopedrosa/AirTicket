import React from 'react';
import FlightSearch from '../components/FlightSearch';
import FlightList from '../components/FlightList';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const Home = () => {
    const [searchParams] = useSearchParams();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
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
                    console.log('Token:', token); // Add this for debugging
                    console.log('Search params:', { origin, destination, date }); // Add this for debugging
                    
                    const response = await fetch(
                        `http://127.0.0.1:8000/api/flights/search?origin=${origin}&destination=${destination}&date=${date}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            }
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Error al cargar los vuelos');
                    }
                    
                    const data = await response.json();
                    setFlights(data);
                }
            } catch (error) {
                console.error('Error details:', error); // Add this for debugging
                setError('Error al cargar los vuelos. Por favor, inténtalo de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-amber-50">
            {/* Hero Section */}
            <div className="bg-amber-50 py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center text-amber-300 mb-6">
                        Encuentra tu próximo destino
                    </h1>
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <FlightSearch />
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {error}
                    </div>
                ) : flights.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200">
                        <h2 className="text-2xl font-semibold text-amber-800 mb-6">
                            Vuelos disponibles
                        </h2>
                        <FlightList flights={flights} />
                    </div>
                ) : searchParams.toString() ? (
                    <div className="text-center py-8 text-amber-700">
                        No se encontraron vuelos para los criterios seleccionados.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200">
                            <h3 className="text-xl font-semibold text-amber-800 mb-4">
                                Destinos Populares
                            </h3>
                            <ul className="space-y-3 text-amber-700">
                                <li className="flex items-center">
                                    <span className="mr-2">✈️</span>
                                    Madrid - Barcelona
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">✈️</span>
                                    Valencia - Málaga
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">✈️</span>
                                    Sevilla - Bilbao
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200">
                            <h3 className="text-xl font-semibold text-amber-800 mb-4">
                                Ofertas Especiales
                            </h3>
                            <ul className="space-y-3 text-amber-700">
                                <li className="flex items-center">
                                    <span className="mr-2">🎉</span>
                                    Vuelos desde 29.99€
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">🎁</span>
                                    2x1 en equipaje
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">👥</span>
                                    Descuentos para grupos
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200">
                            <h3 className="text-xl font-semibold text-amber-800 mb-4">
                                Ventajas
                            </h3>
                            <ul className="space-y-3 text-amber-700">
                                <li className="flex items-center">
                                    <span className="mr-2">✅</span>
                                    Cancelación gratuita
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">💰</span>
                                    Mejor precio garantizado
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">🕒</span>
                                    Atención 24/7
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;