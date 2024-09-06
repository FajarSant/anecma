"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaHospitalAlt, FaUserMd, FaCog } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import Image from "next/image";
import axiosInstance from "@/libs/axios"; 

interface SidebarProps {
  setActiveMenu: (menu: string) => void;
  activeMenu: string;
}

interface User {
  name: string;
  image: string;
  role: string;
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveMenu, activeMenu }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
          setError('No token found');
          return;
        }

        const response = await axiosInstance.get<User>('/user', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error fetching user data');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
  };

  return (
    <div className="fixed top-0 left-0 bg-white w-64 h-screen flex flex-col shadow-lg border-r">
      <div className="p-4 flex items-center border-b">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <Image
              src={user?.image || "/default-image.jpg"}
              alt="User"
              width={56}
              height={56}
              className="rounded-full border border-gray-300 mr-4"
            />
            <div>
              <h2 className="text-lg font-semibold">{user?.name || "Default User"}</h2>
              <h2 className="text-lg font-semibold">{user?.role || "Default Role"}</h2>
            </div>
          </>
        )}
      </div>

      <nav className="flex-1 p-6">
        <ul>
          <li className="mb-6">
            <Link href="#">
              <span
                className={`flex items-center p-2 rounded-xl w-full text-left transition-colors ${
                  activeMenu === "dashboard"
                    ? "bg-blue-700 text-white"
                    : "hover:bg-blue-200"
                }`}
                onClick={() => handleMenuClick("dashboard")}
              >
                <LuLayoutDashboard className="text-xl mr-3" />
                <span className="text-lg">Dashboard</span>
              </span>
            </Link>
          </li>
          <li className="mb-6">
            <Link href="#">
              <span
                className={`flex items-center p-2 rounded-xl w-full text-left transition-colors ${
                  activeMenu === "dataPuskesmas"
                    ? "bg-blue-700 text-white"
                    : "hover:bg-blue-200"
                }`}
                onClick={() => handleMenuClick("dataPuskesmas")}
              >
                <FaHospitalAlt className="text-xl mr-3" />
                <span className="text-lg">Data Puskesmas</span>
              </span>
            </Link>
          </li>
          <li className="mb-6">
            <Link href="#">
              <span
                className={`flex items-center p-2 rounded-xl w-full text-left transition-colors ${
                  activeMenu === "dataPetugas"
                    ? "bg-blue-700 text-white"
                    : "hover:bg-blue-200"
                }`}
                onClick={() => handleMenuClick("dataPetugas")}
              >
                <FaUserMd className="text-xl mr-3" />
                <span className="text-lg">Data Petugas</span>
              </span>
            </Link>
          </li>
          <li>
            <Link href="#">
              <span
                className={`flex items-center p-2 rounded-xl w-full text-left transition-colors ${
                  activeMenu === "settings"
                    ? "bg-blue-700 text-white"
                    : "hover:bg-blue-200"
                }`}
                onClick={() => handleMenuClick("settings")}
              >
                <FaCog className="text-xl mr-3" />
                <span className="text-lg">Settings</span>
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
