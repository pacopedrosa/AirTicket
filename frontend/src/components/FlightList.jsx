import React from 'react';
import { useNavigate } from 'react-router-dom';

const FlightList = ({ flights }) => {
    const navigate = useNavigate();

    const handleSelectFlight = (flightId) => {
        navigate(`/payment/${flightId}`);
    };

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
                            <div className="text-lg font-bold text-amber-600">{flight.base_price}€</div>
                            <div className="text-sm text-gray-500">Asientos disponibles: {flight.seats_available}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-amber-800">{flight.destination}</div>
                            <div className="text-sm text-gray-500">{formatDate(flight.arrival_date)}</div>
                            <button
                                onClick={() => handleSelectFlight(flight.id)}
                                className="mt-2 bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition duration-300"
                            >
                                Seleccionar vuelo
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FlightList;