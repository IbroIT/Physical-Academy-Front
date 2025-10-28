import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

const DoctorateProgram = () => {
  const { t, i18n } = useTranslation();
  const [activeDirection, setActiveDirection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDirection, setSelectedDirection] = useState(null);

  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    programs: [],
    loading: false,
    error: null,
  });

  // Получение текущего языка для API
  const getApiLanguage = useCallback(() => {
    const langMap = {
      en: "en",
      ru: "ru",
      kg: "kg",
    };
    return langMap[i18n.language] || "ru";
  }, [i18n.language]);

  // Функция для загрузки данных с бэкенда
  const fetchBackendData = useCallback(async () => {
    try {
      setBackendData((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      const lang = getApiLanguage();
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(
        `${API_URL}/api/education/phd-programs/?lang=${i18n.language}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setBackendData({
        programs: data.results || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching PhD programs data:", error);
      setBackendData((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load PhD programs data",
      }));
    }
  }, [getApiLanguage]);

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchBackendData();
  }, []);

  // Перезагрузка данных при изменении языка
  useEffect(() => {
    fetchBackendData();
  }, [i18n.language]);

  // Преобразование данных бэкенда в формат компонента
  const getResearchDirections = useCallback(() => {
    if (!backendData.programs.length) return [];

    const colors = [
      {
        color: "from-blue-500 to-blue-600",
        hoverColor: "from-blue-600 to-blue-700",
      },
      {
        color: "from-green-500 to-green-600",
        hoverColor: "from-green-600 to-green-700",
      },
      {
        color: "from-blue-500 to-green-500",
        hoverColor: "from-blue-600 to-green-600",
      },
      {
        color: "from-green-500 to-blue-500",
        hoverColor: "from-green-600 to-blue-600",
      },
    ];

    if (!backendData.programs || backendData.programs.length === 0) {
      return [];
    }

    return backendData.programs.map((program, index) => {
      const colorSet = colors[index % colors.length];

      return {
        id: program.id,
        title: program.name,
        duration: `${program.duration_years} ${t("doctorateProgram.years")}`,
        format: program.offline
          ? t("doctorateProgram.fullTime")
          : t("doctorateProgram.online"),
        description: program.description,
        supervisor: t("doctorateProgram.defaultSupervisor"),
        requirements: program.features || [],
        icon: program.emoji || "🎓",
        color: colorSet.color,
        hoverColor: colorSet.hoverColor,
        tuition_fee: program.tuition_fee,
        offline: program.offline,
      };
    });
  }, [backendData.programs, t]);

  // Преимущества программы
  const benefits = [
    {
      title: t("doctorateProgram.benefits.researchFunding.title"),
      description: t("doctorateProgram.benefits.researchFunding.description"),
      icon: "💰",
    },
    {
      title: t("doctorateProgram.benefits.internationalOpportunities.title"),
      description: t(
        "doctorateProgram.benefits.internationalOpportunities.description"
      ),
      icon: "🌍",
    },
    {
      title: t("doctorateProgram.benefits.modernLabs.title"),
      description: t("doctorateProgram.benefits.modernLabs.description"),
      icon: "🔬",
    },
    {
      title: t("doctorateProgram.benefits.careerSupport.title"),
      description: t("doctorateProgram.benefits.careerSupport.description"),
      icon: "🎯",
    },
  ];

  const researchDirections = getResearchDirections();

  // Сбрасываем активное направление при изменении языка или данных
  useEffect(() => {
    setActiveDirection(0);
  }, [i18n.language, researchDirections.length]);

  useEffect(() => {
    setIsVisible(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleDirectionClick = (index) => {
    setActiveDirection(index);
  };

  const handleLearnMore = (direction) => {
    setSelectedDirection(direction);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDirection(null);
  };

  const handleApplyNow = () => {
    // В реальном приложении здесь будет логика открытия формы заявки
    alert(t("doctorateProgram.applicationSuccess"));
  };

  // Компонент загрузки
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-8">
      {/* Скелетон для заголовка */}
      <div className="text-center mb-12">
        <div className="h-12 bg-white/20 rounded w-3/4 mx-auto mb-6"></div>
        <div className="h-4 bg-white/20 rounded w-1/2 mx-auto"></div>
      </div>

      {/* Скелетон для статистики */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white/10 rounded-2xl p-6 h-24"></div>
        ))}
      </div>

      {/* Скелетон для направлений */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white/10 rounded-2xl p-6 h-80"></div>
        ))}
      </div>
    </div>
  );

  // Компонент ошибки
  const ErrorMessage = () => (
    <div className="text-center py-16">
      <div className="text-red-400 text-6xl mb-6">⚠️</div>
      <h3 className="text-2xl text-white mb-4">
        {t("doctorateProgram.errorTitle")}
      </h3>
      <p className="text-blue-200 mb-6">{backendData.error}</p>
      <button
        onClick={fetchBackendData}
        className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
      >
        {t("doctorateProgram.retry")}
      </button>
    </div>
  );

  if (backendData.loading) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-12 md:py-20 overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  if (backendData.error && !researchDirections.length) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-12 md:py-20 overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage />
        </div>
      </section>
    );
  }

  // Логируем ошибки, но не блокируем рендер - страница показывается с пустыми данными
  if (backendData.error) {
    console.warn("Faculty API error, using fallback data:", backendData.error);
  }

  return (
    <>
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-12 md:py-20 overflow-hidden">
        {/* Анимированный фон */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
          <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Заголовок */}
          <div
            className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6">
              {t("doctorateProgram.title")}
            </h1>
            <div className="w-20 h-1 bg-emerald-400 mx-auto mb-3 md:mb-4"></div>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto px-4">
              {t("doctorateProgram.subtitle")}
            </p>
          </div>

          {backendData.error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-8 text-center">
              <p className="text-red-300">{backendData.error}</p>
            </div>
          )}

          {/* Ключевые показатели */}
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16 transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {[
              {
                value: "25+",
                label: t("doctorateProgram.stats.years"),
                color: "blue",
              },
              {
                value: "150+",
                label: t("doctorateProgram.stats.graduates"),
                color: "green",
              },
              {
                value: "12",
                label: t("doctorateProgram.stats.professors"),
                color: "blue",
              },
              {
                value: "85%",
                label: t("doctorateProgram.stats.successRate"),
                color: "green",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="relative bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 border border-white/20 shadow-2xl transition-all duration-500 transform hover:scale-105 text-center group"
              >
                <div
                  className={`text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300 ${
                    stat.color === "blue" ? "text-blue-400" : "text-emerald-400"
                  }`}
                >
                  {stat.value}
                </div>
                <div className="text-blue-100 font-medium text-sm md:text-base">
                  {stat.label}
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
              </div>
            ))}
          </div>

          {/* Научные направления */}
          {researchDirections.length > 0 ? (
            <>
              <div
                className={`mb-12 md:mb-16 transition-all duration-1000 delay-400 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {researchDirections.map((direction, index) => (
                    <div
                      key={direction.id}
                      className={`relative bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 border border-white/20 shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${
                        activeDirection === index
                          ? "ring-2 ring-emerald-400 ring-opacity-50"
                          : ""
                      }`}
                      onClick={() => handleDirectionClick(index)}
                    >
                      {/* Иконка направления */}
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${direction.color} flex items-center justify-center text-2xl mb-4 mx-auto`}
                      >
                        {direction.icon}
                      </div>

                      {/* Заголовок */}
                      <h3 className="text-xl font-bold text-white text-center mb-3 line-clamp-2">
                        {direction.title}
                      </h3>

                      {/* Длительность и формат */}
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-emerald-300 text-sm font-semibold bg-emerald-500/20 px-2 py-1 rounded-lg">
                          {direction.duration}
                        </span>
                        <span className="text-blue-300 text-sm bg-blue-500/20 px-2 py-1 rounded-lg">
                          {direction.format}
                        </span>
                      </div>

                      {/* Описание */}
                      <p className="text-blue-100 text-sm mb-4 line-clamp-3">
                        {direction.description}
                      </p>

                      {/* Стоимость (если есть) */}
                      {direction.tuition_fee &&
                        direction.tuition_fee !== "0.00" && (
                          <div className="text-center mb-4">
                            <span className="text-blue-200 text-sm">
                              {t("doctorateProgram.tuitionFee")}
                            </span>
                            <div className="text-white font-semibold text-sm mt-1">
                              {direction.tuition_fee} ₽/
                              {t("doctorateProgram.perYear")}
                            </div>
                          </div>
                        )}

                      {/* Кнопка */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLearnMore(direction);
                        }}
                        className={`w-full bg-gradient-to-r ${direction.color} hover:${direction.hoverColor} text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg`}
                      >
                        {t("doctorateProgram.learnMore")}
                      </button>

                      {/* Индикатор активного направления */}
                      {activeDirection === index && (
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Детали активного направления */}
              <div
                className={`transition-all duration-1000 delay-600 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
                  <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                    {/* Основная информация */}
                    <div className="lg:w-2/3">
                      <div className="flex items-start mb-6">
                        <div
                          className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${researchDirections[activeDirection].color} flex items-center justify-center text-3xl mr-4 md:mr-6`}
                        >
                          {researchDirections[activeDirection].icon}
                        </div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            {researchDirections[activeDirection].title}
                          </h2>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-emerald-300 font-semibold bg-emerald-500/20 px-3 py-1 rounded-lg">
                              {researchDirections[activeDirection].duration}
                            </span>
                            <span className="text-blue-300 bg-blue-500/20 px-3 py-1 rounded-lg">
                              {researchDirections[activeDirection].format}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-blue-100 text-lg mb-6">
                        {researchDirections[activeDirection].description}
                      </p>

                      {/* Требования */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {researchDirections[activeDirection].requirements.map(
                          (requirement, index) => (
                            <div
                              key={index}
                              className="flex items-center bg-white/5 rounded-xl p-4 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                            >
                              <div className="w-8 h-8 bg-emerald-400/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-emerald-400/30 transition-colors">
                                <span className="text-emerald-300">✓</span>
                              </div>
                              <span className="text-white group-hover:text-emerald-300 transition-colors">
                                {requirement}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Боковая панель с действиями */}
                    <div className="lg:w-1/3">
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 sticky top-6">
                        <div className="text-center mb-6">
                          <div className="text-2xl font-bold text-white mb-2">
                            {researchDirections[activeDirection].tuition_fee &&
                            researchDirections[activeDirection].tuition_fee !==
                              "0.00"
                              ? `${
                                  researchDirections[activeDirection]
                                    .tuition_fee
                                } ₽/${t("doctorateProgram.perYear")}`
                              : t("doctorateProgram.freeTuition")}
                          </div>
                          <div className="text-emerald-300 font-semibold">
                            {researchDirections[activeDirection].tuition_fee &&
                            researchDirections[activeDirection].tuition_fee !==
                              "0.00"
                              ? t("doctorateProgram.tuitionRequired")
                              : t("doctorateProgram.fundingAvailable")}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-all duration-300 border border-white/20">
                            {t("doctorateProgram.downloadBrochure")}
                          </button>
                        </div>

                        {/* Дополнительная информация */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-blue-200">
                              {t("doctorateProgram.startDate")}
                            </span>
                            <span className="text-white font-semibold">
                              {t("doctorateProgram.september")}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-blue-200">
                              {t("doctorateProgram.places")}
                            </span>
                            <span className="text-emerald-300 font-semibold">
                              8-10
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-blue-200">
                              {t("doctorateProgram.format")}
                            </span>
                            <span className="text-white font-semibold text-sm text-right">
                              {researchDirections[activeDirection].format}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            !backendData.loading && (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">🎓</div>
                <h3 className="text-2xl text-white mb-4">
                  {t("doctorateProgram.noPrograms")}
                </h3>
                <p className="text-blue-200">
                  {t("doctorateProgram.noProgramsDescription")}
                </p>
              </div>
            )
          )}

          {/* Преимущества программы */}
          <div
            className={`mt-12 md:mt-16 transition-all duration-1000 delay-800 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 md:mb-12">
              {t("doctorateProgram.benefitsTitle")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 text-center group hover:border-emerald-400/30 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">{benefit.icon}</span>
                  </div>
                  <h4 className="text-white font-bold text-lg md:text-xl mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-blue-100 text-sm md:text-base">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Плавающие элементы для десктопа */}
        {!isMobile && (
          <>
            <div className="absolute bottom-20 left-5 w-6 h-6 bg-emerald-400/20 rounded-full animate-bounce"></div>
            <div className="absolute top-20 right-5 w-4 h-4 bg-blue-400/20 rounded-full animate-ping"></div>
          </>
        )}
      </section>

      {/* Модальное окно */}
      {showModal && selectedDirection && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-900 to-emerald-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl animate-scaleIn">
            <div className="p-6 md:p-8">
              {/* Заголовок */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${selectedDirection.color} flex items-center justify-center text-2xl mr-4`}
                  >
                    {selectedDirection.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      {selectedDirection.title}
                    </h2>
                    <p className="text-emerald-300">
                      {selectedDirection.duration}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Контент */}
              <div className="space-y-6">
                <p className="text-blue-100 text-lg">
                  {selectedDirection.description}
                </p>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {t("doctorateProgram.requirements")}
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedDirection.requirements.map(
                      (requirement, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-6 h-6 bg-emerald-400/20 rounded-full flex items-center justify-center mr-3">
                            <span className="text-emerald-300 text-sm">✓</span>
                          </div>
                          <span className="text-white">{requirement}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Информация о стоимости */}
                {selectedDirection.tuition_fee &&
                  selectedDirection.tuition_fee !== "0.00" && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="font-semibold text-white mb-2">
                        {t("doctorateProgram.tuitionInformation")}
                      </h4>
                      <p className="text-emerald-300 font-bold text-lg">
                        {selectedDirection.tuition_fee} ₽/
                        {t("doctorateProgram.perYear")}
                      </p>
                      <p className="text-blue-200 text-sm mt-1">
                        {selectedDirection.format}
                      </p>
                    </div>
                  )}

                <button
                  onClick={handleApplyNow}
                  className={`w-full bg-gradient-to-r ${selectedDirection.color} hover:${selectedDirection.hoverColor} text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg`}
                >
                  {t("doctorateProgram.applyForDirection")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorateProgram;
