"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaRegBell, FaCircle } from "react-icons/fa6";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axiosInstance from "@/libs/axios";

// Extend the Session type to include accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}


// Define the userData interface
interface UserData {
  name: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
console.log("session", session);
  useEffect(() => {
    async function fetchUserData() {
      if (status === "authenticated" && session?.accessToken) {
        try {
          const response = await axiosInstance.get("/istri/get-user", {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });
          setUserData(response.data.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to load user data.");
        } finally {
          setLoading(false);
        }
      } else if (status === "unauthenticated") {
        setError("You need to be logged in.");
        setLoading(false);
      }
    }

    fetchUserData();
  }, [session, status]);


  return (
    <main>
      {/* Header */}
      <div className="m-5">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col space-y-1">
            <p className="text-xl font-bold">Hi, Good morning</p>
            {userData && <p className="text-xl font-bold">{userData.name}!</p>}
          </div>
          <div>
            <FaRegBell className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="m-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
        <div className="flex flex-row m-5 justify-between items-center">
          <div className="flex flex-col space-y-2">
            <p className="text-lg font-bold">Status Anemia</p>
            <div className="flex flex-row space-x-2 items-center">
              <p className="text-green-pastel">Rendah</p>
              <FaCircle className="w-1 h-1" />
              <p>HB: 13</p>
            </div>
            <button
              type="button"
              className="text-white bg-blue-light hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => alert("Reminder to drink TTD!")}
            >
              Ingatkan Minum TTD
            </button>
          </div>
          <div>
            <Image
              src="/images/blood-pressure.png"
              alt="Blood Pressure Image"
              width={90}
              height={90}
            />
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <div className="grid grid-cols-2 mx-5 mb-20 gap-5">
        <Link href="/istri/dashboard/kalkulator-anemia">
          <div className="flex flex-row items-end max-w-sm min-h-28 p-4 bg-blue-light border border-gray-200 rounded-lg shadow hover:bg-blue-light/90">
            <p className="text-white font-bold">Kalkulator Anemia</p>
          </div>
        </Link>
        <Link href="/istri/dashboard/jurnal-makan">
          <div className="flex flex-row items-end max-w-sm min-h-28 p-4 bg-green-pastel border border-gray-200 rounded-lg shadow hover:bg-green-pastel/90">
            <p className="text-white font-bold">Jurnal Makan</p>
          </div>
        </Link>
        <Link href="/istri/dashboard/reminder-ttd">
          <div className="flex flex-row items-end max-w-sm min-h-28 p-4 bg-blue-white border border-gray-200 rounded-lg shadow hover:bg-green-pastel/90">
            <p className="text-white font-bold">Reminder TTD</p>
          </div>
        </Link>
        <Link href="/istri/dashboard/konsumsi-ttd">
          <div className="flex flex-row items-end max-w-sm min-h-28 p-4 bg-gray-white border border-gray-200 rounded-lg shadow hover:bg-green-pastel/90">
            <p className="text-white font-bold">Konsumsi TTD</p>
          </div>
        </Link>
        <Link href="/istri/dashboard/riwayat">
          <div className="flex flex-row items-end max-w-sm min-h-28 p-4 bg-blue-sky border border-gray-200 rounded-lg shadow hover:bg-green-pastel/90">
            <p className="text-white font-bold">Riwayat HB</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
