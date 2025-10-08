// components/BachelorRegistration.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const BachelorRegistration = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  const [formData, setFormData] = useState({
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthDate: ''
    },
    education: {
      program: '',
      motivation: '',
      previousEducation: '',
      graduationYear: ''
    },
    documents: {
      passport: null,
      diploma: null,
      photos: null,
      medicalCertificate: null
    }
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const steps = [
    { 
      number: 1, 
      title: t('bachelor.registration.steps.personal.title', 'Личные данные'), 
      icon: '👤',
      description: t('bachelor.registration.steps.personal.description', 'Основная информация о абитуриенте'),
      colorClass: 'from-blue-500 to-blue-600'
    },
    { 
      number: 2, 
      title: t('bachelor.registration.steps.education.title', 'Образование'), 
      icon: '🎓',
      description: t('bachelor.registration.steps.education.description', 'Информация об образовании и выборе программы'),
      colorClass: 'from-green-500 to-green-600'
    },
    { 
      number: 3, 
      title: t('bachelor.registration.steps.documents.title', 'Документы'), 
      icon: '📄',
      description: t('bachelor.registration.steps.documents.description', 'Загрузка необходимых документов'),
      colorClass: 'from-blue-500 to-green-500'
    },
    { 
      number: 4, 
      title: t('bachelor.registration.steps.review.title', 'Подтверждение'), 
      icon: '✅',
      description: t('bachelor.registration.steps.review.description', 'Проверка и отправка заявки'),
      colorClass: 'from-green-500 to-blue-500'
    }
  ];

  const programs = [
    { id: 'sports_science', name: t('bachelor.registration.programs.sports_science', 'Спортивная наука') },
    { id: 'physical_education', name: t('bachelor.registration.programs.physical_education', 'Физическая культура') },
    { id: 'sports_management', name: t('bachelor.registration.programs.sports_management', 'Спортивный менеджмент') },
    { id: 'rehabilitation', name: t('bachelor.registration.programs.rehabilitation', 'Спортивная реабилитация') },
    { id: 'coaching', name: t('bachelor.registration.programs.coaching', 'Тренерская работа') }
  ];

  const deadlines = [
    { 
      period: t('bachelor.registration.deadlines.main.period', 'Основной набор'), 
      date: '20 июня - 25 июля',
      status: 'active'
    },
    { 
      period: t('bachelor.registration.deadlines.additional.period', 'Дополнительный набор'), 
      date: '1-15 августа',
      status: 'upcoming'
    }
  ];

  const requirements = [
    t('bachelor.registration.requirements.age', 'Возраст от 17 до 25 лет'),
    t('bachelor.registration.requirements.education', 'Аттестат о среднем образовании'),
    t('bachelor.registration.requirements.exams', 'Результаты вступительных экзаменов'),
    t('bachelor.registration.requirements.language', 'Владение английским языком (для международных программ)'),
    t('bachelor.registration.requirements.health', 'Медицинская справка')
  ];

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 0) {
      if (!formData.personal.firstName) errors.firstName = t('bachelor.registration.errors.required');
      if (!formData.personal.lastName) errors.lastName = t('bachelor.registration.errors.required');
      if (!formData.personal.email) errors.email = t('bachelor.registration.errors.required');
      if (!formData.personal.phone) errors.phone = t('bachelor.registration.errors.required');
    }
    
    if (step === 1) {
      if (!formData.education.program) errors.program = t('bachelor.registration.errors.required');
      if (!formData.education.motivation) errors.motivation = t('bachelor.registration.errors.required');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleInputChange = (step, field, value) => {
    setFormData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        [field]: value
      }
    }));
  };

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file
      }
    }));
  };

  const handleSubmit = () => {
    // Here would be API call to submit the application
    console.log('Form submitted:', formData);
    alert(t('bachelor.registration.success', 'Заявка успешно отправлена!'));
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 mb-6 group hover:bg-white/20 transition-all duration-300">
            <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
            <span className="text-green-300 font-medium text-sm md:text-base">
              {t('bachelor.registration.badge', 'Поступление')}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            {t('bachelor.registration.title', 'Регистрация на бакалавриат')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-green-400 mx-auto mb-6 md:mb-8"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto px-4 leading-relaxed">
            {t('bachelor.registration.subtitle', 'Подайте заявку на поступление в академию')}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 md:gap-12">
          {/* Progress Steps - Sidebar */}
          <div className="lg:col-span-1">
            <div className={`bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl border border-white/20 p-6 sticky top-6 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-200">
                    {t('bachelor.registration.progress', 'Прогресс')}
                  </span>
                  <span className="text-sm font-bold text-green-300">
                    {Math.round(getProgressPercentage())}%
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full transition-all duration-500 shadow-lg"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step.number}
                    className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 group cursor-pointer ${
                      index === currentStep
                        ? `bg-gradient-to-r ${step.colorClass} border-white/30 text-white shadow-2xl transform scale-105`
                        : index < currentStep
                        ? 'bg-green-500/20 border-green-400/30 text-green-300'
                        : 'bg-white/5 border-white/20 text-blue-100 hover:border-green-400/50 hover:bg-white/10'
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold transition-all duration-300 ${
                      index === currentStep
                        ? 'bg-white/20 text-white'
                        : index < currentStep
                        ? 'bg-green-400 text-white'
                        : 'bg-white/10 text-blue-200 group-hover:text-white'
                    }`}>
                      {index < currentStep ? '✓' : step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium transition-colors duration-300 ${
                        index === currentStep ? 'text-white' : 
                        index < currentStep ? 'text-green-300' : 'text-blue-100 group-hover:text-white'
                      }`}>
                        {step.title}
                      </div>
                      <div className={`text-xs transition-colors duration-300 ${
                        index === currentStep ? 'text-white/90' : 
                        index < currentStep ? 'text-green-200' : 'text-blue-200 group-hover:text-blue-100'
                      } truncate`}>
                        {step.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements Card */}
            <div className={`mt-6 bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl border border-white/20 p-6 transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h3 className="font-semibold text-white mb-4 text-lg flex items-center gap-2">
                <span className="text-blue-400">📋</span>
                <span>{t('bachelor.registration.requirementsTitle', 'Требования')}</span>
              </h3>
              <ul className="space-y-3">
                {requirements.map((requirement, idx) => (
                  <li key={idx} className="flex items-start gap-3 group">
                    <div className="w-5 h-5 bg-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-green-400/30 transition-colors duration-300">
                      <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:bg-green-400 transition-colors duration-300"></div>
                    </div>
                    <span className="text-blue-100 text-sm group-hover:text-white transition-colors duration-300">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className={`bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl border border-white/20 overflow-hidden shadow-2xl transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              {/* Step Header */}
              <div className="border-b border-white/20 p-6 bg-white/5">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${steps[currentStep].colorClass} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {steps[currentStep].number}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {steps[currentStep].title}
                    </h2>
                    <p className="text-blue-100 mt-1">
                      {steps[currentStep].description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <div className="p-6">
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">
                          {t('bachelor.registration.form.firstName', 'Имя')} *
                        </label>
                        <input 
                          type="text" 
                          value={formData.personal.firstName}
                          onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                          className={`w-full p-4 bg-white/5 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-white placeholder-blue-300 ${
                            formErrors.firstName ? 'border-red-400' : 'border-white/20'
                          }`}
                          placeholder={t('bachelor.registration.form.firstNamePlaceholder', 'Введите ваше имя')}
                        />
                        {formErrors.firstName && (
                          <p className="text-red-400 text-sm mt-1">{formErrors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">
                          {t('bachelor.registration.form.lastName', 'Фамилия')} *
                        </label>
                        <input 
                          type="text" 
                          value={formData.personal.lastName}
                          onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                          className={`w-full p-4 bg-white/5 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-white placeholder-blue-300 ${
                            formErrors.lastName ? 'border-red-400' : 'border-white/20'
                          }`}
                          placeholder={t('bachelor.registration.form.lastNamePlaceholder', 'Введите вашу фамилию')}
                        />
                        {formErrors.lastName && (
                          <p className="text-red-400 text-sm mt-1">{formErrors.lastName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">
                          {t('bachelor.registration.form.email', 'Email')} *
                        </label>
                        <input 
                          type="email" 
                          value={formData.personal.email}
                          onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                          className={`w-full p-4 bg-white/5 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-white placeholder-blue-300 ${
                            formErrors.email ? 'border-red-400' : 'border-white/20'
                          }`}
                          placeholder="email@example.com"
                        />
                        {formErrors.email && (
                          <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">
                          {t('bachelor.registration.form.phone', 'Телефон')} *
                        </label>
                        <input 
                          type="tel" 
                          value={formData.personal.phone}
                          onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                          className={`w-full p-4 bg-white/5 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-white placeholder-blue-300 ${
                            formErrors.phone ? 'border-red-400' : 'border-white/20'
                          }`}
                          placeholder="+7 (XXX) XXX-XX-XX"
                        />
                        {formErrors.phone && (
                          <p className="text-red-400 text-sm mt-1">{formErrors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">
                        {t('bachelor.registration.form.selectProgram', 'Выберите программу')} *
                      </label>
                      <select 
                        value={formData.education.program}
                        onChange={(e) => handleInputChange('education', 'program', e.target.value)}
                        className={`w-full p-4 bg-white/5 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-white ${
                          formErrors.program ? 'border-red-400' : 'border-white/20'
                        }`}
                      >
                        <option value="" className="bg-blue-900 text-white">{t('bachelor.registration.form.chooseProgram', 'Выберите программу обучения')}</option>
                        {programs.map(program => (
                          <option key={program.id} value={program.id} className="bg-blue-900 text-white">
                            {program.name}
                          </option>
                        ))}
                      </select>
                      {formErrors.program && (
                        <p className="text-red-400 text-sm mt-1">{formErrors.program}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">
                        {t('bachelor.registration.form.motivation', 'Мотивационное письмо')} *
                      </label>
                      <textarea 
                        value={formData.education.motivation}
                        onChange={(e) => handleInputChange('education', 'motivation', e.target.value)}
                        rows={6}
                        className={`w-full p-4 bg-white/5 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-white placeholder-blue-300 ${
                          formErrors.motivation ? 'border-red-400' : 'border-white/20'
                        }`}
                        placeholder={t('bachelor.registration.form.motivationPlaceholder', 'Расскажите о ваших целях и почему вы хотите учиться в нашей академии...')}
                      />
                      {formErrors.motivation && (
                        <p className="text-red-400 text-sm mt-1">{formErrors.motivation}</p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <p className="text-blue-200 mb-4">
                      {t('bachelor.registration.uploadDescription', 'Загрузите необходимые документы в формате PDF или JPG')}
                    </p>
                    
                    {[
                      { key: 'passport', label: t('bachelor.registration.documents.passport', 'Копия паспорта') },
                      { key: 'diploma', label: t('bachelor.registration.documents.diploma', 'Аттестат или диплом') },
                      { key: 'photos', label: t('bachelor.registration.documents.photos', 'Фотографии 3x4') },
                      { key: 'medicalCertificate', label: t('bachelor.registration.documents.medical', 'Медицинская справка') }
                    ].map((doc, idx) => (
                      <div key={doc.key} className="flex items-center justify-between p-4 bg-white/5 border border-white/20 rounded-xl hover:border-blue-400 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center group-hover:bg-green-400/30 transition-colors duration-300">
                            <span className="text-blue-400 group-hover:text-green-400 transition-colors duration-300">📄</span>
                          </div>
                          <div>
                            <span className="font-medium text-white">{doc.label}</span>
                            <p className="text-sm text-blue-300">
                              {formData.documents[doc.key] ? '✅ Загружено' : '❌ Не загружено'}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => document.getElementById(`file-${doc.key}`).click()}
                          className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-green-600 transition-all transform hover:scale-105 text-sm font-medium shadow-lg border border-white/20"
                        >
                          {t('bachelor.registration.upload', 'Загрузить')}
                        </button>
                        <input
                          id={`file-${doc.key}`}
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(doc.key, e.target.files[0])}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center py-4">
                      <div className="text-6xl mb-4">🎓</div>
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {t('bachelor.registration.reviewTitle', 'Проверьте вашу заявку')}
                      </h3>
                      <p className="text-blue-200 mb-8">
                        {t('bachelor.registration.reviewDescription', 'Убедитесь, что все данные указаны верно перед отправкой')}
                      </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 space-y-4 border border-white/20">
                      <h4 className="font-semibold text-white text-lg mb-4">Личные данные</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-blue-300">Имя:</span>
                          <p className="font-medium text-white">{formData.personal.firstName}</p>
                        </div>
                        <div>
                          <span className="text-sm text-blue-300">Фамилия:</span>
                          <p className="font-medium text-white">{formData.personal.lastName}</p>
                        </div>
                        <div>
                          <span className="text-sm text-blue-300">Email:</span>
                          <p className="font-medium text-white">{formData.personal.email}</p>
                        </div>
                        <div>
                          <span className="text-sm text-blue-300">Телефон:</span>
                          <p className="font-medium text-white">{formData.personal.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                      <h4 className="font-semibold text-white text-lg mb-4">Образование</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-blue-300">Программа:</span>
                          <p className="font-medium text-white">
                            {programs.find(p => p.id === formData.education.program)?.name || 'Не выбрано'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="border-t border-white/20 p-6 bg-white/5">
                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="px-8 py-3 bg-white/10 border border-white/20 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-400 hover:bg-white/20 transition-all duration-300 font-medium backdrop-blur-lg"
                  >
                    {t('bachelor.registration.previous', 'Назад')}
                  </button>
                  <button
                    onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:from-blue-600 hover:to-green-600 transition-all transform hover:scale-105 font-medium shadow-lg border border-white/20"
                  >
                    {currentStep === steps.length - 1 
                      ? t('bachelor.registration.submit', 'Отправить заявку')
                      : t('bachelor.registration.next', 'Продолжить')
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Deadlines */}
            <div className={`bg-orange-500/20 backdrop-blur-lg border border-orange-400/30 rounded-2xl md:rounded-3xl p-6 transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h3 className="font-semibold text-orange-300 mb-4 flex items-center gap-2">
                <span className="text-orange-400">⏰</span>
                <span>{t('bachelor.registration.deadlinesTitle', 'Сроки подачи')}</span>
              </h3>
              <div className="space-y-4">
                {deadlines.map((deadline, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border backdrop-blur-sm ${
                    deadline.status === 'active' 
                      ? 'bg-orange-500/10 border-orange-400/50' 
                      : 'bg-orange-500/5 border-orange-400/30'
                  }`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-orange-300 font-medium">{deadline.period}</span>
                      {deadline.status === 'active' && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full border border-orange-400/50">
                          Активно
                        </span>
                      )}
                    </div>
                    <div className="text-orange-200 font-bold">{deadline.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Help Section */}
            <div className={`bg-green-500/20 backdrop-blur-lg border border-green-400/30 rounded-2xl md:rounded-3xl p-6 transition-all duration-1000 delay-900 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h3 className="font-semibold text-green-300 mb-3 flex items-center gap-2">
                <span className="text-green-400">❓</span>
                <span>{t('bachelor.registration.help.title', 'Нужна помощь?')}</span>
              </h3>
              <p className="text-green-200 text-sm mb-4">
                {t('bachelor.registration.help.description', 'Свяжитесь с нами для консультации')}
              </p>
              <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 text-sm font-medium border border-green-400/30 shadow-lg">
                {t('bachelor.registration.help.button', 'Связаться с приемной комиссией')}
              </button>
            </div>

            {/* Contact Info */}
            <div className={`bg-blue-500/20 backdrop-blur-lg border border-blue-400/30 rounded-2xl md:rounded-3xl p-6 transition-all duration-1000 delay-1100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h3 className="font-semibold text-blue-300 mb-4 flex items-center gap-2">
                <span className="text-blue-400">📞</span>
                <span>Контакты</span>
              </h3>
              <div className="space-y-3 text-blue-200 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">📧</span>
                  <span>admission@academy.ru</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">📱</span>
                  <span>+7 (495) 123-45-67</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">🏛️</span>
                  <span>Главный корпус, каб. 101</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Плавающие элементы для десктопа */}
      {!isMobile && (
        <>
          <div className="absolute bottom-20 left-5 w-6 h-6 bg-green-400/20 rounded-full animate-bounce"></div>
          <div className="absolute top-20 right-5 w-4 h-4 bg-blue-400/20 rounded-full animate-ping"></div>
        </>
      )}
    </section>
  );
};

export default BachelorRegistration;