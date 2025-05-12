import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
    FaChartBar, 
    FaPlane, 
    FaUsers, 
    FaTicketAlt, 
    FaCog, 
    FaTachometerAlt,
    FaTimes
} from 'react-icons/fa';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
    const menuItems = [
        { path: '/admin', icon: FaTachometerAlt, name: 'Dashboard' },
        { path: '/admin/users', icon: FaUsers, name: 'Users' },
        { path: '/admin/flights', icon: FaPlane, name: 'Flights' },
        { path: '/admin/reservations', icon: FaTicketAlt, name: 'Reservations' },
        { path: '/admin/statistics', icon: FaChartBar, name: 'Statistics' },
        { path: '/admin/settings', icon: FaCog, name: 'Settings' },
    ];

    // Cerrar el sidebar al cambiar de ruta en móvil
    const handleNavClick = () => {
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Sidebar */}
            <div 
                id="admin-sidebar"
                className={`
                    fixed lg:static inset-0 z-30
                    bg-amber-800 transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    lg:w-64
                `}
            >
                {/* Header del sidebar */}
                <div className="flex items-center justify-between h-20 px-6 bg-amber-800 border-b border-amber-700">
                    <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden text-white hover:text-amber-200 focus:outline-none"
                    >
                        <FaTimes className="h-6 w-6" />
                    </button>
                </div>
                
                {/* Menú de navegación */}
                <nav className="mt-8 px-4 lg:px-0">
                    <div className="flex flex-col items-center lg:items-start space-y-4">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                    `w-full lg:w-auto flex items-center justify-center lg:justify-start py-3 px-6 
                                    text-white hover:bg-amber-700 transition-colors rounded-lg
                                    ${isActive ? 'bg-amber-700' : ''}`
                                }
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                <span className="mx-4 text-center lg:text-left">{item.name}</span>
                            </NavLink>
                        ))}
                    </div>
                </nav>
            </div>
        </>
    );
};

export default AdminSidebar;