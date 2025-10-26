import React from 'react';
import { useSeoManager } from '../hooks/useSeoManager';

const TestSeo = () => {
  useSeoManager('home');
  
  const checkSeoTags = () => {
    console.log('=== SEO CHECK ===');
    console.log('Title:', document.title);
    console.log('Description:', document.querySelector('meta[name="description"]')?.content);
    console.log('OG Title:', document.querySelector('meta[property="og:title"]')?.content);
    console.log('OG Description:', document.querySelector('meta[property="og:description"]')?.content);
    console.log('All meta tags:', document.querySelectorAll('meta'));
  };

  return (
    <div>
      <h1>Тест SEO</h1>
      <button onClick={checkSeoTags}>Проверить SEO теги</button>
    </div>
  );
};

export default TestSeo;