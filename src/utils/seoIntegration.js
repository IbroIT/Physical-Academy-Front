import withSeo from '../hocs/withSeo';

import Navbar from "../components/Navbar";
import Footer from "../components/pages/home/Contacts";

// Academy pages
import AcademyAbout from "../components/pages/academy/AcademyAbout";
import AcademyLeadership from "../components/pages/academy/AcademyLeadership";
import AcademyStructure from "../components/pages/academy/AcademyStructure";
import AcademyHistory from "../components/pages/academy/AcademyHistory";
import AcademyMission from "../components/pages/academy/AcademyMission";
import AcademyAccreditation from "../components/pages/academy/AcademyAccreditation";
import AcademyNumbers from "../components/pages/academy/AcademyNumbers";
import AcademyDocuments from "../components/pages/academy/AcademyDocuments";
import BoardOfTrustees from "../components/pages/academy/BoardOfTrustees";
import AuditCommission from "../components/pages/academy/AuditCommission";
import AcademicCouncil from "../components/pages/academy/AcademicCouncil";
import TradeUnion from "../components/pages/academy/TradeUnion";
import Commissions from "../components/pages/academy/Commissions";
import AdministrativeStructure from "../components/pages/academy/AdministrativeStructure";
import AdministrativeUnits from "../components/pages/academy/AdministrativeUnits";

// Admissions pages
import BachelorInfo from "../components/pages/admissions/bachelor/BachelorInfo";
import BachelorRegistration from "../components/pages/admissions/bachelor/BachelorRegistration";
import BachelorInternational from "../components/pages/admissions/bachelor/BachelorInternational";
import BachelorQuotasFull from "../components/pages/admissions/bachelor/BachelorQuotasFull";
import BachelorContacts from "../components/pages/admissions/bachelor/BachelorContacts";
import MasterInfo from "../components/pages/admissions/master/MasterInfo";
import CollegeInfo from "../components/pages/admissions/college/CollegeInfo";
import DoctorateInfo from "../components/pages/admissions/doctorate/DoctorateInfo";

// Education pages
import PedagogicalSports from "../components/pages/education/faculties/PedagogicalSports";
import CoachingFaculty from "../components/pages/education/faculties/CoachingFaculty";
import MilitaryTraining from "../components/pages/education/faculties/MilitaryTraining";
import CorrespondenceTraining from "../components/pages/education/faculties/CorrespondenceTraining";
import MasterProgram from "../components/pages/education/faculties/MasterProgram";
import DoctorateProgram from "../components/pages/education/faculties/DoctorateProgram";
import GeneralDepartments from "../components/pages/education/departments/GeneralDepartments";
import CollegeSports from "../components/pages/education/college/CollegeSports";

// Science pages
import ScientificPublications from "../components/pages/science/ScientificPublications";
import Vestnik from "../components/pages/science/Vestnik";
import WebOfScience from "../components/pages/science/WebOfScience";
import Scopus from "../components/pages/science/Scopus";
import Ipchain from "../components/pages/science/Ipchain";
import ScientificCouncil from "../components/pages/science/ScientificCouncil";
import NTSCommittee from "../components/pages/science/NTSCommittee";
import StudentScientificSociety from "../components/pages/science/StudentScientificSociety";

// Students pages
import UsefulInfo from "../components/pages/students/UsefulInfo";
import StudentsDisabilities from "../components/pages/students/StudentsDisabilities";
import StudentCouncil from "../components/pages/students/StudentCouncil";
import StudentClubs from "../components/pages/students/StudentClubs";
import ExchangePrograms from "../components/pages/students/ExchangePrograms";
import Instructions from "../components/pages/students/Instructions";
import Scholarship from "../components/pages/students/Scholarship";
import UsefulLinks from "../components/pages/students/UsefulLinks";
import EbilimLogin from "../components/pages/students/EbilimLogin";
import StudentContactInfo from "../components/pages/students/ContactInfo";
import StudentSocial from "../components/pages/students/Social";
import VisaSupport from "../components/pages/students/VisaSupport";

// Contacts pages
import AddressMap from "../components/pages/contacts/AddressMap";
import ContactInfo from "../components/pages/contacts/ContactInfo";
import SocialNetworks from "../components/pages/contacts/SocialNetworks";

// Home page
import Home from "../components/pages/home/Home";

// Additional components
import DetailPage from "../components/Details";
import AnnouncementDetailPage from "../components/AnnouncementDetail";
import PrivacyPolicy from "../components/Privacy";
import TermsOfService from "../components/Terms";

// Layout components
export const HomeWithSeo = withSeo(Home, 'home');
export const FooterWithSeo = withSeo(Footer, 'footer');
export const NavbarWithSeo = withSeo(Navbar, 'navbar');

