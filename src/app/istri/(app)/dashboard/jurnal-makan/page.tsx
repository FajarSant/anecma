"use client";
import Image from "next/image";
import { MouseEvent, useState } from "react";

// Opsi waktu makan
const mealOptions = [
  { name: "sarapan", label: "Sarapan" },
  { name: "makan-siang", label: "Makan Siang" },
  { name: "makan-malam", label: "Makan Malam" },
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
  laukHewani: [
    { value: "0.5", label: "0.5 Porsi" },
    { value: "1", label: "1 Porsi" },
    { value: "1.5", label: "1.5 Porsi" },
    { value: "2", label: "2 Porsi" },
    { value: "2.5", label: "2.5 Porsi" },
    { value: "3", label: "3 Porsi" },
    { value: "3.5", label: "3.5 Porsi" },
    { value: "4", label: "4 Porsi" },
  ],
  laukNabati: [
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
    { src: "/images/kentang-2-buah.jpg", alt: "Kentang 2 Buah", title: "Kentang", description: "2 Buah Ukuran Sedang" },
    { src: "/images/Mie-2-buah.jpg", alt: "Mie 2 Buah", title: "Mie", description: "2 Buah Ukuran Sedang" },
    { src: "/images/ubi-1-biji-sedang.jpg", alt: "Ubi 1 Biji Sedang", title: "Ubi", description: "1 Biji Sedang" },
    { src: "/images/roti-3-lembar.jpg", alt: "Roti 3 Lembar", title: "Roti", description: "3 Lembar" },
    { src: "/images/singkong-1-setengah-buah.jpg", alt: "Singkong 1 Setengah Buah", title: "Singkong", description: "1.5 Buah" },
  ],
  laukHewani: [
    { src: "/images/ikan-lele.jpg", alt: "Ikan-Lele", title: "Ikan Lele", description: "1/3 sedang ikan Lele " },
    { src: "/images/ikan-mujair.jpg", alt: "Ikan-Mujair", title: "Ikan Mujair", description: "1/3 ekor sedang ikan Mujair" },
    { src: "/images/ikan-bandeng.jpg", alt: "Ikan-Bandeng", title: "Ikan Bandeng", description: "1 potong badan Ikan Bandeng" },
    { src: "/images/ikan-gurame.jpg", alt: "Ikan-gurame", title: "Ikan gurame", description: "1 potong badan Ikan gurame" },
    { src: "/images/ikan-tengiri.jpg", alt: "Ikan-tengiri", title: "Ikan tengiri", description: "1 potong badan Ikan tengiri" },
    { src: "/images/ikan-patin.jpg", alt: "Ikan-patin", title: "Ikan patin", description: "1 potong badan Ikan patin" },
    { src: "/images/ikan-teri-padang.jpg", alt: "ikan-teri-padang", title: "Ikan Teri Padang", description: "3 sendok makan teri padang" },
    { src: "/images/ikan-teri-nasi.jpg", alt: "ikan-teri-nasi", title: "Ikan Teri Nasi", description: "1/3 gelas teri nasi" },
    { src: "/images/telur.jpg", alt: "telur", title: "Telur", description: "1 Butir Telur" },
    { src: "/images/telur-puyuh.jpg", alt: "telur-puyuh", title: "Telur Puyuh", description: "5 Butir elur puyuh" },
    { src: "/images/sayap-ayam.jpg", alt: "sayap-ayam", title: "Daging Ayam ", description: "1 Potong sedang" },
    { src: "/images/paha-ayam.jpg", alt: "paha-ayam", title: "Daging Ayam", description: "1 Potong sedang" },
    { src: "/images/dada-ayam.jpg", alt: "dada-ayam", title: "Daging Ayam", description: "1 Potong sedang" },
    { src: "/images/leher-ayam.jpg", alt: "leher-ayam", title: "Daging Ayam", description: "1 Potong sedang" },
    { src: "/images/daging-potong-sedang.jpg", alt: "daging", title: "Daging ", description: "1 Potong Daging Sedang" },
    { src: "/images/jeroan-ati.jpg", alt: "Jeroan", title: "Jeroan Ati", description: "1 Buah Sedanh Ati" },
    { src: "/images/jeroan-rempelo.jpg", alt: "Jeroan", title: "Jeroan Rempela", description: "Jeroan Rempela" },
    { src: "/images/seafood-udang.jpg", alt: "Seafood", title: "Seafood Udang", description: "5 Ekor Sedang Udang" },
    { src: "/images/seafood-cumi.jpg", alt: "Seafood", title: "Seafood Cumo", description: "2 Ekor Cumi" },
    { src: "/images/nugget.jpg", alt: "Nugget", title: "Nugget", description: "Nugget 2 Potong" },
  ],
  laukNabati: [
    { src: "/images/tahu.jpg", alt: "Tahu", title: "Tahu", description: "2 Potong Sedang" },
    { src: "/images/tempe.jpg", alt: "Tempe", title: "Tempe", description: "2 Tempe Sedang" },
    { src: "/images/tempe-orek.jpg", alt: "Tempe Orek", title: "Tempe Orek", description: "3 Sendok Makan Tempe Orek" },
    { src: "/images/kacang-ijo.jpg", alt: "Kacang Ijo", title: "Kacang Ijo", description: ": 2 ½ Sendok Makan, Kacang Ijo" },
    { src: "/images/kacang-merah.jpg", alt: "Kacang Merah", title: "Kacang Merah", description: "2 ½ Sendok Makan, Kacang Merah" },
    { src: "/images/kacang-tanah.jpg", alt: "Kacang Tanah", title: "Kacang Tanah", description: "2 Sendok Makan Kacang Tanah Rebus " },
  ],
  sayur: [
    { src: "/images/5-sendok-makan.jpg", alt: "Sayur", title: "Sayur", description: "5 Sendok Makan" },
    { src: "/images/1-mangkuk-kecil.jpg", alt: "Sayur", title: "Sayur", description: "1 Mangkuk Kecil" },
    { src: "/images/2-sendok-sayur.jpg", alt: "Sayur", title: "Sayur", description: "2 Sendok Sayur" },
  ],
  buah: [
    { src: "/images/semangka.jpg", alt: "Semangka", title: "Semangka", description: "2 Potong Sedang Semangka" },
    { src: "/images/pepaya.jpg", alt: "Pepaya", title: "Pepaya", description: "1 Potong Besar Pepaya" },
    { src: "/images/pisang.jpg", alt: "Pisang", title: "Pisang", description: "1 Buah Sedang Pisang" },
    { src: "/images/melon.jpg", alt: "Melon", title: "Melon", description: "1 Potong Buah Melon" },
    { src: "/images/mangga.jpg", alt: "Mangga", title: "Mangga", description: "¾ Buah Besar Mangga" },
    { src: "/images/apel.jpg", alt: "Apel", title: "Apel", description: "1 Buah Kecil Apel" },
  ],
};

// Konten tab makanan
function MealTabContent({ tab }: { tab: string }) {
  const categories = Object.keys(mealCategories) as Array<keyof typeof mealCategories>;

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
                      name={`${tab}-radio`}
                      value={size.value}
                      className="w-7 h-7 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </label>
                </div>
              )) || portionSizes.default.map((size, index) => (
                <div key={index} className="flex items-center mb-28">
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
                      name={`${tab}-radio`}
                      value={size.value}
                      className="w-7 h-7 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
      <div className="tabs flex  mx-5 justify-between">
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
      </div>
    </div>
  );
}
