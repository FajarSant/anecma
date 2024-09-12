"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { FaFemale, FaMale } from 'react-icons/fa'; // Ikon perempuan dan laki-laki

const GenderPicker = () => {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Pilih Gender</h2>

        <div className="flex flex-col gap-4">
          {/* Tombol untuk memilih Istri */}
          <Link href="/istri/login" passHref>
            <button
              onClick={() => handleGenderChange('Istri')}
              className={`flex items-center justify-center gap-3 px-8 py-4 rounded-lg text-white transition-transform transform ${
                selectedGender === 'Istri' ? 'bg-pink-500' : 'bg-pink-400'
              } hover:bg-pink-600 hover:scale-105 hover:shadow-lg w-full`}
            >
              <FaFemale size={24} /> {/* Ikon untuk Istri (Perempuan) */}
              <span className="text-lg">Istri</span>
            </button>
          </Link>

          {/* Teks pemisah "atau" */}
          <p className="text-gray-500 text-center">atau</p>

          {/* Tombol untuk memilih Suami */}
          <Link href="/suami/login" passHref>
            <button
              onClick={() => handleGenderChange('Suami')}
              className={`flex items-center justify-center gap-3 px-8 py-4 rounded-lg text-white transition-transform transform ${
                selectedGender === 'Suami' ? 'bg-blue-500' : 'bg-blue-400'
              } hover:bg-blue-600 hover:scale-105 hover:shadow-lg w-full`}
            >
              <FaMale size={24} /> {/* Ikon untuk Suami (Laki-laki) */}
              <span className="text-lg">Suami</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GenderPicker;
