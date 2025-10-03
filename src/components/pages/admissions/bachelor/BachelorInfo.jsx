// components/BachelorInfo.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const BachelorInfo = () => {
  const { t } = useTranslation();
  const [selectedProgram, setSelectedProgram] = useState(0);

  const programs = [
    {
      id: 'cs',
      title: t('bachelor.info.programs.cs.title'),
      description: t('bachelor.info.programs.cs.description'),
      duration: '4 года',
      subjects: ['Алгоритмы', 'Структуры данных', 'Машинное обучение', 'Базы данных'],
      careers: ['Software Engineer', 'Data Scientist', 'AI Researcher']
    },
    {
      id: 'se',
      title: t('bachelor.info.programs.se.title'),
      description: t('bachelor.info.programs.se.description'),
      duration: '4 года',
      subjects: ['Software Architecture', 'Testing', 'DevOps', 'Agile Methodologies'],
      careers: ['Software Architect', 'Tech Lead', 'Product Manager']
    },
    {
      id: 'cyber',
      title: t('bachelor.info.programs.cyber.title'),
      description: t('bachelor.info.programs.cyber.description'),
      duration: '4 года',
      subjects: ['Криптография', 'Сетевая безопасность', 'Ethical Hacking', 'Digital Forensics'],
      careers: ['Security Analyst', 'Penetration Tester', 'CISO']
    }
  ];

  const stats = [
    { number: '98%', label: t('bachelor.info.stats.employment') },
    { number: '50+', label: t('bachelor.info.stats.partners') },
    { number: '5', label: t('bachelor.info.stats.years') },
    { number: '1000+', label: t('bachelor.info.stats.graduates') }
  ];

  return (
    <div className="p-8">
      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl border border-blue-100">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {stat.number}
            </div>
            <div className="text-gray-600 font-medium mt-2">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Programs Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {t('bachelor.info.programsTitle')}
        </h2>
        
        {/* Program Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {programs.map((program, index) => (
            <button
              key={program.id}
              onClick={() => setSelectedProgram(index)}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                selectedProgram === index
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:shadow-md'
              }`}
            >
              {program.title}
            </button>
          ))}
        </div>

        {/* Program Details */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 border border-blue-100">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {programs[selectedProgram].title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {programs[selectedProgram].description}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  ⏱️ {programs[selectedProgram].duration}
                </span>
                <span className="flex items-center">
                  🎓 {t('bachelor.info.fullTime')}
                </span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  📚 {t('bachelor.info.keySubjects')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {programs[selectedProgram].subjects.map((subject, idx) => (
                    <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  💼 {t('bachelor.info.careerPaths')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {programs[selectedProgram].careers.map((career, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: '🏆', title: t('bachelor.info.features.quality.title'), desc: t('bachelor.info.features.quality.desc') },
          { icon: '🤝', title: t('bachelor.info.features.industry.title'), desc: t('bachelor.info.features.industry.desc') },
          { icon: '🌐', title: t('bachelor.info.features.international.title'), desc: t('bachelor.info.features.international.desc') }
        ].map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BachelorInfo;