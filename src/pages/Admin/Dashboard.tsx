import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { GlassmorphismCard } from '../../components/common/GlassmorphismCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

interface Reservation {
  id: string;
  tableNumber: number;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  status: string;
}

export const AdminDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const { data: reservations, isLoading, refetch } = useQuery({
    queryKey: ['admin-reservations', selectedDate],
    queryFn: async () => {
      const response = await apiClient.get('/admin/reservations', {
        params: { date: selectedDate }
      });
      return response.data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/stats');
      return response.data;
    },
  });

  const handleStatusChange = async (reservationId: string, newStatus: string) => {
    try {
      await apiClient.patch(`/admin/reservations/${reservationId}`, {
        status: newStatus
      });
      refetch();
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-roots-green/10 to-roots-cream p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-roots-green">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-lg"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button className="bg-roots-green text-white px-4 py-2 rounded-lg hover:bg-roots-green/90">
              Export
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <GlassmorphismCard className="p-6">
            <div className="text-sm text-gray-600">Total Reservations</div>
            <div className="text-3xl font-bold text-roots-green mt-2">
              {stats?.total || 0}
            </div>
          </GlassmorphismCard>
          
          <GlassmorphismCard className="p-6">
            <div className="text-sm text-gray-600">Today's Reservations</div>
            <div className="text-3xl font-bold text-roots-green mt-2">
              {stats?.today || 0}
            </div>
          </GlassmorphismCard>
          
          <GlassmorphismCard className="p-6">
            <div className="text-sm text-gray-600">Available Tables</div>
            <div className="text-3xl font-bold text-green-500 mt-2">
              {stats?.availableTables || 0}
            </div>
          </GlassmorphismCard>
          
          <GlassmorphismCard className="p-6">
            <div className="text-sm text-gray-600">Occupied</div>
            <div className="text-3xl font-bold text-red-500 mt-2">
              {stats?.occupiedTables || 0}
            </div>
          </GlassmorphismCard>
        </div>

        {/* Reservations Table */}
        <GlassmorphismCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Reservations</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Table</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Phone</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations?.map((res: Reservation) => (
                  <tr key={res.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-medium">Table {res.tableNumber}</td>
                    <td className="py-3 px-4">{res.customerName}</td>
                    <td className="py-3 px-4">{res.customerPhone}</td>
                    <td className="py-3 px-4">{res.time}</td>
                    <td className="py-3 px-4">
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${res.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : ''}
                        ${res.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : ''}
                        ${res.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : ''}
                      `}>
                        {res.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                        value={res.status}
                        onChange={(e) => handleStatusChange(res.id, e.target.value)}
                      >
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassmorphismCard>
      </div>
    </div>
  );
};