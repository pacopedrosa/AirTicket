import React from 'react';

const Settings = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Settings</h2>
            
            <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Site Name</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                placeholder="AirTicket"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                            <input
                                type="email"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                placeholder="admin@airticket.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Timezone</label>
                            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500">
                                <option>UTC</option>
                                <option>Europe/Madrid</option>
                                <option>Europe/London</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <button className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;