interface PetugasData {
    id: number;
    name: string;
    email: string;
    role: string;
    gender: "Laki-laki" | "Perempuan";
    created_at: string;
    updated_at: string;
    puskesmas: {
      id: number;
      nama_puskesmas: string;
      alamat: string;
    }[];
  }
  