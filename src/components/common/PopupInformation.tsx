import React from 'react';
import Button from './Button';

interface PopupInformationProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string | null;
  buttonText?: string;
}

const PopupInformation: React.FC<PopupInformationProps> = ({
  isOpen,
  onClose,
  title = 'Informasi',
  message = '',
  buttonText = 'Tutup',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 backdrop-blur-xs" onClick={onClose}>
      <div className="bg-white p-6 rounded shadow-md text-center">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-center">
          <Button variant="primary" onClick={onClose}>
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopupInformation;

