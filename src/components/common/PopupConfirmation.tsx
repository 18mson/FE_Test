import React from 'react';
import Button from './Button';

interface PopupConfirmationProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  Confirmation?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  errorMessage?: string | null;
}

const PopupConfirmation: React.FC<PopupConfirmationProps> = ({ 
    isOpen, 
    onConfirm, 
    onCancel, 
    Confirmation = 'Konfirmasi Hapus',
    message = 'Apakah Anda yakin ingin menghapus data ini?', 
    confirmButtonText = 'Ya',
    cancelButtonText = 'Tidak',
    errorMessage = '',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-white p-6 rounded shadow-md text-center">
        <h2 className="text-lg font-semibold mb-4">{Confirmation}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-center">
          <Button
            variant="primary"
            className="mr-2"
            onClick={onCancel}
          >
            {cancelButtonText}
          </Button>
          <Button
            variant="secondary"
            onClick={onConfirm}
          >
            {confirmButtonText}
          </Button>
        </div>
        {errorMessage && <p className="text-red-500 mt-4 text-sm">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default PopupConfirmation;

