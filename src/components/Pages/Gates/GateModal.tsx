import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createGate, updateGate } from '../../../services/api';
import { Gate } from '../../../types';

interface GateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  gate: Gate | null;
  mode: 'create' | 'edit' | 'view';
}

const GateModal: React.FC<GateModalProps> = ({ isOpen, onClose, onSave, gate, mode }) => {
  const [formData, setFormData] = useState({
    id: '',
    IdCabang: '',
    NamaGerbang: '',
    NamaCabang: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (gate) {
        setFormData({
          id: gate.id.toString(),
          IdCabang: gate.IdCabang.toString(),
          NamaGerbang: gate.NamaGerbang,
          NamaCabang: gate.NamaCabang,
        });
      } else {
        setFormData({
          id: '',
          IdCabang: '',
          NamaGerbang: '',
          NamaCabang: '',
        });
      }
      setError('');
    }
  }, [isOpen, gate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'create') {
        await createGate(formData);
      } else if (mode === 'edit' && gate) {
        await updateGate(gate.id, formData);
      }
      onSave();
    } catch (error) {
      setError('An error occurred while saving the gate');
      console.error('Error saving gate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {mode === 'create' ? 'Tambah Gerbang' : mode === 'edit' ? 'Edit Gerbang' : 'Gerbang Detail'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
                ID *
              </label>
              <input
                type="text"
                id="id"
                required
                disabled={mode === 'view'}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="IdGerbang" className="block text-sm font-medium text-gray-700 mb-2">
                ID Gerbang *
              </label>
              <input
                type="text"
                id="IdGerbang"
                required
                disabled={mode === 'view'}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                value={formData.IdCabang}
                onChange={(e) => setFormData({ ...formData, IdCabang: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="NamaCabang" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Cabang *
              </label>
              <input
                type="text"
                id="NamaCabang"
                required
                disabled={mode === 'view'}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                value={formData.NamaCabang}
                onChange={(e) => setFormData({ ...formData, NamaCabang: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="NamaGerbang" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Gerbang *
              </label>
              <input
                type="text"
                id="NamaGerbang"
                required
                disabled={mode === 'view'}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                value={formData.NamaGerbang}
                onChange={(e) => setFormData({ ...formData, NamaGerbang: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              {mode === 'view' ? 'Close' : 'Cancel'}
            </button>
            {mode !== 'view' && (
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? 'Saving...' : mode === 'create' ? 'Create Gate' : 'Update Gate'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default GateModal;