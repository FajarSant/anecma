import React from "react";

interface AddPetugasModalProps {
  show: boolean;
  onClose: () => void;
  newPetugas: Partial<PetugasData>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAdd: () => void;
}

const AddPetugasModal: React.FC<AddPetugasModalProps> = ({
  show,
  onClose,
  newPetugas,
  handleChange,
  handleAdd,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Tambah Petugas</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Nama</label>
          <input
            type="text"
            name="name"
            value={newPetugas.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={newPetugas.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Gender</label>
          <select
            name="gender"
            value={newPetugas.gender}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
            onClick={handleAdd}
          >
            Tambah
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
            onClick={onClose}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPetugasModal;
