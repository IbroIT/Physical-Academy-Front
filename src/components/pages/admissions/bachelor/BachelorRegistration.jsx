// components/BachelorRegistration.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const BachelorRegistration = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
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

  const steps = [
    { 
      number: 1, 
      title: t('bachelor.registration.steps.personal.title', 'Личные данные'), 
      icon: '👤',
      description: t('bachelor.registration.steps.personal.description', 'Основная информация о абитуриенте')
    },
    { 
      number: 2, 
      title: t('bachelor.registration.steps.education.title', 'Образование'), 
      icon: '🎓',
      description: t('bachelor.registration.steps.education.description', 'Информация об образовании и выборе программы')
    },
    { 
      number: 3, 
      title: t('bachelor.registration.steps.documents.title', 'Документы'), 
      icon: '📄',
      description: t('bachelor.registration.steps.documents.description', 'Загрузка необходимых документов')
    },
    { 
      number: 4, 
      title: t('bachelor.registration.steps.review.title', 'Подтверждение'), 
      icon: '✅',
      description: t('bachelor.registration.steps.review.description', 'Проверка и отправка заявки')
    }
  ];

  const programs = [
    { id: 'cs', name: t('bachelor.registration.programs.cs', 'Компьютерные науки') },
    { id: 'se', name: t('bachelor.registration.programs.se', 'Программная инженерия') },
    { id: 'cyber', name: t('bachelor.registration.programs.cyber', 'Кибербезопасность') },
    { id: 'ai', name: t('bachelor.registration.programs.ai', 'Искусственный интеллект') },
    { id: 'data', name: t('bachelor.registration.programs.data', 'Наука о данных') }
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
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('bachelor.registration.title', 'Регистрация на бакалавриат')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('bachelor.registration.subtitle', 'Подайте заявку на поступление в академию')}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Progress Steps - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    {t('bachelor.registration.progress', 'Прогресс')}
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {Math.round(getProgressPercentage())}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step.number}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                      index === currentStep
                        ? 'bg-blue-50 border border-blue-200'
                        : index < currentStep
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold transition-all duration-300 ${
                      index === currentStep
                        ? 'bg-blue-600 text-white'
                        : index < currentStep
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index < currentStep ? '✓' : step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${
                        index === currentStep ? 'text-blue-800' : 
                        index < currentStep ? 'text-green-800' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {step.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {/* Step Header */}
              <div className="border-b border-gray-200 p-6 bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {steps[currentStep].number}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {steps[currentStep].title}
                    </h2>
                    <p className="text-gray-600 mt-1">
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('bachelor.registration.form.firstName', 'Имя')} *
                        </label>
                        <input 
                          type="text" 
                          value={formData.personal.firstName}
                          onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                          className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            formErrors.firstName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder={t('bachelor.registration.form.firstNamePlaceholder', 'Введите ваше имя')}
                        />
                        {formErrors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('bachelor.registration.form.lastName', 'Фамилия')} *
                        </label>
                        <input 
                          type="text" 
                          value={formData.personal.lastName}
                          onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                          className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            formErrors.lastName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder={t('bachelor.registration.form.lastNamePlaceholder', 'Введите вашу фамилию')}
                        />
                        {formErrors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('bachelor.registration.form.email', 'Email')} *
                        </label>
                        <input 
                          type="email" 
                          value={formData.personal.email}
                          onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                          className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            formErrors.email ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="email@example.com"
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('bachelor.registration.form.phone', 'Телефон')} *
                        </label>
                        <input 
                          type="tel" 
                          value={formData.personal.phone}
                          onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                          className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            formErrors.phone ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="+7 (XXX) XXX-XX-XX"
                        />
                        {formErrors.phone && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('bachelor.registration.form.selectProgram', 'Выберите программу')} *
                      </label>
                      <select 
                        value={formData.education.program}
                        onChange={(e) => handleInputChange('education', 'program', e.target.value)}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.program ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">{t('bachelor.registration.form.chooseProgram', 'Выберите программу обучения')}</option>
                        {programs.map(program => (
                          <option key={program.id} value={program.id}>
                            {program.name}
                          </option>
                        ))}
                      </select>
                      {formErrors.program && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.program}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('bachelor.registration.form.motivation', 'Мотивационное письмо')} *
                      </label>
                      <textarea 
                        value={formData.education.motivation}
                        onChange={(e) => handleInputChange('education', 'motivation', e.target.value)}
                        rows={6}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.motivation ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder={t('bachelor.registration.form.motivationPlaceholder', 'Расскажите о ваших целях и почему вы хотите учиться в нашей академии...')}
                      />
                      {formErrors.motivation && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.motivation}</p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <p className="text-gray-600 mb-4">
                      {t('bachelor.registration.uploadDescription', 'Загрузите необходимые документы в формате PDF или JPG')}
                    </p>
                    
                    {[
                      { key: 'passport', label: t('bachelor.registration.documents.passport', 'Копия паспорта') },
                      { key: 'diploma', label: t('bachelor.registration.documents.diploma', 'Аттестат или диплом') },
                      { key: 'photos', label: t('bachelor.registration.documents.photos', 'Фотографии 3x4') },
                      { key: 'medicalCertificate', label: t('bachelor.registration.documents.medical', 'Медицинская справка') }
                    ].map((doc, idx) => (
                      <div key={doc.key} className="flex items-center justify-between p-4 border border-gray-300 rounded-xl hover:border-blue-300 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600">📄</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">{doc.label}</span>
                            <p className="text-sm text-gray-500">
                              {formData.documents[doc.key] ? '✅ Загружено' : '❌ Не загружено'}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => document.getElementById(`file-${doc.key}`).click()}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {t('bachelor.registration.reviewTitle', 'Проверьте вашу заявку')}
                      </h3>
                      <p className="text-gray-600 mb-8">
                        {t('bachelor.registration.reviewDescription', 'Убедитесь, что все данные указаны верно перед отправкой')}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                      <h4 className="font-semibold text-gray-900 text-lg mb-4">Личные данные</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Имя:</span>
                          <p className="font-medium">{formData.personal.firstName}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Фамилия:</span>
                          <p className="font-medium">{formData.personal.lastName}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Email:</span>
                          <p className="font-medium">{formData.personal.email}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Телефон:</span>
                          <p className="font-medium">{formData.personal.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 text-lg mb-4">Образование</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-600">Программа:</span>
                          <p className="font-medium">
                            {programs.find(p => p.id === formData.education.program)?.name || 'Не выбрано'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="px-8 py-3 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-500 transition-colors font-medium"
                  >
                    {t('bachelor.registration.previous', 'Назад')}
                  </button>
                  <button
                    onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
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
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <h3 className="font-semibold text-orange-800 mb-4 flex items-center gap-2">
                <span>⏰</span>
                <span>{t('bachelor.registration.deadlinesTitle', 'Сроки подачи')}</span>
              </h3>
              <div className="space-y-4">
                {deadlines.map((deadline, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border ${
                    deadline.status === 'active' 
                      ? 'bg-white border-orange-300' 
                      : 'bg-orange-100 border-orange-200'
                  }`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-orange-700 font-medium">{deadline.period}</span>
                      {deadline.status === 'active' && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                          Активно
                        </span>
                      )}
                    </div>
                    <div className="text-orange-800 font-bold">{deadline.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="font-semibold text-blue-800 mb-4">
                {t('bachelor.registration.requirementsTitle', 'Требования')}
              </h3>
              <ul className="space-y-3">
                {requirements.map((requirement, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-blue-700 text-sm">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help Section */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <span>❓</span>
                <span>{t('bachelor.registration.help.title', 'Нужна помощь?')}</span>
              </h3>
              <p className="text-green-700 text-sm mb-4">
                {t('bachelor.registration.help.description', 'Свяжитесь с нами для консультации')}
              </p>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                {t('bachelor.registration.help.button', 'Связаться с приемной комиссией')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BachelorRegistration;