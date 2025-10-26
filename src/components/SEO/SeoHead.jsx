import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSeo } from '../../hooks/useSeo';

const SeoHead = ({ pageKey, additionalProps = {} }) => {
  const { getPageSeoData } = useSeo();
  const seoData = getPageSeoData(pageKey, additionalProps);

  return (
    <Helmet>
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:site_name" content="КГАФКиС" />
      
      {/* Canonical */}
      <link rel="canonical" href={seoData.canonical} />
      
      {/* Alternate languages */}
      {seoData.alternateUrls && Object.entries(seoData.alternateUrls).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
    </Helmet>
  );
};

export default SeoHead;