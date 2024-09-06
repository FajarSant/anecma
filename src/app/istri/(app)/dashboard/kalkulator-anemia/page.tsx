"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaPlus } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FiBook } from "react-icons/fi";
import { IoChatbubblesOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { useSession } from "next-auth/react";
import axiosInstance from '@/libs/axios';
import axios from 'axios';

const anemiaOptions = [
  { value: "0", label: "Tidak Punya" },
  { value: "1", label: "Punya" },
];

export default function KalkulatorAnemiaPage() {
  const [formData, setFormData] = useState({
    usia_kehamilan: "",
    jumlah_anak: "",
    jumlah_konsumsi_ttd_terakhir: "",
    hasil_pemeriksaan_hb_terakhir: "",
    riwayat_anemia: "0" // Default to "Tidak Punya"
  });

  const [userId, setUserId] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      if (status === "authenticated" && session?.accessToken) {
        console.log("Access Token:", session.accessToken); 

        try {
          const response = await axiosInstance.get("/istri/get-user", {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });

          // console.log("Full API Response:", response); 
          // console.log("Response Data:", response.data); 

          if (response.data && response.data.data && response.data.data.id) {
            console.log("User ID:", response.data.data.id); 
            setUserId(response.data.data.id.toString()); 
          } else {
            console.error("User object or user ID is undefined in response data", response.data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    }
    fetchUserData();
  }, [session, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      console.error("User ID is not available");
      return;
    }
  
    if (!session?.accessToken) {
      console.error("Access Token is not available");
      return;
    }
  
    // Gabungkan data menjadi satu objek
    const dataToSend = {
      user_id: userId,
      usia_kehamilan: formData.usia_kehamilan,
      jumlah_anak: formData.jumlah_anak,
      riwayat_anemia: formData.riwayat_anemia,
      konsumsi_ttd_7hari: formData.jumlah_konsumsi_ttd_terakhir,
      hasil_hb: formData.hasil_pemeriksaan_hb_terakhir,
      resiko: formData.riwayat_anemia,
    };
  
    console.log("Data to send:", dataToSend);
  
    try {
      const response = await axiosInstance.post('/istri/dashboard/kalkulator-anemia', dataToSend, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
  
      console.log("Response Data:", response.data);
      localStorage.setItem('formData', JSON.stringify(dataToSend));
      router.push('/istri/dashboard/kalkulator-anemia/hasil');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error submitting data:", error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error("Error submitting data:", error.message);
      } else {
        console.error("An unknown error occurred.");
      }
    }
  };
  
  return (
    <main>
      <div className="m-5 flex flex-row">
        <p className="text-2xl font-bold">Kalkulator Anemia</p>
      </div>

      <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />

      <div className="mx-5">
        <form className="flex flex-col gap-4">
          {Object.entries(formData).map(([id, value]) => (
            id === "riwayat_anemia" ? (
              <div key={id} className="relative my-2.5">
                <select
                  id={id}
                  value={value}
                  onChange={handleChange}
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                >
                  {anemiaOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <label
                  htmlFor={id}
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  {id.replace(/_/g, " ").toUpperCase()}
                </label>
              </div>
            ) : (
              <div key={id} className="relative my-2.5">
                <input
                  type="text"
                  id={id}
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={value}
                  onChange={handleChange}
                />
                <label
                  htmlFor={id}
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  {id.replace(/_/g, " ").toUpperCase()}
                </label>
              </div>
            )
          ))}
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="text-white bg-green-pastel hover:bg-green-pastel/90 focus:ring-4 focus:outline-none focus:ring-green-pastel/35 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2"
            >
              <FaPlus />
              Hitung Resiko
            </button>
          </div>
        </form>
      </div>

      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <FaHome className="w-5 h-5 mb-2 text-blue-600 dark:text-blue-500" />
            <span className="text-sm text-blue-600 dark:text-blue-500">
              Home
            </span>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <FiBook className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              Edukasi
            </span>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <IoChatbubblesOutline className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              Konsultasi
            </span>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <LuUsers className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              Profil
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
