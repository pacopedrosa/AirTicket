import React from 'react';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';

const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
    return (
        <header className="bg-white shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
                <button
                    className="text-gray-500 lg:hidden"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <FaBars className="h-6 w-6" />
                </button>

                <div className="flex items-center space-x-4">
                    <button className="text-gray-500 hover:text-gray-700">
                        <FaBell className="h-6 w-6" />
                    </button>
                    <div className="flex items-center space-x-2">
                        <FaUserCircle className="h-8 w-8 text-gray-500" />
                        <span className="text-gray-700">Admin</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;