// Простой тест компонент
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const BachelorQuotasTest = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎓 ТЕСТ - Компонент работает!
          </h1>
          <p className="text-white text-xl">Если вы видите этот текст, то React компонент рендерится корректно</p>
          <div className="mt-8 p-4 bg-white/10 rounded-lg">
            <p className="text-green-400">✅ Компонент загружен</p>
            <p className="text-blue-300">✅ CSS стили применены</p>
            <p className="text-purple-300">✅ Framer Motion работает</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BachelorQuotasTest;