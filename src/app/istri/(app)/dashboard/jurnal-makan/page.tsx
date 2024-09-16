"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axiosInstance from "@/libs/axios";

// Opsi waktu makan
const mealOptions = [
  { name: "sarapan", label: "Sarapan", jam_makan: "sarapan" },
  { name: "makan_siang", label: "Makan Siang", jam_makan: "makan_siang" },
  { name: "makan_malam", label: "Makan Malam", jam_makan: "makan_malam" },
];

// Opsi porsi
const portionSizes = {
  default: [
    { value: "0.5", label: "0.5 Porsi" },
    { value: "1", label: "1 Porsi" },
    { value: "1.5", label: "1.5 Porsi" },
    { value: "2", label: "2 Porsi" },
  ],
  karbohidrat: [
    { value: "0.5", label: "0.5 Porsi" },
    { value: "1", label: "1 Porsi" },
    { value: "1.5", label: "1.5 Porsi" },
    { value: "2", label: "2 Porsi" },
  ],
  lauk_hewani: [
    { value: "0.5", label: "0.5 Porsi" },
    { value: "1", label: "1 Porsi" },
    { value: "1.5", label: "1.5 Porsi" },
    { value: "2", label: "2 Porsi" },
    { value: "2.5", label: "2.5 Porsi" },
    { value: "3", label: "3 Porsi" },
    { value: "3.5", label: "3.5 Porsi" },
    { value: "4", label: "4 Porsi" },
  ],
  lauk_nabati: [
    { value: "0.5", label: "0.5 Porsi" },
    { value: "1", label: "1 Porsi" },
    { value: "1.5", label: "1.5 Porsi" },
    { value: "2", label: "2 Porsi" },
  ],
  sayur: [
    { value: "0.5", label: "0.5 Porsi" },
    { value: "1", label: "1 Porsi" },
    { value: "1.5", label: "1.5 Porsi" },
    { value: "2", label: "2 Porsi" },
  ],
  buah: [
    { value: "0.5", label: "0.5 Porsi" },
    { value: "1", label: "1 Porsi" },
    { value: "1.5", label: "1.5 Porsi" },
    { value: "2", label: "2 Porsi" },
  ],
};

// Gambar kategori makanan
const mealCategories = {
  karbohidrat: [
    {
      src: "/images/nasi-1-piring.jpg",
      alt: "Nasi 1 Piring",
      title: "Nasi",
      description: "1 Piring Kecil",
    },
  ],
  lauk_hewani: [
    {
      src: "/images/ikan-lele.jpg",
      alt: "Ikan-Lele",
      title: "Ikan Lele",
      description: "1/3 sedang ikan Lele",
    },
  ],
  lauk_nabati: [
    {
      src: "/images/tahu.jpg",
      alt: "Tahu",
      title: "Tahu",
      description: "2 Potong Sedang",
    },
  ],
  sayur: [
    {
      src: "/images/5-sendok-makan.jpg",
      alt: "Sayur",
      title: "Sayur",
      description: "5 Sendok Makan",
    },
  ],
  buah: [
    {
      src: "/images/semangka.jpg",
      alt: "Semangka",
      title: "Semangka",
      description: "2 Potong Sedang Semangka",
    },
  ],
};

// Konversi data porsi API ke dalam format yang sesuai dengan opsi porsi
const mapPortionValue = (value: number) => {
  if (value === 0.5) return "0.5";
  if (value === 1) return "1";
  if (value === 1.5) return "1.5";
  if (value === 2) return "2";
  if (value === 2.5) return "2.5";
  if (value === 3) return "3";
  if (value === 3.5) return "3.5";
  if (value === 4) return "4";
  return "";
};

const FoodLogForm = () => {
  const [selectedTab, setSelectedTab] = useState<string>("sarapan");
  const [jurnalMakanData, setJurnalMakanData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPortions, setSelectedPortions] = useState<
    Record<string, string>
  >({});
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchJurnalMakanData() {
      if (status === "authenticated" && session?.accessToken) {
        try {
          const response = await axiosInstance.get(
            "/istri/dashboard/get-jurnal-makan",
            {
              headers: { Authorization: `Bearer ${session.accessToken}` },
            }
          );
          const fetchedData = response.data.data; // Assuming the data you're interested in is in `data`
          setJurnalMakanData(fetchedData);

          // Set initial selected portions based on fetched data
          const initialPortions = Object.keys(mealCategories).reduce(
            (acc, category) => {
              const apiKey = `${selectedTab}_${category}`.replace(/-/g, "_");
              acc[category] = mapPortionValue(fetchedData[apiKey] || 0);
              return acc;
            },
            {} as Record<string, string>
          );
          setSelectedPortions(initialPortions);
        } catch (error) {
          console.error("Error fetching Jurnal Makan data:", error);
          setError("Failed to load Jurnal Makan data.");
        } finally {
          setLoading(false);
        }
      } else if (status === "unauthenticated") {
        setError("You need to be logged in.");
        setLoading(false);
      }
    }

    fetchJurnalMakanData();
  }, [session, status, selectedTab]);

  const getCheckedValue = (category: string) => {
    return selectedPortions[category] || "";
  };

  const handleRadioChange = (category: string, value: string) => {
    setSelectedPortions((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSave = async () => {
    if (status === "authenticated" && session?.accessToken) {
      try {
        const currentMealOption = mealOptions.find(option => option.name === selectedTab);
        const jamMakan = currentMealOption?.jam_makan;
  
        // Gunakan string untuk semua nilai
        const formattedData = Object.keys(selectedPortions).reduce((acc, category) => {
          acc[`${jamMakan}_${category}`] = selectedPortions[category] || ""; // Tetap string
          return acc;
        }, {} as Record<string, string>); // Ubah tipe di sini
  
        // Tambahkan jam_makan ke dalam data yang akan dikirim
        formattedData.jam_makan = jamMakan || "";
  
        // Hitung total kalori jika diperlukan
        const totalKalori = Object.values(selectedPortions)
          .reduce((sum, value) => sum + parseFloat(value || "0"), 0);
  
        // Tambahkan total kalori ke dalam data yang akan dikirim
        formattedData.total_kalori = totalKalori.toString(); // Ubah total kalori menjadi string
  
        // Tambahkan console.log untuk melihat data yang akan dikirim
        console.log("Data yang akan dikirim ke API:", formattedData);
  
        await axiosInstance.post(
          "/istri/dashboard/jurnal-makan",
          formattedData, // Kirim data porsi terpilih ke server
          {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          }
        );
        alert("Data berhasil disimpan!");
      } catch (error) {
        console.error("Error saving data:", error);
        alert("Gagal menyimpan data.");
      }
    } else {
      alert("Anda harus masuk untuk menyimpan data.");
    }
  };
  
  const categories = Object.keys(mealCategories) as Array<
    keyof typeof mealCategories
  >;

  if (error) return <div>{error}</div>;

  return (
    <div className="">
      <div className="m-5 flex flex-row">
        <p className="text-2xl font-bold">Jurnal Makan</p>
      </div>

      <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />
      <div className="tabs flex mx-5 justify-between">
        {mealOptions.map((tab) => (
          <button
            key={tab.name}
            className={`tab tab-lg tab-bordered tab-lifted w-full ${
              selectedTab === tab.name
                ? "text-blue-500 border-b-2 border-blue-500"
                : ""
            }`}
            onClick={() => setSelectedTab(tab.name)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-8 mx-5">
        <div className="flex flex-col gap-5 pb-20">
          {categories.map((category) => (
            <div key={category} className="mb-5">
              <h2 className="text-center text-xl mb-2">
                Berapa porsi {category.replace(/([A-Z])/g, " $1").toLowerCase()}{" "}
                yang Anda konsumsi saat {selectedTab}?
              </h2>
              <div className="flex overflow-x-auto gap-5 py-2.5">
                {mealCategories[category].map((image, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-white w-40 p-5 rounded-2xl flex-shrink-0"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={100}
                      height={100}
                      className="w-32 h-32 rounded-3xl"
                    />
                    <p className="mt-2 text-center">{image.title}</p>
                    <p className="text-center text-sm text-gray-500">
                      {image.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="my-2.5">
                <form action="" className="flex flex-col gap-2.5">
                  {portionSizes[category]?.map((size, index) => (
                    <div key={index} className="flex items-center mb-4">
                      <label
                        htmlFor={`porsi-${size.value}`}
                        className="w-full flex flex-row justify-between ms-2 text-xl font-medium text-black"
                      >
                        <p>
                          <span className="mr-2.5">
                            ({String.fromCharCode(65 + index)})
                          </span>{" "}
                          {size.label}
                        </p>
                        <input
                          type="radio"
                          id={`porsi-${size.value}`}
                          name={`${selectedTab}-radio-${category}`}
                          value={size.value}
                          className="w-7 h-7 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          checked={getCheckedValue(category) === size.value}
                          onChange={() =>
                            handleRadioChange(category, size.value)
                          }
                        />
                      </label>
                    </div>
                  ))}
                </form>
              </div>
            </div>
          ))}
          <div className="flex justify-end mt-5">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodLogForm;
