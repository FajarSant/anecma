import React, { useState, useEffect } from "react";
import { FaPlus, FaRegUser, FaMale, FaFemale } from "react-icons/fa";
import { BiSolidEdit } from "react-icons/bi";
import { CiTrash } from "react-icons/ci";
import axiosInstance from "@/libs/axios";

interface PuskesmasData {
  id: number;
  nama_puskesmas: string;
  alamat: string;
  pivot: {
    user_id: number;
    puskesmas_id: number;
  };
}

interface PetugasData {
  id: number;
  name: string;
  email: string;
  role: string;
  gender: "Laki-laki" | "Perempuan";
  created_at: string;
  updated_at: string;
  puskesmas: PuskesmasData[];
}

const Petugas: React.FC = () => {
  const [data, setData] = useState<PetugasData[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newPetugas, setNewPetugas] = useState<Partial<PetugasData>>({
    name: "",
    email: "",
    role: "petugas",
    gender: "Laki-laki",
    puskesmas: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await axiosInstance.get("/admin/data-petugas-puskesmas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data.data)) {
          setData(response.data.data);
        } else {
          console.error("Response data is not an array:", response.data.data);
        }
      } catch (error) {
        console.error("Error fetching petugas data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAdd = () => {
    if (newPetugas.name && newPetugas.email) {
      setData([
        ...data,
        {
          ...newPetugas,
          id: data.length + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          puskesmas: newPetugas.puskesmas || [],
        } as PetugasData,
      ]);
      setShowAddModal(false);
      setNewPetugas({
        name: "",
        email: "",
        role: "petugas",
        gender: "Laki-laki",
        puskesmas: [],
      });
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewPetugas({ ...newPetugas, [name]: value });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Daftar Petugas</h1>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus className="mr-2" />
            Tambah Petugas
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">Nama</th>
                <th className="px-4 py-2 text-left text-gray-600">Email</th>
                <th className="px-4 py-2 text-left text-gray-600">Puskesmas</th>
                <th className="px-4 py-2 text-left text-gray-600">Action</th>
                <th className="px-4 py-2 text-left text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 flex items-center">
                    {item.gender === "Laki-laki" ? (
                      <FaMale className="mr-2 text-blue-500" />
                    ) : (
                      <FaFemale className="mr-2 text-pink-500" />
                    )}
                    {item.name}
                  </td>
                  <td className="px-4 py-2">{item.email}</td>
                  <td className="px-4 py-2">
                    {item.puskesmas.map((p) => (
                      <div key={p.id}>
                        {p.nama_puskesmas} - {p.alamat}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="text-purple-500 mr-2"
                      aria-label="Edit Petugas"
                    >
                      <BiSolidEdit className="text-lg" />
                    </button>
                    <button
                      className="text-blue-500 mr-2"
                      aria-label="View User"
                    >
                      <FaRegUser className="text-lg" />
                    </button>
                    <button
                      className="text-red-500"
                      aria-label="Delete Petugas"
                    >
                      <CiTrash className="text-lg" />
                    </button>
                  </td>
                  <td className={`px-4 py-2 text-green-500`}>
                    Aktif
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
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
                onClick={() => setShowAddModal(false)}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Petugas;
