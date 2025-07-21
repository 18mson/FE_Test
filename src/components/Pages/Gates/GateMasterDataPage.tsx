import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { deleteGate, getGates } from '../../../services/api';
import { Gate } from '../../../types';
import GateModal from './GateModal';
import TablePagination from '../../common/TablePagination';
import PopupConfirmation from '../../common/PopupConfirmation';
import Button from '../../common/Button';

const GateMasterDataPage: React.FC = () => {
  const [gates, setGates] = useState<Gate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGate, setSelectedGate] = useState<Gate | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGates();
  }, [currentPage, searchTerm]);

  const fetchGates = async () => {
    setIsLoading(true);
    try {
      const { data } = await getGates({
        id: currentPage,
        NamaCabang: searchTerm,
        NamaGerbang: searchTerm
      });
      setGates(data.data.rows.rows);
      
      setTotal(data.data.count);
    } catch (error) {
      console.error('Error fetching gates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedGate(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEdit = (gate: Gate) => {
    setSelectedGate(gate);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleView = (gate: Gate) => {
    setSelectedGate(gate);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleDelete = (gate: Gate) => {
    setSelectedGate(gate);
    setConfirmationOpen(true);
  };

  const handleConfirmation = async () => {
      try {
        await deleteGate(selectedGate!.id, selectedGate!.IdCabang);
        fetchGates();
        setConfirmationOpen(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred while deleting the gate.');
      }
  };
  

  const handleModalSave = () => {
    setModalOpen(false);
    fetchGates();
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Master Data Gerbang</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1 max-w-md">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search All
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                id="search"
                className="pl-10 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Cari Gerbang ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-end">
            <Button
              variant="primary"
              onClick={handleCreate}
              className="flex items-center"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Gerbang
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Gates</h3>
        </div>
        
        {isLoading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Ruas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Gerbang
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {gates.map((gate, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {((currentPage - 1) * itemsPerPage) + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {gate.NamaCabang}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {gate.NamaGerbang}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleView(gate)}
                            className="text-gray-600 hover:text-gray-900 cursor-pointer"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(gate)}
                            className="text-blue-600 hover:text-blue-900 cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(gate)}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onSetItemsPerPage={setItemsPerPage}
              entriesPerPage={itemsPerPage}
            />
          </>
        )}
      </div>

      <GateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
        gate={selectedGate}
        mode={modalMode}
      />

      <PopupConfirmation
        isOpen={confirmationOpen}
        onConfirm={handleConfirmation}
        onCancel={() => setConfirmationOpen(false)}
        Confirmation="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus data ini?"
        confirmButtonText="Ya"
        cancelButtonText="Tidak"
        errorMessage={error}
      />
    </div>
  );
};

export default GateMasterDataPage;