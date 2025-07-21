import React from 'react';
import { Search, Calendar } from 'lucide-react';

interface FilterSectionProps {
  searchTerm: string;
  selectedDate: string;
  onSearchChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onFilter: () => void;
  onReset: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  searchTerm,
  selectedDate,
  onSearchChange,
  onDateChange,
  onFilter,
  onReset
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center space-x-4 mb-4">
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              className="pl-10 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="date"
              className="pl-10 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Dari Tanggal"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onFilter}
          className="px-4 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors duration-200"
        >
          Filter
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors duration-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterSection;