// components/BachelorInternational.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const BachelorInternational = () => {
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState('germany');
  const [activeTab, setActiveTab] = useState('requirements');

  const countries = {
    germany: {
      name: '🇩🇪 Германия',
      flag: '🇩🇪',
      requirements: [
        t('bachelor.international.countries.germany.requirements.0', 'Аттестат о среднем образовании с высоким средним баллом'),
        t('bachelor.international.countries.germany.requirements.1', 'Сертификат немецкого языка уровня TestDaF или DSH'),
        t('bachelor.international.countries.germany.requirements.2', 'Мотивационное письмо и рекомендации')
      ],
      support: [
        t('bachelor.international.countries.germany.support.0', 'Помощь в подготовке документов для поступления'),
        t('bachelor.international.countries.germany.support.1', 'Консультации по получению студенческой визы'),
        t('bachelor.international.countries.germany.support.2', 'Поддержка в поиске жительства в Германии')
      ],
      universities: [
        t('bachelor.international.countries.germany.universities.0', 'Технический университет Мюнхена'),
        t('bachelor.international.countries.germany.universities.1', 'Гейдельбергский университет'),
        t('bachelor.international.countries.germany.universities.2', 'Свободный университет Берлина')
      ],
      color: 'blue'
    },
    usa: {
      name: '🇺🇸 США',
      flag: '🇺🇸',
      requirements: [
        t('bachelor.international.countries.usa.requirements.0', 'Диплом средней школы с высоким GPA'),
        t('bachelor.international.countries.usa.requirements.1', 'Результаты SAT/ACT и TOEFL/IELTS'),
        t('bachelor.international.countries.usa.requirements.2', 'Эссе и внеучебные достижения')
      ],
      support: [
        t('bachelor.international.countries.usa.support.0', 'Подготовка к стандартизированным тестам'),
        t('bachelor.international.countries.usa.support.1', 'Помощь в написании мотивационных писем'),
        t('bachelor.international.countries.usa.support.2', 'Консультации по стипендиям и грантам')
      ],
      universities: [
        t('bachelor.international.countries.usa.universities.0', 'Гарвардский университет'),
        t('bachelor.international.countries.usa.universities.1', 'Стэнфордский университет'),
        t('bachelor.international.countries.usa.universities.2', 'Массачусетский технологический институт')
      ],
      color: 'green'
    },
    korea: {
      name: '🇰🇷 Южная Корея',
      flag: '🇰🇷',
      requirements: [
        t('bachelor.international.countries.korea.requirements.0', 'Аттестат о полном среднем образовании'),
        t('bachelor.international.countries.korea.requirements.1', 'Сертификат TOPIK (корейский язык)'),
        t('bachelor.international.countries.korea.requirements.2', 'Портфолио достижений')
      ],
      support: [
        t('bachelor.international.countries.korea.support.0', 'Подготовка к экзамену TOPIK'),
        t('bachelor.international.countries.korea.support.1', 'Помощь в оформлении визы D-2'),
        t('bachelor.international.countries.korea.support.2', 'Культурная адаптация и ориентация')
      ],
      universities: [
        t('bachelor.international.countries.korea.universities.0', 'Сеульский национальный университет'),
        t('bachelor.international.countries.korea.universities.1', 'Корейский ведущий научно-технический институт'),
        t('bachelor.international.countries.korea.universities.2', 'Университет Ёнсе')
      ],
      color: 'red'
    },
    japan: {
      name: '🇯🇵 Япония',
      flag: '🇯🇵',
      requirements: [
        t('bachelor.international.countries.japan.requirements.0', 'Аттестат о 12-летнем образовании'),
        t('bachelor.international.countries.japan.requirements.1', 'Сертификат JLPT N2 или выше'),
        t('bachelor.international.countries.japan.requirements.2', 'Результаты экзамена EJU')
      ],
      support: [
        t('bachelor.international.countries.japan.support.0', 'Подготовка к экзамену EJU'),
        t('bachelor.international.countries.japan.support.1', 'Помощь в поступлении в языковую школу'),
        t('bachelor.international.countries.japan.support.2', 'Консультации по стипендиям MEXT')
      ],
      universities: [
        t('bachelor.international.countries.japan.universities.0', 'Токийский университет'),
        t('bachelor.international.countries.japan.universities.1', 'Киотский университет'),
        t('bachelor.international.countries.japan.universities.2', 'Осакский университет')
      ],
      color: 'purple'
    }
  };

  const processSteps = [
    { 
      step: 1, 
      title: t('bachelor.international.process.apply', 'Подача заявления'), 
      duration: '1-2 месяца',
      description: t('bachelor.international.process.applyDesc', 'Подготовка и подача документов в выбранные университеты')
    },
    { 
      step: 2, 
      title: t('bachelor.international.process.documents', 'Оформление документов'), 
      duration: '2-3 недели',
      description: t('bachelor.international.process.documentsDesc', 'Получение приглашения и подготовка к визе')
    },
    { 
      step: 3, 
      title: t('bachelor.international.process.visa', 'Получение визы'), 
      duration: '1-3 месяца',
      description: t('bachelor.international.process.visaDesc', 'Подача документов на студенческую визу')
    },
    { 
      step: 4, 
      title: t('bachelor.international.process.arrival', 'Прибытие и адаптация'), 
      duration: '2 недели',
      description: t('bachelor.international.process.arrivalDesc', 'Переезд и ориентация в новой стране')
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return { 
          bg: 'bg-green-50', 
          border: 'border-green-200', 
          text: 'text-green-800',
          active: 'bg-green-600',
          light: 'bg-green-100'
        };
      case 'blue':
        return { 
          bg: 'bg-blue-50', 
          border: 'border-blue-200', 
          text: 'text-blue-800',
          active: 'bg-blue-600',
          light: 'bg-blue-100'
        };
      case 'red':
        return { 
          bg: 'bg-red-50', 
          border: 'border-red-200', 
          text: 'text-red-800',
          active: 'bg-red-600',
          light: 'bg-red-100'
        };
      case 'purple':
        return { 
          bg: 'bg-purple-50', 
          border: 'border-purple-200', 
          text: 'text-purple-800',
          active: 'bg-purple-600',
          light: 'bg-purple-100'
        };
      default:
        return { 
          bg: 'bg-gray-50', 
          border: 'border-gray-200', 
          text: 'text-gray-800',
          active: 'bg-gray-600',
          light: 'bg-gray-100'
        };
    }
  };

  const currentCountry = countries[selectedCountry];
  const colors = getColorClasses(currentCountry.color);

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('bachelor.international.title', 'Бакалавриат за рубежом')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('bachelor.international.subtitle', 'Получите качественное образование в ведущих университетах мира с нашей поддержкой')}
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
            <div className="text-2xl font-bold text-blue-600 mb-1">15+</div>
            <div className="text-blue-800 text-sm font-medium">Стран</div>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 text-center border border-green-100">
            <div className="text-2xl font-bold text-green-600 mb-1">200+</div>
            <div className="text-green-800 text-sm font-medium">Университетов</div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
            <div className="text-2xl font-bold text-blue-600 mb-1">95%</div>
            <div className="text-blue-800 text-sm font-medium">Успешных поступлений</div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
            <div className="text-2xl font-bold text-gray-600 mb-1">5</div>
            <div className="text-gray-800 text-sm font-medium">Лет опыта</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Country Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('bachelor.international.chooseCountry', 'Выберите страну')}
              </h3>
              <div className="space-y-3">
                {Object.entries(countries).map(([key, country]) => {
                  const countryColors = getColorClasses(country.color);
                  const isSelected = selectedCountry === key;
                  
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCountry(key)}
                      className={`w-full p-4 rounded-xl border transition-all duration-300 text-left group ${
                        isSelected
                          ? `${countryColors.border} ${countryColors.bg} shadow-md transform scale-105`
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{country.flag}</span>
                          <span className="font-semibold text-gray-900">{country.name}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
                          isSelected 
                            ? `${countryColors.active} border-white shadow-inner` 
                            : 'border-gray-300 group-hover:border-gray-400'
                        }`}></div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Country Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {/* Country Header */}
              <div className={`${colors.bg} ${colors.border} border-b p-6`}>
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{currentCountry.flag}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentCountry.name}</h2>
                    <p className="text-gray-600 mt-1">
                      {t('bachelor.international.opportunities', 'Возможности для международных студентов')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('requirements')}
                    className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'requirements'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    📋 {t('bachelor.international.requirements', 'Требования')}
                  </button>
                  <button
                    onClick={() => setActiveTab('support')}
                    className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'support'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    🛠️ {t('bachelor.international.support', 'Поддержка')}
                  </button>
                  <button
                    onClick={() => setActiveTab('universities')}
                    className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'universities'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    🎓 {t('bachelor.international.universities', 'Университеты')}
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'requirements' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {t('bachelor.international.requirementsForAdmission', 'Требования для поступления')}
                    </h3>
                    <ul className="space-y-3">
                      {currentCountry.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-6 h-6 ${colors.light} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <div className={`w-2 h-2 ${colors.active} rounded-full`}></div>
                          </div>
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'support' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {t('bachelor.international.ourSupport', 'Наша поддержка')}
                    </h3>
                    <ul className="space-y-3">
                      {currentCountry.support.map((sup, idx) => (
                        <li key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 text-sm">✓</span>
                          </div>
                          <span className="text-blue-800">{sup}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'universities' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {t('bachelor.international.topUniversities', 'Топ университеты')}
                    </h3>
                    <div className="grid gap-3">
                      {currentCountry.universities.map((uni, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">🎓</span>
                          </div>
                          <span className="text-gray-700">{uni}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Process Timeline */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('bachelor.international.processTitle', 'Процесс поступления')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('bachelor.international.processSubtitle', 'Пошаговый путь к обучению за рубежом')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div key={step.step} className="group">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 h-full hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                        {step.step}
                      </div>
                      {index < processSteps.length - 1 && (
                        <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-gray-200 -z-10">
                          <div className="w-0 h-full bg-blue-600 group-hover:w-full transition-all duration-1000 delay-300"></div>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">{step.title}</h3>
                    <p className="text-blue-600 font-medium mb-3 flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{step.duration}</span>
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-50 rounded-2xl p-8 text-center border border-blue-200">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('bachelor.international.cta.title', 'Готовы начать свой путь?')}
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              {t('bachelor.international.cta.description', 'Запишитесь на консультацию и узнайте все возможности для обучения за рубежом')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                {t('bachelor.international.cta.button', 'Записаться на консультацию')}
              </button>
              <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold border border-blue-200 hover:border-blue-300 transition-colors">
                {t('bachelor.international.cta.secondary', 'Скачать брошюру')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BachelorInternational;