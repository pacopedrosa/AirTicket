import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import DataTable from './DataTable';
import Pagination from './Pagination';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const columns = [
        { field: 'id', header: 'ID' },
        { field: 'username', header: 'Username' },
        { field: 'email', header: 'Email' },
        { field: 'roles', header: 'Roles' },
    ];

    const fetchUsers = async (page) => {
        try {
            setLoading(true);
            setError(null);
            const token = Cookies.get('jwt_token');
            if (!token) {
                throw new Error('No se encontró el token de autenticación en la cookie');
            }

            const response = await fetch(`http://127.0.0.1:8000/api/admin/users?page=${page}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Error del servidor: ${response.status}`);
            }

            const data = await response.json();
            setUsers(Array.isArray(data.items) ? data.items : []);
            setTotalPages(Number.isFinite(data.totalPages) ? data.totalPages : 1);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError(error.message);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const handleEdit = (user) => {
        console.log('Edit user:', user);
    };

    const handleDelete = async (user) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const token = Cookies.get('jwt_token');
                if (!token) {
                    throw new Error('No se encontró el token de autenticación en la cookie');
                }

                const response = await fetch(`http://127.0.0.1:8000/api/admin/users/${user.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || 'Error al eliminar usuario');
                }

                fetchUsers(currentPage);
            } catch (error) {
                console.error('Error deleting user:', error);
                setError(error.message);
            }
        }
    };

    const handleView = (user) => {
        console.log('View user:', user);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>
                <button className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600">
                    Add New User
                </button>
            </div>

            {loading ? (
                <div className="text-center">Cargando...</div>
            ) : error ? (
                <div className="text-red-500">Error: {error}</div>
            ) : (
                <>
                    <DataTable 
                        columns={columns}
                        data={users}
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

export default UserManagement;