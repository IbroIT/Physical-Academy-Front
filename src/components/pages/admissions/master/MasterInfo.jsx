// GraduateStudies.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const GraduateStudies = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('master');

  const masterData = t('graduateStudies.master', { returnObjects: true });
  const phdData = t('graduateStudies.phd', { returnObjects: true });
  const commonInfo = t('graduateStudies.commonInfo', { returnObjects: true });

  const currentData = activeTab === 'master' ? masterData : phdData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t('graduateStudies.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('graduateStudies.subtitle')}
          </p>
        </div>

        {/* Переключение между магистратурой и аспирантурой */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-2 inline-flex">
            <button
              onClick={() => setActiveTab('master')}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                activeTab === 'master'
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🎓 {t('graduateStudies.masterTitle')}
            </button>
            <button
              onClick={() => setActiveTab('phd')}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                activeTab === 'phd'
                  ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📚 {t('graduateStudies.phdTitle')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Основная информация */}
          <div className="lg:col-span-2 space-y-8">
            {/* Общая информация */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6">
                <h2 className="text-2xl font-bold text-white">
                  {t('graduateStudies.generalInfo')}
                </h2>
              </div>
              <div className="p-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {currentData.generalInfo.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="font-bold text-blue-800 mb-2">
                        {t('graduateStudies.duration')}
                      </h4>
                      <p className="text-gray-700">{currentData.generalInfo.duration}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <h4 className="font-bold text-green-800 mb-2">
                        {t('graduateStudies.format')}
                      </h4>
                      <p className="text-gray-700">{currentData.generalInfo.format}</p>
                    </div>
                  </div>

                  {currentData.generalInfo.features && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-800 mb-4">
                        {t('graduateStudies.keyFeatures')}
                      </h4>
                      <ul className="space-y-3">
                        {currentData.generalInfo.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <span className="text-green-500 mt-1">✓</span>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Программы и требования */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6">
                <h2 className="text-2xl font-bold text-white">
                  {t('graduateStudies.programsAndRequirements')}
                </h2>
              </div>
              <div className="p-6">
                {/* Программы обучения */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {t('graduateStudies.studyPrograms')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentData.programs.map((program, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors duration-300"
                      >
                        <h4 className="font-bold text-gray-800 mb-2">{program.name}</h4>
                        <p className="text-gray-600 text-sm mb-3">{program.field}</p>
                        <div className="flex flex-wrap gap-2">
                          {program.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Требования для поступления */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {t('graduateStudies.admissionRequirements')}
                  </h3>
                  <div className="space-y-4">
                    {currentData.requirements.map((requirement, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-1">
                            {requirement.title}
                          </h4>
                          <p className="text-gray-600">{requirement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Боковая панель - Документы и контакты */}
          <div className="space-y-8">
            {/* Документы */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6">
                <h2 className="text-2xl font-bold text-white">
                  {t('graduateStudies.documents')}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {currentData.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                          {doc.type === 'pdf' ? '📕' : doc.type === 'doc' ? '📘' : '📋'}
                        </span>
                        <div>
                          <h4 className="font-semibold text-gray-800 group-hover:text-blue-600">
                            {doc.title}
                          </h4>
                          <p className="text-gray-500 text-sm">{doc.format}</p>
                        </div>
                      </div>
                      <span className="text-blue-500 group-hover:text-blue-700">↓</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Важные даты */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6">
                <h2 className="text-2xl font-bold text-white">
                  {t('graduateStudies.importantDates')}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {currentData.importantDates.map((date, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-700 font-medium">{date.event}</span>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {date.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Контакты */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6">
                <h2 className="text-2xl font-bold text-white">
                  {t('graduateStudies.contacts')}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">👨‍🏫</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">{commonInfo.contactPerson}</h4>
                      <p className="text-gray-600 text-sm">{commonInfo.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📧</span>
                    <div>
                      <p className="text-gray-800 font-medium">{commonInfo.email}</p>
                      <p className="text-gray-600 text-sm">Email</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📞</span>
                    <div>
                      <p className="text-gray-800 font-medium">{commonInfo.phone}</p>
                      <p className="text-gray-600 text-sm">Телефон</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🏢</span>
                    <div>
                      <p className="text-gray-800 font-medium">{commonInfo.address}</p>
                      <p className="text-gray-600 text-sm">Адрес</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraduateStudies;