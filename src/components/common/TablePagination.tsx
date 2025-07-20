import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSetItemsPerPage: (itemsPerPage: number) => void;
  entriesPerPage?: number;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  entriesPerPage = 10,
  onSetItemsPerPage
}) => {

  const handleChangeItemsPerPage = (value: string) => {
    onSetItemsPerPage(Number(value));
    onPageChange(1); 
  }

  const renderPageButtons = () => {
  const pages = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-2 py-1 border rounded text-sm ${
            currentPage === i ? "bg-gray-300 text-gray-900" : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }
  } else {
    [1, 2].forEach((i) => {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-2 py-1 border rounded text-sm ${
            currentPage === i ? "bg-gray-300 text-gray-900" : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    });

    if (currentPage > 3) {
      pages.push(<span key="dots1" className="px-2 text-gray-400">...</span>);
    }

    if (currentPage > 2 && currentPage < totalPages - 1) {
      pages.push(
        <button
          key="current"
          className="px-2 py-1 border rounded text-sm bg-gray-300 text-gray-900"
          disabled
        >
          {currentPage}
        </button>
      );
    }
    if (currentPage < totalPages - 3) {
      pages.push(<span key="dots2" className="px-2 text-gray-400">...</span>);
    }

    [totalPages - 1, totalPages].forEach((i) => {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-2 py-1 border rounded text-sm ${
            currentPage === i ? "bg-gray-300 text-gray-900" : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    });
  }

  return pages;
};

  return (
    <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-end space-x-4">
      <div className="flex items-center space-x-2">
        <select
          className="border border-gray-300 rounded text-sm text-gray-700 px-2 py-1"
          value={entriesPerPage}
          onChange={(e) => handleChangeItemsPerPage(e.target.value)}
        >
          {[5, 10, 25, 50].map((option) => (
            <option key={option} value={option}>
              Show: {option} entries
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex space-x-1">
          {renderPageButtons()}
        </div>
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;