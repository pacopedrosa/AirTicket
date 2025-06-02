import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import StatsCard from './StatsCard';
import { FaUsers, FaPlane, FaTicketAlt, FaEuroSign } from 'react-icons/fa';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeFlights: 0,
        totalReservations: 0,
        monthlyRevenue: 0
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchData = async () => {
        try {
            const token = Cookies.get('jwt_token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${apiUrl}/api/admin/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            const data = await response.json();
            setStats({
                totalUsers: data.totalUsers || 0,
                activeFlights: data.activeFlights || 0,
                totalReservations: data.totalReservations || 0,
                monthlyRevenue: parseFloat(data.monthlyRevenue) || 0
            });
            setRecentBookings(data.recentBookings || []);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Carga inicial

        // Configurar polling cada 30 segundos
        const intervalId = setInterval(fetchData, 30000);

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(intervalId);
    }, []);

    if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h2>

            {/* Recent Bookings Table */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Bookings</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentBookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.flightNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {booking.origin || '-'} → {booking.destination || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {booking.status || 'UNKNOWN'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${(booking.totalPrice || 0).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;