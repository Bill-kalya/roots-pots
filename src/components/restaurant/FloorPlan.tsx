import React, { useState } from 'react';
import { Table } from '../../types';

interface FloorPlanProps {
  tables: Table[];
  onTableClick: (table: Table) => void;
}

export const FloorPlan: React.FC<FloorPlanProps> = ({ tables, onTableClick }) => {
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-3xl mx-auto bg-roots-cream rounded-2xl p-8 shadow-xl">
      <div className="relative aspect-square bg-white rounded-xl p-4">
        {/* Grid background for floor plan */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-2 p-4 opacity-10">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="border border-roots-green"></div>
          ))}
        </div>
        
        {/* Window indication */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-blue-200/30 rounded-t-xl flex items-center justify-center text-xs text-gray-500">
          🪟 Garden View
        </div>
        
        {/* Tables */}
        {tables.map((table) => (
          <button
            key={table.id}
            className={`
              absolute transform -translate-x-1/2 -translate-y-1/2
              w-16 h-16 rounded-full flex items-center justify-center
              transition-all duration-300
              ${table.available !== false ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500'}
              ${hoveredTable === table.id ? 'scale-110 shadow-xl' : 'scale-100 shadow-md'}
              text-white font-bold text-sm
            `}
            style={{
              left: `${table.x}%`,
              top: `${table.y}%`,
            }}
            onClick={() => onTableClick(table)}
            onMouseEnter={() => setHoveredTable(table.id)}
            onMouseLeave={() => setHoveredTable(null)}
          >
            <div className="text-center">
              <div className="text-xs">Table</div>
              <div className="text-lg">{table.tableNumber}</div>
              <div className="text-[10px]">{table.seats} seats</div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span>Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span>Pending</span>
        </div>
      </div>
    </div>
  );
};