"use client";
import { FiBook } from "react-icons/fi";
import { IoChatbubblesOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { IoIosArrowDropup, IoIosArrowDropdown } from "react-icons/io";
import { FaHome, FaPlus } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "@/libs/axios";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";

interface FormData {
  user_id: string;
  usia_kehamilan: string;
  jumlah_anak: string;
  riwayat_anemia: string;
  jumlah_konsumsi_ttd_terakhir: string;
  hasil_pemeriksaan_hb_terakhir: string;
}

export default function HasilKalkulatorAnemiaPage() {
  const [riskLevel, setRiskLevel] = useState<string>("rendah");
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [penjelasan, setPenjelasan] = useState<string>("");
  const { data: session, status } = useSession();

  const calculateScore = useCallback((formData: FormData) => {
    let score = 0;
    let explanations: string[] = [];

    // Kalkulator jumlah_anak
    const jumlahAnak = parseInt(formData.jumlah_anak, 10);
    if (jumlahAnak === 0) {
      explanations.push("Jumlah anak: 0, tidak menambah risiko.");
    } else {
      const anakScore = jumlahAnak >= 2 ? 1 : 0;
      score += anakScore;
      explanations.push(`Jumlah anak: ${jumlahAnak}, skor: ${anakScore}.`);
    }

    // Kalkulator jumlah_konsumsi_ttd_terakhir
    const jumlahKonsumsiTTD = parseInt(formData.jumlah_konsumsi_ttd_terakhir, 10);
    let konsumsiScore = 0;
    if (jumlahKonsumsiTTD >= 7) {
      konsumsiScore = 0;
    } else if (jumlahKonsumsiTTD >= 5) {
      konsumsiScore = 1;
    } else if (jumlahKonsumsiTTD >= 3) {
      konsumsiScore = 2;
    } else {
      konsumsiScore = 3;
    }
    score += konsumsiScore;
    explanations.push(`Jumlah konsumsi TTD terakhir: ${jumlahKonsumsiTTD}, skor: ${konsumsiScore}.`);

    // Kalkulator hasil_pemeriksaan_hb_terakhir
    const hbLevel = parseInt(formData.hasil_pemeriksaan_hb_terakhir, 10);
    let hbScore = 0;
    if (hbLevel >= 2) {
      hbScore = 2;
    } else if (hbLevel === 1) {
      hbScore = 1;
    }
    score += hbScore;
    explanations.push(`Hasil pemeriksaan Hb terakhir: ${hbLevel}, skor: ${hbScore}.`);

    // Kalkulator riwayat_anemia
    const riwayatAnemia = parseInt(formData.riwayat_anemia, 10);
    const riwayatScore = riwayatAnemia === 1 ? 1 : 0;
    score += riwayatScore;
    explanations.push(`Riwayat anemia: ${riwayatAnemia}, skor: ${riwayatScore}.`);

    setTotalScore(score);
    determineRiskLevel(score, explanations);
  }, []);

  const determineRiskLevel = (score: number, explanations: string[]) => {
    let level: string;
  
    // Scores greater than or equal to 7 are classified as "tinggi"
    if (score >= 7) {
      level = "tinggi";
    } else {
      level = "rendah";
    }
  
    setRiskLevel(level);
    setPenjelasan(`Skor total Anda adalah ${score}.\n\nPenjelasan detail:\n${explanations.join("\n")}`);
  };
  
  
  const sendDataToAPI = useCallback(
    async (formData: FormData) => {
      const dataToSend = {
        user_id: formData.user_id,
        usia_kehamilan: formData.usia_kehamilan,
        jumlah_anak: formData.jumlah_anak,
        riwayat_anemia: formData.riwayat_anemia,
        konsumsi_ttd_7hari: formData.jumlah_konsumsi_ttd_terakhir,
        hasil_hb: formData.hasil_pemeriksaan_hb_terakhir,
        resiko: riskLevel,
      };

      if (status === "authenticated" && session?.accessToken) {
        try {
          const response = await axiosInstance.post("/istri/dashboard/kalkulator-anemia", dataToSend, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          console.log("Response from API:", response.data);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            console.error("Error response data:", error.response.data);
          } else {
            console.error("Unexpected error:", error);
            alert("Terjadi kesalahan tidak terduga.");
          }
        }
      }
    },
    [riskLevel, session, status]
  );

  useEffect(() => {
    const formDataString = localStorage.getItem("formData");
    if (formDataString) {
      try {
        const formData: FormData = JSON.parse(formDataString);
        calculateScore(formData);
        sendDataToAPI(formData);
      } catch (error) {
        console.error("Error parsing formData", error);
        alert("Terjadi kesalahan saat memproses data.");
      }
    }
  }, [calculateScore, sendDataToAPI]);

  const handleHitungUlang = () => {
    localStorage.removeItem("formData");
    window.location.href = '/istri/dashboard/kalkulator-anemia';
  };

  const getBackgroundClass = (riskLevel: string) => {
    switch (riskLevel) {
      case "tinggi":
        return "bg-red-600";
      case "rendah":
        return "bg-green-600";
    }
  };

  const getArrowIcon = (riskLevel: string) => {
    return riskLevel === "rendah" ? (
      <IoIosArrowDropdown className="w-10 h-10 font-semibold" />
    ) : (
      <IoIosArrowDropup className="w-10 h-10 font-semibold" />
    );
  };

  return (
    <main>
      {/* Header */}
      <div className="m-5 flex flex-row">
        <p className="text-2xl font-bold">Kalkulator Anemia</p>
      </div>

      <hr className="mx-5 mb-5 h-0.5 border-t-0 bg-gray-300" />

      <div className={`mx-5 py-10 flex flex-col items-center gap-5 rounded-3xl my-5 ${getBackgroundClass(riskLevel)}`}>
        <p className="text-base font-semibold">Resiko Anemia</p>
        <div className="flex flex-row gap-2.5 items-center">
          {getArrowIcon(riskLevel)}
          <p className={`text-4xl font-semibold`}>{riskLevel}</p>
        </div>

        {totalScore !== null && <p className="text-lg mt-2">Skor Total: {totalScore}</p>}
      </div>

      <div className="mx-5 text-center my-5">
        <button
          type="button"
          className="max-w-fit self-center text-white bg-green-pastel hover:bg-green-pastel/90 focus:ring-4 focus:outline-none focus:ring-green-pastel/35 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 gap-2"
          onClick={handleHitungUlang}
        >
          <FaPlus />
          Hitung Ulang
        </button>
      </div>
      <p className="text-base mt-2">{penjelasan}</p>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <FaHome className="w-6 h-6 mb-1 text-gray-500 group-hover:text-green-pastel" />
            <span className="text-sm text-gray-500 group-hover:text-green-pastel dark:text-gray-400">Beranda</span>
          </button>

          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <FiBook className="w-6 h-6 mb-1 text-gray-500 group-hover:text-green-pastel" />
            <span className="text-sm text-gray-500 group-hover:text-green-pastel dark:text-gray-400">Informasi</span>
          </button>

          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <IoChatbubblesOutline className="w-6 h-6 mb-1 text-gray-500 group-hover:text-green-pastel" />
            <span className="text-sm text-gray-500 group-hover:text-green-pastel dark:text-gray-400">Bantuan</span>
          </button>

          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <LuUsers className="w-6 h-6 mb-1 text-gray-500 group-hover:text-green-pastel" />
            <span className="text-sm text-gray-500 group-hover:text-green-pastel dark:text-gray-400">Profil</span>
          </button>
        </div>
      </div>
    </main>
  );
}
