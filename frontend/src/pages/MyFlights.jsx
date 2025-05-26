import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaFilePdf } from 'react-icons/fa';
import { useNotification } from '../hooks/useNotification';

const MyFlights = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { showSuccess, showError } = useNotification();

    useEffect(() => {
        const fetchMyFlights = async () => {
            try {
                const token = Cookies.get('jwt_token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`/api/user/flights`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/login');
                        return;
                    }
                    throw new Error('Error al cargar los vuelos');
                }

                const data = await response.json();
                setFlights(data);
            } catch (error) {
                console.error('Error:', error);
                setError('Error al cargar tus vuelos. Por favor, inténtalo de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyFlights();
    }, [navigate]);

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

    const handleExportPDF = async (reservationId) => {
        try {
            console.log('Intentando exportar PDF para reserva:', reservationId);
            const token = Cookies.get('jwt_token');
            if (!token) {
                navigate('/login');
                return;
            }

            const url = `/api/user/flights/${reservationId}/pdf`;
            console.log('URL de la petición:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/pdf',
                }
            });

            if (!response.ok) {
                console.error('Error en la respuesta:', response.status, response.statusText);
                throw new Error(`Error al generar el PDF: ${response.status} ${response.statusText}`);
            }

            // Obtener el blob del PDF
            const blob = await response.blob();
            
            // Crear una URL para el blob
            const urlBlob = window.URL.createObjectURL(blob);
            
            // Crear un enlace temporal y hacer clic en él
            const link = document.createElement('a');
            link.href = urlBlob;
            link.download = `reserva_vuelo_${reservationId}.pdf`;
            document.body.appendChild(link);
            link.click();
            
            // Limpiar
            document.body.removeChild(link);
            window.URL.revokeObjectURL(urlBlob);
            
            showSuccess('PDF generado correctamente');
        } catch (error) {
            console.error('Error completo:', error);
            showError(error.message || 'Error al generar el PDF');
        }
    };

    return (
        <div className="min-h-screen bg-amber-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-amber-800 text-center mb-8">
                        Mis Vuelos
                    </h1>
                    
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                            <p className="mt-4 text-amber-700">Cargando tus vuelos...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-8">
                            {error}
                        </div>
                    ) : flights.length > 0 ? (
                        <div className="space-y-4">
                            {flights.map((flight) => (
                                console.log(flight),
                                <div key={flight.id} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-amber-800">{flight.origin}</div>
                                            <div className="text-sm text-gray-500">{formatDate(flight.departure_date)}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm text-gray-500">Vuelo: {flight.flight_number}</div>
                                            <div className="w-full h-px bg-amber-300 my-2"></div>
                                            <div className="text-sm text-gray-500">Estado: {flight.reservation_status}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-amber-800">{flight.destination}</div>
                                            <div className="text-sm text-gray-500">{formatDate(flight.arrival_date)}</div>
                                            <button
                                                onClick={() => handleExportPDF(flight.reservation_id)}
                                                className="mt-2 inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition duration-300"
                                            >
                                                <FaFilePdf className="mr-2" />
                                                Exportar PDF
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-amber-700">
                            No tienes vuelos reservados.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyFlights;