import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Inicializa Stripe con la clave pública
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Payment = () => {
    const { flightId } = useParams();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const [flight, setFlight] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [extras, setExtras] = useState([]);
    const [selectedExtras, setSelectedExtras] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [clientSecret, setClientSecret] = useState('');
    const [extraReservationId, setExtraReservationId] = useState(null);
    const [postalCode, setPostalCode] = useState('');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false); // Nuevo estado para manejar el proceso de pago

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = Cookies.get('jwt_token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const flightResponse = await fetch(`http://localhost:8000/api/flights/${flightId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!flightResponse.ok) {
                    throw new Error('Error al cargar los detalles del vuelo');
                }

                const flightData = await flightResponse.json();
                setFlight(flightData);
                setTotalPrice(flightData.base_price);

                const methodsResponse = await fetch('http://localhost:8000/api/payment-methods', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!methodsResponse.ok) {
                    throw new Error('Error al cargar los métodos de pago');
                }

                const methodsData = await methodsResponse.json();
                setPaymentMethods(methodsData);

                const extrasResponse = await fetch('http://localhost:8000/api/extras', {
                    headers: { 'Authorization': `Bearer ${token}` },
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

            const extrasTotal = extras.reduce((sum, extra) => {
                return sum + (extra.price * (newExtras[extra.id] || 0));
            }, 0);

            setTotalPrice(flight.base_price + extrasTotal);
            return newExtras;
        });
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setError('Stripe no está inicializado. Por favor, intenta de nuevo.');
            return;
        }

        if (!selectedMethod || (selectedMethod !== 'credit_card' && selectedMethod !== 'debit_card')) {
            setError('Por favor, selecciona un método de pago válido (tarjeta de crédito o débito).');
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError('Error al cargar los detalles de la tarjeta. Por favor, intenta de nuevo.');
            return;
        }

        if (!postalCode) {
            setError('Por favor, ingresa un código postal válido.');
            return;
        }

        // Evitar re-renderizados mientras se procesa el pago
        setIsProcessingPayment(true);

        try {
            const token = Cookies.get('jwt_token');
            if (!token) {
                console.error('No hay token de autenticación');
                navigate('/login');
                return;
            }
            console.log('Token presente:', !!token);
            console.log('Iniciando proceso de pago...');

            const selectedExtrasArray = Object.entries(selectedExtras)
                .filter(([_, quantity]) => quantity > 0)
                .map(([id, quantity]) => ({ id: parseInt(id), quantity }));

            if (selectedExtrasArray.length > 0) {
                console.log('Reservando extras:', selectedExtrasArray);
                const extrasResponse = await fetch('http://localhost:8000/api/extras/reserve', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ extras: selectedExtrasArray })
                });

                if (!extrasResponse.ok) {
                    const errorData = await extrasResponse.json();
                    console.error('Error al reservar extras:', errorData);
                    throw new Error(errorData.error || 'Error al reservar los extras');
                }

                const extrasData = await extrasResponse.json();
                console.log('Extras reservados:', extrasData);
                setExtraReservationId(extrasData.id);
            }

            console.log('Creando PaymentIntent con monto:', totalPrice * 100);
            const paymentIntentResponse = await fetch('http://localhost:8000/api/flights/payment/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: Math.round(totalPrice * 100),
                    currency: 'eur',
                    flight_id: flightId,
                })
            });

            if (!paymentIntentResponse.ok) {
                const errorData = await paymentIntentResponse.json();
                console.error('Error al crear PaymentIntent:', errorData);
                throw new Error(errorData.error || 'Error al crear el PaymentIntent');
            }

            const paymentIntentData = await paymentIntentResponse.json();
            console.log('PaymentIntent creado:', paymentIntentData);
            setClientSecret(paymentIntentData.clientSecret);

            console.log('Confirmando pago con Stripe...');
            const { error, paymentIntent } = await stripe.confirmCardPayment(paymentIntentData.clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: 'Cliente de prueba',
                        address: {
                            postal_code: postalCode,
                        },
                    },
                },
            });

            if (error) {
                console.error('Error de Stripe:', error);
                setError(error.message);
                setIsProcessingPayment(false);
                return;
            }

            console.log('Pago confirmado:', paymentIntent);

            if (paymentIntent.status === 'succeeded') {
                console.log('Pago exitoso, procesando reserva...');
                const bookResponse = await fetch(`http://localhost:8000/api/flights/${flightId}/book`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        payment_intent_id: paymentIntent.id,
                        extra_reservation_id: extraReservationId,
                    })
                });

                if (!bookResponse.ok) {
                    const errorData = await bookResponse.json();
                    console.error('Error al procesar la reserva:', errorData);
                    throw new Error(errorData.error || 'Error al procesar la reserva');
                }

                const bookData = await bookResponse.json();
                console.log('Reserva procesada:', bookData);
                navigate('/my-flights');
            }
        } catch (error) {
            console.error('Error completo en el proceso de pago:', error);
            setError(error.message || 'Error al procesar el pago. Por favor, inténtalo de nuevo.');
            setIsProcessingPayment(false);
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

    const renderPaymentFields = () => {
        if (!selectedMethod || (selectedMethod !== 'credit_card' && selectedMethod !== 'debit_card')) {
            return null;
        }

        return (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-amber-700 mb-2">
                        Detalles de la Tarjeta
                    </label>
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-amber-700 mb-2">
                        Código Postal
                    </label>
                    <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Ej. 28001"
                        className="w-full px-3 py-2 border border-amber-300 rounded-md"
                        required
                    />
                </div>
            </div>
        );
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
                                    Total a Pagar: {totalPrice.toFixed(2)}€
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
                                            <option key={method.id} value={method.id}>
                                                {method.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {renderPaymentFields()}

                                <div className="mt-8">
                                    <button
                                        type="submit"
                                        className="w-full bg-amber-500 text-white py-3 px-6 rounded-md hover:bg-amber-600 transition duration-300"
                                        disabled={isProcessingPayment || !stripe}
                                    >
                                        {isProcessingPayment ? 'Procesando...' : `Pagar ${totalPrice.toFixed(2)}€`}
                                    </button>
                                    <div className="mt-4 p-4 bg-amber-50 rounded-lg text-center">
                                        <p className="text-lg font-semibold text-amber-800">
                                            Total a Pagar: {totalPrice.toFixed(2)}€
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

// Envuelve el componente en Elements para usar Stripe
const PaymentWithStripe = (props) => (
    <Elements stripe={stripePromise}>
        <Payment {...props} />
    </Elements>
);

export default PaymentWithStripe;