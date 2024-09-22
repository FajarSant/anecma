"use client"
import React, { useState, useEffect } from "react";
import { FaPlus, FaRegUser, FaMale, FaFemale } from "react-icons/fa";
import { BiSolidEdit } from "react-icons/bi";
import { CiTrash } from "react-icons/ci";
import axiosInstance from "@/libs/axios";
import AddPetugasModal from "./addpetugas"; // Import modal

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
    role: "",
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

  const handleAdd = async () => {
    if (newPetugas.name && newPetugas.email) {
      try {
        const response = await axiosInstance.post("/admin/add-petugas", newPetugas, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.data.success) {
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
        } else {
          console.error("Failed to add petugas");
        }
        setShowAddModal(false);
        setNewPetugas({
          name: "",
          email: "",
          role: "petugas",
          gender: "Laki-laki",
          puskesmas: [],
        });
      } catch (error) {
        console.error("Error adding petugas:", error);
      }
    } else {
      console.error("Please fill in all fields");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPetugas({ ...newPetugas, [name]: value });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Daftar Petugas</h1>
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
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
                    <button className="text-purple-500 mr-2" aria-label="Edit Petugas">
                      <BiSolidEdit className="text-lg" />
                    </button>
                    <button className="text-blue-500 mr-2" aria-label="View User">
                      <FaRegUser className="text-lg" />
                    </button>
                    <button className="text-red-500" aria-label="Delete Petugas">
                      <CiTrash className="text-lg" />
                    </button>
                  </td>
                  <td className={`px-4 py-2 text-green-500`}>Aktif</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal untuk tambah petugas */}
      <AddPetugasModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        newPetugas={newPetugas}
        handleChange={handleChange}
        handleAdd={handleAdd}
      />
    </div>
  );
};

export default Petugas;
