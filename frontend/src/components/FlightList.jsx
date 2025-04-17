import React from 'react';
import { useNavigate } from 'react-router-dom';

const FlightList = ({ flights }) => {
    const navigate = useNavigate();

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

    const handleSelectFlight = async (flightId) => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];
            const response = await fetch(`http://localhost:8000/api/flights/${flightId}/book`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = '/login';
                    return;
                }
                throw new Error('Error al seleccionar el vuelo');
            }

            const data = await response.json();
            navigate(`/flights/${flightId}/book`, { state: { flight: data } });
        } catch (error) {
            console.error('Error:', error);
            alert('Error al seleccionar el vuelo. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div className="space-y-4">
            {flights.map((flight) => (
                <div key={flight.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-amber-800">{flight.origin}</div>
                            <div className="text-sm text-gray-500">{formatDate(flight.departure_date)}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-500">Duración: 2h 30m</div>
                            <div className="w-full h-px bg-amber-300 my-2"></div>
                            <div className="text-sm text-gray-500">Vuelo: {flight.flight_number}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-amber-800">{flight.destination}</div>
                            <div className="text-sm text-gray-500">{formatDate(flight.arrival_date)}</div>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <div className="text-lg font-semibold text-amber-700">
                            {flight.base_price}€
                        </div>
                        <div className="text-sm text-gray-500">
                            {flight.seats_available} asientos disponibles
                        </div>
                        <button
                            onClick={() => handleSelectFlight(flight.id)}
                            className="bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600 transition duration-300"
                        >
                            Seleccionar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FlightList; 