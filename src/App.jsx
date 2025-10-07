import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
// import Footer from './components/Footer';

// import Home from './components/pages/Home';

// Academy pages
import AcademyAbout from './components/pages/academy/AcademyAbout';
import AcademyLeadership from './components/pages/academy/AcademyLeadership';
import AcademyStructure from './components/pages/academy/AcademyStructure';
import AcademyHistory from './components/pages/academy/AcademyHistory';
import AcademyMission from './components/pages/academy/AcademyMission';
import AcademyAccreditation from './components/pages/academy/AcademyAccreditation';
import AcademyNumbers from './components/pages/academy/AcademyNumbers';
import AcademyDocuments from './components/pages/academy/AcademyDocuments';

// Admissions pages
import BachelorInfo from './components/pages/admissions/bachelor/BachelorInfo';
import BachelorRegistration from './components/pages/admissions/bachelor/BachelorRegistration';
import BachelorInternational from './components/pages/admissions/bachelor/BachelorInternational';
import BachelorQuotas from './components/pages/admissions/bachelor/BachelorQuotas';
import BachelorContacts from './components/pages/admissions/bachelor/BachelorContacts';
import MasterInfo from './components/pages/admissions/master/MasterInfo';
import CollegeInfo from './components/pages/admissions/college/CollegeInfo';

// Education pages
import PedagogicalSports from './components/pages/education/faculties/PedagogicalSports';
import CoachingFaculty from './components/pages/education/faculties/CoachingFaculty';
import MilitaryTraining from './components/pages/education/faculties/MilitaryTraining';
import CorrespondenceTraining from './components/pages/education/faculties/CorrespondenceTraining';
import GeneralDepartments from './components/pages/education/departments/GeneralDepartments';
import CollegeSports from './components/pages/education/college/CollegeSports';

// Science pages
import ScientificPublications from './components/pages/science/ScientificPublications';
import Vestnik from './components/pages/science/Vestnik';
import WebOfScience from './components/pages/science/WebOfScience';
import Scopus from './components/pages/science/Scopus';
import Ipchain from './components/pages/science/Ipchain';
import ScientificCouncil from './components/pages/science/ScientificCouncil';

// Students pages
import UsefulInfo from './components/pages/students/UsefulInfo';
import StudentsDisabilities from './components/pages/students/StudentsDisabilities';
import StudentCouncil from './components/pages/students/StudentCouncil';
import StudentClubs from './components/pages/students/StudentClubs';
import ExchangePrograms from './components/pages/students/ExchangePrograms';
import Instructions from './components/pages/students/Instructions';
import Scholarship from './components/pages/students/Scholarship';
import UsefulLinks from './components/pages/students/UsefulLinks';
import EbilimLogin from './components/pages/students/EbilimLogin';

// Contacts pages
import AddressMap from './components/pages/contacts/AddressMap';
import ContactInfo from './components/pages/contacts/ContactInfo';
import SocialNetworks from './components/pages/contacts/SocialNetworks';

import Home from './components/pages/home/Home';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Academy routes */}
            <Route path="/academy/about" element={<AcademyAbout />} />
            <Route path="/academy/leadership/rectorate" element={<AcademyLeadership />} />
            <Route path="/academy/structure/academic" element={<AcademyStructure />} />
            <Route path="/academy/history" element={<AcademyHistory />} />
            <Route path="/academy/mission" element={<AcademyMission />} />
            <Route path="/academy/accreditation" element={<AcademyAccreditation />} />
            <Route path="/academy/numbers" element={<AcademyNumbers />} />
            <Route path="/academy/documents" element={<AcademyDocuments />} />
            
            {/* Admissions routes */}
            <Route path="/admissions/bachelor/info" element={<BachelorInfo />} />
            <Route path="/admissions/bachelor/registration" element={<BachelorRegistration />} />
            <Route path="/admissions/bachelor/international" element={<BachelorInternational />} />
            <Route path="/admissions/bachelor/quotas" element={<BachelorQuotas />} />
            <Route path="/admissions/bachelor/contacts" element={<BachelorContacts />} />
            <Route path="/admissions/master/info" element={<MasterInfo />} />
            <Route path="/admissions/college/info" element={<CollegeInfo />} />
            
            {/* Education routes */}
            <Route path="/education/faculties/pedagogical" element={<PedagogicalSports />} />
            <Route path="/education/faculties/coaching" element={<CoachingFaculty />} />
            <Route path="/education/faculties/military-training" element={<MilitaryTraining />} />
            <Route path="/education/faculties/correspondence" element={<CorrespondenceTraining />} />
            <Route path="/education/departments" element={<GeneralDepartments />} />
            <Route path="/education/college/sports" element={<CollegeSports />} />
            
            {/* Science routes */}
            <Route path="/science/publications" element={<ScientificPublications />} />
            <Route path="/science/vestnik" element={<Vestnik />} />
            <Route path="/science/web-of-science" element={<WebOfScience />} />
            <Route path="/science/scopus" element={<Scopus />} />
            <Route path="/science/ipchain" element={<Ipchain />} />
            <Route path="/science/nts" element={<ScientificCouncil />} />
            
            {/* Students routes */}
            <Route path="/students/info" element={<UsefulInfo />} />
            <Route path="/students/disabilities" element={<StudentsDisabilities />} />
            <Route path="/students/council" element={<StudentCouncil />} />
            <Route path="/students/clubs" element={<StudentClubs />} />
            <Route path="/students/exchange" element={<ExchangePrograms />} />
            <Route path="/students/instructions" element={<Instructions />} />
            <Route path="/students/scholarship" element={<Scholarship />} />
            <Route path="/students/links" element={<UsefulLinks />} />
            <Route path="/students/ebilim" element={<EbilimLogin />} />
            
            {/* Contacts routes */}
            <Route path="/contacts/address" element={<AddressMap />} />
            <Route path="/contacts/contact-info" element={<ContactInfo />} />
            <Route path="/contacts/social" element={<SocialNetworks />} />
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;