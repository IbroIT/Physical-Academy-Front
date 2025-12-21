import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const DepartmentTabs = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teachersData, setTeachersData] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [errorTeachers, setErrorTeachers] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/general-departments/categories/?lang=${i18n.language}`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        const sortedData = data.sort((a, b) => a.order - b.order);
        setCategories(sortedData);
        if (sortedData.length > 0) {
          setActiveTab(sortedData[0].key);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [i18n.language]);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoadingTeachers(true);
      setErrorTeachers(null);
      try {
        const lang = i18n.language === 'ru' ? 'ru' : i18n.language === 'en' ? 'en' : 'kg';
        const response = await fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/general-departments/management/?lang=${lang}`);
        if (!response.ok) {
          throw new Error('Failed to fetch teachers data');
        }
        const data = await response.json();
        setTeachersData(data.sort((a, b) => a.order - b.order));
      } catch (err) {
        setErrorTeachers(err.message);
      } finally {
        setLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, [i18n.language]);

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

  const getActiveTabStyle = (tabKey) => {
    const category = categories.find(cat => cat.key === tabKey);
    if (!category) return '';
    const styles = getColorStyles(category.color);
    return `${styles.border} ${styles.bg} ${styles.text}`;
  };

  const getActiveCategory = () => {
    return categories.find(cat => cat.key === activeTab);
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
          {categories.map((category) => {
            const styles = getColorStyles(category.color);
            return (
              <button
                key={category.key}
                onClick={() => setActiveTab(category.key)}
                className={`
                  px-6 py-3 rounded-xl font-semibold transition-all duration-300
                  transform hover:-translate-y-1 hover:shadow-lg
                  ${activeTab === category.key 
                    ? `border-b-4 ${getActiveTabStyle(category.key)} shadow-md` 
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    {t('departmentTabs.content.about')}
                  </h3>
                  <div className="prose prose-lg max-w-none">
                    <div 
                      className="text-gray-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: activeCategory.description }}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    Преподаватели
                  </h3>
                  {loadingTeachers ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : errorTeachers ? (
                    <div className="text-center py-8">
                      <p className="text-red-500">Error loading teachers: {errorTeachers}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {teachersData.map((teacher) => (
                        <div key={teacher.id} className="bg-white rounded-xl border border-blue-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transform">
                          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 mx-auto border-4 border-blue-100">
                            <img 
                              src={teacher.photo} 
                              alt={teacher.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className="text-xl font-bold text-blue-900 mb-2 text-center">{teacher.name}</h3>
                          <p className="text-gray-600 mb-3 text-center font-medium">{teacher.role}</p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span>{teacher.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span>{teacher.email}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentTabs;