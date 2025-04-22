import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Payment = () => {
    const { flightId } = useParams();
    const navigate = useNavigate();
    const [flight, setFlight] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = Cookies.get('jwt_token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Fetch flight details
                const flightResponse = await fetch(`http://localhost:8000/api/flights/${flightId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                // Fetch payment methods
                const methodsResponse = await fetch('http://localhost:8000/api/payment-methods', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!flightResponse.ok || !methodsResponse.ok) {
                    throw new Error('Error al cargar los datos');
                }

                const flightData = await flightResponse.json();
                const methodsData = await methodsResponse.json();

                setFlight(flightData);
                setPaymentMethods(methodsData);
            } catch (error) {
                setError('Error al cargar la información. Por favor, inténtalo de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [flightId, navigate]);

    const handlePaymentDetailsChange = (e) => {
        setPaymentDetails({
            ...paymentDetails,
            [e.target.name]: e.target.value
        });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        try {
            const token = Cookies.get('jwt_token');
            const response = await fetch(`http://localhost:8000/api/flights/${flightId}/book`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    payment_method: selectedMethod,
                    payment_details: paymentDetails
                })
            });

            if (!response.ok) {
                throw new Error('Error al procesar el pago');
            }

            navigate('/my-flights');
        } catch (error) {
            setError('Error al procesar el pago. Por favor, inténtalo de nuevo.');
        }
    };

    const renderPaymentFields = () => {
        if (selectedMethod === 'credit_card' || selectedMethod === 'debit_card') {
            return (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-amber-700 mb-2">
                            Número de Tarjeta
                        </label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={paymentDetails.cardNumber}
                            onChange={handlePaymentDetailsChange}
                            className="w-full px-3 py-2 border border-amber-300 rounded-md"
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-amber-700 mb-2">
                            Titular de la Tarjeta
                        </label>
                        <input
                            type="text"
                            name="cardHolder"
                            value={paymentDetails.cardHolder}
                            onChange={handlePaymentDetailsChange}
                            className="w-full px-3 py-2 border border-amber-300 rounded-md"
                            placeholder="NOMBRE APELLIDOS"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-amber-700 mb-2">
                                Fecha de Caducidad
                            </label>
                            <input
                                type="text"
                                name="expiryDate"
                                value={paymentDetails.expiryDate}
                                onChange={handlePaymentDetailsChange}
                                className="w-full px-3 py-2 border border-amber-300 rounded-md"
                                placeholder="MM/YY"
                                maxLength="5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-amber-700 mb-2">
                                CVV
                            </label>
                            <input
                                type="text"
                                name="cvv"
                                value={paymentDetails.cvv}
                                onChange={handlePaymentDetailsChange}
                                className="w-full px-3 py-2 border border-amber-300 rounded-md"
                                placeholder="123"
                                maxLength="3"
                            />
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-amber-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                        <p className="mt-4 text-amber-700">Cargando información del pago...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-amber-800 mb-6">Confirmar y Pagar</h1>
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            {error}
                        </div>
                    )}

                    {flight && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-amber-700 mb-2">Detalles del Vuelo</h2>
                            <div className="grid grid-cols-2 gap-4 text-gray-600">
                                <div>
                                    <p><span className="font-medium">Origen:</span> {flight.origin}</p>
                                    <p><span className="font-medium">Destino:</span> {flight.destination}</p>
                                </div>
                                <div>
                                    <p><span className="font-medium">Número de vuelo:</span> {flight.flight_number}</p>
                                    <p><span className="font-medium">Precio:</span> {flight.base_price}€</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handlePayment} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-amber-700 mb-2">
                                Método de Pago
                            </label>
                            <select
                                value={selectedMethod}
                                onChange={(e) => setSelectedMethod(e.target.value)}
                                className="w-full px-3 py-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                                required
                            >
                                <option value="">Selecciona un método de pago</option>
                                {paymentMethods.map((method) => (
                                    <option key={method.id} value={method.id}>
                                        {method.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {renderPaymentFields()}

                        <button
                            type="submit"
                            className="w-full bg-amber-500 text-white py-3 px-6 rounded-md hover:bg-amber-600 transition duration-300 font-semibold"
                        >
                            Confirmar y Pagar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Payment;