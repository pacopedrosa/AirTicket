import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;