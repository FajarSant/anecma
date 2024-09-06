"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/libs/axios"; 
import Sidebar from "./components/sidebar";
import Puskesmas from "./components/puskesmas";
import Petugas from "./components/petugas";
import TopBar from "./components/topbar";
import HomePage from "./components/home";

interface User {
  name: string;
  image: string;
}

const Page: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>("dashboard"); // Default ke "dashboard"
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const authToken = localStorage.getItem('authToken'); // Tetap ambil token dari localStorage

      const config = {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      };

      try {
        const response = await axiosInstance.get<User>('/user', config); 
        setUser(response.data);
      } catch (err) {
        setError('Error fetching user data');
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, []);

  const getTitle = () => {
    switch (activeMenu) {
      case "dashboard":
        return "Data Ibu Hamil";
      case "dataPuskesmas":
        return "Data Puskesmas";
      case "dataPetugas":
        return "Data Petugas";
      case "settings":
        return "Settings";
      default:
        return "Default Content";
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <HomePage />;
      case "dataPuskesmas":
        return <Puskesmas />;
      case "dataPetugas":
        return <Petugas />;
      case "settings":
        return <h1 className="text-3xl font-bold">Settings Content</h1>;
      default:
        return <h1 className="text-3xl font-bold">Default Content</h1>;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar setActiveMenu={setActiveMenu} activeMenu={activeMenu} />
      <div className="flex-1 flex flex-col ml-64 bg-gray-100">
        {/* TopBar untuk menampilkan judul halaman dan informasi user */}
        <TopBar
          title={getTitle()}
          userName={user?.name || "Default User"}
          userImage={user?.image || ""}
        />
        <div className="p-6">
          {/* Render konten berdasarkan activeMenu */}
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
