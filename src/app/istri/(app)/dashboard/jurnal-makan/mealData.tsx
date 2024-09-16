// mealData.ts
export type MealCategory = 'karbohidrat' | 'laukhewani' | 'lauknabati' | 'sayur' | 'buah';

export const mealCategories: Record<MealCategory, { src: string; alt: string; title: string; description: string; }[]> = {
  karbohidrat: [
    // data karbohidrat
  ],
  laukhewani: [
    // data laukhewani
  ],
  lauknabati: [
    // data lauknabati
  ],
  sayur: [
    // data sayur
  ],
  buah: [
    // data buah
  ],
};
