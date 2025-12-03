import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const DepartmentTabs = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('languages');

  const tabs = [
    { 
      id: 'languages', 
      color: 'border-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    { 
      id: 'philosophy', 
      color: 'border-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    { 
      id: 'fundamental', 
      color: 'border-blue-600',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800'
    },
    { 
      id: 'theory', 
      color: 'border-green-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800'
    },
    { 
      id: 'pedagogy', 
      color: 'border-blue-700',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-900'
    }
  ];

  const getActiveTabStyle = (tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    return tab ? `${tab.color} ${tab.bgColor} ${tab.textColor}` : '';
  };

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
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 rounded-xl font-semibold transition-all duration-300
                transform hover:-translate-y-1 hover:shadow-lg
                ${activeTab === tab.id 
                  ? `border-b-4 ${getActiveTabStyle(tab.id)} shadow-md` 
                  : 'bg-white text-gray-700 border-b-2 border-gray-200 hover:bg-gray-50'
                }
              `}
            >
              {t(`departmentTabs.tabs.${tab.id}`)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className={`h-2 ${activeTab === 'languages' ? 'bg-blue-500' : 
                           activeTab === 'philosophy' ? 'bg-green-500' :
                           activeTab === 'fundamental' ? 'bg-blue-600' :
                           activeTab === 'theory' ? 'bg-green-600' : 'bg-blue-700'}`} />
          
          <div className="p-8 md:p-12">
            <div className="flex items-center mb-8">
              
              <h2 className="text-3xl font-bold text-gray-800">
                {t(`departmentTabs.tabs.${activeTab}`)}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  {t('departmentTabs.content.about')}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t(`departmentTabs.content.${activeTab}.description`)}
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  {t('departmentTabs.content.features')}
                </h3>
                <ul className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <li key={item} className="flex items-start">
                      <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${activeTab === 'languages' ? 'bg-blue-500' : 
                                     activeTab === 'philosophy' ? 'bg-green-500' :
                                     activeTab === 'fundamental' ? 'bg-blue-600' :
                                     activeTab === 'theory' ? 'bg-green-600' : 'bg-blue-700'}`} />
                      <span className="text-gray-600">
                        {t(`departmentTabs.content.${activeTab}.feature${item}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentTabs;