// CollegeSports.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const CollegeSports = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('about');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredProgram, setHoveredProgram] = useState(null);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          startCounters();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const startCounters = () => {
    const targetValues = [500, 15, 95, 10];
    const duration = 2000;
    const steps = 60;
    const stepValues = targetValues.map(target => target / steps);

    let currentStep = 0;
    const counterInterval = setInterval(() => {
      currentStep++;
      setCounterValues(prev => 
        prev.map((value, index) => {
          if (currentStep <= steps) {
            return Math.min(value + stepValues[index], targetValues[index]);
          }
          return value;
        })
      );

      if (currentStep >= steps) {
        clearInterval(counterInterval);
      }
    }, duration / steps);
  };

  const sections = [
    { id: 'about', label: t('collegeSports.sections.about'), icon: '🏫', color: 'from-blue-500 to-blue-600' },
    { id: 'programs', label: t('collegeSports.sections.programs'), icon: '🎓', color: 'from-green-500 to-green-600' },
    { id: 'admissions', label: t('collegeSports.sections.admissions'), icon: '📝', color: 'from-blue-500 to-green-500' },
    { id: 'campus', label: t('collegeSports.sections.campus'), icon: '🏛️', color: 'from-green-500 to-blue-500' },
    { id: 'sports', label: t('collegeSports.sections.sports'), icon: '⚽', color: 'from-blue-500 to-green-600' }
  ];

  const stats = [
    { 
      number: `${Math.round(counterValues[0])}+`, 
      label: t('collegeSports.stats.students'), 
      icon: '👨‍🎓',
      delay: 0
    },
    { 
      number: `${Math.round(counterValues[1])}+`, 
      label: t('collegeSports.stats.programs'), 
      icon: '📚',
      delay: 200
    },
    { 
      number: `${Math.round(counterValues[2])}%`, 
      label: t('collegeSports.stats.employment'), 
      icon: '💼',
      delay: 400
    },
    { 
      number: `${Math.round(counterValues[3])}`, 
      label: t('collegeSports.stats.sports'), 
      icon: '🏆',
      delay: 600
    }
  ];

  const programs = [
    {
      id: 'physical-education',
      title: t('collegeSports.programs.physicalEducation.title'),
      duration: '2 года 10 месяцев',
      description: t('collegeSports.programs.physicalEducation.description'),
      subjects: [
        t('collegeSports.programs.physicalEducation.subjects.0'),
        t('collegeSports.programs.physicalEducation.subjects.1'),
        t('collegeSports.programs.physicalEducation.subjects.2'),
        t('collegeSports.programs.physicalEducation.subjects.3')
      ],
      careers: [
        t('collegeSports.programs.physicalEducation.careers.0'),
        t('collegeSports.programs.physicalEducation.careers.1'),
        t('collegeSports.programs.physicalEducation.careers.2')
      ],
      icon: '🏃‍♂️',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'sports-coaching',
      title: t('collegeSports.programs.sportsCoaching.title'),
      duration: '2 года 10 месяцев',
      description: t('collegeSports.programs.sportsCoaching.description'),
      subjects: [
        t('collegeSports.programs.sportsCoaching.subjects.0'),
        t('collegeSports.programs.sportsCoaching.subjects.1'),
        t('collegeSports.programs.sportsCoaching.subjects.2'),
        t('collegeSports.programs.sportsCoaching.subjects.3')
      ],
      careers: [
        t('collegeSports.programs.sportsCoaching.careers.0'),
        t('collegeSports.programs.sportsCoaching.careers.1'),
        t('collegeSports.programs.sportsCoaching.careers.2')
      ],
      icon: '👨‍🏫',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'fitness-training',
      title: t('collegeSports.programs.fitnessTraining.title'),
      duration: '2 года 10 месяцев',
      description: t('collegeSports.programs.fitnessTraining.description'),
      subjects: [
        t('collegeSports.programs.fitnessTraining.subjects.0'),
        t('collegeSports.programs.fitnessTraining.subjects.1'),
        t('collegeSports.programs.fitnessTraining.subjects.2'),
        t('collegeSports.programs.fitnessTraining.subjects.3')
      ],
      careers: [
        t('collegeSports.programs.fitnessTraining.careers.0'),
        t('collegeSports.programs.fitnessTraining.careers.1'),
        t('collegeSports.programs.fitnessTraining.careers.2')
      ],
      icon: '💪',
      color: 'from-blue-500 to-green-500'
    }
  ];

  const sportsFacilities = [
    {
      name: t('collegeSports.facilities.gym.name'),
      description: t('collegeSports.facilities.gym.description'),
      icon: '🏋️',
      image: '/api/placeholder/400/300',
      color: 'blue'
    },
    {
      name: t('collegeSports.facilities.stadium.name'),
      description: t('collegeSports.facilities.stadium.description'),
      icon: '🏟️',
      image: '/api/placeholder/400/300',
      color: 'green'
    },
    {
      name: t('collegeSports.facilities.pool.name'),
      description: t('collegeSports.facilities.pool.description'),
      icon: '🏊',
      image: '/api/placeholder/400/300',
      color: 'blue'
    },
    {
      name: t('collegeSports.facilities.courts.name'),
      description: t('collegeSports.facilities.courts.description'),
      icon: '🎾',
      image: '/api/placeholder/400/300',
      color: 'green'
    }
  ];

  const admissionSteps = [
    {
      step: 1,
      title: t('collegeSports.admission.steps.0.title'),
      description: t('collegeSports.admission.steps.0.description'),
      icon: '📋',
      color: 'blue'
    },
    {
      step: 2,
      title: t('collegeSports.admission.steps.1.title'),
      description: t('collegeSports.admission.steps.1.description'),
      icon: '📚',
      color: 'green'
    },
    {
      step: 3,
      title: t('collegeSports.admission.steps.2.title'),
      description: t('collegeSports.admission.steps.2.description'),
      icon: '🎯',
      color: 'blue'
    },
    {
      step: 4,
      title: t('collegeSports.admission.steps.3.title'),
      description: t('collegeSports.admission.steps.3.description'),
      icon: '✅',
      color: 'green'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'about':
        return (
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  {t('collegeSports.about.title')}
                </h3>
                <div className="prose prose-lg text-gray-700 space-y-6">
                  <p className="text-lg leading-relaxed border-l-4 border-blue-500 pl-6 py-2 bg-blue-50 rounded-r-2xl">
                    {t('collegeSports.about.description1')}
                  </p>
                  <p className="text-lg leading-relaxed">
                    {t('collegeSports.about.description2')}
                  </p>
                  <p className="text-lg leading-relaxed">
                    {t('collegeSports.about.description3')}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-green-500 rounded-3xl p-8 text-white text-center shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="text-6xl mb-6 hover:scale-110 transition-transform duration-500">🏆</div>
                <h4 className="text-2xl font-bold mb-4">{t('collegeSports.about.missionTitle')}</h4>
                <p className="text-lg opacity-90 leading-relaxed">{t('collegeSports.about.mission')}</p>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {[
                {
                  icon: '👨‍🏫',
                  title: t('collegeSports.about.features.teachers.title'),
                  description: t('collegeSports.about.features.teachers.description'),
                  color: 'blue'
                },
                {
                  icon: '🔬',
                  title: t('collegeSports.about.features.equipment.title'),
                  description: t('collegeSports.about.features.equipment.description'),
                  color: 'green'
                },
                {
                  icon: '🤝',
                  title: t('collegeSports.about.features.partnerships.title'),
                  description: t('collegeSports.about.features.partnerships.description'),
                  color: 'blue'
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-gray-200 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden"
                >
                  {/* Background effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${
                    feature.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                  
                  <div className="relative z-10">
                    <div className={`text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 ${
                      feature.color === 'blue' ? 'text-blue-500' : 'text-green-500'
                    }`}>
                      {feature.icon}
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'programs':
        return (
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              {t('collegeSports.programs.title')}
            </h3>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {programs.map((program, index) => (
                <div 
                  key={program.id}
                  onMouseEnter={() => setHoveredProgram(index)}
                  onMouseLeave={() => setHoveredProgram(null)}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden"
                >
                  {/* Background effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${
                    program.color.includes('blue') ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                  
                  <div className="relative z-10">
                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {program.icon}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {program.title}
                    </h4>
                    <p className="text-gray-700 mb-4 leading-relaxed text-lg">{program.description}</p>
                    
                    <div className="flex items-center text-lg text-gray-600 mb-4">
                      <span className="mr-3">⏱️</span>
                      {program.duration}
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center text-lg">
                          <span className="mr-3">📚</span>
                          {t('collegeSports.programs.keySubjects')}
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {program.subjects.map((subject, idx) => (
                            <span 
                              key={idx}
                              className="bg-blue-100 text-blue-700 px-3 py-2 rounded-2xl text-sm font-medium hover:bg-blue-200 hover:scale-105 transition-all duration-300 cursor-default"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center text-lg">
                          <span className="mr-3">💼</span>
                          {t('collegeSports.programs.careerPaths')}
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {program.careers.map((career, idx) => (
                            <span 
                              key={idx}
                              className="bg-green-100 text-green-700 px-3 py-2 rounded-2xl text-sm font-medium hover:bg-green-200 hover:scale-105 transition-all duration-300 cursor-default"
                            >
                              {career}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      {t('collegeSports.programs.learnMore')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'admissions':
        return (
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              {t('collegeSports.admission.title')}
            </h3>

            {/* Admission Timeline */}
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-green-500 -z-10 rounded-full"></div>
              <div className="space-y-8">
                {admissionSteps.map((step, index) => (
                  <div key={step.step} className="flex items-start space-x-6 group">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg transition-all duration-500 group-hover:scale-110 ${
                      step.color === 'blue' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                        : 'bg-gradient-to-r from-green-500 to-green-600'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {step.title}
                        </h4>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                          step.color === 'blue' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {t('collegeSports.admission.step')} {step.step}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-lg">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1">
                <h4 className="font-bold text-blue-800 text-xl mb-6 flex items-center">
                  <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">📋</span>
                  {t('collegeSports.admission.requirements.title')}
                </h4>
                <ul className="space-y-4">
                  {t('collegeSports.admission.requirements.list', { returnObjects: true }).map((req, idx) => (
                    <li key={idx} className="flex items-start group">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                      <span className="text-blue-700 text-lg group-hover:text-blue-800 transition-colors duration-300">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-50 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1">
                <h4 className="font-bold text-green-800 text-xl mb-6 flex items-center">
                  <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">📅</span>
                  {t('collegeSports.admission.deadlines.title')}
                </h4>
                <div className="space-y-4">
                  {t('collegeSports.admission.deadlines.list', { returnObjects: true }).map((deadline, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-white rounded-xl border border-green-200 hover:shadow-md transition-all duration-300 group">
                      <span className="text-green-700 font-medium text-lg group-hover:text-green-800 transition-colors duration-300">
                        {deadline.period}
                      </span>
                      <span className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold group-hover:scale-105 transition-transform duration-300">
                        {deadline.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'campus':
        return (
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              {t('collegeSports.campus.title')}
            </h3>

            {/* Sports Facilities */}
            <div className="grid md:grid-cols-2 gap-8">
              {sportsFacilities.map((facility, index) => (
                <div key={index} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-green-500 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-white text-6xl group-hover:scale-110 transition-transform duration-500">
                      {facility.icon}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {facility.name}
                    </h4>
                    <p className="text-gray-700 mb-4 leading-relaxed text-lg">{facility.description}</p>
                    <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center group-hover:translate-x-2 transition-transform duration-300 text-lg">
                      {t('collegeSports.campus.viewDetails')}
                      <span className="ml-2">→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Campus Life */}
            <div className="mt-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
              <h4 className="text-2xl font-bold mb-8 text-center">
                {t('collegeSports.campus.life.title')}
              </h4>
              <div className="grid md:grid-cols-3 gap-8">
                {t('collegeSports.campus.life.features', { returnObjects: true }).map((feature, index) => (
                  <div key={index} className="text-center group">
                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h5 className="font-semibold mb-3 text-lg">{feature.title}</h5>
                    <p className="text-white/90 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'sports':
        return (
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              {t('collegeSports.sports.title')}
            </h3>

            {/* Sports Teams */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {t('collegeSports.sports.teams', { returnObjects: true }).map((team, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {team.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900 text-lg mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {team.name}
                  </h4>
                  <p className="text-gray-700 mb-4">{team.coach}</p>
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium inline-block group-hover:bg-green-200 group-hover:scale-105 transition-all duration-300">
                    {team.status}
                  </div>
                </div>
              ))}
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-200 shadow-sm hover:shadow-xl transition-all duration-500">
              <h4 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {t('collegeSports.sports.achievements.title')}
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {t('collegeSports.sports.achievements.list', { returnObjects: true }).map((achievement, index) => (
                  <div key={index} className="text-center group">
                    <div className="text-3xl text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                      {achievement.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {achievement.number}
                    </div>
                    <div className="text-gray-700 text-lg">{achievement.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Training Schedule */}
            <div className="mt-12">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">
                {t('collegeSports.sports.schedule.title')}
              </h4>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 font-semibold text-gray-900 text-lg">
                          {t('collegeSports.sports.schedule.team')}
                        </th>
                        <th className="text-left py-4 font-semibold text-gray-900 text-lg">
                          {t('collegeSports.sports.schedule.days')}
                        </th>
                        <th className="text-left py-4 font-semibold text-gray-900 text-lg">
                          {t('collegeSports.sports.schedule.time')}
                        </th>
                        <th className="text-left py-4 font-semibold text-gray-900 text-lg">
                          {t('collegeSports.sports.schedule.location')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {t('collegeSports.sports.schedule.list', { returnObjects: true }).map((schedule, index) => (
                        <tr key={index} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-300">
                          <td className="py-4 text-gray-700 text-lg">{schedule.team}</td>
                          <td className="py-4 text-gray-700 text-lg">{schedule.days}</td>
                          <td className="py-4 text-gray-700 text-lg">{schedule.time}</td>
                          <td className="py-4 text-gray-700 text-lg">{schedule.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
              {t('collegeSports.badge')}
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('collegeSports.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('collegeSports.subtitle')}
          </p>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-8 bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2 font-mono">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium text-lg">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className={`bg-white rounded-3xl shadow-lg border border-gray-200 mb-12 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`p-6 rounded-2xl transition-all duration-500 transform hover:scale-105 group ${
                  activeSection === section.id
                    ? `bg-gradient-to-r ${section.color} text-white shadow-2xl scale-105`
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-lg'
                }`}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {section.icon}
                </div>
                <div className="font-semibold text-lg">{section.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className={`bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeSports;