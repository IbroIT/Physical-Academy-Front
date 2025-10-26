import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const Scopus = () => {
  const { t, i18n } = useTranslation();
  const [activePublication, setActivePublication] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedPublication, setExpandedPublication] = useState(null);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedDocumentType, setSelectedDocumentType] = useState('all');
  const [selectedJournal, setSelectedJournal] = useState('all');
  
  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    stats: [],
    publications: [],
    documentTypes: [],
    metrics: [],
    authors: [],
    journals: [],
    publishers: [],
    publicationAuthors: [],
    sections: [],
    loading: false,
    error: null
  });
  
  const sectionRef = useRef(null);

  // Получение текущего языка для API
  const getApiLanguage = useCallback(() => {
    const langMap = {
      'en': 'en',
      'ru': 'ru',
      'kg': 'kg'
    };
    return langMap[i18n.language] || 'ru';
  }, [i18n.language]);

  // Функция для загрузки данных с бэкенда
  const fetchBackendData = useCallback(async () => {
    try {
      setBackendData(prev => ({ 
        ...prev, 
        loading: true, 
        error: null 
      }));
      
      const lang = getApiLanguage();
      
      const API_URL = import.meta.env.VITE_API_URL;

      const endpoints = [
        `${API_URL}/api/science/scopus-stats/?lang=${lang}`,
        `${API_URL}/api/science/scopus-publications/?lang=${lang}`,
        `${API_URL}/api/science/scopus-document-types/?lang=${lang}`,
        `${API_URL}/api/science/scopus-metrics/?lang=${lang}`,
        `${API_URL}/api/science/scopus-authors/?lang=${lang}`,
        `${API_URL}/api/science/scopus-journals/?lang=${lang}`,
        `${API_URL}/api/science/scopus-publishers/?lang=${lang}`,
        `${API_URL}/api/science/scopus-publication-authors/?lang=${lang}`,
        `${API_URL}/api/science/scopus-sections/?lang=${lang}`
      ];


      const responses = await Promise.all(
        endpoints.map(async (url) => {
          try {
            const response = await fetch(url);
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
          } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            return { results: [] };
          }
        })
      );

      setBackendData({
        stats: responses[0].results || [],
        publications: responses[1].results || [],
        documentTypes: responses[2].results || [],
        metrics: responses[3].results || [],
        authors: responses[4].results || [],
        journals: responses[5].results || [],
        publishers: responses[6].results || [],
        publicationAuthors: responses[7].results || [],
        sections: responses[8].results || [],
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching scopus data:', error);
      setBackendData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  }, [getApiLanguage]);

  // Загрузка данных при монтировании и изменении языка
  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

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

  // Автопереключение публикаций
  useEffect(() => {
    const filteredPublications = getFilteredPublications();
    if (filteredPublications.length > 1) {
      const interval = setInterval(() => {
        setActivePublication(prev => (prev + 1) % filteredPublications.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [backendData.publications, selectedYear, selectedDocumentType, selectedJournal]);

  const togglePublication = (index) => {
    setExpandedPublication(expandedPublication === index ? null : index);
  };

  // Получение уникальных годов
  const getPublicationYears = () => {
    const years = backendData.publications.map(pub => pub.year).filter(Boolean);
    return ['all', ...new Set(years)].sort((a, b) => b - a);
  };

  // Получение уникальных журналов
  const getPublicationJournals = () => {
    const journals = backendData.publications.map(pub => pub.journal_name).filter(Boolean);
    return ['all', ...new Set(journals)];
  };

  // Фильтрация публикаций
  const getFilteredPublications = () => {
    let filtered = backendData.publications;

    if (selectedYear !== 'all') {
      filtered = filtered.filter(pub => pub.year === parseInt(selectedYear));
    }

    if (selectedDocumentType !== 'all') {
      filtered = filtered.filter(pub => pub.document_type === selectedDocumentType);
    }

    if (selectedJournal !== 'all') {
      filtered = filtered.filter(pub => pub.journal_name === selectedJournal);
    }

    return filtered;
  };

  // Получение заголовка на текущем языке
  const getLocalizedTitle = (publication) => {
    const lang = i18n.language;
    if (lang === 'ru' && publication.title_ru) return publication.title_ru;
    if (lang === 'en' && publication.title_en) return publication.title_en;
    if (lang === 'kg' && publication.title_kg) return publication.title_kg;
    return publication.title;
  };

  // Получение аннотации на текущем языке
  const getLocalizedAbstract = (publication) => {
    const lang = i18n.language;
    if (lang === 'ru' && publication.abstract_ru) return publication.abstract_ru;
    if (lang === 'en' && publication.abstract_en) return publication.abstract_en;
    if (lang === 'kg' && publication.abstract_kg) return publication.abstract_kg;
    return '';
  };

  // Получение авторов для публикации
  const getPublicationAuthors = (publicationId) => {
    return backendData.publicationAuthors
      .filter(pa => pa.publication === publicationId)
      .sort((a, b) => a.author_position - b.author_position)
      .map(pa => pa.author);
  };

  // Компонент загрузки
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className="bg-white/10 rounded-2xl h-8 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white/5 rounded-3xl p-6 space-y-4">
            <div className="bg-white/10 rounded-2xl h-6 w-3/4"></div>
            <div className="bg-white/10 rounded-2xl h-4"></div>
            <div className="bg-white/10 rounded-2xl h-4 w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );

  // Компонент ошибки
  const ErrorMessage = ({ onRetry }) => (
    <div className="text-center py-12">
      <div className="text-red-400 text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl text-white mb-4">
        {t('scopus.errorTitle')}
      </h2>
      <p className="text-blue-200 mb-6">
        {backendData.error}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
      >
        {t('scopus.retry')}
      </button>
    </div>
  );

  const filteredPublications = getFilteredPublications();
  const publicationYears = getPublicationYears();
  const publicationJournals = getPublicationJournals();

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
        
        {/* Символы науки */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🔬</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">📊</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">📚</div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">🌍</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-2xl"
          >
            📚
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t('scopus.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t('scopus.subtitle')}
          </p>
        </motion.div>
        {backendData.error ? (
          <ErrorMessage onRetry={fetchBackendData} />
        ) : (
          <>
           

            {/* Актив публикация */}
            {filteredPublications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-12 lg:mb-16"
              >
                <motion.div
                  key={activePublication}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-6 lg:p-8 backdrop-blur-sm border border-white/20"
                >
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Информация о публикации */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                          📄
                        </div>
                        <div>
                          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                            {getLocalizedTitle(filteredPublications[activePublication])}
                          </h3>
                          <p className="text-blue-300">
                            {filteredPublications[activePublication]?.year} • {filteredPublications[activePublication]?.journal_name}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-blue-200 mb-6 leading-relaxed line-clamp-3">
                        {getLocalizedAbstract(filteredPublications[activePublication])}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                          <h4 className="font-bold text-blue-300 mb-2 text-sm">
                            {t('scopus.citations')}
                          </h4>
                          <p className="text-white font-bold text-2xl">
                            {filteredPublications[activePublication]?.citation_count || 0}
                          </p>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                          <h4 className="font-bold text-emerald-300 mb-2 text-sm">
                            {t('scopus.year')}
                          </h4>
                          <p className="text-white font-bold text-xl">
                            {filteredPublications[activePublication]?.year}
                          </p>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                          <h4 className="font-bold text-cyan-300 mb-2 text-sm">
                            {t('scopus.doi')}
                          </h4>
                          <p className="text-white font-mono text-sm truncate">
                            {filteredPublications[activePublication]?.doi || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Авторы */}
                      {getPublicationAuthors(filteredPublications[activePublication]?.id).length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-bold text-white mb-3">{t('scopus.authors')}</h4>
                          <div className="flex flex-wrap gap-2">
                            {getPublicationAuthors(filteredPublications[activePublication]?.id).map((author, index) => (
                              <span
                                key={author.id}
                                className="px-3 py-1 bg-white/10 text-blue-200 rounded-full text-sm border border-white/10"
                              >
                                {author.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Действия */}
                    <div className="w-full lg:w-64 space-y-4">
                      {filteredPublications[activePublication]?.url && (
                        <motion.a
                          href={filteredPublications[activePublication]?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>🔗</span>
                          <span>{t('scopus.viewPublication')}</span>
                        </motion.a>
                      )}
                      
                      {filteredPublications[activePublication]?.doi && (
                        <motion.a
                          href={`https://doi.org/${filteredPublications[activePublication]?.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center space-x-2 p-4 bg-white/5 border border-white/10 hover:border-emerald-400/30 text-white font-semibold rounded-xl transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                        >
                          <span>📖</span>
                          <span>{t('scopus.viewDOI')}</span>
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Все публикации */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {backendData.loading ? (
                <LoadingSkeleton />
              ) : filteredPublications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  {filteredPublications.map((publication, index) => (
                    <motion.div
                      key={publication.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white/5 rounded-3xl backdrop-blur-sm border cursor-pointer transition-all duration-300 overflow-hidden ${
                        activePublication === index
                          ? 'bg-white/10 border-emerald-400/50 shadow-2xl'
                          : 'border-white/10 hover:bg-white/10 hover:border-emerald-400/30'
                      }`}
                      onClick={() => {
                        setActivePublication(index);
                        setExpandedPublication(expandedPublication === index ? null : index);
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {/* Заголовок публикации */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-lg mb-2 line-clamp-2">
                              {getLocalizedTitle(publication)}
                            </h4>
                            <p className="text-blue-300 text-sm mb-2">
                              {publication.journal_name} • {publication.year}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-emerald-400 font-bold text-xl">
                              {publication.citation_count || 0}
                            </div>
                            <div className="text-blue-300 text-xs">
                              {t('scopus.citations')}
                            </div>
                          </div>
                        </div>

                        <p className="text-blue-200 text-sm line-clamp-3 mb-4">
                          {getLocalizedAbstract(publication)}
                        </p>

                        {/* Авторы */}
                        {getPublicationAuthors(publication.id).length > 0 && (
                          <div className="mb-4">
                            <p className="text-blue-300 text-xs font-semibold mb-2">
                              {t('scopus.authors')}:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {getPublicationAuthors(publication.id).slice(0, 3).map((author, idx) => (
                                <span
                                  key={author.id}
                                  className="px-2 py-1 bg-white/5 text-blue-200 rounded text-xs border border-white/5"
                                >
                                  {author.name}
                                </span>
                              ))}
                              {getPublicationAuthors(publication.id).length > 3 && (
                                <span className="px-2 py-1 bg-white/5 text-blue-300 rounded text-xs">
                                  +{getPublicationAuthors(publication.id).length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePublication(index);
                          }}
                          className="w-full flex items-center justify-center space-x-2 py-2 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300"
                        >
                          <span className="text-blue-300 text-sm">
                            {expandedPublication === index 
                              ? t('scopus.showLess') 
                              : t('scopus.showMore')
                            }
                          </span>
                          <svg
                            className={`w-4 h-4 text-blue-300 transition-transform duration-300 ${
                              expandedPublication === index ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      {/* Раскрывающаяся детальная информация */}
                      <AnimatePresence>
                        {expandedPublication === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-6 pb-6 border-t border-white/10 pt-4">
                              <div className="space-y-4">
                                {/* Полное описание */}
                                <div>
                                  <h5 className="font-semibold text-white mb-2 text-sm">
                                    {t('scopus.abstract')}
                                  </h5>
                                  <p className="text-blue-100 text-sm leading-relaxed">
                                    {getLocalizedAbstract(publication)}
                                  </p>
                                </div>

                                {/* Детальная информация */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="bg-white/5 rounded-xl p-3">
                                    <p className="text-blue-300 mb-1">{t('scopus.doi')}</p>
                                    <p className="text-white font-mono text-xs">
                                      {publication.doi || 'N/A'}
                                    </p>
                                  </div>
                                  <div className="bg-white/5 rounded-xl p-3">
                                    <p className="text-emerald-300 mb-1">{t('scopus.journal')}</p>
                                    <p className="text-white text-sm">
                                      {publication.journal_name}
                                    </p>
                                  </div>
                                </div>

                                {/* Ссылки */}
                                <div className="flex space-x-3">
                                  {publication.url && (
                                    <motion.a
                                      href={publication.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 hover:border-blue-400 transition-all duration-300 text-sm"
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      <span>🔗</span>
                                      <span>{t('scopus.view')}</span>
                                    </motion.a>
                                  )}
                                  {publication.doi && (
                                    <motion.a
                                      href={`https://doi.org/${publication.doi}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/30 hover:border-emerald-400 transition-all duration-300 text-sm"
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      <span>📖</span>
                                      <span>DOI</span>
                                    </motion.a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 text-blue-300">📚</div>
                  <h3 className="text-xl text-white mb-2">
                    {t('scopus.noPublications')}
                  </h3>
                  <p className="text-blue-200">
                    {t('scopus.noPublicationsDescription')}
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default Scopus;