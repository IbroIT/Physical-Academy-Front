// AcademicStructure.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrganizationStructure } from '../../../hooks/useApi';
import { PageLoading, ErrorDisplay, EmptyState, CardSkeleton } from '../../common/Loading';

const AcademicStructure = () => {
  const { t } = useTranslation();
  const [viewType, setViewType] = useState('hierarchical');
  const [selectedType, setSelectedType] = useState('all');
  const [expandedDepartments, setExpandedDepartments] = useState(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState(null);
  const sectionRef = useRef(null);

  const { structure, loading, error, refetch } = useOrganizationStructure(viewType === 'hierarchical');

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

  const toggleDepartment = (departmentId) => {
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(departmentId)) {
      newExpanded.delete(departmentId);
    } else {
      newExpanded.add(departmentId);
    }
    setExpandedDepartments(newExpanded);
  };

  const getFilteredData = () => {
    if (viewType === 'hierarchical') {
      return structure;
    }

    if (!structure || !Array.isArray(structure)) return [];

    if (selectedType === 'all') {
      return structure;
    }

    return structure.filter(item => item.structure_type === selectedType);
  };

  const filteredData = getFilteredData();
  
  const structureTypes = [
    { key: 'leadership', label: t('structure.types.leadership'), icon: '👑', gradient: 'from-blue-500 to-emerald-500' },
    { key: 'faculties', label: t('structure.types.faculties'), icon: '🎓', gradient: 'from-emerald-500 to-blue-600' },
    { key: 'administrative', label: t('structure.types.administrative'), icon: '🏛️', gradient: 'from-blue-600 to-emerald-600' },
    { key: 'support', label: t('structure.types.support'), icon: '🔧', gradient: 'from-emerald-400 to-blue-500' }
  ];

  if (loading) {
    return <PageLoading message={t('structure.loading')} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <ErrorDisplay
            error={error}
            onRetry={refetch}
            className="max-w-md mx-auto"
          />
        </div>
      </div>
    );
  }

  const getTypeGradient = (type) => {
    const typeConfig = structureTypes.find(t => t.key === type);
    if (!typeConfig) return 'from-gray-500 to-gray-600';
    return typeConfig.gradient;
  };

  const DepartmentCard = ({ department, level = 0 }) => {
    const gradient = getTypeGradient(department.structure_type);
    const hasChildren = department.children && department.children.length > 0;
    const isExpanded = expandedDepartments.has(department.id);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: level * 0.1 }}
        className={`${level > 0 ? 'ml-4 lg:ml-8 mt-4' : ''}`}
      >
        <motion.div 
          className={`bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 hover:border-emerald-400/50 transition-all duration-500 overflow-hidden group cursor-pointer ${
            activeDepartment === department.id ? 'ring-2 ring-emerald-400 scale-105' : ''
          }`}
          onClick={() => {
            if (hasChildren) toggleDepartment(department.id);
            setActiveDepartment(department.id);
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="p-6 lg:p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 lg:space-x-6 flex-1">
                {/* Иконка */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex-shrink-0"
                >
                  <div className={`w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center text-white text-xl lg:text-2xl shadow-2xl`}>
                    {department.icon || '🏛️'}
                  </div>
                </motion.div>
                
                {/* Контент */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <motion.h3 
                        className="text-xl lg:text-2xl font-bold text-white mb-3"
                        layout
                      >
                        {department.name}
                      </motion.h3>

                      {/* Structure Type */}
                      {department.structure_type && (
                        <motion.span 
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <span className="mr-2">{structureTypes.find(t => t.key === department.structure_type)?.icon || '🏗️'}</span>
                          {structureTypes.find(t => t.key === department.structure_type)?.label}
                        </motion.span>
                      )}
                    </div>

                    {hasChildren && (
                      <motion.button 
                        className="flex-shrink-0 ml-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <motion.svg 
                          className="w-5 h-5"
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </motion.button>
                    )}
                  </div>

                  {/* Head Information */}
                  {department.head_name && (
                    <motion.div 
                      className="mt-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm">
                          👤
                        </div>
                        <span className="text-sm font-semibold text-white">
                          {t('structure.head')}
                        </span>
                      </div>
                      <p className="text-blue-100 text-lg font-medium">{department.head_name}</p>
                    </motion.div>
                  )}

                  {/* Contact Information */}
                  {(department.phone || department.email) && (
                    <motion.div 
                      className="mt-4 space-y-2 text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {department.phone && (
                        <div className="flex items-center gap-3 text-blue-100">
                          <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-sm">📱</span>
                          </div>
                          <a href={`tel:${department.phone}`} className="hover:text-emerald-300 hover:underline transition-colors">
                            {department.phone}
                          </a>
                        </div>
                      )}
                      {department.email && (
                        <div className="flex items-center gap-3 text-blue-100">
                          <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-sm">📧</span>
                          </div>
                          <a href={`mailto:${department.email}`} className="hover:text-emerald-300 hover:underline transition-colors">
                            {department.email}
                          </a>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Status */}
                  <motion.div 
                    className="flex flex-wrap gap-2 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
                      department.is_active
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                        : 'bg-red-500/20 text-red-300 border-red-400/30'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        department.is_active ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                      }`}></div>
                      {department.is_active ? '✅ ' + t('structure.active') : '❌ ' + t('structure.inactive')}
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Expand Button for Mobile */}
            {hasChildren && (
              <div className="flex justify-center mt-6 lg:hidden">
                <motion.button 
                  className="flex items-center gap-2 text-emerald-300 text-sm font-medium hover:text-emerald-200 transition-colors bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{isExpanded ? t('structure.showLess') : t('structure.showMore')}</span>
                  <motion.svg 
                    className="w-4 h-4"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </motion.button>
              </div>
            )}
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && hasChildren && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="border-t border-white/10 bg-white/5 p-6 lg:p-8"
              >
                <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                    🏢
                  </div>
                  {t('structure.subdepartments')} ({department.children.length})
                </h4>
                <div className="grid gap-4">
                  {department.children.map((child, index) => (
                    <motion.div
                      key={child.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="font-bold text-white text-lg">{child.name}</h5>
                          {child.head_name && (
                            <p className="text-blue-100 text-sm mt-2 flex items-center gap-2">
                              <span>👤</span>
                              {child.head_name}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-3 mt-3">
                            {child.phone && (
                              <span className="text-xs text-blue-200 flex items-center gap-1">
                                📱 {child.phone}
                              </span>
                            )}
                            {child.email && (
                              <span className="text-xs text-blue-200 flex items-center gap-1">
                                📧 {child.email}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
                          child.is_active
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                            : 'bg-red-500/20 text-red-300 border-red-400/30'
                        }`}>
                          {child.is_active ? t('structure.active') : t('structure.inactive')}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Recursive children rendering for hierarchical view */}
        <AnimatePresence>
          {viewType === 'hierarchical' && isExpanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 mt-6"
            >
              {department.children.map((child) => (
                <DepartmentCard 
                  key={child.id} 
                  department={child} 
                  level={level + 1}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const getStats = () => {
    if (!Array.isArray(structure)) return null;
    
    return {
      total: structure.length,
      faculties: structure.filter(d => d.structure_type === 'faculties').length,
      administrative: structure.filter(d => d.structure_type === 'administrative').length,
      leadership: structure.filter(d => d.structure_type === 'leadership').length,
      support: structure.filter(d => d.structure_type === 'support').length,
      active: structure.filter(d => d.is_active).length
    };
  };

  const stats = getStats();

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Академические символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🏛️</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">🎓</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">👑</div>
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
            🏛️
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t('academicStructure.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t('academicStructure.subtitle')}
          </p>
        </motion.div>

        {/* Статистика */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-12 lg:mb-16"
          >
            {[
              { value: stats.total, label: t('structure.stats.total'), gradient: 'from-blue-500 to-emerald-500' },
              { value: stats.faculties, label: t('structure.stats.faculties'), gradient: 'from-emerald-500 to-blue-600' },
              { value: stats.administrative, label: t('structure.stats.administrative'), gradient: 'from-blue-600 to-emerald-600' },
              { value: stats.leadership, label: t('structure.stats.leadership'), gradient: 'from-emerald-400 to-blue-500' },
              { value: stats.support, label: t('structure.stats.support'), gradient: 'from-blue-500 to-cyan-500' },
              { value: stats.active, label: t('structure.stats.active'), gradient: 'from-emerald-500 to-green-500' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
              >
                <div className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.value}
                </div>
                <div className="text-blue-200 text-sm lg:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8"
        >
          {/* View Type Toggle */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-2 flex border border-white/10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setViewType('hierarchical');
                setExpandedDepartments(new Set());
                setActiveDepartment(null);
              }}
              className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium backdrop-blur-sm ${
                viewType === 'hierarchical'
                  ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              {t('structure.hierarchicalView')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setViewType('flat');
                setExpandedDepartments(new Set());
                setActiveDepartment(null);
              }}
              className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium backdrop-blur-sm ${
                viewType === 'flat'
                  ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              {t('structure.flatView')}
            </motion.button>
          </div>

          {/* Type Filter (only for flat view) */}
          {viewType === 'flat' && (
            <div className="flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedType('all')}
                className={`px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium border backdrop-blur-sm ${
                  selectedType === 'all'
                    ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white border-transparent shadow-lg'
                    : 'bg-white/5 text-blue-100 border-white/10 hover:bg-white/10'
                }`}
              >
                {t('structure.all')}
              </motion.button>
              {structureTypes.map((type) => (
                <motion.button
                  key={type.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedType(type.key)}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium border backdrop-blur-sm flex items-center gap-2 ${
                    selectedType === type.key
                      ? `bg-gradient-to-r ${type.gradient} text-white border-transparent shadow-lg`
                      : 'bg-white/5 text-blue-100 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Content */}
        {viewType === 'hierarchical' ? (
          // Hierarchical view
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="space-y-6"
          >
            {Array.isArray(filteredData) && filteredData.length > 0 ? (
              filteredData.map((department) => (
                <DepartmentCard key={department.id} department={department} />
              ))
            ) : (
              <EmptyState
                message={t('structure.noData')}
                icon={<div className="text-6xl mb-4">🏛️</div>}
              />
            )}
          </motion.div>
        ) : (
          // Flat grid view
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {Array.isArray(filteredData) && filteredData.length > 0 ? (
              filteredData.map((department) => (
                <DepartmentCard key={department.id} department={department} />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState
                  message={t('structure.noDepartments')}
                  icon={<div className="text-6xl mb-4">🏛️</div>}
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-16 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-8 lg:p-12 backdrop-blur-lg border border-white/20 text-center"
        >
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            {t('structure.contactInfo.title')}
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-lg leading-relaxed">
            {t('structure.contactInfo.description')}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl"
          >
            {t('structure.contactInfo.button')}
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AcademicStructure;