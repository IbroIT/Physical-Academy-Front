import React from 'react';
import { useSeoManager } from '../hooks/useSeoManager';

const SeoRoute = ({ component: Component, pageKey, ...props }) => {
  useSeoManager(pageKey);
  return <Component {...props} />;
};

export default SeoRoute;