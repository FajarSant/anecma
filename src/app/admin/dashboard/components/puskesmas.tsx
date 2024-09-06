import React, { useState, useEffect } from "react";
import { FaRegUser, FaPlus } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { BiSolidEdit } from "react-icons/bi";
import axiosInstance from "@/libs/axios";

const Puskesmas: React.FC = () => {
  const [puskesmasData, setPuskesmasData] = useState<any[]>([]);

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

        // Check the response format and extract the data
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setPuskesmasData(response.data.data);
        } else {
          console.error("Unexpected data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching puskesmas data:", error);
      }
    };

    fetchPuskesmasData();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Puskesmas</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" />
          Tambah Puskesmas
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">
                Nama Puskesmas
              </th>
              <th className="px-4 py-2 text-left text-gray-600">Alamat</th>
              <th className="px-4 py-2 text-left text-gray-600">Email</th>
              <th className="px-4 py-2 text-left text-gray-600">Action</th>
              <th className="px-4 py-2 text-left text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {puskesmasData.map((item) => (
              <tr key={item.puskesmas_id}>
                <td className="px-4 py-2">{item.nama_puskesmas}</td>
                <td className="px-4 py-2">{item.alamat}</td>
                <td className="px-4 py-2">{item.email}</td>
                <td className="px-4 py-2">
                  <button className="text-purple-500 mr-2">
                    <BiSolidEdit className="text-lg" />
                  </button>
                  <button className="text-purple-400 mr-2">
                    <FaRegUser className="text-lg" />
                  </button>
                  <button className="text-red-500">
                    <CiTrash className="text-lg" />
                  </button>
                </td>
                <td
                  className={`px-4 py-2 ${
                    item.status === "Aktif"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
};

export default Puskesmas;
