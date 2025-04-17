import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FlightSearch = () => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/flights?origin=${origin}&destination=${destination}&date=${departureDate}&passengers=${passengers}`);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-amber-800 mb-6">Busca tu vuelo</h2>
            <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-amber-700 mb-1">Origen</label>
                        <input
                            type="text"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            className="w-full px-3 py-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Ciudad de origen"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-amber-700 mb-1">Destino</label>
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="w-full px-3 py-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Ciudad de destino"
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-amber-700 mb-1">Fecha de salida</label>
                        <input
                            type="date"
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                            className="w-full px-3 py-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-amber-700 mb-1">Pasajeros</label>
                        <select
                            value={passengers}
                            onChange={(e) => setPassengers(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                <option key={num} value={num}>{num} {num === 1 ? 'pasajero' : 'pasajeros'}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-amber-500 text-white py-3 px-6 rounded-md hover:bg-amber-600 transition duration-300 font-semibold"
                    >
                        Buscar vuelos
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FlightSearch; 