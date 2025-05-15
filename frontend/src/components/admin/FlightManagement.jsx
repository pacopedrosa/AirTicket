import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';
import Pagination from './Pagination';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const FlightManagement = () => {
    const navigate = useNavigate();
    const [flights, setFlights] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const columns = [
        { field: 'flightNumber', header: 'Flight Number' },
        { field: 'origin', header: 'Origin' },
        { field: 'destination', header: 'Destination' },
        { field: 'departureDate', header: 'Departure' },
        { field: 'arrivalDate', header: 'Arrival' },
        { field: 'basePrice', header: 'Price' }
    ];

    const fetchFlights = async (page) => {
        try {
            setLoading(true);
            setError(null);
            
            const token = Cookies.get('jwt_token');
            if (!token) {
                throw new Error('No se encontró el token de autenticación');
            }

            const response = await fetch(`/api/admin/flights?page=${page}&limit=10`, {
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
                if (response.status === 401) {
                    throw new Error('No autorizado. Por favor, inicie sesión de nuevo.');
                } else if (response.status === 500) {
                    throw new Error('Error en el servidor. Por favor, inténtelo de nuevo más tarde.');
                }
                throw new Error(errorData.error || 'Error al cargar los vuelos');
            }

            const data = await response.json();
            
            if (!data.items || !Array.isArray(data.items)) {
                throw new Error('Formato de respuesta inválido del servidor');
            }

            const formattedFlights = data.items.map(flight => ({
                ...flight,
                departureDate: flight.departureDate ? flight.departureDate : 'N/A',
                arrivalDate: flight.arrivalDate ? flight.arrivalDate : 'N/A',
                basePrice: flight.price ? `€${flight.price}` : 'N/A'
            }));

            setFlights(formattedFlights);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching flights:', error);
            setError(error.message);
            setFlights([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlights(currentPage);
    }, [currentPage]);

    const handleDelete = async (flight) => {
        if (window.confirm('Estas seguro que quieres eliminar el vuelo?')) {
            try {
                const token = Cookies.get('jwt_token');
                if (!token) {
                    throw new Error('No se encontró el token de autenticación');
                }

                const response = await fetch(`/api/admin/flights/${flight.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || 'Error al eliminar el vuelo');
                }

                fetchFlights(currentPage);
            } catch (error) {
                console.error('Error deleting flight:', error);
                setError(error.message);
            }
        }
    };

    const handleAddFlight = () => {
        navigate('/admin/flights/new');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Gestión de Vuelos</h2>
                <button 
                    onClick={handleAddFlight}
                    className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600">
                    Añadir Nuevo Vuelo
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                    <p className="mt-4 text-amber-700">Cargando vuelos...</p>
                </div>
            ) : (
                <>
                    <DataTable 
                        columns={columns}
                        data={flights}
                        onDelete={handleDelete}
                    />
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
};

export default FlightManagement;