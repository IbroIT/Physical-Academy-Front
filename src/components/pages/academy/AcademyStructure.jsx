// AcademicStructure.jsx
import { useTranslation } from 'react-i18next';

const AcademyStructure = () => {
  const { t } = useTranslation();

  const blocks = t('academicStructure.blocks', { returnObjects: true });
  const administrative = t('academicStructure.administrative', { returnObjects: true });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t('academicStructure.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('academicStructure.subtitle')}
          </p>
        </div>

        {/* Основные блоки */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {blocks.map((block, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 rounded-t-2xl">
                <h3 className="text-2xl font-bold text-white">
                  {block.title}
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {block.departments.map((dept, deptIndex) => (
                    <div
                      key={deptIndex}
                      className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                    >
                      <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {dept.name}
                        </h4>
                        {dept.description && (
                          <p className="text-gray-600 text-sm">
                            {dept.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Административные подразделения */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6">
            <h2 className="text-3xl font-bold text-white text-center">
              {t('academicStructure.administrativeTitle')}
            </h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {administrative.map((unit, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-xl p-6 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                      <span className="text-green-600 font-bold text-lg">
                        {unit.abbreviation}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {unit.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {unit.description}
                  </p>
                  {unit.responsibilities && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-700 text-sm">
                        Основные функции:
                      </h4>
                      <ul className="space-y-1">
                        {unit.responsibilities.map((resp, respIndex) => (
                          <li
                            key={respIndex}
                            className="flex items-start space-x-2 text-sm text-gray-600"
                          >
                            <span className="text-green-500 mt-1">•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademyStructure;