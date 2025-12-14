import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../../../../utils/imageUtils';

const FacultyInfoComponent = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('history');
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabsData, setTabsData] = useState([]);
  const [loadingTabs, setLoadingTabs] = useState(false);
  const [errorTabs, setErrorTabs] = useState(null);
  const [cardsData, setCardsData] = useState({});
  const [expandedDepartments, setExpandedDepartments] = useState({});

  useEffect(() => {
    const fetchTabsAndCards = async () => {
      setLoadingTabs(true);
      setErrorTabs(null);
      try {
        const lang = i18n.language === 'ru' ? 'ru' : i18n.language === 'en' ? 'en' : 'kg';
        const tabsResponse = await fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/faculties/pedagogical/tabs/?lang=${lang}`);
        if (!tabsResponse.ok) {
          throw new Error('Failed to fetch tabs data');
        }
        const tabs = await tabsResponse.json();
        setTabsData(tabs.sort((a, b) => a.order - b.order));

        // Fetch cards for each tab except history, Specializations and departments
        const cardsPromises = tabs
          .filter(tab => tab.key !== 'history' && tab.key !== 'Specializations' && tab.key !== 'departments')
          .map(tab => fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/faculties/pedagogical/cards/?tab=${tab.key}&lang=${lang}`)
            .then(res => res.ok ? res.json() : [])
            .then(data => ({ key: tab.key, data: data.sort((a, b) => a.order - b.order) })));

        const cardsResults = await Promise.all(cardsPromises);
        const newCardsData = {};
        cardsResults.forEach(({ key, data }) => {
          newCardsData[key] = data;
        });
        setCardsData(newCardsData);
      } catch (err) {
        setErrorTabs(err.message);
      } finally {
        setLoadingTabs(false);
      }
    };

    fetchTabsAndCards();
  }, [i18n.language]);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const lang = i18n.language === 'ru' ? 'ru' : i18n.language === 'en' ? 'en' : 'kg';
        const response = await fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/faculties/pedagogical/history/?lang=${lang}`);
        if (!response.ok) {
          throw new Error('Failed to fetch history data');
        }
        const data = await response.json();
        setHistoryData(data.sort((a, b) => a.order - b.order));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [i18n.language]);

  const getDefaultIcon = (key) => {
    switch (key) {
      case 'history':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'about':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'management':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'specializations':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'departments':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const tabs = tabsData.map(tab => ({
    ...tab,
    icon: tab.icon ? <img src={getImageUrl(tab.icon)} alt={tab.title} className="w-6 h-6" /> : getDefaultIcon(tab.key)
  }));

  const getCardsData = () => {
    return cardsData[activeTab] || [];
  };

  const getHistoryTimeline = () => {
    return historyData;
  };

  const getActiveTabTitle = () => {
    const tab = tabs.find(tab => tab.key === activeTab);
    return tab ? tab.title : tabs[0]?.title || '';
  };

  const toggleDepartment = (departmentId) => {
    setExpandedDepartments(prev => ({
      ...prev,
      [departmentId]: !prev[departmentId]
    }));
  };

  const renderContent = () => {
    if (activeTab === 'history') {
      if (loading) {
        return (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        );
      }
      if (error) {
        return (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading history: {error}</p>
          </div>
        );
      }
      const timeline = getHistoryTimeline();
      return (
        <div>
          <div className="mb-6">
            <img 
              src="/img1.jpeg" 
              alt="История факультета" 
              className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
            />
          </div>
          <p>Педагогический факультет физической культуры был создан в 1950 году как первый факультет в системе высшего спортивного образования Кыргызстана.</p>
          <p>Факультет стал основой для развития системы физического воспитания и спортивного образования в республике.</p>
          <p>За более чем 70 лет существования факультет подготовил тысячи учителей физической культуры, тренеров и специалистов в области спортивной педагогики.</p>
        </div>
      );
    } else {
      if (loadingTabs) {
        return (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        );
      }
      
      if (activeTab === 'about') {
        return (
          <div>
            <p>Педагогический факультет физической культуры готовит учителей физической культуры и тренеров-преподавателей для общеобразовательных школ и спортивных учреждений.</p>
            <p>Студенты изучают методику преподавания физической культуры, возрастную физиологию, спортивную медицину и организацию спортивно-массовой работы.</p>
            <p>Выпускники факультета работают учителями в школах, преподавателями в колледжах и тренерами в спортивных организациях, способствуя развитию физической культуры среди населения.</p>
          </div>
        );
      }

      if (activeTab === 'management') {
        const managementData = [
          {
            id: 1,
            name: 'Иванов Иван Иванович',
            position: 'Декан факультета',
            phone: '+996 (312) 12-34-56',
            email: 'ivanov@academy.kg',
            resume_url: '#',
            photo: '/img1.jpeg'
          },
          {
            id: 2,
            name: 'Петрова Мария Сергеевна',
            position: 'Заместитель декана',
            phone: '+996 (312) 12-34-57',
            email: 'petrova@academy.kg',
            resume_url: '#',
            photo: '/img1.jpeg'
          },
          {
            id: 3,
            name: 'Сидоров Алексей Петрович',
            position: 'Заведующий кафедрой',
            phone: '+996 (312) 12-34-58',
            email: 'sidorov@academy.kg',
            resume_url: '#',
            photo: '/img1.jpeg'
          }
        ];

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managementData.map((person) => (
              <div key={person.id} className="bg-white rounded-xl border border-blue-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transform">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 mx-auto border-4 border-blue-100">
                  <img 
                    src={person.photo} 
                    alt={person.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2 text-center">{person.name}</h3>
                <p className="text-gray-600 mb-3 text-center font-medium">{person.position}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{person.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{person.email}</span>
                  </div>
                </div>
                <a
                  href={person.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-green-600 transition-all duration-300 text-center block"
                >
                  Посмотреть резюме
                </a>
              </div>
            ))}
          </div>
        );
      }

      if (activeTab === 'Specializations') {
        const specializationsData = [
          'Физическая культура и спорт',
          'Спортивная педагогика',
          'Адаптивная физическая культура',
          'Спортивный менеджмент',
          'Оздоровительная физическая культура',
          'Теория и методика физического воспитания'
        ];

        return (
          <div className="space-y-4">
            {specializationsData.map((spec, index) => (
              <div key={index} className="bg-white rounded-lg border border-blue-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900">{spec}</h3>
                </div>
              </div>
            ))}
          </div>
        );
      }

      if (activeTab === 'departments') {
        const departmentsData = [
          {
            id: 1,
            name: 'Кафедра теории и методики физического воспитания',
            description: 'Кафедра занимается разработкой современных методик преподавания физической культуры, подготовкой учебных программ и проведением научных исследований в области спортивной педагогики.',
            staff: [
              {
                id: 1,
                name: 'Профессор Иванов Иван Иванович',
                position: 'Заведующий кафедрой',
                resume_url: '/resumes/ivanov.pdf'
              },
              {
                id: 2,
                name: 'Доцент Петрова Мария Сергеевна',
                position: 'Старший преподаватель',
                resume_url: '/resumes/petrova.pdf'
              },
              {
                id: 3,
                name: 'Старший преподаватель Сидоров Алексей Петрович',
                position: 'Преподаватель',
                resume_url: '/resumes/sidorov.pdf'
              }
            ]
          },
          {
            id: 2,
            name: 'Кафедра спортивной медицины и лечебной физкультуры',
            description: 'Кафедра специализируется на медицинских аспектах физической культуры, реабилитации спортсменов и профилактике спортивных травм.',
            staff: [
              {
                id: 4,
                name: 'Профессор Козлова Анна Викторовна',
                position: 'Заведующий кафедрой',
                resume_url: '/resumes/kozlova.pdf'
              },
              {
                id: 5,
                name: 'Доцент Николаев Дмитрий Андреевич',
                position: 'Старший преподаватель',
                resume_url: '/resumes/nikolaev.pdf'
              }
            ]
          },
          {
            id: 3,
            name: 'Кафедра спортивных игр и единоборств',
            description: 'Кафедра готовит специалистов по различным видам спортивных игр и единоборств, разрабатывает тренировочные программы и методики.',
            staff: [
              {
                id: 6,
                name: 'Профессор Михайлов Сергей Петрович',
                position: 'Заведующий кафедрой',
                resume_url: '/resumes/mikhailov.pdf'
              },
              {
                id: 7,
                name: 'Доцент Сергеева Ольга Ивановна',
                position: 'Старший преподаватель',
                resume_url: '/resumes/sergeeva.pdf'
              },
              {
                id: 8,
                name: 'Старший преподаватель Волков Андрей Михайлович',
                position: 'Преподаватель',
                resume_url: '/resumes/volkov.pdf'
              }
            ]
          }
        ];

        return (
          <div className="space-y-4">
            {departmentsData.map((department) => (
              <div key={department.id} className="bg-white rounded-lg border border-blue-200 shadow-sm">
                <button
                  onClick={() => toggleDepartment(department.id)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-blue-50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900">{department.name}</h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-blue-600 transform transition-transform duration-200 ${
                      expandedDepartments[department.id] ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedDepartments[department.id] && (
                  <div className="px-4 pb-4 border-t border-blue-100">
                    <div className="pt-4">
                      <p className="text-gray-700 mb-6">{department.description}</p>

                      <h4 className="text-lg font-semibold text-blue-900 mb-4">Сотрудники кафедры</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {department.staff.map((person) => (
                          <div key={person.id} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <h5 className="font-semibold text-blue-900 mb-1">{person.name}</h5>
                            <p className="text-gray-600 text-sm mb-3">{person.position}</p>
                            <a
                              href={person.resume_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Посмотреть резюме
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }
      
      const cards = getCardsData();
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.id} className="bg-white rounded-xl border border-blue-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transform">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <div className="w-6 h-6 rounded-full bg-green-500"></div>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">{card.title}</h3>
              <p className="text-gray-700">{card.description}</p>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Заголовок и описание */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
            {t('faculty.pedagogical.title')}
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg md:text-xl text-gray-700">
              {t('faculty.pedagogical.description')}
            </p>
          </div>
        </div>

        {/* Табы */}
        {loadingTabs ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : errorTabs ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading tabs: {errorTabs}</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg'
                    : 'bg-white text-blue-900 hover:bg-blue-50 border border-blue-200'
                }`}
              >
                {tab.icon}
                <span>{tab.title}</span>
              </button>
            ))}
          </div>
        )}

        {/* Контент */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 p-6 md:p-8">
          <div className="flex items-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center mr-4">
              {tabs.find(t => t.key === activeTab)?.icon}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-blue-900">
                {getActiveTabTitle()}
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mt-2"></div>
            </div>
          </div>
          
          {renderContent()}
        </div>

      </div>
    </div>
  );
};

export default FacultyInfoComponent;