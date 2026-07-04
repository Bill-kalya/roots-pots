import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FloorPlan } from '../components/restaurant/FloorPlan';
import { ReservationPanel } from '../components/restaurant/ReservationPanel';
import { Table } from '../types';
import { useWebSocket } from '../hooks/useWebSocket';
import { apiClient } from '../api/client';

export const Explore: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showReservation, setShowReservation] = useState(false);
  
  // Fetch restaurant data
  const { data: tables, refetch } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      const response = await apiClient.get('/restaurants/1/tables');
      return response.data;
    },
  });

  // WebSocket for real-time updates
  useWebSocket(() => {
    // Update table availability in real-time
    refetch();
  });

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setShowReservation(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-roots-green/10 to-roots-cream p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-roots-green mb-2">
          Choose Your Table
        </h1>
        <p className="text-gray-600 mb-8">
          Tap a table to reserve it for your visit
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {tables && <FloorPlan tables={tables} onTableClick={handleTableClick} />}
          </div>
          
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <h3 className="font-semibold text-lg mb-4">Selected Table</h3>
              {selectedTable ? (
                <div>
                  <div className="text-3xl font-bold text-roots-green">
                    Table {selectedTable.tableNumber}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {selectedTable.seats} seats • {selectedTable.zone}
                  </div>
                  <button
                    onClick={() => setShowReservation(true)}
                    className="mt-4 w-full bg-roots-green text-white py-3 rounded-xl hover:bg-roots-green/90 transition"
                  >
                    Reserve Now
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">Select a table on the floor plan</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showReservation && selectedTable && (
        <ReservationPanel
          table={selectedTable}
          onClose={() => setShowReservation(false)}
          onSuccess={() => {
            setShowReservation(false);
            refetch();
          }}
        />
      )}
    </div>
  );
};