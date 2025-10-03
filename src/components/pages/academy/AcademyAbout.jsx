import React from 'react';

const AcademyAbout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-green-100 flex flex-col items-center py-12 px-6">
      {/* Заголовок */}
      <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">
        Об академии
      </h1>

      {/* Контент */}
      <div className="max-w-4xl bg-white shadow-lg rounded-2xl p-8 border-t-4 border-green-400">
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Наша академия — это современный центр образования, науки и спорта, 
          направленный на подготовку квалифицированных специалистов мирового уровня.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Основная цель академии — развитие личности студента, 
          формирование профессиональных компетенций и воспитание активной гражданской позиции.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Мы стремимся создавать инновационную образовательную среду, 
          объединяющую традиции и современные технологии, 
          а также предоставляем возможности для академического обмена, 
          научных исследований и практического опыта.
        </p>

        {/* Карточки ценностей */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-50 rounded-xl shadow-md p-4 text-center hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Миссия</h3>
            <p className="text-gray-600 text-sm">
              Поддерживать высокий уровень образования и формировать новых лидеров общества.
            </p>
          </div>
          <div className="bg-green-50 rounded-xl shadow-md p-4 text-center hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-green-700 mb-2">Ценности</h3>
            <p className="text-gray-600 text-sm">
              Честность, инновации, сотрудничество и уважение к личности.
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl shadow-md p-4 text-center hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Задачи</h3>
            <p className="text-gray-600 text-sm">
              Развитие науки, внедрение новых технологий и укрепление международных связей.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademyAbout;
