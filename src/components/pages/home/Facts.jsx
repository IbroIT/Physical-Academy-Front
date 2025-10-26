import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const CounterItem = ({ end, icon, label, duration = 2000, delay = 0, color = 'blue' }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  // Цветовые схемы
  const colorSchemes = {
    blue: {
      text: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      gradient: 'from-blue-500 to-green-500',
      ping: 'bg-blue-400',
      dot: 'bg-blue-500'
    },
    green: {
      text: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-100',
      gradient: 'from-green-500 to-blue-500',
      ping: 'bg-green-400',
      dot: 'bg-green-500'
    },
    red: {
      text: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-100',
      gradient: 'from-red-500 to-orange-500',
      ping: 'bg-red-400',
      dot: 'bg-red-500'
    },
    purple: {
      text: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      gradient: 'from-purple-500 to-pink-500',
      ping: 'bg-purple-400',
      dot: 'bg-purple-500'
    },
    orange: {
      text: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      gradient: 'from-orange-500 to-red-500',
      ping: 'bg-orange-400',
      dot: 'bg-orange-500'
    },
    cyan: {
      text: 'text-cyan-600',
      bg: 'bg-cyan-50',
      border: 'border-cyan-100',
      gradient: 'from-cyan-500 to-blue-500',
      ping: 'bg-cyan-400',
      dot: 'bg-cyan-500'
    }
  };

  const colors = colorSchemes[color] || colorSchemes.blue;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setTimeout(() => {
            setHasAnimated(true);
            
            let startTime = null;
            const step = (timestamp) => {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              
              // Эффект замедления в конце
              const easeOutQuart = 1 - Math.pow(1 - progress, 4);
              setCount(Math.floor(easeOutQuart * end));
              
              if (progress < 1) {
                window.requestAnimationFrame(step);
              }
            };
            
            window.requestAnimationFrame(step);
          }, delay);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [end, duration, hasAnimated, delay]);

  return (
    <div 
      ref={ref} 
      className={`text-center p-8 rounded-2xl shadow-xl transform transition-all duration-700 ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100 hover:shadow-2xl hover:-translate-y-2' 
          : 'opacity-0 translate-y-10 scale-95'
      }`}
    >
      <div className="relative inline-block mb-4">
        <div className="text-5xl mb-2">{icon}</div>
        {hasAnimated && (
          <div className="absolute -top-2 -right-4">
            <div className="relative">
              <div className={`animate-ping absolute inline-flex h-5 w-5 rounded-full ${colors.ping} opacity-75`}></div>
              <div className={`relative inline-flex rounded-full h-5 w-5 ${colors.dot}`}></div>
            </div>
          </div>
        )}
      </div>
      <div className={`text-5xl font-bold ${colors.text} mb-2 transition-all duration-300`}>
        {count.toLocaleString()}+
      </div>
      <div className={`text-lg text-gray-700 font-medium ${colors.bg} py-2 px-4 rounded-full inline-block border ${colors.border}`}>
        {label}
      </div>
      {hasAnimated && (
        <div className={`mt-4 h-1 w-20 bg-gradient-to-r ${colors.gradient} rounded-full mx-auto`}></div>
      )}
    </div>
  );
};

const AnimatedFactsSection = () => {
  const { t, i18n } = useTranslation();
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка фактов с бэкенда
  useEffect(() => {
    const fetchFacts = async () => {
      try {
        const currentLanguage = i18n.language;
        const response = await axios.get(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/facts/?lang=${currentLanguage}`);
        if (response.data.success) {
          setFacts(response.data.facts);
        }
      } catch (err) {
        setError('Ошибка загрузки фактов');
        console.error('Error fetching facts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacts();
  }, [i18n.language]);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center text-blue-600 text-xl">...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600 text-xl">{error}</div>
        </div>
      </section>
    );
  }

  if (facts.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-xl">Нет доступных фактов</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-700 mb-6 relative inline-block">
            {t("facts.title")}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {t("facts.subtitle")}
          </p>
        </div>
        
        {/* counters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {facts.map((fact, index) => (
            <CounterItem
              key={fact.id}
              end={fact.end_value}
              icon={fact.icon}
              label={fact.label}
              duration={fact.duration}
              delay={fact.delay}
              color={fact.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedFactsSection;