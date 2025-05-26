import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import DataTable from './DataTable';
import Pagination from './Pagination';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../hooks/useNotification';

const UserManagement = () => {
    const navigate = useNavigate();
    const { showSuccess, showError } = useNotification();
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

            const response = await fetch(`/api/admin/users?page=${page}`, { 
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

    const handleDelete = async (user) => {
        if (window.confirm('¿Estás seguro que quieres eliminar este usuario?')) {
            try {
                const token = Cookies.get('jwt_token');
                if (!token) {
                    showError('No se encontró el token de autenticación');
                    return;
                }
    
                const response = await fetch(`/api/admin/deleteUser/${user.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                });
    
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    showError(errorData.error || `Error del servidor: ${response.status}`);
                    return;
                }
    
                showSuccess('Usuario eliminado exitosamente');
                fetchUsers(currentPage);
            } catch (error) {
                console.error('Error deleting user:', error.message);
                showError('Error al eliminar el usuario');
            }
        }
    };

    const handleAddUser = () => {
        navigate('/admin/users/new');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>
                <button 
                    onClick={handleAddUser}
                    className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600">
                    Añadir nuevo usuario
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

export default UserManagement;