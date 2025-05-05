import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';
import Pagination from './Pagination';

const FlightManagement = () => {
    const [flights, setFlights] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

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
            const response = await fetch(`http://127.0.0.1:8000/api/admin/flights?page=${page}`);
            const data = await response.json();
            setFlights(data.items);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching flights:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlights(currentPage);
    }, [currentPage]);

    const handleEdit = (flight) => {
        console.log('Edit flight:', flight);
    };

    const handleDelete = async (flight) => {
        if (window.confirm('Are you sure you want to delete this flight?')) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/admin/flights/${flight.id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchFlights(currentPage);
                }
            } catch (error) {
                console.error('Error deleting flight:', error);
            }
        }
    };

    const handleView = (flight) => {
        console.log('View flight:', flight);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Flight Management</h2>
                <button className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600">
                    Add New Flight
                </button>
            </div>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <>
                    <DataTable 
                        columns={columns}
                        data={flights}
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

export default FlightManagement;