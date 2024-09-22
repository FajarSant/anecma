"use client";
import React, { useState, useEffect } from "react";
import { FaRegUser, FaPlus } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { BiSolidEdit } from "react-icons/bi";
import axiosInstance from "@/libs/axios";
import AddPuskesmasModal from './AddPuskesmasModal';
import DeleteConfirmationModal from './DeletePuskesmasModal';
import EditPuskesmasModal from './EditPuskesmasModal';
import ShowPuskesmasModal from './ShowPuskesmasModal'; // Modal untuk menampilkan detail Puskesmas
import Swal from 'sweetalert2';

interface PuskesmasItem {
  id: number;
  nama_puskesmas: string;
  alamat: string;
  email: string;
  status: string;
}

const Puskesmas: React.FC = () => {
  const [puskesmasData, setPuskesmasData] = useState<PuskesmasItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPuskesmasName, setSelectedPuskesmasName] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPuskesmasData, setEditPuskesmasData] = useState<PuskesmasItem | null>(null);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [showPuskesmasData, setShowPuskesmasData] = useState<PuskesmasItem | null>(null);

  useEffect(() => {
    const fetchPuskesmasData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axiosInstance.get("/admin/data-puskesmas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setPuskesmasData(response.data.data);
        } else {
          console.error("Unexpected data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching puskesmas data:", error);
        setError("Gagal memuat data Puskesmas. Silakan coba lagi nanti.");
      }
    };

    fetchPuskesmasData();
  }, []);

  const handleAdd = async (data: PuskesmasItem) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found");
      }
  
      const response = await axiosInstance.post("/admin/data-puskesmas/insert", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data && response.data.success) {
        setPuskesmasData((prev) => [...prev, response.data.data]);
        setIsAddModalOpen(false); 
  
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Puskesmas berhasil ditambahkan!',
        });
      }
    } catch (error) {
      console.error("Error adding puskesmas:", error);
      setError("Gagal menambahkan Puskesmas. Silakan coba lagi.");
    }
  };

  const handleDelete = (id: number, nama: string) => {
    setDeletingId(id);
    setSelectedPuskesmasName(nama);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No token found");
        }
  
        const response = await axiosInstance.post(`/admin/data-puskesmas/delete/${deletingId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.data && response.data.success) {
          setPuskesmasData((prev) => prev.filter(item => item.id !== deletingId));
          setDeletingId(null); 
  
          Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Puskesmas berhasil dihapus!',
          });
        }
      } catch (error) {
        console.error("Error deleting puskesmas:", error);
        setError("Gagal menghapus Puskesmas. Silakan coba lagi.");
      } finally {
        setIsDeleteModalOpen(false);
      }
    }
  };

  const handleEdit = async (data: PuskesmasItem) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found");
      }
  
      const response = await axiosInstance.post(`/admin/data-puskesmas/update/${data.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data && response.data.success) {
        setPuskesmasData((prev) =>
          prev.map((item) => (item.id === data.id ? { ...item, ...data } : item))
        );
        setIsEditModalOpen(false); 
  
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Puskesmas berhasil diedit!',
        });
      }
    } catch (error) {
      console.error("Error editing puskesmas:", error);
      setError("Gagal mengedit Puskesmas. Silakan coba lagi.");
    }
  };

  const openEditModal = (item: PuskesmasItem) => {
    setEditPuskesmasData(item);
    setIsEditModalOpen(true);
  };

  const openShowModal = async (id: number) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axiosInstance.get(`/admin/data-puskesmas/show/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.success) {
        setShowPuskesmasData(response.data.data);
        setIsShowModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching puskesmas details:", error);
      setError("Gagal memuat detail Puskesmas. Silakan coba lagi.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Daftar Puskesmas</h1>
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FaPlus className="mr-2" />
            Tambah Puskesmas
          </button>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">Nama Puskesmas</th>
                <th className="px-4 py-2 text-left text-gray-600">Alamat</th>
                <th className="px-4 py-2 text-left text-gray-600">Email</th>
                <th className="px-4 py-2 text-left text-gray-600">Action</th>
                <th className="px-4 py-2 text-left text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {puskesmasData.length > 0 ? (
                puskesmasData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2">{item.nama_puskesmas}</td>
                    <td className="px-4 py-2">{item.alamat}</td>
                    <td className="px-4 py-2">{item.email}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-purple-500 mr-2"
                        onClick={() => openEditModal(item)}
                      >
                        <BiSolidEdit className="text-lg" />
                      </button>
                      <button
                        className="text-purple-500 mr-2"
                        onClick={() => openShowModal(item.id)} // Menambahkan action untuk Show
                      >
                        <FaRegUser className="text-lg" />
                      </button>
                      <button
                        className="text-red-500"
                        onClick={() => handleDelete(item.id, item.nama_puskesmas)}
                      >
                        <CiTrash className="text-lg" />
                      </button>
                    </td>
                    <td className={`px-4 py-2 ${item.status === "Aktif" ? "text-green-500" : "text-red-500"}`}>
                      {item.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-2 text-center" colSpan={5}>
                    Tidak ada data yang tersedia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AddPuskesmasModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAdd}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        puskesmasName={selectedPuskesmasName}
      />
      <EditPuskesmasModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEdit}
        puskesmasData={editPuskesmasData}
      />
      <ShowPuskesmasModal
        isOpen={isShowModalOpen}
        onClose={() => setIsShowModalOpen(false)}
        puskesmasData={showPuskesmasData}
      />
    </div>
  );
};

export default Puskesmas;
