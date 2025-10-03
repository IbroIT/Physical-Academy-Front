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
};

i18n
  .use(LanguageDetector) // автоматическое определение языка
  .use(initReactI18next) // подключение к React
  .init({
    resources,
    fallbackLng: "en", // язык по умолчанию
    debug: false,
    interpolation: {
      escapeValue: false, // React уже экранирует
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"],
    },
  });

export default i18n;