// Academy
export const AcademyAboutWithSeo = withSeo(AcademyAbout, 'academy-about');
export const AcademyLeadershipWithSeo = withSeo(AcademyLeadership, 'academy-leadership');
export const AcademyStructureWithSeo = withSeo(AcademyStructure, 'academy-structure');
export const AcademyHistoryWithSeo = withSeo(AcademyHistory, 'academy-history');
export const AcademyMissionWithSeo = withSeo(AcademyMission, 'academy-mission');
export const AcademyAccreditationWithSeo = withSeo(AcademyAccreditation, 'academy-accreditation');
export const AcademyNumbersWithSeo = withSeo(AcademyNumbers, 'academy-numbers');
export const AcademyDocumentsWithSeo = withSeo(AcademyDocuments, 'academy-documents');
export const BoardOfTrusteesWithSeo = withSeo(BoardOfTrustees, 'board-of-trustees');
export const AuditCommissionWithSeo = withSeo(AuditCommission, 'audit-commission');
export const AcademicCouncilWithSeo = withSeo(AcademicCouncil, 'academic-council');
export const TradeUnionWithSeo = withSeo(TradeUnion, 'trade-union');
export const CommissionsWithSeo = withSeo(Commissions, 'commissions');
export const AdministrativeStructureWithSeo = withSeo(AdministrativeStructure, 'administrative-structure');
export const AdministrativeUnitsWithSeo = withSeo(AdministrativeUnits, 'administrative-units');

// Admissions
export const BachelorInfoWithSeo = withSeo(BachelorInfo, 'bachelor-info');
export const BachelorRegistrationWithSeo = withSeo(BachelorRegistration, 'bachelor-registration');
export const BachelorInternationalWithSeo = withSeo(BachelorInternational, 'bachelor-international');
export const BachelorQuotasFullWithSeo = withSeo(BachelorQuotasFull, 'bachelor-quotas');
export const BachelorContactsWithSeo = withSeo(BachelorContacts, 'bachelor-contacts');
export const MasterInfoWithSeo = withSeo(MasterInfo, 'master-info');
export const DoctorateInfoWithSeo = withSeo(DoctorateInfo, 'doctorate-info');
export const CollegeInfoWithSeo = withSeo(CollegeInfo, 'college-info');

// Education
export const PedagogicalSportsWithSeo = withSeo(PedagogicalSports, 'pedagogical-sports');
export const CoachingFacultyWithSeo = withSeo(CoachingFaculty, 'coaching-faculty');
export const MilitaryTrainingWithSeo = withSeo(MilitaryTraining, 'military-training');
export const CorrespondenceTrainingWithSeo = withSeo(CorrespondenceTraining, 'correspondence-training');
export const GeneralDepartmentsWithSeo = withSeo(GeneralDepartments, 'general-departments');
export const CollegeSportsWithSeo = withSeo(CollegeSports, 'college-sports');
export const MasterProgramWithSeo = withSeo(MasterProgram, 'master-program');
export const DoctorateProgramWithSeo = withSeo(DoctorateProgram, 'doctorate-program');

// Science
export const ScientificPublicationsWithSeo = withSeo(ScientificPublications, 'scientific-publications');
export const VestnikWithSeo = withSeo(Vestnik, 'vestnik');
export const WebOfScienceWithSeo = withSeo(WebOfScience, 'web-of-science');
export const ScopusWithSeo = withSeo(Scopus, 'scopus');
export const IpchainWithSeo = withSeo(Ipchain, 'ipchain');
export const ScientificCouncilWithSeo = withSeo(ScientificCouncil, 'scientific-council');
export const NTSCommitteeWithSeo = withSeo(NTSCommittee, 'nts-committee');
export const StudentScientificSocietyWithSeo = withSeo(StudentScientificSociety, 'student-scientific-society');

// Students
export const UsefulInfoWithSeo = withSeo(UsefulInfo, 'useful-info');
export const StudentsDisabilitiesWithSeo = withSeo(StudentsDisabilities, 'students-disabilities');
export const StudentCouncilWithSeo = withSeo(StudentCouncil, 'student-council');
export const StudentClubsWithSeo = withSeo(StudentClubs, 'student-clubs');
export const ExchangeProgramsWithSeo = withSeo(ExchangePrograms, 'exchange-programs');
export const InstructionsWithSeo = withSeo(Instructions, 'instructions');
export const ScholarshipWithSeo = withSeo(Scholarship, 'scholarship');
export const UsefulLinksWithSeo = withSeo(UsefulLinks, 'useful-links');
export const EbilimLoginWithSeo = withSeo(EbilimLogin, 'ebilim-login');
export const StudentContactInfoWithSeo = withSeo(StudentContactInfo, 'student-contact-info');
export const StudentSocialWithSeo = withSeo(StudentSocial, 'student-social');
export const VisaSupportWithSeo = withSeo(VisaSupport, 'visa-support');

// Contacts
export const AddressMapWithSeo = withSeo(AddressMap, 'address-map');
export const ContactInfoWithSeo = withSeo(ContactInfo, 'contact-info');
export const SocialNetworksWithSeo = withSeo(SocialNetworks, 'social-networks');

// Additional
export const DetailPageWithSeo = withSeo(DetailPage, 'detail-page');
export const AnnouncementDetailPageWithSeo = withSeo(AnnouncementDetailPage, 'announcement-detail');
export const PrivacyPolicyWithSeo = withSeo(PrivacyPolicy, 'privacy-policy');
export const TermsOfServiceWithSeo = withSeo(TermsOfService, 'terms-of-service');