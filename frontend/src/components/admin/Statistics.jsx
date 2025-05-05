import React from 'react';
import { FaPlane, FaUsers, FaEuroSign, FaChartLine } from 'react-icons/fa';
import StatsCard from './StatsCard';

const Statistics = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Statistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                    title="Total Revenue" 
                    value="€125,430" 
                    icon={FaEuroSign} 
                    change="+15.3%" 
                />
                <StatsCard 
                    title="Active Users" 
                    value="2,845" 
                    icon={FaUsers} 
                    change="+10.2%" 
                />
                <StatsCard 
                    title="Total Flights" 
                    value="456" 
                    icon={FaPlane} 
                    change="+5.8%" 
                />
                <StatsCard 
                    title="Growth Rate" 
                    value="23.5%" 
                    icon={FaChartLine} 
                    change="+2.1%" 
                />
            </div>

            {/* Add more statistical components here */}
        </div>
    );
};

export default Statistics;