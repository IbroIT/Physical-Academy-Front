import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const DepartmentTabs = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                  <p className="text-gray-600 leading-relaxed">
                    {activeCategory.description}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    {t('departmentTabs.content.features')}
                  </h3>
                  <ul className="space-y-3">
                    {activeCategory.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${getColorStyles(activeCategory.color).accent}`} />
                        <span className="text-gray-600">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
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