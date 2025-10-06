// AcademicStructure.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOrganizationStructure } from '../../../hooks/useApi';
import { PageLoading, ErrorDisplay, EmptyState, CardSkeleton } from '../../common/Loading';

const AcademyStructure = () => {
  const { t } = useTranslation();
  const [viewType, setViewType] = useState('hierarchical');
  const [selectedType, setSelectedType] = useState('all');
  const [expandedDepartments, setExpandedDepartments] = useState(new Set());

  const { structure, loading, error, refetch } = useOrganizationStructure(viewType === 'hierarchical');

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
    { key: 'leadership', label: 'Руководство', icon: '👑', color: 'green' },
    { key: 'faculties', label: 'Факультеты', icon: '🎓', color: 'blue' },
    { key: 'administrative', label: 'Администрация', icon: '🏛️', color: 'purple' },
    { key: 'support', label: 'Поддержка', icon: '🔧', color: 'orange' }
  ];

  if (loading) {
    return <PageLoading message={t('structure.loading', 'Загрузка структуры...')} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-8 px-4">
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

  const getTypeColor = (type) => {
    const typeConfig = structureTypes.find(t => t.key === type);
    if (!typeConfig) return 'gray';
    return typeConfig.color;
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', active: 'bg-green-600' };
      case 'blue':
        return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', active: 'bg-blue-600' };
      case 'purple':
        return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', active: 'bg-purple-600' };
      case 'orange':
        return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', active: 'bg-orange-600' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800', active: 'bg-gray-600' };
    }
  };

  const DepartmentCard = ({ department, level = 0 }) => {
    const colors = getColorClasses(getTypeColor(department.structure_type));
    const hasChildren = department.children && department.children.length > 0;
    const isExpanded = expandedDepartments.has(department.id);
    
    return (
      <div className={`${level > 0 ? 'ml-6 mt-4' : ''}`}>
        <div 
          className={`bg-white rounded-xl border ${colors.border} hover:border-blue-300 transition-all duration-300 overflow-hidden group cursor-pointer`}
          onClick={() => hasChildren && toggleDepartment(department.id)}
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center border ${colors.border}`}>
                    <span className="text-xl">{department.icon || '🏛️'}</span>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {department.name}
                      </h3>

                      {/* Structure Type */}
                      {department.structure_type && (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                          {structureTypes.find(t => t.key === department.structure_type)?.icon || '🏗️'} 
                          {department.title || department.structure_type}
                        </span>
                      )}
                    </div>

                    {hasChildren && (
                      <button className="flex-shrink-0 ml-4 w-8 h-8 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <svg 
                          className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Head Information */}
                  {department.head_name && (
                    <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-blue-600">👤</span>
                        <span className="text-sm font-semibold text-blue-800">
                          {t('structure.head', 'Руководитель')}:
                        </span>
                      </div>
                      <p className="text-sm text-blue-700">{department.head_name}</p>
                    </div>
                  )}

                  {/* Contact Information */}
                  {(department.phone || department.email) && (
                    <div className="mt-3 space-y-2 text-sm">
                      {department.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <span>📱</span>
                          <a href={`tel:${department.phone}`} className="text-blue-600 hover:text-blue-700 hover:underline">
                            {department.phone}
                          </a>
                        </div>
                      )}
                      {department.email && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <span>📧</span>
                          <a href={`mailto:${department.email}`} className="text-blue-600 hover:text-blue-700 hover:underline">
                            {department.email}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Status */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      department.is_active
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-1 ${
                        department.is_active ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                      {department.is_active ? '✅ Активное' : '❌ Неактивное'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expand Button for Mobile */}
            {hasChildren && (
              <div className="flex justify-center mt-4 lg:hidden">
                <button className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                  <span>{isExpanded ? t('structure.showLess', 'Свернуть') : t('structure.showMore', 'Подробнее')}</span>
                  <svg 
                    className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Expanded Content */}
          {isExpanded && hasChildren && (
            <div className="border-t border-gray-100 bg-gray-50 p-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span>🏢</span>
                {t('structure.subdepartments', 'Подразделения')} ({department.children.length})
              </h4>
              <div className="space-y-3">
                {department.children.map((child) => (
                  <div key={child.id} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{child.name}</h5>
                        {child.head_name && (
                          <p className="text-sm text-gray-600 mt-1">
                            👤 {child.head_name}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {child.phone && (
                            <span className="text-xs text-gray-500">📱 {child.phone}</span>
                          )}
                          {child.email && (
                            <span className="text-xs text-gray-500">📧 {child.email}</span>
                          )}
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        child.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {child.is_active ? 'Активно' : 'Неактивно'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recursive children rendering for hierarchical view */}
        {viewType === 'hierarchical' && isExpanded && hasChildren && (
          <div className="space-y-4 mt-4">
            {department.children.map((child) => (
              <DepartmentCard 
                key={child.id} 
                department={child} 
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
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
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('academicStructure.title', 'Организационная структура')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('academicStructure.subtitle', 'Структура академии и её подразделений')}
          </p>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
              <div className="text-2xl font-bold text-blue-600 mb-1">{stats.total}</div>
              <div className="text-blue-800 text-sm font-medium">Всего</div>
            </div>
            <div className="bg-green-50 rounded-2xl p-4 text-center border border-green-100">
              <div className="text-2xl font-bold text-green-600 mb-1">{stats.faculties}</div>
              <div className="text-green-800 text-sm font-medium">Факультетов</div>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
              <div className="text-2xl font-bold text-blue-600 mb-1">{stats.administrative}</div>
              <div className="text-blue-800 text-sm font-medium">Административных</div>
            </div>
            <div className="bg-purple-50 rounded-2xl p-4 text-center border border-purple-100">
              <div className="text-2xl font-bold text-purple-600 mb-1">{stats.leadership}</div>
              <div className="text-purple-800 text-sm font-medium">Руководства</div>
            </div>
            <div className="bg-orange-50 rounded-2xl p-4 text-center border border-orange-100">
              <div className="text-2xl font-bold text-orange-600 mb-1">{stats.support}</div>
              <div className="text-orange-800 text-sm font-medium">Поддержки</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-gray-600 mb-1">{stats.active}</div>
              <div className="text-gray-800 text-sm font-medium">Активных</div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          {/* View Type Toggle */}
          <div className="bg-gray-100 rounded-2xl p-2 flex">
            <button
              onClick={() => {
                setViewType('hierarchical');
                setExpandedDepartments(new Set());
              }}
              className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                viewType === 'hierarchical'
                  ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {t('structure.hierarchicalView', 'Иерархический вид')}
            </button>
            <button
              onClick={() => {
                setViewType('flat');
                setExpandedDepartments(new Set());
              }}
              className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                viewType === 'flat'
                  ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {t('structure.flatView', 'Плоский список')}
            </button>
          </div>

          {/* Type Filter (only for flat view) */}
          {viewType === 'flat' && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium border ${
                  selectedType === 'all'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
                }`}
              >
                {t('structure.all', 'Все')}
              </button>
              {structureTypes.map((type) => (
                <button
                  key={type.key}
                  onClick={() => setSelectedType(type.key)}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium border flex items-center gap-2 ${
                    selectedType === type.key
                      ? `${getColorClasses(type.color).bg} ${getColorClasses(type.color).text} ${getColorClasses(type.color).border}`
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        {viewType === 'hierarchical' ? (
          // Hierarchical view
          <div className="space-y-6">
            {Array.isArray(filteredData) && filteredData.length > 0 ? (
              filteredData.map((department) => (
                <DepartmentCard key={department.id} department={department} />
              ))
            ) : (
              <EmptyState
                message={t('structure.noData', 'Структура организации не найдена')}
                icon={<div className="text-6xl mb-4">🏛️</div>}
              />
            )}
          </div>
        ) : (
          // Flat grid view
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.isArray(filteredData) && filteredData.length > 0 ? (
              filteredData.map((department) => (
                <DepartmentCard key={department.id} department={department} />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState
                  message={t('structure.noDepartments', 'Подразделения не найдены')}
                  icon={<div className="text-6xl mb-4">🏛️</div>}
                />
              </div>
            )}
          </div>
        )}

        {/* Additional Information */}
        <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {t('structure.contactInfo.title', 'Нужна дополнительная информация?')}
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {t('structure.contactInfo.description', 'Свяжитесь с нашим отделом кадров для получения дополнительной информации об организационной структуре')}
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
            {t('structure.contactInfo.button', 'Связаться с отделом кадров')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcademyStructure;