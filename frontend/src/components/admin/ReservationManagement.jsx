import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';
import Pagination from './Pagination';
import Cookies from 'js-cookie';

const ReservationManagement = () => {
    const [reservations, setReservations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

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
            const token = Cookies.get('jwt_token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            };

            // Use the correct endpoint for reservations
            const response = await fetch(`http://127.0.0.1:8000/api/admin/bookings?page=${page}`, {
                headers,
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch reservations');
            }

            const data = await response.json();
            
            // Transform the data to match the database structure
            const formattedData = data.map(booking => ({
                id: booking.id,
                flightNumber: `${booking.flight?.origin} - ${booking.flight?.destination} (${booking.flight?.flightNumber})`,
                username: `${booking.passenger?.firstName} ${booking.passenger?.lastName}`,
                status: booking.status,
                totalPrice: formatPrice(booking.totalAmount),
                createdAt: formatDate(booking.bookingDate)
            }));

            setReservations(formattedData);
            setTotalPages(Math.ceil(formattedData.length / 10));
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
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
                const response = await fetch(`http://127.0.0.1:8000/api/user/flights/${reservation.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                });
                
                if (response.ok) {
                    fetchReservations(currentPage);
                } else {
                    throw new Error('Failed to delete reservation');
                }
            } catch (error) {
                console.error('Error deleting reservation:', error);
            }
        }
    };

    const handleView = (reservation) => {
        console.log('View reservation:', reservation);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Reservation Management</h2>

            {loading ? (
                <div className="text-center">Loading...</div>
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