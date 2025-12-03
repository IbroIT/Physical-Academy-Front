// components/BachelorQuotas.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useBachelorQuotas } from '../../../../hooks/useApi';

const BachelorQuotas = () => {
  const { t } = useTranslation();
  const [selectedQuota, setSelectedQuota] = useState(0);
  const [expandedSection, setExpandedSection] = useState('requirements');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Получаем данные из API
  const { quotasData, loading, error } = useBachelorQuotas();

  // Извлекаем данные из API response
  const quotas = quotasData?.quotas || [];
  const quotaStats = quotasData?.quota_stats || [];
  const additionalSupport = quotasData?.additional_support || [];
  const processSteps = quotasData?.process_steps || [];

  // Базовая отладочная информация
  console.log('BachelorQuotas - Data loaded:', !!quotasData, 'Loading:', loading, 'Error:', error);
  if (quotasData) {
    console.log('BachelorQuotas - Quotas count:', quotas.length, 'Stats count:', quotaStats.length, 'Support count:', additionalSupport.length, 'Steps count:', processSteps.length);
  }

  // Intersection Observer для анимаций
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Автопереключение квот
  useEffect(() => {
    if (quotas.length > 0) {
      const interval = setInterval(() => {
        setSelectedQuota((prev) => (prev + 1) % quotas.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [quotas.length]);

  // Обработка loading состояния
  if (loading && !quotasData) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-2xl animate-pulse">
                🎓
              </div>
              <div className="text-white text-xl">Загрузка данных о квотах...</div>
              <div className="mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Обработка error состояния
  if (error) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white text-2xl shadow-2xl">
                ⚠️
              </div>
              <div className="text-white text-xl mb-4">Ошибка загрузки данных</div>
              <div className="text-blue-200">{error}</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Если нет данных после загрузки
  if (!quotas.length && !loading) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center text-white text-2xl shadow-2xl">
                📋
              </div>
              <div className="text-white text-xl mb-4">Нет данных о квотах</div>
              <div className="text-blue-200">Данные временно недоступны. Попробуйте обновить страницу.</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Основной рендер
  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">

        {/* Простой заголовок без сложных анимаций */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-2xl">
            🎓
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t('bachelor.quotas.subtitle', 'Специальные программы поддержки для талантливых спортсменов и абитуриентов')}
          </p>
          <div className="mt-4 text-white">
            Квот загружено: {quotas.length} | Статистик: {quotaStats.length}
          </div>
        </div>

        {/* Простая статистика */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {quotaStats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-blue-200 text-sm uppercase tracking-wide mb-1">{stat.label}</div>
              <div className="text-blue-300/70 text-xs">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Простой список квот */}
        <div className="space-y-6">
          {quotas.map((quota, index) => (
            <div key={quota.id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-4">{quota.icon}</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">{quota.title}</h3>
                  <p className="text-blue-200">{quota.description}</p>
                </div>
              </div>
              <div className="text-white">
                <p>Мест: {quota.spots}</p>
                <p>Дедлайн: {quota.deadline}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BachelorQuotas;