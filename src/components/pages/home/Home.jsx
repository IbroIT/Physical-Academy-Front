import React from 'react';
import Banner from './Banner';
import Facts from './Facts';
import News from './News';
import AdsPage from './AdsPage';
import QuotesBanner from './QuotesBanner';
// import Contacts from './Contacts';
// import UniversityAnnouncementsPage from './AdsPage';
import AboutAcademy from './AboutAcademy';
import UniversityEventsPage from './UniversityEventsPage';

import SeoHead from '../../SEO/SeoHead';
import BreadcrumbSchema from '../../SEO/BreadcrumbSchema';
import { OrganizationSchema } from '../../SEO/StructuredData';

import { useSeoManager } from '../../../hooks/useSeoManager';

const Home = () => {
  useSeoManager('home');

  return (
    <div className='bg-gradient-to-br from-blue-200 via-white to-green-200'>
      <SeoHead pageKey="home" />
      <OrganizationSchema />
      <BreadcrumbSchema />
        <Banner />  
        <News />
        <AdsPage />
        <QuotesBanner />
        <AboutAcademy />
        <UniversityEventsPage />
        <Facts />
    </div>
  )
}

export default Home