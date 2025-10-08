import { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const ScientificPublications = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [activeStat, setActiveStat] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          startCounters();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Автопереключение статистики
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const startCounters = () => {
    const stats = t('science.sections.publications.stats', { returnObjects: true });
    const targetValues = stats.map(stat => parseInt(stat.value.replace(/\D/g, '')));
    const duration = 2000;
    const steps = 60;
    const stepValues = targetValues.map(target => target / steps);

    let currentStep = 0;
    const counterInterval = setInterval(() => {
      currentStep++;
      setCounterValues(prev => 
        prev.map((value, index) => {
          if (currentStep <= steps) {
            return Math.min(value + stepValues[index], targetValues[index]);
          }
          return value;
        })
      );

      if (currentStep >= steps) {
        clearInterval(counterInterval);
      }
    }, duration / steps);
  };

  const publications = t('science.sections.publications.publications', { returnObjects: true });
  const stats = t('science.sections.publications.stats', { returnObjects: true });

  const filteredPublications = useMemo(() => {
    let filtered = publications.filter(pub => 
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      pub.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (filterYear !== 'all') {
      filtered = filtered.filter(pub => pub.year === filterYear);
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'citations') return b.citations - a.citations;
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      return 0;
    });
  }, [publications, searchTerm, filterYear, sortBy]);

  const years = [...new Set(publications.map(pub => pub.year))].sort((a, b) => b - a);

  const resetFilters = () => {
    setSearchTerm('');
    setFilterYear('all');
    setSortBy('date');
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон с научными элементами */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Научные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🔬</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">📊</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">📚</div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">🎓</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
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
            {t('science.sections.publications.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t('science.sections.publications.subtitle')}
          </p>
        </motion.div>

        {/* Статистика с анимацией */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12 lg:mb-16">
          {/* Активная статистика */}
          <motion.div
            key={activeStat}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
          >
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                {stats[activeStat]?.icon}
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  {stats[activeStat]?.label}
                </h3>
                <div className="text-4xl lg:text-5xl font-bold text-emerald-400 font-mono">
                  {stats[activeStat]?.value.includes('%') 
                    ? `${Math.round(counterValues[activeStat])}%`
                    : stats[activeStat]?.value.includes('+')
                    ? `${Math.round(counterValues[activeStat])}+`
                    : Math.round(counterValues[activeStat])
                  }
                </div>
              </div>
            </div>
          </motion.div>

          {/* Вся статистика */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
                  activeStat === index
                    ? 'border-emerald-400/50 bg-white/10 shadow-lg'
                    : 'border-white/10 hover:border-emerald-400/30'
                }`}
                onClick={() => setActiveStat(index)}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl mb-3">{stat.icon}</div>
                <div className="text-2xl font-bold text-emerald-400 mb-1 font-mono">
                  {stat.value.includes('%') 
                    ? `${Math.round(counterValues[index])}%`
                    : stat.value.includes('+')
                    ? `${Math.round(counterValues[index])}+`
                    : Math.round(counterValues[index])
                  }
                </div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Фильтры и поиск */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
            <div className="relative">
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Поиск публикаций
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Название, автор, ключевые слова..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-lg text-white placeholder-blue-300 backdrop-blur-sm"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 text-xl">🔍</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Год публикации
              </label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-lg text-white backdrop-blur-sm"
              >
                <option value="all" className="bg-slate-800">Все годы</option>
                {years.map(year => (
                  <option key={year} value={year} className="bg-slate-800">{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Сортировка
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-lg text-white backdrop-blur-sm"
              >
                <option value="date" className="bg-slate-800">По дате публикации</option>
                <option value="citations" className="bg-slate-800">По количеству цитирований</option>
              </select>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetFilters}
                className="w-full px-4 py-3 border-2 border-white/20 text-blue-200 rounded-2xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 font-medium text-lg backdrop-blur-sm"
              >
                Сбросить фильтры
              </motion.button>
            </div>
          </div>

          {/* Active filters info */}
          <AnimatePresence>
            {(searchTerm || filterYear !== 'all') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 flex flex-wrap gap-2"
              >
                {searchTerm && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm backdrop-blur-sm"
                  >
                    Поиск: "{searchTerm}"
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="ml-2 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </motion.span>
                )}
                {filterYear !== 'all' && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm backdrop-blur-sm"
                  >
                    Год: {filterYear}
                    <button 
                      onClick={() => setFilterYear('all')}
                      className="ml-2 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </motion.span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <p className="text-blue-200 text-lg">
              Найдено публикаций: <span className="font-semibold text-white">{filteredPublications.length}</span>
            </p>
            {filteredPublications.length > 0 && (
              <p className="text-blue-300 text-sm">
                Сортировка: {sortBy === 'date' ? 'по дате' : 'по цитированиям'}
              </p>
            )}
          </div>

          {/* Список публикаций */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredPublications.map((pub, index) => (
                <PublicationCard 
                  key={pub.id || index} 
                  publication={pub} 
                  index={index}
                  onSelect={setSelectedPublication}
                />
              ))}
            </AnimatePresence>
          </div>

          {filteredPublications.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm"
            >
              <div className="text-6xl mb-4 text-blue-300 opacity-60">🔍</div>
              <h3 className="text-2xl font-semibold text-white mb-2">Публикации не найдены</h3>
              <p className="text-blue-200 text-lg mb-6">Попробуйте изменить параметры поиска</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetFilters}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-2xl hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 font-medium shadow-lg"
              >
                Сбросить фильтры
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Publication Modal */}
        <AnimatePresence>
          {selectedPublication && (
            <PublicationModal 
              publication={selectedPublication}
              onClose={() => setSelectedPublication(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const PublicationCard = ({ publication, index, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    onSelect(publication);
  };

  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    if (action === 'pdf') {
      window.open(publication.pdfLink, '_blank');
    } else if (action === 'cite') {
      navigator.clipboard.writeText(publication.citation);
      // You could add a toast notification here
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 rounded-3xl p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-500 backdrop-blur-sm group cursor-pointer relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      whileHover={{ scale: 1.02 }}
    >
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors duration-300 mb-3 leading-tight">
              {publication.title}
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {publication.authors.map((author, i) => (
                <motion.span 
                  key={i} 
                  className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-xl text-sm font-medium hover:bg-blue-500/30 transition-colors duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  {author}
                </motion.span>
              ))}
            </div>
          </div>
          <span className="text-3xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 flex-shrink-0 ml-4">📖</span>
        </div>
        
        <p className="text-blue-200 mb-4 leading-relaxed line-clamp-3">
          {publication.abstract}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-2 bg-emerald-500/20 text-emerald-300 rounded-xl text-sm font-medium backdrop-blur-sm">
            {publication.journal}
          </span>
          <span className="px-3 py-2 bg-blue-500/20 text-blue-300 rounded-xl text-sm font-medium backdrop-blur-sm">
            {publication.year}
          </span>
          <span className="px-3 py-2 bg-purple-500/20 text-purple-300 rounded-xl text-sm font-medium backdrop-blur-sm">
            {publication.citations} цитирований
          </span>
          <span className="px-3 py-2 bg-orange-500/20 text-orange-300 rounded-xl text-sm font-medium backdrop-blur-sm">
            {publication.type}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {publication.keywords.slice(0, 4).map((keyword, i) => (
            <motion.span 
              key={i} 
              className="px-3 py-1 bg-white/10 text-blue-200 rounded-xl text-sm hover:bg-white/20 transition-colors duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              #{keyword}
            </motion.span>
          ))}
          {publication.keywords.length > 4 && (
            <span className="px-3 py-1 bg-white/10 text-blue-200 rounded-xl text-sm backdrop-blur-sm">
              +{publication.keywords.length - 4}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-blue-300 text-sm font-mono bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
            DOI: {publication.doi}
          </span>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleButtonClick(e, 'pdf')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-medium text-sm shadow-lg"
            >
              <span>📥</span>
              <span>PDF</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleButtonClick(e, 'cite')}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-blue-200 rounded-xl hover:bg-white/20 transition-all duration-300 font-medium text-sm backdrop-blur-sm"
            >
              <span>📋</span>
              <span>Цитировать</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PublicationModal = ({ publication, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(publication.citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10 bg-white/5">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-white">Детали публикации</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300 text-white"
            >
              ×
            </motion.button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">{publication.title}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {publication.authors.map((author, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-xl text-sm font-medium backdrop-blur-sm"
                >
                  {author}
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Журнал</h4>
                <p className="text-blue-200">{publication.journal}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Год публикации</h4>
                <p className="text-blue-200">{publication.year}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Тип публикации</h4>
                <p className="text-blue-200">{publication.type}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Цитирования</h4>
                <p className="text-emerald-400 font-semibold">{publication.citations}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">DOI</h4>
                <p className="text-blue-200 font-mono">{publication.doi}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Дата публикации</h4>
                <p className="text-blue-200">{publication.date}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Аннотация</h4>
            <p className="text-blue-200 leading-relaxed">{publication.abstract}</p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Ключевые слова</h4>
            <div className="flex flex-wrap gap-2">
              {publication.keywords.map((keyword, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 bg-white/10 text-blue-200 rounded-xl text-sm backdrop-blur-sm"
                >
                  #{keyword}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Цитирование</h4>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-blue-200 font-mono text-sm">{publication.citation}</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(publication.pdfLink, '_blank')}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-2xl hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 font-medium shadow-lg"
            >
              <span>📥</span>
              <span>Открыть PDF</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyCitation}
              className="flex items-center space-x-2 px-6 py-3 bg-white/10 text-blue-200 rounded-2xl hover:bg-white/20 transition-all duration-300 font-medium backdrop-blur-sm"
            >
              <span>📋</span>
              <span>{copied ? 'Скопировано!' : 'Копировать цитирование'}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ScientificPublications;