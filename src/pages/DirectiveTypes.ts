export type SubChapterKey =
  | "SUBCHAPTER_1_1"
  | "SUBCHAPTER_1_2"
  | "SUBCHAPTER_2_1"
  | "SUBCHAPTER_2_2"
  | "SUBCHAPTER_3_1"
  | "SUBCHAPTER_3_2";

export type ChapterKey = "CHAPTER_1" | "CHAPTER_2" | "CHAPTER_3";

interface Chapter {
    title: string;
    content: Partial<Record<SubChapterKey, string[]>>;
  }

export type Unit = {
  region: string;
  district: string;
  group: string;
  troop: string;
};
  
export interface Directive {
    date: string;
    city: string;
    serialNumber: string;
    chapters: Partial<Record<ChapterKey, Chapter>>;
  }
  
export interface UserData {
    firstname: string;
    surname: string;
    rank: string;
    function: string;
    unit: Unit | null;
  }
  
export interface LastDirectiveData {
    serialNumber: string;
    city: string;
    signatureFirst: string;
    signatureSecond: string;
  }

export const templates: Record<SubChapterKey, string[]> = {
    SUBCHAPTER_1_1: ["Informujemy, ze [informacja]", "Decyzja zarzadu [decyzja]", " "],
    SUBCHAPTER_1_2: ["Zarzadza sie, ze [zarządzenie]", "Wydaje sie polecenie [polecenie]", " "],
    SUBCHAPTER_2_1: ["Mianuje [imię i nazwisko] na funkcje [funkcja]", " "],
    SUBCHAPTER_2_2: ["Zwalniam [imię i nazwisko] z funkcji [funkcja]", " "],
    SUBCHAPTER_3_1: ["Przyznaje się stopien [stopień] osobie [imię i nazwisko]", " "],
    SUBCHAPTER_3_2: ["Nadaje się sprawnosc [sprawność] osobie [imię i nazwisko]", " "],
  };

export const availableChaptersData: Record<ChapterKey, { title: string; subchapters: Partial<Record<SubChapterKey, string>> }> = {
  CHAPTER_1: {
    title: "Informacje i zarządzenia",
    subchapters: {
      SUBCHAPTER_1_1: "Informacje",
      SUBCHAPTER_1_2: "Zarządzenia",
    },
  },
  CHAPTER_2: {
    title: "Mianowania i zwolnienia",
    subchapters: {
      SUBCHAPTER_2_1: "Mianowania",
      SUBCHAPTER_2_2: "Zwolnienia",
    },
  },
  CHAPTER_3: {
    title: "Stopnie i sprawności",
    subchapters: {
      SUBCHAPTER_3_1: "Stopnie",
      SUBCHAPTER_3_2: "Sprawności",
    },
  },
};

export interface TemplateFormProps {
  template: string;
  onSubmit: (finalText: string) => void;
}