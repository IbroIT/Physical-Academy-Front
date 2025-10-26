// utils/componentScanner.js
const context = require.context('../components', true, /\.(jsx|tsx|vue)$/);
const componentFiles = context.keys();

export const scanComponents = () => {
  const components = [];
  
  componentFiles.forEach(filePath => {
    const componentName = filePath.split('/').pop().replace(/\.(jsx|tsx|vue)$/, '');
    
    // Извлекаем метаданные из комментариев
    const fileContent = context(filePath);
    const metadata = extractMetadata(fileContent);
    
    components.push({
      id: componentName,
      name: componentName,
      path: filePath,
      type: 'component',
      metadata,
      // Автоматически добавляем в поиск
      searchable: true
    });
  });
  
  return components;
};

const extractMetadata = (content) => {
  // Ищем JSDoc комментарии
  const jsDocMatch = content.match(/\/\*\*\s*\n([^*]*\n)+\s*\*\//);
  const metadata = {};
  
  if (jsDocMatch) {
    const descriptionMatch = jsDocMatch[0].match(/@description\s+(.+)/);
    if (descriptionMatch) metadata.description = descriptionMatch[1];
    
    const tagsMatch = jsDocMatch[0].match(/@tags\s+(.+)/);
    if (tagsMatch) metadata.tags = tagsMatch[1].split(',').map(tag => tag.trim());
  }
  
  return metadata;
};