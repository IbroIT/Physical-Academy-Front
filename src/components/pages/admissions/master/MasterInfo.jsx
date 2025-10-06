// GraduateStudies.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const GraduateStudies = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('master');
  const [isVisible, setIsVisible] = useState(false);
  const [expandedRequirement, setExpandedRequirement] = useState(null);
  const [hoveredProgram, setHoveredProgram] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const masterData = t('graduateStudies.master', { returnObjects: true });
  const phdData = t('graduateStudies.phd', { returnObjects: true });
  const commonInfo = t('graduateStudies.commonInfo', { returnObjects: true });

  const currentData = activeTab === 'master' ? masterData : phdData;

  const toggleRequirement = (index) => {
    setExpandedRequirement(expandedRequirement === index ? null : index);
  };

  const stats = [
    { number: '95%', label: t('graduateStudies.stats.employment'), icon: '💼' },
    { number: '50+', label: t('graduateStudies.stats.professors'), icon: '👨‍🏫' },
    { number: '30+', label: t('graduateStudies.stats.researchLabs'), icon: '🔬' },
    { number: '80%', label: t('graduateStudies.stats.funding'), icon: '💰' }
  ];

  return (
    <div ref={sectionRef} className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            <span className="text-blue-600 font-medium text-sm">
              {t('graduateStudies.badge')}
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('graduateStudies.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('graduateStudies.subtitle')}
          </p>
        </div>

        {/* Stats Section */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-500 group hover:-translate-y-2"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium text-lg">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className={`flex justify-center mb-12 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-white rounded-2xl shadow-lg p-2 inline-flex border border-gray-200">
            <button
              onClick={() => setActiveTab('master')}
              className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 transform hover:scale-105 ${
                activeTab === 'master'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl">🎓</span>
              <span>{t('graduateStudies.masterTitle')}</span>
            </button>
            <button
              onClick={() => setActiveTab('phd')}
              className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 transform hover:scale-105 ${
                activeTab === 'phd'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl">📚</span>
              <span>{t('graduateStudies.phdTitle')}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* General Information */}
            <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              <div className={`p-6 ${
                activeTab === 'master' ? 'bg-blue-500' : 'bg-green-500'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white text-2xl">
                    ℹ️
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {t('graduateStudies.generalInfo')}
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed mb-6 border-l-4 border-blue-500 pl-6 py-2 bg-blue-50 rounded-r-2xl">
                    {currentData.generalInfo.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 group">
                      <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                        {t('graduateStudies.duration')}
                      </h4>
                      <p className="text-gray-700 text-lg font-semibold">{currentData.generalInfo.duration}</p>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300 group">
                      <h4 className="font-bold text-green-800 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                        {t('graduateStudies.format')}
                      </h4>
                      <p className="text-gray-700 text-lg font-semibold">{currentData.generalInfo.format}</p>
                    </div>
                  </div>

                  {currentData.generalInfo.features && (
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
                      <h4 className="font-bold text-gray-900 text-xl mb-6 flex items-center">
                        <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">⭐</span>
                        {t('graduateStudies.keyFeatures')}
                      </h4>
                      <ul className="space-y-4">
                        {currentData.generalInfo.features.map((feature, index) => (
                          <li key={index} className="flex items-start group">
                            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                            <span className="text-gray-700 text-lg group-hover:text-gray-900 transition-colors duration-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Programs and Requirements */}
            <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-1000 delay-900 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              <div className={`p-6 ${
                activeTab === 'master' ? 'bg-gradient-to-r from-blue-500 to-green-500' : 'bg-gradient-to-r from-green-500 to-blue-500'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white text-2xl">
                    📋
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {t('graduateStudies.programsAndRequirements')}
                  </h2>
                </div>
              </div>
              <div className="p-6">
                {/* Study Programs */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="w-2 h-8 bg-blue-500 rounded mr-3"></span>
                    {t('graduateStudies.studyPrograms')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentData.programs.map((program, index) => (
                      <div
                        key={index}
                        onMouseEnter={() => setHoveredProgram(index)}
                        onMouseLeave={() => setHoveredProgram(null)}
                        className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 group hover:-translate-y-2 relative overflow-hidden"
                      >
                        {/* Background effect */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${
                          activeTab === 'master' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></div>
                        
                        <div className="relative z-10">
                          <h4 className="font-bold text-gray-900 text-xl mb-2 group-hover:text-blue-600 transition-colors duration-300">
                            {program.name}
                          </h4>
                          <p className="text-gray-600 text-lg mb-4">{program.field}</p>
                          <div className="flex flex-wrap gap-2">
                            {program.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 hover:scale-105 transition-all duration-300 cursor-default"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admission Requirements */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="w-2 h-8 bg-green-500 rounded mr-3"></span>
                    {t('graduateStudies.admissionRequirements')}
                  </h3>
                  <div className="space-y-4">
                    {currentData.requirements.map((requirement, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleRequirement(index)}
                          className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-300"
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                              activeTab === 'master' 
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                                : 'bg-gradient-to-r from-green-500 to-green-600'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-lg">
                                {requirement.title}
                              </h4>
                            </div>
                          </div>
                          <svg
                            className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${
                              expandedRequirement === index ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {expandedRequirement === index && (
                          <div className="px-6 pb-6">
                            <div className="border-t border-gray-200 pt-4">
                              <p className="text-gray-700 leading-relaxed">{requirement.description}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Documents */}
            <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}>
              <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white text-2xl">
                    📄
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {t('graduateStudies.documents')}
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {currentData.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
                    >
                      <div className="flex items-center space-x-4">
                        <span className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${
                          doc.type === 'pdf' ? 'text-red-500' : 
                          doc.type === 'doc' ? 'text-blue-500' : 'text-green-500'
                        }`}>
                          {doc.type === 'pdf' ? '📕' : doc.type === 'doc' ? '📘' : '📋'}
                        </span>
                        <div>
                          <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                            {doc.title}
                          </h4>
                          <p className="text-gray-500 text-sm">{doc.format}</p>
                        </div>
                      </div>
                      <span className="text-blue-500 group-hover:text-blue-700 group-hover:scale-110 transition-all duration-300">↓</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Important Dates */}
            <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-1000 delay-900 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}>
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white text-2xl">
                    📅
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {t('graduateStudies.importantDates')}
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {currentData.importantDates.map((date, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-300 group"
                    >
                      <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
                        {date.event}
                      </span>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold group-hover:bg-green-200 group-hover:scale-105 transition-all duration-300">
                        {date.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contacts */}
            <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-1000 delay-1100 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}>
              <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white text-2xl">
                    👥
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {t('graduateStudies.contacts')}
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 group">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                      👨‍🏫
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                        {commonInfo.contactPerson}
                      </h4>
                      <p className="text-gray-600 text-sm">{commonInfo.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 group">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 text-xl group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                      📧
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium group-hover:text-green-600 transition-colors duration-300">
                        {commonInfo.email}
                      </p>
                      <p className="text-gray-600 text-sm">Email</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 group">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                      📞
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium group-hover:text-blue-600 transition-colors duration-300">
                        {commonInfo.phone}
                      </p>
                      <p className="text-gray-600 text-sm">Телефон</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 group">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 text-xl group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                      🏢
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium group-hover:text-green-600 transition-colors duration-300">
                        {commonInfo.address}
                      </p>
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