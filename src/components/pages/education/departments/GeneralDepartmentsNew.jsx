import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const DepartmentTabs = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departmentDetails, setDepartmentDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);

  // Получаем список всех кафедр
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/general-departments/categories/?lang=${i18n.language}`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        
        // Обработка различных форматов ответа API
        let categoriesArray = [];
        if (Array.isArray(data)) {
          categoriesArray = data;
        } else if (data && Array.isArray(data.results)) {
          categoriesArray = data.results;
        } else if (data && Array.isArray(data.data)) {
          categoriesArray = data.data;
        } else {
          console.warn('Unexpected API response format:', data);
          categoriesArray = [];
        }
        
        setCategories(categoriesArray);
        if (categoriesArray.length > 0) {
          setActiveTab(categoriesArray[0].id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [i18n.language]);

  // Получаем детали конкретной кафедры по ID
  useEffect(() => {
    if (!activeTab) return;

    const fetchDepartmentDetails = async () => {
      setLoadingDetails(true);
      setErrorDetails(null);
      try {
        const url = `https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/general-departments/categories/${activeTab}/?lang=${i18n.language}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch department details: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        
        // Обработка различных форматов ответа API
        let departmentData = data;
        if (data && typeof data === 'object' && !data.description && !data.staff) {
          // Если данные wrapped в другое поле
          if (data.data) departmentData = data.data;
          else if (data.result) departmentData = data.result;
          else if (data.department) departmentData = data.department;
          
          // Если API возвращает данные в формате с info и management
          if (departmentData.info && !departmentData.description) {
            departmentData.description = departmentData.info.description;
          }
          if (departmentData.management && !departmentData.staff) {
            departmentData.staff = departmentData.management;
          }
        }
        
        setDepartmentDetails(departmentData);
      } catch (err) {
        console.error('Error fetching department details:', err);
        setErrorDetails(err.message);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDepartmentDetails();
  }, [activeTab, i18n.language]);

  const getColorStyles = (color) => {
    const colorMap = {
      blue: {
        border: 'border-blue-500',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        accent: 'bg-blue-500'
      },
      green: {
        border: 'border-green-500',
        bg: 'bg-green-50',
        text: 'text-green-700',
        accent: 'bg-green-500'
      },
      'blue-600': {
        border: 'border-blue-600',
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        accent: 'bg-blue-600'
      },
      'green-600': {
        border: 'border-green-600',
        bg: 'bg-green-100',
        text: 'text-green-800',
        accent: 'bg-green-600'
      },
      'blue-700': {
        border: 'border-blue-700',
        bg: 'bg-blue-50',
        text: 'text-blue-900',
        accent: 'bg-blue-700'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  const getActiveTabStyle = (tabId) => {
    if (!Array.isArray(categories)) return '';
    const category = categories.find(cat => cat.id === tabId);
    if (!category) return '';
    const styles = getColorStyles(category.color);
    return `${styles.border} ${styles.bg} ${styles.text}`;
  };

  const getActiveCategory = () => {
    if (!Array.isArray(categories) || !activeTab) return null;
    return categories.find(cat => cat.id === activeTab);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading departments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  const activeCategory = getActiveCategory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            {t('departmentTabs.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('departmentTabs.description')}
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {Array.isArray(categories) && categories.map((category) => {
            const styles = getColorStyles(category.color);
            return (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`
                  px-6 py-3 rounded-xl font-semibold transition-all duration-300
                  transform hover:-translate-y-1 hover:shadow-lg
                  ${activeTab === category.id 
                    ? `border-b-4 ${getActiveTabStyle(category.id)} shadow-md` 
                    : 'bg-white text-gray-700 border-b-2 border-gray-200 hover:bg-gray-50'
                  }
                `}
              >
                {category.name}
              </button>
            );
          })}
        </div>  

        {/* Tab Content */}
        {activeCategory && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className={`h-2 ${getColorStyles(activeCategory.color).accent}`} />
            
            <div className="p-8 md:p-12">
              <div className="flex items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                  {activeCategory.name}
                </h2>
              </div>

              {loadingDetails ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  <p className="ml-4 text-gray-600">Загрузка информации о кафедре...</p>
                </div>
              ) : errorDetails ? (
                <div className="text-center py-8">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-red-800 font-semibold mb-2">Ошибка загрузки данных</h3>
                    <p className="text-red-600">{errorDetails}</p>
                    <p className="text-sm text-red-500 mt-2">Проверьте консоль браузера для дополнительной информации</p>
                  </div>
                </div>
              ) : departmentDetails && (departmentDetails.description || departmentDetails.info?.description || (departmentDetails.staff && departmentDetails.staff.length > 0) || (departmentDetails.management && departmentDetails.management.length > 0)) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                      {t('departmentTabs.content.about')}
                    </h3>
                    <div className="prose prose-lg max-w-none">
                      {(departmentDetails.description || departmentDetails.info?.description) ? (
                        <div 
                          className="text-gray-600 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: departmentDetails.description || departmentDetails.info?.description }}
                        />
                      ) : (
                        <p className="text-gray-500 italic">Описание кафедры отсутствует</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    {(departmentDetails.staff && Array.isArray(departmentDetails.staff) && departmentDetails.staff.length > 0) || 
                     (departmentDetails.management && Array.isArray(departmentDetails.management) && departmentDetails.management.length > 0) ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(departmentDetails.staff || departmentDetails.management).map((teacher, index) => (
                          <div key={teacher.id || teacher.name || index} className="bg-white rounded-xl border border-blue-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transform">
                            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 mx-auto border-4 border-blue-100">
                              <img 
                                src={teacher.photo || teacher.image || '/default-avatar.png'} 
                                alt={teacher.name || teacher.full_name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = '/default-avatar.png';
                                }}
                              />
                            </div>
                            <h3 className="text-xl font-bold text-blue-900 mb-2 text-center">
                              {teacher.name || teacher.full_name || teacher.title}
                            </h3>
                            <p className="text-gray-600 mb-3 text-center font-medium">
                              {teacher.role || teacher.position || teacher.job_title}
                            </p>
                            <div className="space-y-2">
                              {(teacher.phone || teacher.phone_number) && (
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  <span>{teacher.phone || teacher.phone_number}</span>
                                </div>
                              )}
                              {(teacher.email || teacher.email_address) && (
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  <span>{teacher.email || teacher.email_address}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-2">Информация о преподавателях отсутствует</p>
                        <p className="text-sm text-gray-400">
                          Staff/Management data: {
                            departmentDetails.staff ? 
                              (Array.isArray(departmentDetails.staff) ? 
                                `${departmentDetails.staff.length} items (staff)` : 
                                typeof departmentDetails.staff) : 
                            departmentDetails.management ?
                              (Array.isArray(departmentDetails.management) ? 
                                `${departmentDetails.management.length} items (management)` : 
                                typeof departmentDetails.management) :
                            'null/undefined'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <h3 className="text-yellow-800 font-semibold mb-2">Информация о кафедре не найдена</h3>
                    
                    <details className="mt-2">
                      <summary className="text-yellow-600 cursor-pointer text-sm">Показать отладочную информацию</summary>
                      <pre className="text-xs text-yellow-800 mt-2 bg-yellow-100 p-2 rounded overflow-auto">
                        {JSON.stringify({
                          activeTab,
                          departmentDetails,
                          hasDescription: !!(departmentDetails?.description || departmentDetails?.info?.description),
                          staffCount: (departmentDetails?.staff?.length || 0) + (departmentDetails?.management?.length || 0),
                          departmentDetailsKeys: departmentDetails ? Object.keys(departmentDetails) : []
                        }, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentTabs;