import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/pages/home/Contacts";

// Academy pages
import AcademyAbout from "./components/pages/academy/AcademyAbout";
import AcademyLeadership from "./components/pages/academy/AcademyLeadership";
import AcademyStructure from "./components/pages/academy/AcademyStructure";
import AcademyHistory from "./components/pages/academy/AcademyHistory";
import AcademyMission from "./components/pages/academy/AcademyMission";
import AcademyAccreditation from "./components/pages/academy/AcademyAccreditation";
import AcademyNumbers from "./components/pages/academy/AcademyNumbers";
import AcademyDocuments from "./components/pages/academy/AcademyDocuments";

// Admissions pages
import BachelorInfo from "./components/pages/admissions/bachelor/BachelorInfo";
import BachelorRegistration from "./components/pages/admissions/bachelor/BachelorRegistration";
import BachelorInternational from "./components/pages/admissions/bachelor/BachelorInternational";
import BachelorQuotasFull from "./components/pages/admissions/bachelor/BachelorQuotasFull";
import BachelorContacts from "./components/pages/admissions/bachelor/BachelorContacts";
import MasterInfo from "./components/pages/admissions/master/MasterInfo";
import CollegeInfo from "./components/pages/admissions/college/CollegeInfo";

// Education pages
import PedagogicalSports from "./components/pages/education/faculties/PedagogicalSports";
import CoachingFaculty from "./components/pages/education/faculties/CoachingFacultyNew";
import MilitaryTraining from "./components/pages/education/faculties/MilitaryTrainingNew";
import CorrespondenceTraining from "./components/pages/education/faculties/CorrespondenceTrainingNew";
import GeneralDepartments from "./components/pages/education/departments/GeneralDepartmentsNew";
import CollegeSports from "./components/pages/education/college/CollegeSports";

// Science pages
import ScientificPublications from "./components/pages/science/ScientificPublications";
import Vestnik from "./components/pages/science/Vestnik";
import WebOfScience from "./components/pages/science/WebOfScience";
import ScientificLibrary from "./components/pages/science/ScientificLibrary";
import TopicRegistry from "./components/pages/science/TopicRegistry";
import Regulations from "./components/pages/science/Regulations";
import YoungScientistsCouncil from "./components/pages/science/YoungScientistsCouncil";
import Reports from "./components/pages/science/Reports";

// Students pages
import UsefulInfo from "./components/pages/students/UsefulInfo";
import StudentsDisabilities from "./components/pages/students/StudentsDisabilities";
import StudentCouncil from "./components/pages/students/StudentCouncil";
import StudentClubs from "./components/pages/students/StudentClubs";
import ExchangePrograms from "./components/pages/students/ExchangePrograms";
import Instructions from "./components/pages/students/Instructions";
import Scholarship from "./components/pages/students/Scholarship";
import UsefulLinks from "./components/pages/students/UsefulLinks";
import EbilimLogin from "./components/pages/students/EbilimLogin";
import StudentContactInfo from "./components/pages/students/ContactInfo";
import StudentSocial from "./components/pages/students/Social";

// // Contacts pages
// import AddressMap from "./components/pages/contacts/AddressMap";
// import ContactInfo from "./components/pages/contacts/ContactInfo";
// import SocialNetworks from "./components/pages/contacts/SocialNetworks";
import MainContacts from "./components/pages/contacts/MainContacts";

import Home from "./components/pages/home/Home";

// Additional pages
import BoardOfTrustees from "./components/pages/academy/BoardOfTrustees";
import AuditCommission from "./components/pages/academy/AuditCommission";
import AcademicCouncil from "./components/pages/academy/AcademicCouncil";
import TradeUnion from "./components/pages/academy/TradeUnion";
import Commissions from "./components/pages/academy/Commissions";
import AdministrativeStructure from "./components/pages/academy/AdministrativeStructure";
import AdministrativeUnits from "./components/pages/academy/AdministrativeUnits";
import DoctorateInfo from "./components/pages/admissions/doctorate/DoctorateInfo";
import MasterProgram from "./components/pages/education/faculties/MasterProgram";
import DoctorateProgram from "./components/pages/education/faculties/DoctorateProgram";
import NTSCommittee from "./components/pages/science/NTSCommittee";
import VisaSupport from "./components/pages/students/VisaSupport";
import DetailPage from "./components/Details";
import AnnouncementDetailPage from "./components/AnnouncementDetail";
import PrivacyPolicy from './components/Privacy';
import TermsOfService from './components/Terms';

import { SearchProvider } from './search/SearchContext';
import { SearchBar } from './search/components/SearchBar';
import { SearchResults } from './search/components/SearchResults';
import { SeoProvider } from './providers/SeoProvider';
import { I18nextProvider } from 'react-i18next';
import i18n from "./i18n";
import SeoRouteWrapper from './components/SeoRouteWrapper';

