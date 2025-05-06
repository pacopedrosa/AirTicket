import React from 'react';
import FlightSearch from '../components/FlightSearch';
import DashboardStats from '../components/DashboardStats';
import FlightList from '../components/FlightList';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

const Home = () => {
    const [searchParams] = useSearchParams();

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
        <div className="min-h-screen bg-amber-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold text-amber-800 text-center mb-8">
                        Encuentra tu próximo destino
                    </h1>
                    
                    <FlightSearch />
                    
                    <div className="mt-12">
                        <DashboardStats />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;