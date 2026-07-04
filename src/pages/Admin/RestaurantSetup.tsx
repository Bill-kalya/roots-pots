import React, { useState } from 'react';
import { GlassmorphismCard } from '../../components/common/GlassmorphismCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { apiClient } from '../../api/client';

interface TableFormData {
  tableNumber: string;
  seats: string;
  x: string;
  y: string;
  zone: string;
}

export const RestaurantSetup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'details' | 'tables'>('details');
  const [isLoading, setIsLoading] = useState(false);
  
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
  });

  const [tableData, setTableData] = useState<TableFormData>({
    tableNumber: '',
    seats: '',
    x: '',
    y: '',
    zone: 'Indoor',
  });

  const [tables, setTables] = useState<any[]>([]);

  const handleRestaurantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiClient.post('/admin/restaurants', {
        ...restaurantData,
        latitude: parseFloat(restaurantData.latitude),
        longitude: parseFloat(restaurantData.longitude),
      });
      alert('Restaurant created successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create restaurant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTableSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newTable = {
        tableNumber: parseInt(tableData.tableNumber),
        seats: parseInt(tableData.seats),
        x: parseFloat(tableData.x),
        y: parseFloat(tableData.y),
        zone: tableData.zone,
      };
      setTables([...tables, newTable]);
      setTableData({ tableNumber: '', seats: '', x: '', y: '', zone: 'Indoor' });
    } finally {
      setIsLoading(false);
    }
  };

  const saveAllTables = async () => {
    try {
      await apiClient.post('/admin/tables/batch', { tables });
      alert('Tables saved successfully!');
      setTables([]);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save tables');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-roots-green/10 to-roots-cream p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-roots-green mb-8">
          Restaurant Setup
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            className={`px-6 py-3 rounded-lg transition ${
              activeTab === 'details' 
                ? 'bg-roots-green text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Restaurant Details
          </button>
          <button
            className={`px-6 py-3 rounded-lg transition ${
              activeTab === 'tables' 
                ? 'bg-roots-green text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('tables')}
          >
            Table Setup ({tables.length})
          </button>
        </div>

        {/* Restaurant Details */}
        {activeTab === 'details' && (
          <GlassmorphismCard className="p-8">
            <form onSubmit={handleRestaurantSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={restaurantData.name}
                  onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none h-24"
                  value={restaurantData.description}
                  onChange={(e) => setRestaurantData({ ...restaurantData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={restaurantData.address}
                  onChange={(e) => setRestaurantData({ ...restaurantData, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={restaurantData.latitude}
                    onChange={(e) => setRestaurantData({ ...restaurantData, latitude: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={restaurantData.longitude}
                    onChange={(e) => setRestaurantData({ ...restaurantData, longitude: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-roots-green text-white py-3 rounded-lg hover:bg-roots-green/90 
                         transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" color="text-white" />
                    Saving...
                  </>
                ) : (
                  'Save Restaurant'
                )}
              </button>
            </form>
          </GlassmorphismCard>
        )}

        {/* Table Setup */}
        {activeTab === 'tables' && (
          <div className="space-y-6">
            <GlassmorphismCard className="p-8">
              <h2 className="text-xl font-semibold mb-4">Add Tables</h2>
              <form onSubmit={handleTableSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Table Number *
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      value={tableData.tableNumber}
                      onChange={(e) => setTableData({ ...tableData, tableNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Seats *
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      value={tableData.seats}
                      onChange={(e) => setTableData({ ...tableData, seats: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      X Position (%) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      value={tableData.x}
                      onChange={(e) => setTableData({ ...tableData, x: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Y Position (%) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      value={tableData.y}
                      onChange={(e) => setTableData({ ...tableData, y: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zone
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={tableData.zone}
                    onChange={(e) => setTableData({ ...tableData, zone: e.target.value })}
                  >
                    <option value="Indoor">Indoor</option>
                    <option value="Garden">Garden</option>
                    <option value="Rooftop">Rooftop</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-roots-gold text-white py-2 rounded-lg 
                           hover:bg-roots-gold/90 transition disabled:opacity-50"
                >
                  Add Table
                </button>
              </form>
            </GlassmorphismCard>

            {tables.length > 0 && (
              <GlassmorphismCard className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Added Tables ({tables.length})
                  </h3>
                  <button
                    onClick={saveAllTables}
                    className="bg-roots-green text-white px-6 py-2 rounded-lg 
                             hover:bg-roots-green/90 transition"
                  >
                    Save All Tables
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {tables.map((table, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="font-bold text-roots-green">#{table.tableNumber}</div>
                      <div className="text-sm text-gray-600">{table.seats} seats</div>
                      <div className="text-xs text-gray-500">{table.zone}</div>
                    </div>
                  ))}
                </div>
              </GlassmorphismCard>
            )}
          </div>
        )}
      </div>
    </div>
  );
};