import SportSections from "./components/pages/sport/SectionSport";
import SportInfrastructure from "./components/pages/sport/InfractructureSport";
import SportAchievements from "./components/pages/sport/AchievmentsSport";
import Graduates from "./components/pages/sport/Graduates";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <SeoProvider>
        <SearchProvider>
          <Router>
            <SeoRouteWrapper>
              <div className="App">
                <Navbar />
                <main className="main-content">
                  <Routes>



                    {/* Basic routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/news/:id" element={<DetailPage />} />
                    <Route path="/announcement/:id" element={<AnnouncementDetailPage />} />

                    {/* Academy routes */}
                    <Route path="/academy/about" element={<AcademyAbout />} />
                    <Route path="/academy/history" element={<AcademyHistory />} />
                    <Route path="/academy/mission" element={<AcademyMission />} />
                    <Route path="/academy/accreditation" element={<AcademyAccreditation />} />
                    <Route path="/academy/numbers" element={<AcademyNumbers />} />
                    <Route path="/academy/documents" element={<AcademyDocuments />} />
                    <Route path="/academy/leadership/rectorate" element={<AcademyLeadership />} />
                    <Route path="/academy/structure/academic" element={<AcademyStructure />} />
                    <Route path="/academy/leadership/board-of-trustees" element={<BoardOfTrustees />} />
                    <Route path="/academy/leadership/audit-commission" element={<AuditCommission />} />
                    <Route path="/academy/leadership/academic-council" element={<AcademicCouncil />} />
                    <Route path="/academy/leadership/trade-union" element={<TradeUnion />} />
                    <Route path="/academy/leadership/commissions" element={<Commissions />} />
                    <Route path="/academy/structure/administrative" element={<AdministrativeStructure />} />
                    <Route path="/academy/structure/units" element={<AdministrativeUnits />} />

                    {/* Admissions routes */}
                    <Route path="/admissions/bachelor/info" element={<BachelorInfo />} />
                    <Route path="/admissions/bachelor/registration" element={<BachelorRegistration />} />
                    <Route path="/admissions/bachelor/international" element={<BachelorInternational />} />
                    <Route path="/admissions/bachelor/quotas" element={<BachelorQuotasFull />} />
                    <Route path="/admissions/bachelor/contacts" element={<BachelorContacts />} />
                    <Route path="/admissions/master/info" element={<MasterInfo />} />
                    <Route path="/admissions/college/info" element={<CollegeInfo />} />
                    <Route path="/admissions/doctorate/info" element={<DoctorateInfo />} />

                    {/* Education routes */}
                    <Route path="/education/faculties/pedagogical" element={<PedagogicalSports />} />
                    <Route path="/education/faculties/coaching" element={<CoachingFaculty />} />
                    <Route path="/education/faculties/military-training" element={<MilitaryTraining />} />
                    <Route path="/education/faculties/correspondence" element={<CorrespondenceTraining />} />
                    <Route path="/education/departments" element={<GeneralDepartments />} />
                    <Route path="/education/college/sports" element={<CollegeSports />} />
                    <Route path="/education/faculties/master" element={<MasterProgram />} />
                    <Route path="/education/faculties/doctorate" element={<DoctorateProgram />} />

                    {/* Sport routes */}
                    <Route path="/sport/sections" element={<SportSections />} />
                    <Route path="/sport/infrastructure" element={<SportInfrastructure />} />
                    <Route path="/sport/achievements" element={<SportAchievements />} />
                    <Route path="sport/graduates" element={< Graduates />} />

                    {/* Science routes */}
                    <Route path="/science/publications" element={<ScientificPublications />} />
                    <Route path="/science/vestnik" element={<Vestnik />} />
                    <Route path="/science/library" element={<ScientificLibrary />} />
                    <Route path="/science/web-of-science" element={<WebOfScience />} />
                    <Route path="/science/topic-registry" element={<TopicRegistry />} />
                    <Route path="/science/regulations" element={<Regulations />} />
                    <Route path="/science/nts-committee" element={<NTSCommittee />} />
                    <Route path="/science/young-scientists-council" element={<YoungScientistsCouncil />} />
                    <Route path="/science/reports" element={<Reports />} />


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
                    <Route path="/students/visa-support" element={<VisaSupport />} />
                    <Route path="/students/contact-info" element={<StudentContactInfo />} />
                    <Route path="/students/social" element={<StudentSocial />} />

                    {/* Contacts routes */}
                    {/* <Route path="/contacts/address" element={<AddressMap />} />
                    <Route path="/contacts/contact-info" element={<ContactInfo />} />
                    <Route path="/contacts/social" element={<SocialNetworks />} /> */}
                    <Route path="/contacts" element={<MainContacts />} />
                    {/* Fallback route */}
                    <Route path="*" element={<Home />} />

                  </Routes>
                </main>
                <Footer />
              </div>
            </SeoRouteWrapper>
          </Router>
        </SearchProvider>
      </SeoProvider>
    </I18nextProvider>
  );
}

export default App;