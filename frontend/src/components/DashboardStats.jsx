import React, { useState, useEffect } from 'react';
import { FaPlane, FaMapMarkerAlt, FaTicketAlt, FaClock, FaLeaf } from 'react-icons/fa';
import Cookies from 'js-cookie';

const DashboardStats = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = Cookies.get('jwt_token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch('/api/statistics', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setStats(data);
                setError(null);
            } catch (error) {
                console.error('Statistics error:', error);
                setError('Error al cargar las estadísticas');
                setStats(null);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-600 text-center p-4">
                {error}
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-gray-600 text-center p-4">
                No hay estadísticas disponibles
            </div>
        );
    }

    const StatCard = ({ icon: Icon, title, value, description }) => (
        <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center space-x-4">
                <div className="bg-amber-100 p-3 rounded-full">
                    <Icon className="text-amber-600 text-xl" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-amber-800">{title}</h3>
                    <p className="text-2xl font-bold text-amber-600">{value}</p>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="py-8">
            <h2 className="text-2xl font-bold text-amber-800 text-center mb-8">
                Estadísticas de Vuelos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    icon={FaPlane}
                    title="Viajero Más Frecuente"
                    value={stats.topTraveler.name}
                    description={`${stats.topTraveler.total_flights} vuelos realizados`}
                />
                <StatCard
                    icon={FaMapMarkerAlt}
                    title="Destino Más Popular"
                    value={stats.popularDestination.city}
                    description={`${stats.popularDestination.total_bookings} reservas`}
                />
                <StatCard
                    icon={FaTicketAlt}
                    title="Total de Vuelos"
                    value={stats.totalFlights}
                    description="Reservas realizadas"
                />
                <StatCard
                    icon={FaLeaf}
                    title="Huella de Carbono"
                    value={`${stats.carbonOffset} kg`}
                    description="CO₂ compensado"
                />
            </div>
        </div>
    );
};

export default DashboardStats;