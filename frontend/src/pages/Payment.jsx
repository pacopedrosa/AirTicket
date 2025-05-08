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
    const [extras, setExtras] = useState([]);
    const [selectedExtras, setSelectedExtras] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);

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

                if (!flightResponse.ok) {
                    throw new Error('Error al cargar los detalles del vuelo');
                }

                const flightData = await flightResponse.json();
                setFlight(flightData);
                setTotalPrice(flightData.base_price);

                // Fetch payment methods
                const methodsResponse = await fetch('http://localhost:8000/api/payment-methods', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!methodsResponse.ok) {
                    throw new Error('Error al cargar los métodos de pago');
                }

                const methodsData = await methodsResponse.json();
                setPaymentMethods(methodsData);

                // Fetch extras
                const extrasResponse = await fetch('http://localhost:8000/api/extras', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!extrasResponse.ok) {
                    throw new Error('Error al cargar los extras');
                }

                const extrasData = await extrasResponse.json();
                setExtras(extrasData);
            } catch (error) {
                setError('Error al cargar la información. Por favor, inténtalo de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [flightId, navigate]);

    const handleExtraChange = (extraId, quantity) => {
        setSelectedExtras(prev => {
            const newExtras = {
                ...prev,
                [extraId]: quantity
            };
            
            // Calcular nuevo precio total
            const extrasTotal = extras.reduce((sum, extra) => {
                return sum + (extra.price * (newExtras[extra.id] || 0));
            }, 0);
            
            setTotalPrice(flight.base_price + extrasTotal);
            return newExtras;
        });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        try {
            const token = Cookies.get('jwt_token');
            
            // Primero reservar los extras
            const selectedExtrasArray = Object.entries(selectedExtras)
                .filter(([_, quantity]) => quantity > 0)
                .map(([id, quantity]) => ({ id: parseInt(id), quantity }));

            if (selectedExtrasArray.length > 0) {
                const extrasResponse = await fetch('http://localhost:8000/api/extras/reserve', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ extras: selectedExtrasArray })
                });

                if (!extrasResponse.ok) {
                    throw new Error('Error al reservar los extras');
                }
            }

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

    const renderExtras = () => (
        <div className="mt-6">
            <h2 className="text-xl font-semibold text-amber-800 mb-4">Extras Disponibles</h2>
            <div className="space-y-4">
                {extras.map(extra => (
                    <div key={extra.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                        <div>
                            <h3 className="font-medium text-amber-900">{extra.description}</h3>
                            <p className="text-amber-600">{extra.price}€</p>
                        </div>
                        <div>
                            <input
                                type="number"
                                min="0"
                                value={selectedExtras[extra.id] || 0}
                                onChange={(e) => handleExtraChange(extra.id, parseInt(e.target.value))}
                                className="w-20 px-2 py-1 border border-amber-300 rounded"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const handlePaymentDetailsChange = (e) => {
        setPaymentDetails({
            ...paymentDetails,
            [e.target.name]: e.target.value
        });
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

    return (
        <div className="min-h-screen bg-amber-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {loading ? (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                            <p className="mt-4 text-amber-700">Cargando información del pago...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            {error}
                        </div>
                    ) : flight ? (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-amber-800">Detalles del Pago</h2>
                                <div className="text-xl font-semibold text-amber-600 mt-2">
                                    Total a Pagar: {totalPrice}€
                                </div>
                            </div>

                            <form onSubmit={handlePayment}>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-amber-800 mb-4">Detalles del Vuelo</h2>
                                    {flight && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-gray-600">Origen: {flight.origin}</p>
                                                <p className="text-gray-600">Destino: {flight.destination}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Precio base: {flight.base_price}€</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {renderExtras()}

                                <div className="mt-6">
                                    <h2 className="text-xl font-semibold text-amber-800 mb-4">Método de Pago</h2>
                                    <select
                                        value={selectedMethod}
                                        onChange={(e) => setSelectedMethod(e.target.value)}
                                        className="w-full px-3 py-2 border border-amber-300 rounded-md"
                                        required
                                    >
                                        <option value="">Selecciona un método de pago</option>
                                        {paymentMethods.map(method => (
                                            <option key={method.id} value={method.code}>
                                                {method.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedMethod && renderPaymentFields()}

                                <div className="mt-8">
                                    <button
                                        type="submit"
                                        className="w-full bg-amber-500 text-white py-3 px-6 rounded-md hover:bg-amber-600 transition duration-300"
                                    >
                                        Pagar {totalPrice}€
                                    </button>
                                    <div className="mt-4 p-4 bg-amber-50 rounded-lg text-center">
                                        <p className="text-lg font-semibold text-amber-800">
                                            Total a Pagar: {totalPrice}€
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="text-center text-amber-700">
                            No se encontró información del vuelo.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Payment;