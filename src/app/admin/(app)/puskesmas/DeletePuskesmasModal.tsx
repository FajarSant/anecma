import React from 'react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  puskesmasName: string; // Menambahkan prop untuk nama Puskesmas
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, puskesmasName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Konfirmasi Penghapusan</h2>
        <p>Apakah Anda yakin ingin menghapus Puskesmas <strong>{puskesmasName}</strong>?</p>
        <div className="flex justify-end mt-4">
          <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={onConfirm}>
            Ya, Hapus
          </button>
          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded" onClick={onClose}>
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
