import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';
import Pagination from './Pagination';
import Cookies from 'js-cookie';

const ReservationManagement = () => {
    const [reservations, setReservations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const columns = [
        { field: 'id', header: 'ID' },
        { field: 'flightNumber', header: 'Flight' },
        { field: 'username', header: 'User' },
        { field: 'status', header: 'Status' },
        { field: 'totalPrice', header: 'Total Price' },
        { field: 'createdAt', header: 'Created At' }
    ];

    const fetchReservations = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            const token = Cookies.get('jwt_token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            // Use the correct endpoint for reservations
                const response = await fetch(`/api/admin/reservations?page=${page}&limit=10`, {
                method: 'GET',
                headers,
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 401) {
                    throw new Error('Unauthorized. Please log in again.');
                } else if (response.status === 500) {
                    throw new Error('Server error. Please try again later.');
                }
                throw new Error(errorData.error || 'Failed to fetch reservations');
            }

            const data = await response.json();

            if (!data.items || !Array.isArray(data.items)) {
                throw new Error('Invalid response format from server');
            }

            // Transform the data to match the expected structure
            const formattedData = data.items.map(booking => ({
                id: booking.id,
                flightNumber: booking.flightNumber || 'N/A',
                username: booking.username || 'N/A',
                status: booking.status || 'N/A',
                totalPrice: booking.totalPrice ? formatPrice(booking.totalPrice) : 'N/A',
                createdAt: booking.reservationDate ? formatDate(booking.reservationDate) : 'N/A'
            }));

            setReservations(formattedData);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            setError(error.message);
            setReservations([]);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        }).format(price);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        fetchReservations(currentPage);
    }, [currentPage]);

    const handleEdit = (reservation) => {
        console.log('Edit reservation:', reservation);
    };

    const handleDelete = async (reservation) => {
        if (window.confirm('Are you sure you want to delete this reservation?')) {
            try {
                const token = Cookies.get('jwt_token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(`/api/admin/reservations/${reservation.id}`, {
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
                    throw new Error(errorData.error || 'Failed to delete reservation');
                }

                fetchReservations(currentPage);
            } catch (error) {
                console.error('Error deleting reservation:', error);
                setError(error.message);
            }
        }
    };

    const handleView = (reservation) => {
        console.log('View reservation:', reservation);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Reservation Management</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                    <p className="mt-4 text-amber-700">Loading reservations...</p>
                </div>
            ) : (
                <>
                    <DataTable 
                        columns={columns}
                        data={reservations}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handleView}
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

export default ReservationManagement;