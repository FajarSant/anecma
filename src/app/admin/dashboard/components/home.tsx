import React, { useEffect, useState } from "react";
import axiosInstance from "@/libs/axios";
import { FaSearch } from "react-icons/fa";

interface DashboardData {
  ibu_hamil: number;
  ibu_hamil_anemia_rendah: number;
  ibu_hamil_anemia_tinggi: number;
  rata_rata_konsumsi_ttd: number | null;
}

interface ResikoAnemia {
  id: number;
  user_id: number;
  usia_kehamilan: number;
  jumlah_anak: number;
  riwayat_anemia: number;
  konsumsi_ttd_7hari: number;
  hasil_hb: number;
  resiko: string;
  created_at: string | null;
  updated_at: string | null;
}

interface DataItem {
  id: number;
  name: string;
  usia: number | null;
  resiko_anemia: ResikoAnemia[];
}

const HomePage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    ibu_hamil: 0,
    ibu_hamil_anemia_rendah: 0,
    ibu_hamil_anemia_tinggi: 0,
    rata_rata_konsumsi_ttd: 0,
  });
  const [dataItems, setDataItems] = useState<DataItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
          throw new Error("Authentication token not found.");
        }

        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

        // Ambil data dashboard
        const response = await axiosInstance.get("/admin/dashboard-card-hitung-data");
        const data = response.data.data;

        setDashboardData({
          ibu_hamil: data.ibu_hamil || 0,
          ibu_hamil_anemia_rendah: data.ibu_hamil_anemia_rendah || 0,
          ibu_hamil_anemia_tinggi: data.ibu_hamil_anemia_tinggi || 0,
          rata_rata_konsumsi_ttd:
            typeof data.rata_rata_konsumsi_ttd === "number"
              ? data.rata_rata_konsumsi_ttd
              : 0,
        });

        // Ambil data tabel
        const responseItems = await axiosInstance.get("/admin/dashboard-data-terbaru");
        setDataItems(responseItems.data.data);
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data:", error);
        setError("Gagal mengambil data. Silakan coba lagi nanti.");
      }
    };

    fetchData();
  }, []);

  const filteredDataItems = dataItems.flatMap((item) =>
    item.resiko_anemia
      .filter((resiko) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((resiko) => ({
        ...resiko,
        itemName: item.name,
        usia: item.usia,
      }))
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col">
      {/* Dashboard Card */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-100 p-4 rounded shadow flex items-center">
            <div>
              <h2 className="text-lg font-semibold">Jumlah Ibu Hamil</h2>
              <p className="text-2xl">{dashboardData.ibu_hamil}</p>
            </div>
          </div>
          <div className="bg-green-100 p-4 rounded shadow flex items-center">
            <div>
              <h2 className="text-lg font-semibold">Anemia Rendah</h2>
              <p className="text-2xl">{dashboardData.ibu_hamil_anemia_rendah}</p>
            </div>
          </div>
          <div className="bg-red-100 p-4 rounded shadow flex items-center">
            <div>
              <h2 className="text-lg font-semibold">Anemia Tinggi</h2>
              <p className="text-2xl">{dashboardData.ibu_hamil_anemia_tinggi}</p>
            </div>
          </div>
          <div className="bg-yellow-100 p-4 rounded shadow flex items-center">
            <div>
              <h2 className="text-lg font-semibold">Rata-rata TTD</h2>
              <p className="text-2xl">
                {typeof dashboardData.rata_rata_konsumsi_ttd === "number" &&
                !isNaN(dashboardData.rata_rata_konsumsi_ttd)
                  ? dashboardData.rata_rata_konsumsi_ttd.toFixed(2)
                  : "0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Data */}
      <div className="bg-white p-6 rounded-lg shadow-md flex-1">
        <div className="flex justify-end mb-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Cari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 pl-10 w-full rounded-lg border border-gray-300 bg-white outline-none"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-200 text-black">
              <tr>
                <th className="px-4 py-2 text-center border-r">No</th>
                <th className="px-4 py-2 text-center border-r">Nama</th>
                <th className="px-4 py-2 text-center border-r">Usia</th>
                <th className="px-4 py-2 text-center border-r">Rasio Anemia</th>
                <th className="px-4 py-2 text-center border-r">Konsumsi TTD</th>
                <th className="px-4 py-2 text-center border-r">HB Terakhir</th>
              </tr>
            </thead>
            <tbody>
              {filteredDataItems.length > 0 ? (
                filteredDataItems.map((resiko, index) => (
                  <tr key={resiko.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 text-center border-b border-r">{index + 1}</td>
                    <td className="px-4 py-2 text-center border-b border-r">{resiko.itemName}</td>
                    <td className="px-4 py-2 text-center border-b border-r">{resiko.usia ?? "Data tidak tersedia"}</td>
                    <td className="px-4 py-2 text-center border-b border-r">{resiko.resiko}</td>
                    <td className="px-4 py-2 text-center border-b border-r">{resiko.konsumsi_ttd_7hari ?? "Data tidak tersedia"}</td>
                    <td className="px-4 py-2 text-center border-b border-r">{resiko.hasil_hb ?? "Data tidak tersedia"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-2 text-center border-b" colSpan={6}>Tidak ada data yang tersedia</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default HomePage;
