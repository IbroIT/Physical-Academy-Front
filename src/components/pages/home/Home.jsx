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
const Home = () => {
  return (
    <div className='bg-gradient-to-br from-blue-200 via-white to-green-200'>
        <Banner />  
        <News />
        <AdsPage />
        <QuotesBanner />
        <AboutAcademy />
        <UniversityEventsPage />
        <Facts />
        {/* <Contacts /> */}
    </div>
  )
}

export default Home