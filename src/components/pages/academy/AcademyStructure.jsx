// AcademicStructure.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOrganizationStructure } from '../../../hooks/useApi';
import { PageLoading, ErrorDisplay, EmptyState, CardSkeleton } from '../../common/Loading';

const AcademyStructure = () => {
  const { t } = useTranslation();
  const [viewType, setViewType] = useState('hierarchical'); // 'hierarchical' or 'flat'
  const [selectedType, setSelectedType] = useState('all');

  // API integration - all hooks must be called before early returns
  const { structure, loading, error, refetch } = useOrganizationStructure(viewType === 'hierarchical');

  // Filter data based on selected type
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
  const structureTypes = ['leadership', 'faculties', 'administrative', 'support'];

  // Early returns AFTER all hooks are called
  if (loading) {
    return <PageLoading message={t('structure.loading', 'Загрузка структуры...')} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
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

  // Component to render a single department
  const DepartmentCard = ({ department }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 hover:border-green-300">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">{department.icon || '🏛️'}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            {/* Main Info */}
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {department.name}
            </h3>

            {/* Multilingual names */}
            <div className="mb-3 space-y-1">
              {department.name_ru && department.name_ru !== department.name && (
                <p className="text-sm text-gray-600">
                  🇷🇺 <strong>RU:</strong> {department.name_ru}
                </p>
              )}
              {department.name_en && department.name_en !== department.name && (
                <p className="text-sm text-gray-600">
                  🇺🇸 <strong>EN:</strong> {department.name_en}
                </p>
              )}
              {department.name_ky && department.name_ky !== department.name && (
                <p className="text-sm text-gray-600">
                  🇰🇬 <strong>KG:</strong> {department.name_ky}
                </p>
              )}
            </div>

            {/* Head Information */}
            {department.head_name && (
              <div className="mb-3 bg-blue-50 rounded-lg p-3">
                <p className="text-sm font-semibold text-blue-800 mb-1">
                  👤 Руководитель:
                </p>
                <p className="text-sm text-blue-700">{department.head_name}</p>

                {/* Multilingual head names */}
                {department.head_name_ru && department.head_name_ru !== department.head_name && (
                  <p className="text-xs text-blue-600">🇷🇺 {department.head_name_ru}</p>
                )}
                {department.head_name_en && department.head_name_en !== department.head_name && (
                  <p className="text-xs text-blue-600">🇺🇸 {department.head_name_en}</p>
                )}
                {department.head_name_ky && department.head_name_ky !== department.head_name && (
                  <p className="text-xs text-blue-600">🇰🇬 {department.head_name_ky}</p>
                )}
              </div>
            )}

            {/* Structure Type */}
            {department.structure_type && (
              <div className="inline-block bg-purple-50 rounded-full px-3 py-1 mb-3">
                <span className="text-xs text-purple-600 font-medium">
                  🏗️ {department.title || department.structure_type}
                </span>
              </div>
            )}

            {/* Parent Department */}
            {department.parent && (
              <div className="mb-3">
                <p className="text-xs text-gray-600">
                  🔗 Родительское подразделение: #{department.parent}
                </p>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <p className="font-semibold text-gray-700 mb-2">📞 Контакты:</p>
              {department.phone && (
                <p className="flex items-center">
                  <span className="mr-2">�</span>
                  <a href={`tel:${department.phone}`} className="text-blue-600 hover:underline">
                    {department.phone}
                  </a>
                </p>
              )}
              {department.email && (
                <p className="flex items-center">
                  <span className="mr-2">📧</span>
                  <a href={`mailto:${department.email}`} className="text-blue-600 hover:underline">
                    {department.email}
                  </a>
                </p>
              )}
              {!department.phone && !department.email && (
                <p className="text-gray-500 text-xs">Контактная информация не указана</p>
              )}
            </div>

            {/* Status and Order */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${department.is_active
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                }`}>
                <div className={`w-2 h-2 rounded-full mr-1 ${department.is_active ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                {department.is_active ? '✅ Активное' : '❌ Неактивное'}
              </span>

              {department.order && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  #️⃣ Порядок: {department.order}
                </span>
              )}
            </div>

            {/* Children departments */}
            {department.children && department.children.length > 0 && (
              <div className="mt-4 pl-4 border-l-2 border-green-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  🏢 Подразделения ({department.children.length}):
                </h4>
                <div className="space-y-2">
                  {department.children.map((child) => (
                    <div key={child.id} className="bg-gray-50 rounded-lg p-3">
                      <p className="font-medium text-gray-800">{child.name}</p>
                      {child.head_name && (
                        <p className="text-sm text-gray-600">
                          👤 Руководитель: {child.head_name}
                        </p>
                      )}
                      {child.phone && (
                        <p className="text-sm text-gray-600">
                          📱 {child.phone}
                        </p>
                      )}
                      {child.email && (
                        <p className="text-sm text-gray-600">
                          📧 {child.email}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">ID: {child.id}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* API ID for developers */}
            <div className="text-xs text-gray-400 mt-4 pt-3 border-t">
              🔧 API ID: {department.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t('academicStructure.title', 'Организационная структура')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('academicStructure.subtitle', 'Структура академии и её подразделений')}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {/* View Type Toggle */}
          <div className="bg-white rounded-full p-1 shadow-lg">
            <button
              onClick={() => setViewType('hierarchical')}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${viewType === 'hierarchical'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-600 hover:text-green-600'
                }`}
            >
              Иерархический вид
            </button>
            <button
              onClick={() => setViewType('flat')}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${viewType === 'flat'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-600 hover:text-green-600'
                }`}
            >
              Плоский список
            </button>
          </div>

          {/* Type Filter (only for flat view) */}
          {viewType === 'flat' && (
            <div className="bg-white rounded-full p-1 shadow-lg">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-4 py-2 rounded-full transition-all duration-300 text-sm ${selectedType === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
                  }`}
              >
                Все
              </button>
              {structureTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 text-sm ${selectedType === type
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                    }`}
                >
                  {type === 'leadership' && 'Руководство'}
                  {type === 'faculties' && 'Факультеты'}
                  {type === 'administrative' && 'Администрация'}
                  {type === 'support' && 'Поддержка'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        {viewType === 'hierarchical' ? (
          // Hierarchical view
          <div className="space-y-8">
            {Array.isArray(filteredData) && filteredData.length > 0 ? (
              filteredData.map((department) => (
                <DepartmentCard key={department.id} department={department} />
              ))
            ) : (
              <EmptyState
                message="Структура организации не найдена"
                icon={<div className="text-6xl mb-4">🏛️</div>}
              />
            )}
          </div>
        ) : (
          // Flat grid view
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(filteredData) && filteredData.length > 0 ? (
              filteredData.map((department) => (
                <DepartmentCard key={department.id} department={department} />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState
                  message="Подразделения не найдены"
                  icon={<div className="text-6xl mb-4">🏛️</div>}
                />
              </div>
            )}
          </div>
        )}

        {/* Statistics */}
        {Array.isArray(filteredData) && filteredData.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Статистика структуры
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {viewType === 'hierarchical' ?
                    (Array.isArray(filteredData) ? filteredData.length : 0) :
                    filteredData.filter(d => d.structure_type === 'faculties').length
                  }
                </div>
                <div className="text-gray-600">Факультетов</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {viewType === 'hierarchical' ?
                    (Array.isArray(filteredData) ?
                      filteredData.reduce((acc, dept) => acc + (dept.children?.length || 0), 0) : 0
                    ) :
                    filteredData.filter(d => d.structure_type === 'administrative').length
                  }
                </div>
                <div className="text-gray-600">Подразделений</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {filteredData.filter(d => d.structure_type === 'leadership').length}
                </div>
                <div className="text-gray-600">Руководящих органов</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {Array.isArray(filteredData) ? filteredData.length : 0}
                </div>
                <div className="text-gray-600">Всего единиц</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademyStructure;