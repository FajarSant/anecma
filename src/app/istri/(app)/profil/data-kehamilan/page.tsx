"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axiosInstance from "@/libs/axios";
import { FaRegEdit } from "react-icons/fa";

interface UserData {
  hari_pertama_haid: string;
  tempat_tinggal_ktp: string;
  tempat_tinggal_domisili: string;
  pendidikan_terakhir: string;
  pekerjaan: string;
}

export default function ProfilPage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editableData, setEditableData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      if (status === "authenticated" && session?.accessToken) {
        try {
          const response = await axiosInstance.get("/istri/get-user", {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });
          setUserData(response.data.data);
          setEditableData(response.data.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to load user data.");
        }
      } else if (status === "unauthenticated") {
        setError("You need to be logged in.");
      }
    }

    fetchUserData();
  }, [session, status]);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSave = async () => {
    if (status === "authenticated" && session?.accessToken) {
      setSaving(true);
      try {
        await axiosInstance.post(
          "/istri/profil/update-data-kehamilan",
          editableData,
          {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          }
        );
        setUserData(editableData);
        setIsEditing(false);
        setError(null);
      } catch (error) {
        console.error("Error updating user data:", error);
        setError("Failed to update user data.");
      } finally {
        setSaving(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditableData((prev) => ({
      ...prev!,
      [id]: value,
    }));
  };

  return (
    <main>
      <div className="m-5 flex flex-row">
        <p className="text-2xl font-bold">Halaman Profil</p>
      </div>

      <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />

      <div className="mx-5">
        <p className="text-xl font-semibold">Data Kehamilan</p>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <form className="flex flex-col gap-2.5">
            <div className="relative my-2.5">
              <input
                type="text"
                id="hari_pertama_haid"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white-background text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={
                  isEditing
                    ? editableData?.hari_pertama_haid || ""
                    : userData?.hari_pertama_haid || ""
                }
                onChange={handleChange}
                disabled={!isEditing}
              />
              <label
                htmlFor="hari_pertama_haid"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Hari Pertama Haid
              </label>
            </div>
            <div className="relative my-2.5">
              <input
                type="text"
                id="tempat_tinggal_ktp"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white-background text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={
                  isEditing
                    ? editableData?.tempat_tinggal_ktp || ""
                    : userData?.tempat_tinggal_ktp || ""
                }
                onChange={handleChange}
                disabled={!isEditing}
              />
              <label
                htmlFor="tempat_tinggal_ktp"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Tempat Tinggal KTP
              </label>
            </div>
            <div className="relative my-2.5">
              <input
                type="text"
                id="tempat_tinggal_domisili"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white-background text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={
                  isEditing
                    ? editableData?.tempat_tinggal_domisili || ""
                    : userData?.tempat_tinggal_domisili || ""
                }
                onChange={handleChange}
                disabled={!isEditing}
              />
              <label
                htmlFor="tempat_tinggal_domisili"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Tempat Tinggal Domisili
              </label>
            </div>
            <div className="relative my-2.5">
              <input
                type="text"
                id="pendidikan_terakhir"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white-background text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={
                  isEditing
                    ? editableData?.pendidikan_terakhir || ""
                    : userData?.pendidikan_terakhir || ""
                }
                onChange={handleChange}
                disabled={!isEditing}
              />
              <label
                htmlFor="pendidikan_terakhir"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Pendidikan Terakhir
              </label>
            </div>
            <div className="relative my-2.5 mb-6">
              <input
                type="text"
                id="pekerjaan"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-white-background text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={
                  isEditing
                    ? editableData?.pekerjaan || ""
                    : userData?.pekerjaan || ""
                }
                onChange={handleChange}
                disabled={!isEditing}
              />
              <label
                htmlFor="pekerjaan"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Pekerjaan
              </label>
            </div>
            {isEditing ? (
              <button
                type="button"
                onClick={handleSave}
                className="max-w-fit self-center text-white bg-green-500 hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <FaRegEdit />
                    Simpan
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEditToggle}
                className="max-w-fit self-center text-white bg-blue-500 hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2"
              >
                <FaRegEdit />
                Edit
              </button>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
