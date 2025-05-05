import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    FaChartBar, 
    FaPlane, 
    FaUsers, 
    FaTicketAlt, 
    FaCog, 
    FaTachometerAlt 
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

    return (
        <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 w-64 bg-amber-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
            <div className="flex items-center justify-center h-20 bg-amber-900">
                <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
            </div>
            
            <nav className="mt-5">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center py-3 px-6 text-white hover:bg-amber-700 transition-colors ${
                                isActive ? 'bg-amber-700' : ''
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="mx-4">{item.name}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default AdminSidebar;