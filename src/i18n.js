import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Переводы
import translationEN from "./locales/en/translation.json";
import translationRU from "./locales/ru/translation.json";
import translationKG from "./locales/kg/translation.json";

const resources = {
  en: { translation: translationEN },
  ru: { translation: translationRU },
  kg: { translation: translationKG },
  // Добавляем псевдоним для ky -> kg
  ky: { translation: translationKG },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"],
    },
    // Добавляем обработку разных кодов языков
    supportedLngs: ["en", "ru", "kg", "ky"],
    nonExplicitSupportedLngs: true,
    // Нормализация кодов языков
    load: "languageOnly",
  });

// Дополнительная обработка для кодов kg/ky
i18n.services.languageUtils.getLanguagePartFromCode = (code) => {
  const lang = code.split('-')[0].toLowerCase();
  // Преобразуем ky в kg
  if (lang === 'ky') return 'kg';
  return lang;
};

export default i18n;