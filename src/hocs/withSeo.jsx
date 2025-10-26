import React from 'react';
import { useSeoManager } from '../hooks/useSeoManager';

const withSeo = (WrappedComponent, pageKey) => {
  const ComponentWithSeo = (props) => {
    useSeoManager(pageKey);
    return <WrappedComponent {...props} />;
  };
  
  ComponentWithSeo.displayName = `WithSeo(${WrappedComponent.displayName || WrappedComponent.name})`;
  return ComponentWithSeo;
};

export default withSeo;