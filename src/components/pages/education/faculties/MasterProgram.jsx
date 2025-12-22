import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const MasterProgram = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [programDetails, setProgramDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Получаем список всех магистерских программ
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const API_URL = import.meta.env.VITE_API_URL || 'https://physical-academy-backend-3dccb860f75a.herokuapp.com';
        const response = await fetch(
          `${API_URL}/api/education/master-programs/?lang=${i18n.language}`
        );
        
        if (!response.ok) {
          throw new Error(t('masterProgram.errors.fetchFailed'));
        }
        
        const data = await response.json();
        console.log('Master programs API response:', data);
        
        // Обработка различных форматов ответа API
        let programsArray = [];
        if (Array.isArray(data)) {
          programsArray = data;
        } else if (data && Array.isArray(data.results)) {
          programsArray = data.results;
        } else if (data && Array.isArray(data.data)) {
          programsArray = data.data;
        } else if (data && Array.isArray(data.programs)) {
          programsArray = data.programs;
        } else {
          console.warn('Unexpected API response format:', data);
          programsArray = [];
        }
        
        // Добавляем цвета для табов
        const colors = ['blue', 'green', 'blue-600', 'green-600', 'blue-700'];
        const programsWithColors = programsArray.map((program, index) => ({
          ...program,
          color: colors[index % colors.length]
        }));
        
        setPrograms(programsWithColors);
        if (programsWithColors.length > 0) {
          setActiveTab(programsWithColors[0].id);
        }
      } catch (err) {
        setError(err.message || t('masterProgram.errors.unknown'));
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [i18n.language, t]);

  // Получаем детали конкретной программы по ID
  useEffect(() => {
    if (!activeTab) return;

    const fetchProgramDetails = async () => {
      setLoadingDetails(true);
      setErrorDetails(null);
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://physical-academy-backend-3dccb860f75a.herokuapp.com';
        const url = `${API_URL}/api/education/master-programs/${activeTab}/?lang=${i18n.language}`;
        console.log('Fetching program details from:', url);
        
        const response = await fetch(url);
        console.log('Program details response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`${t('masterProgram.errors.detailsFailed')}: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Program details data:', data);
        
        // Обработка различных форматов ответа API
        let programData = data;
        if (data && typeof data === 'object') {
          if (data.data) programData = data.data;
          else if (data.result) programData = data.result;
          else if (data.program) programData = data.program;
          
          // Стандартизация полей
          if (!programData.description && programData.info?.description) {
            programData.description = programData.info.description;
          }
          if (!programData.curriculum && programData.courses) {
            programData.curriculum = programData.courses;
          }
          if (!programData.faculty && programData.teachers) {
            programData.faculty = programData.teachers;
          }
        }
        
        console.log('Processed program data:', programData);
        setProgramDetails(programData);
      } catch (err) {
        console.error('Error fetching program details:', err);
        setErrorDetails(err.message || t('masterProgram.errors.unknown'));
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchProgramDetails();
  }, [activeTab, i18n.language, t]);

  const getColorStyles = (color) => {
    const colorMap = {
      blue: {
        border: 'border-blue-500',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        accent: 'bg-blue-500',
        gradient: 'from-blue-500 to-blue-600',
        hoverGradient: 'from-blue-600 to-blue-700'
      },
      green: {
        border: 'border-green-500',
        bg: 'bg-green-50',
        text: 'text-green-700',
        accent: 'bg-green-500',
        gradient: 'from-green-500 to-green-600',
        hoverGradient: 'from-green-600 to-green-700'
      },
      'blue-600': {
        border: 'border-blue-600',
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        accent: 'bg-blue-600',
        gradient: 'from-blue-600 to-blue-700',
        hoverGradient: 'from-blue-700 to-blue-800'
      },
      'green-600': {
        border: 'border-green-600',
        bg: 'bg-green-100',
        text: 'text-green-800',
        accent: 'bg-green-600',
        gradient: 'from-green-600 to-green-700',
        hoverGradient: 'from-green-700 to-green-800'
      },
      'blue-700': {
        border: 'border-blue-700',
        bg: 'bg-blue-50',
        text: 'text-blue-900',
        accent: 'bg-blue-700',
        gradient: 'from-blue-700 to-blue-800',
        hoverGradient: 'from-blue-800 to-blue-900'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  const getActiveTabStyle = (tabId) => {
    if (!Array.isArray(programs)) return '';
    const program = programs.find(prog => prog.id === tabId);
    if (!program) return '';
    const styles = getColorStyles(program.color);
    return `${styles.border} ${styles.bg} ${styles.text}`;
  };

  const getActiveProgram = () => {
    if (!Array.isArray(programs) || !activeTab) return null;
    return programs.find(prog => prog.id === activeTab);
  };

  const handleLearnMore = (program) => {
    setSelectedProgram(program);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProgram(null);
  };

  const handleApplyNow = () => {
    // В реальном приложении здесь будет логика открытия формы заявки
    alert(t('masterProgram.applicationSuccess'));
  };

  // Функция для форматирования стоимости обучения
  const formatTuitionFee = (fee) => {
    if (!fee || fee === "0.00") return t('masterProgram.freeTuition');
    return `${fee} ₽/${t('masterProgram.perYear')}`;
  };

  // Функция для получения формата обучения
  const getStudyFormat = (program) => {
    if (program.online && program.offline) {
      return t('masterProgram.formatHybrid');
    } else if (program.online) {
      return t('masterProgram.formatOnline');
    } else {
      return t('masterProgram.formatFullTime');
    }
  };

  // Функция для получения продолжительности
  const getDuration = (program) => {
    if (program.duration_years) {
      return `${program.duration_years} ${t('masterProgram.years')}`;
    } else if (program.duration) {
      return program.duration;
    }
    return t('masterProgram.defaultDuration');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('masterProgram.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 inline-block">
            <p className="text-red-500 font-semibold mb-2">{t('masterProgram.errorTitle')}</p>
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              {t('masterProgram.retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeProgram = getActiveProgram();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            {t('masterProgram.title')}
          </h1>
          <div className="w-20 h-1 bg-green-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('masterProgram.subtitle')}
          </p>
        </div>
        
        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {Array.isArray(programs) && programs.map((program) => {
            const styles = getColorStyles(program.color);
            return (
              <button
                key={program.id}
                onClick={() => setActiveTab(program.id)}
                className={`
                  px-6 py-3 rounded-xl font-semibold transition-all duration-300
                  transform hover:-translate-y-1 hover:shadow-lg
                  ${activeTab === program.id 
                    ? `border-b-4 ${getActiveTabStyle(program.id)} shadow-md` 
                    : 'bg-white text-gray-700 border-b-2 border-gray-200 hover:bg-gray-50'
                  }
                `}
              >
                {program.name || program.title}
              </button>
            );
          })}
        </div>

        {/* Основной контент */}
        {activeProgram && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
            <div className={`h-2 ${getColorStyles(activeProgram.color).accent}`} />
            <div className="p-8 md:p-12">
              {/* Заголовок программы */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {activeProgram.name || activeProgram.title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      {getDuration(activeProgram)}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      {getStudyFormat(activeProgram)}
                    </span>
                    {activeProgram.tuition_fee && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                        {formatTuitionFee(activeProgram.tuition_fee)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Контент программы */}
              {loadingDetails ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  <p className="ml-4 text-gray-600">{t('masterProgram.loadingDetails')}</p>
                </div>
              ) : errorDetails ? (
                <div className="text-center py-8">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-red-800 font-semibold mb-2">{t('masterProgram.errorDetailsTitle')}</h3>
                    <p className="text-red-600">{errorDetails}</p>
                  </div>
                </div>
              ) : programDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Описание программы */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                      {t('masterProgram.aboutProgram')}
                    </h3>
                    <div className="prose prose-lg max-w-none mb-8">
                      {programDetails.description ? (
                        <div 
                          className="text-gray-600 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: programDetails.description }}
                        />
                      ) : (
                        <p className="text-gray-500 italic">{t('masterProgram.noDescription')}</p>
                      )}
                    </div>
                  </div>
                  {/* Карточка преподавателя справа */}
                  <div className="flex justify-end">
                    <div className="w-full max-w-xs">
                      {programDetails.faculty && Array.isArray(programDetails.faculty) && programDetails.faculty.length > 0 && (
                        programDetails.faculty.slice(0, 1).map((teacher, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-blue-400 flex flex-col items-center"
                            style={{ minWidth: 320 }}
                          >
                            <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-blue-200 bg-gray-100 flex items-center justify-center">
                              <img
                                src={teacher.photo || teacher.image || '/default-avatar.png'}
                                alt={teacher.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = '/default-avatar.png';
                                }}
                              />
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-bold text-blue-900 mb-1">
                                {teacher.name}
                              </div>
                              <div className="text-gray-600 mb-4">
                                {teacher.position}
                              </div>
                              {teacher.phone && (
                                <div className="flex items-center justify-center text-gray-700 mb-1">
                                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.3 1.2a2 2 0 01-.45 1.95l-.7.7a16.001 16.001 0 006.36 6.36l.7-.7a2 2 0 011.95-.45l1.2.3A2 2 0 0121 18.72V21a2 2 0 01-2 2h-1C7.163 23 1 16.837 1 9V8a2 2 0 012-2z" /></svg>
                                  <a href={`tel:${teacher.phone}`} className="text-sm font-medium">
                                    {teacher.phone}
                                  </a>
                                </div>
                              )}
                              {teacher.email && (
                                <div className="flex items-center justify-center text-gray-700">
                                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm2 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-1" /></svg>
                                  <a href={`mailto:${teacher.email}`} className="text-sm font-medium break-all">
                                    {teacher.email}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t('masterProgram.noDetails')}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterProgram;