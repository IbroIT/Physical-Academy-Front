// Минимальный компонент для тестирования
import { useBachelorQuotas } from '../../../../hooks/useApi';

const BachelorQuotasMinimal = () => {
  const { quotasData, loading, error } = useBachelorQuotas();

  

  if (loading) {
    return <div style={{ color: 'white', padding: '20px', backgroundColor: '#1e40af' }}>Загрузка...</div>;
  }

  if (error) {
    return <div style={{ color: 'white', padding: '20px', backgroundColor: '#dc2626' }}>Ошибка: {error}</div>;
  }

  const quotas = quotasData?.quotas || [];

  return (
    <div style={{
      backgroundColor: '#1e40af',
      minHeight: '100vh',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Квоты бакалавриата</h1>

      <div style={{ marginBottom: '20px' }}>
        <strong>Статус API:</strong> {quotasData ? '✅ Подключен' : '❌ Не подключен'}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <strong>Количество квот:</strong> {quotas.length}
      </div>

      {quotas.map((quota, index) => (
        <div key={quota.id} style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '15px',
          margin: '10px 0',
          borderRadius: '8px'
        }}>
          <h3>{quota.icon} {quota.title}</h3>
          <p>{quota.description}</p>
          <p>Мест: {quota.spots} | Дедлайн: {quota.deadline}</p>
        </div>
      ))}
    </div>
  );
};

export default BachelorQuotasMinimal;