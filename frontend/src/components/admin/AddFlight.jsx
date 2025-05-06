import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AddFlight = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        flightNumber: '',
        origin: '',
        destination: '',
        departureDate: '',
        arrivalDate: '',
        basePrice: '',
        totalSeats: '',
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = Cookies.get('jwt_token');
            const response = await fetch('http://127.0.0.1:8000/api/admin/flights', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Error al crear el vuelo');
            }

            navigate('/admin/flights');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">Crear Nuevo Vuelo</h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-2">Número de Vuelo</label>
                    <input
                        type="text"
                        name="flightNumber"
                        value={formData.flightNumber}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Origen</label>
                    <input
                        type="text"
                        name="origin"
                        value={formData.origin}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Destino</label>
                    <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Fecha y Hora de Salida</label>
                    <input
                        type="datetime-local"
                        name="departureDate"
                        value={formData.departureDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Fecha y Hora de Llegada</label>
                    <input
                        type="datetime-local"
                        name="arrivalDate"
                        value={formData.arrivalDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Precio Base</label>
                    <input
                        type="number"
                        name="basePrice"
                        value={formData.basePrice}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Número Total de Asientos</label>
                    <input
                        type="number"
                        name="totalSeats"
                        value={formData.totalSeats}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/flights')}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
                    >
                        Crear Vuelo
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddFlight;