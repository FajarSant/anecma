"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axiosInstance from "@/libs/axios";

// Opsi waktu makan
const mealOptions = [
  { name: "sarapan", label: "Sarapan" },
  { name: "makan_siang", label: "Makan Siang" },
  { name: "makan_malam", label: "Makan Malam" },
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
    { src: "/images/nasi-1-piring.jpg", alt: "Nasi 1 Piring", title: "Nasi", description: "1 Piring Kecil" },
  ],
  lauk_hewani: [
    { src: "/images/ikan-lele.jpg", alt: "Ikan-Lele", title: "Ikan Lele", description: "1/3 sedang ikan Lele " },
  ],
  lauk_nabati: [
    { src: "/images/tahu.jpg", alt: "Tahu", title: "Tahu", description: "2 Potong Sedang" },
  ],
  sayur: [
    { src: "/images/5-sendok-makan.jpg", alt: "Sayur", title: "Sayur", description: "5 Sendok Makan" },
  ],
  buah: [
    { src: "/images/semangka.jpg", alt: "Semangka", title: "Semangka", description: "2 Potong Sedang Semangka" },
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

// Konten tab makanan
function MealTabContent({ tab }: { tab: string }) {
  const categories = Object.keys(mealCategories) as Array<keyof typeof mealCategories>;
  const [jurnalMakanData, setJurnalMakanData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const [selectedPortions, setSelectedPortions] = useState<Record<string, string>>({});

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
          const initialPortions = Object.keys(mealCategories).reduce((acc, category) => {
            const apiKey = `${tab}_${category}`.replace(/-/g, '_');
            acc[category] = mapPortionValue(fetchedData[apiKey] || 0);
            return acc;
          }, {} as Record<string, string>);
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
  }, [session, status, tab]);
  console.log("jurnalMakanData", jurnalMakanData);

  // Menentukan nilai yang dipilih berdasarkan kategori dan tab
  const getCheckedValue = (category: string) => {
    return selectedPortions[category] || "";
  };

  const handleRadioChange = (category: string, value: string) => {
    setSelectedPortions((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col gap-5 pb-20">
      {categories.map((category) => (
        <div key={category} className="mb-5">
          <h2 className="text-center text-xl mb-2">
            Berapa porsi {category.replace(/([A-Z])/g, " $1").toLowerCase()} yang Anda konsumsi saat {tab}?
          </h2>
          <div className="flex overflow-x-auto gap-5 py-2.5">
            {mealCategories[category].map((image, index) => (
              <div key={index} className="flex flex-col items-center bg-white w-40 p-5 rounded-2xl flex-shrink-0">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={100}
                  height={100}
                  className="w-32 h-32 rounded-3xl"
                />
                <p className="mt-2 text-center">{image.title}</p>
                <p className="text-center text-sm text-gray-500">{image.description}</p>
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
                      <span className="mr-2.5">({String.fromCharCode(65 + index)})</span> {size.label}
                    </p>
                    <input
                      type="radio"
                      id={`porsi-${size.value}`}
                      name={`${tab}-radio-${category}`}
                      value={size.value}
                      className="w-7 h-7 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={getCheckedValue(category) === size.value}
                      onChange={() => handleRadioChange(category, size.value)}
                    />
                  </label>
                </div>
              ))}
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FoodLogForm() {
  const [selectedTab, setSelectedTab] = useState<string>("sarapan");

  const handleMealTabClick = (tabName: string) => {
    setSelectedTab(tabName);
  };

  const activeClass = "text-blue-500 border-b-2 border-blue-500";

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
              selectedTab === tab.name ? activeClass : ""
            }`}
            onClick={() => handleMealTabClick(tab.name)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-8 mx-5">
        <MealTabContent tab={selectedTab} />
        <button>Simpan</button>
      </div>
    </div>
  );
}
