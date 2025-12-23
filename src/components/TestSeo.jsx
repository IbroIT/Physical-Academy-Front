import React from 'react';
import { useSeoManager } from '../hooks/useSeoManager';

const TestSeo = () => {
  useSeoManager('home');
  
  const checkSeoTags = () => {
    
  };

  return (
    <div>
      <h1>Тест SEO</h1>
      <button onClick={checkSeoTags}>Проверить SEO теги</button>
    </div>
  );
};

export default TestSeo;