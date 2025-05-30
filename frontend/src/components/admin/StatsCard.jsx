import React from 'react';

const StatsCard = ({ title, value, icon: Icon, change, color = 'bg-blue-500' }) => {
    const changeColor = change && parseFloat(change) >= 0 ? 'text-green-600' : 'text-red-600';

    return (
        <div className="rounded-lg shadow-lg p-6 bg-white">
            <div className="flex items-center">
                <div className={`rounded-full p-3 ${color} bg-opacity-20`}>
                    <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                </div>
                <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    <p className="text-2xl font-semibold text-gray-900">{value}</p>
                    {change && (
                        <p className={`text-sm font-medium ${changeColor}`}>
                            {change} vs mes anterior
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;