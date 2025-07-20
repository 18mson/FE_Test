import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getTrafficData } from '../../../services/api';
import { TrafficData } from '../../../types';
import FilterSection from './FilterSection';
import TrafficReportTable from './TrafficTable';
import TablePagination from '../../common/TablePagination';
import ExportButton from './ExportButton';

const DailyTrafficReportPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('keseluruhan');

  useEffect(() => {
    fetchTrafficData();
  }, [currentPage, selectedDate, searchTerm, itemsPerPage, currentPage]);

  const fetchTrafficData = async () => {
    setIsLoading(true);
    try {
      const { data } = await getTrafficData({
        tanggal: selectedDate,
        search: searchTerm,
        page: currentPage,
        limit: itemsPerPage,
      });
      setTrafficData(data.data.rows.rows);
      setTotal(data.data.rows.count);

    } catch (error) {
      console.error('Error fetching traffic data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchTrafficData();
  };

  const handleReset = () => {
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
    setSearchTerm('');
    setCurrentPage(1);
    setActiveFilter('keseluruhan');
  };

  const handleFilterClick = (filterType: string) => {
    setActiveFilter(filterType);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / itemsPerPage);
  console.log(totalPages);

  const renderButtonHeader = (label: string, filterType: string) => (
    <button
      onClick={() => handleFilterClick(filterType)}
      className={`px-4 py-3 text-center border-r border-gray-200 transition-colors duration-200 hover:bg-blue-100 ${
        activeFilter === filterType ? 'bg-blue-200 border-2 border-blue-500' : 'bg-blue-50'
      }`}
    >
      <div className="text-xs text-gray-600 mb-1">{label}</div>
    </button>
  );

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Laporan Lalin Per Hari</h1>
        <ExportButton 
          data={trafficData}
          activeFilter={activeFilter}
          selectedDate={selectedDate}
        />
      </div>

      {/* Filters */}
      <FilterSection
        searchTerm={searchTerm}
        selectedDate={selectedDate}
        onSearchChange={setSearchTerm}
        onDateChange={setSelectedDate}
        onFilter={handleFilter}
        onReset={handleReset}
      />

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="grid grid-cols-6 gap-0 border-b border-gray-200">
          {renderButtonHeader('Total Tunai', 'tunai')}
          {renderButtonHeader('Total E-Toll', 'etoll')}
          {renderButtonHeader('Total Flo', 'flo')}
          {renderButtonHeader('Total KTP', 'ktp')}
          {renderButtonHeader('Total Keseluruhan', 'keseluruhan')}
          {renderButtonHeader('E-Toll+Tunai+Flo', 'etoll-tunai-flo')}
        </div>
        
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <span className="text-sm text-gray-600">Export</span>
        </div>
        
        <TrafficReportTable
          data={trafficData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          activeFilter={activeFilter}
          isLoading={isLoading}
        />

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onSetItemsPerPage={setItemsPerPage}
          entriesPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default DailyTrafficReportPage;