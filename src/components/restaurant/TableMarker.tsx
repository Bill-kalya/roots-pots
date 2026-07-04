import React, { useState } from 'react';
import { Table } from '../../types';

interface TableMarkerProps {
  table: Table;
  isSelected?: boolean;
  onSelect?: (table: Table) => void;
  onHover?: (table: Table | null) => void;
}

export const TableMarker: React.FC<TableMarkerProps> = ({
  table,
  isSelected = false,
  onSelect,
  onHover
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = () => {
    if (!table.available) return 'bg-red-500';
    if (isSelected) return 'bg-roots-gold';
    if (isHovered) return 'bg-roots-green/80';
    return 'bg-roots-green';
  };

  const getStatusText = () => {
    if (!table.available) return 'Reserved';
    if (isSelected) return 'Selected';
    return `${table.seats} seats`;
  };

  return (
    <div 
      className={`
        absolute transform -translate-x-1/2 -translate-y-1/2
        transition-all duration-300 cursor-pointer
        ${isHovered || isSelected ? 'scale-110 z-10' : 'scale-100'}
      `}
      style={{
        left: `${table.x}%`,
        top: `${table.y}%`,
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover?.(table);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHover?.(null);
      }}
      onClick={() => onSelect?.(table)}
    >
      <div className={`
        w-16 h-16 rounded-full flex flex-col items-center justify-center
        shadow-lg transition-all duration-300
        ${getStatusColor()}
        ${!table.available ? 'cursor-not-allowed opacity-60' : 'hover:shadow-xl'}
        text-white font-medium
      `}>
        <span className="text-xs font-normal">Table</span>
        <span className="text-lg font-bold leading-none">{table.tableNumber}</span>
        <span className="text-[10px] font-normal opacity-90">{getStatusText()}</span>
      </div>

      {/* Tooltip on hover */}
      {isHovered && table.available && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 
                        bg-gray-800 text-white text-xs px-3 py-1 rounded-lg 
                        whitespace-nowrap pointer-events-none">
          {table.zone} • {table.seats} seats
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
                          border-4 border-transparent border-t-gray-800" />
        </div>
      )}
    </div>
  );
};