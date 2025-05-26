import React, { useState, useEffect } from 'react';
import { FaPlane, FaUsers, FaEuroSign, FaChartLine } from 'react-icons/fa';
import StatsCard from './StatsCard';
import Cookies from 'js-cookie';

const Statistics = () => {
    const [stats, setStats] = useState({
        monthlyRevenue: 0,
        totalUsers: 0,
        activeFlights: 0,
        totalReservations: 0,
        revenueChange: 0,
        usersChange: 0,
        flightsChange: 0,
        reservationsChange: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                setError(null);

                const token = Cookies.get('jwt_token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(`/api/admin/statistics`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || 'Failed to fetch statistics');
                }

                const data = await response.json();

                // Calcular porcentajes de cambio
                const calculateChange = (current, previous) => {
                    if (previous === 0) return 0; // Evitar división por cero
                    return ((current - previous) / previous * 100).toFixed(1);
                };

                setStats({
                    monthlyRevenue: data.current.monthlyRevenue,
                    totalUsers: data.current.totalUsers,
                    activeFlights: data.current.activeFlights,
                    totalReservations: data.current.totalReservations,
                    revenueChange: calculateChange(data.current.monthlyRevenue, data.previous.monthlyRevenue),
                    usersChange: calculateChange(data.current.totalUsers, data.previous.totalUsers),
                    flightsChange: calculateChange(data.current.activeFlights, data.previous.activeFlights),
                    reservationsChange: calculateChange(data.current.totalReservations, data.previous.totalReservations)
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Estadísticas</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                    <p className="mt-4 text-amber-700">Cargando estadísticas...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard 
                        title="Ingresos Mensuales" 
                        value={formatCurrency(stats.monthlyRevenue)} 
                        icon={FaEuroSign} 
                        change={`${stats.revenueChange > 0 ? '+' : ''}${stats.revenueChange}%`} 
                        color="bg-green-500"
                    />
                    <StatsCard 
                        title="Usuarios Activos" 
                        value={stats.totalUsers.toString()} 
                        icon={FaUsers} 
                        change={`${stats.usersChange > 0 ? '+' : ''}${stats.usersChange}%`} 
                        color="bg-blue-500"
                    />
                    <StatsCard 
                        title="Vuelos Activos" 
                        value={stats.activeFlights.toString()} 
                        icon={FaPlane} 
                        change={`${stats.flightsChange > 0 ? '+' : ''}${stats.flightsChange}%`} 
                        color="bg-purple-500"
                    />
                    <StatsCard 
                        title="Reservas Totales" 
                        value={stats.totalReservations.toString()} 
                        icon={FaChartLine} 
                        change={`${stats.reservationsChange > 0 ? '+' : ''}${stats.reservationsChange}%`} 
                        color="bg-amber-500"
                    />
                </div>
            )}
        </div>
    );
};

export default Statistics;