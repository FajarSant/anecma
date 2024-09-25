"use client";
import { useState, useEffect } from "react";
import { FaHome } from "react-icons/fa";
import { FiBook } from "react-icons/fi";
import { IoChatbubblesOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "@/libs/axios";
import { useSession } from "next-auth/react";
import { AxiosError } from "axios"; // Ensure you have axios installed

export default function RiwayatPage() {
  const [nilaiHb, setNilaiHb] = useState<string>(""); 
  const { data: session, status } = useSession();
  const [currentDate, setCurrentDate] = useState<string>(""); 

  useEffect(() => {
    const date = new Date();
    setCurrentDate(date.toLocaleString("id-ID", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }));
  }, []);

  const handleSubmit = async () => {
    if (status === "authenticated" && session?.accessToken) {
      if (!nilaiHb) {
        toast.error("Nilai HB tidak boleh kosong.");
        return;
      }
      const numericNilaiHb = parseFloat(nilaiHb);
      if (isNaN(numericNilaiHb)) {
        toast.error("Nilai HB harus berupa angka.");
        return;
      }

      try {
        const response = await axiosInstance.post(
          "/istri/dashboard/insert-riwayat-hb",
          { nilai_hb: numericNilaiHb }, 
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}` 
            }
          }
        );
        console.log("Response:", response.data);
        toast.success("Data HB terbaru berhasil disimpan!");
        setNilaiHb(""); 
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error instanceof AxiosError && error.response) {
          toast.error(error.response.data.message || "Gagal menyimpan data HB terbaru.");
        } else {
          toast.error("Gagal menyimpan data HB terbaru.");
        }
      }
    } else {
      toast.error("Silakan login untuk menyimpan data.");
    }
  };

  return (
    <main>
      <div className="m-5 flex flex-row">
        <Toaster position="top-center" reverseOrder={false} />
        <p className="text-2xl font-bold">Riwayat HB</p>
      </div>

      <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />

      <div className="mx-5 bg-purple-light rounded-3xl mt-5 mb-72">
        <div className="w-full py-10 px-10 flex flex-col items-center gap-5">
          <div className="w-full relative">
            <input
              type="text"
              id="nilai_hb"
              value={nilaiHb}
              onChange={(e) => setNilaiHb(e.target.value)} // Update state on input change
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="nilai_hb"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-purple-light dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Nilai HB
            </label>
          </div>
          <hr className="w-full h-0.5 border-t-0 bg-gray-300" />
          <div className="flex flex-row self-end">
            <button
              type="button"
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2"
            >
              Riwayat
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="text-white bg-green-pastel hover:bg-green-pastel/80 focus:outline-none focus:ring-4 focus:ring-green-pastel/30 font-medium rounded-full text-sm px-5 py-2.5 text-center"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <FaHome className="w-5 h-5 mb-2 text-blue-600 dark:text-blue-500" />
            <span className="text-sm text-blue-600 dark:text-blue-500">Home</span>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <FiBook className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Edukasi</span>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <IoChatbubblesOutline className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Konsultasi</span>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <LuUsers className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Profil</span>
          </button>
        </div>
      </div>
    </main>
  );
}
