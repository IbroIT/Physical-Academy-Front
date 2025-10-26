// API service for Academy Management System
class ApiService {
  constructor() {
    this.baseURL = "https://physical-academy-backend-3dccb860f75a.herokuapp.com/api";
  }

  // Helper method to get language parameter
  getLanguageParam(language) {
    const langMap = {
      ru: "ru",
      kg: "kg", // Map kg to kg for backend (changed from ky)
      en: "en",
      ky: "kg", // Map ky to kg for backend compatibility
    };
    return langMap[language] || "ru";
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Publications API methods
  async getPublicationsPage(language = "ru", filters = {}) {
    const langParam = this.getLanguageParam(language);
    const queryParams = new URLSearchParams({
      lang: langParam,
      ...filters,
    });
    return this.request(`/science/publications-page/?${queryParams}`);
  }

  // Scopus API methods
  async getScopusPage(language = "ru") {
    const langParam = this.getLanguageParam(language);
    return this.request(`/science/scopus-page/?lang=${langParam}`);
  }

  // NTS Committee API methods
  async getNTSCommitteePage(language = "ru") {
    const langParam = this.getLanguageParam(language);
    return this.request(`/science/nts-committee-page/?lang=${langParam}`);
  }

  async getPublications(language = "ru", filters = {}) {
    const langParam = this.getLanguageParam(language);
    const queryParams = new URLSearchParams({
      lang: langParam,
      ...filters,
    });
    return this.request(`/science/publications/?${queryParams}`);
  }

  async getPublicationById(id, language = "ru") {
    const langParam = this.getLanguageParam(language);
    return this.request(`/science/publications/${id}/?lang=${langParam}`);
  }

  // Vestnik API methods
  async getVestnikPage(language = "ru", filters = {}) {
    const langParam = this.getLanguageParam(language);
    const queryParams = new URLSearchParams({
      lang: langParam,
      ...filters,
    });
    return this.request(`/science/vestnik-page/?${queryParams}`);
  }

  async getVestnikIssues(language = "ru", filters = {}) {
    const langParam = this.getLanguageParam(language);
    const queryParams = new URLSearchParams({
      lang: langParam,
      ...filters,
    });
    return this.request(`/science/vestnik-issues/?${queryParams}`);
  }

  async getVestnikIssueById(id, language = "ru") {
    const langParam = this.getLanguageParam(language);
    return this.request(`/science/vestnik-issues/${id}/?lang=${langParam}`);
  }

  async getVestnikArticles(language = "ru", filters = {}) {
    const langParam = this.getLanguageParam(language);
    const queryParams = new URLSearchParams({
      lang: langParam,
      ...filters,
    });
    return this.request(`/science/vestnik-articles/?${queryParams}`);
  }

  async getVestnikArticleById(id, language = "ru") {
    const langParam = this.getLanguageParam(language);
    return this.request(`/science/vestnik-articles/${id}/?lang=${langParam}`);
  }

  // Leadership API methods
  async getLeadership(language = "ru", filters = {}) {
    const langParam = this.getLanguageParam(language);
    const queryParams = new URLSearchParams({
      lang: langParam,
      ...filters,
    });

    const data = await this.request(
      `/leadership-structure/leadership/?${queryParams}`
    );
    return data.results || [];
  }

  async getDirectors(language = "ru") {
    const langParam = this.getLanguageParam(language);
    const data = await this.request(
      `/leadership-structure/leadership/?lang=${langParam}&leadership_type=director`
    );
    return data.results || [];
  }

  async getDepartmentHeads(language = "ru") {
    const langParam = this.getLanguageParam(language);
    const data = await this.request(
      `/leadership-structure/leadership/?lang=${langParam}&leadership_type=department_head`
    );
    return data.results || [];
  }

  async getLeadershipById(id, language = "ru") {
    const langParam = this.getLanguageParam(language);
    return await this.request(
      `/leadership-structure/leadership/${id}/?lang=${langParam}`
    );
  }

  // Accreditation API methods
  async getAccreditations(language = "ru", filters = {}) {
    const langParam = this.getLanguageParam(language);
    const queryParams = new URLSearchParams({
      lang: langParam,
      ...filters,
    });

    const data = await this.request(`/accreditations/?${queryParams}`);
    return data.results || [];
  }

  async getActiveAccreditations(language = "ru") {
    const langParam = this.getLanguageParam(language);
    const data = await this.request(
      `/accreditations/active/?lang=${langParam}`
    );
    return data.results || [];
  }

  // Organization Structure API methods
  async getOrganizationStructure(language = "ru", filters = {}) {
    const langParam = this.getLanguageParam(language);
    const queryParams = new URLSearchParams({
      lang: langParam,
      ...filters,
    });

    const data = await this.request(
      `/leadership-structure/organization-structure/?${queryParams}`
    );
    return data.results || [];
  }

  async getOrganizationHierarchy(language = "ru") {
    const langParam = this.getLanguageParam(language);
    const data = await this.request(
      `/leadership-structure/organization-structure/root/?lang=${langParam}`
    );
    return data || [];
  }

  // Documents API methods
  async getDocuments(language = "ru", filters = {}) {
    const langParam = this.getLanguageParam(language);
    const queryParams = new URLSearchParams({
      lang: langParam,
      ...filters,
    });

    const data = await this.request(
      `/leadership-structure/documents/?${queryParams}`
    );
    return data.results || [];
  }

  // Search methods
  async searchLeadership(query, language = "ru") {
    return await this.getLeadership(language, { search: query });
  }

  async searchDocuments(query, language = "ru") {
    return await this.getDocuments(language, { search: query });
  }

  async searchOrganizationStructure(query, language = "ru") {
    return await this.getOrganizationStructure(language, { search: query });
  }

  // ===== LEADERSHIP STRUCTURE MODULE =====

  // Board of Trustees
  async getBoardOfTrustees(language = "ru") {
    const langParam = this.getLanguageParam(language);
    const data = await this.request(
      `/leadership-structure/board-of-trustees/?lang=${langParam}`
    );
    return data.results || [];
  }

  async getBoardOfTrusteesStats(language = "ru") {
    const langParam = this.getLanguageParam(language);
    const data = await this.request(
      `/leadership-structure/board-of-trustees-stats/?lang=${langParam}`
    );
    return data.results || [];
  }

  // Audit Commission
  async getAuditCommission(language = "ru") {
    const langParam = this.getLanguageParam(language);
    const data = await this.request(
      `/leadership-structure/audit-commission/?lang=${langParam}`
    );
    return data.results || [];
  }

  async getAuditCommissionStatistics(language = "ru") {
    const langParam = this.getLanguageParam(language);
    const data = await this.request(
      `/leadership-structure/audit-commission-statistics/?lang=${langParam}`
    );
    return data.results || [];
  }

  // Academic Council
  async getAcademicCouncil(language = "ru") {
    const langParam = this.getLanguageParam(language);
    const data = await this.request(
      `/leadership-structure/academic-council/?lang=${langParam}`
    );
    return data.results || [];
  }

  // Trade Union
  async getTradeUnionBenefits(language = "ru") {
    const langParam = this.getLanguageParam(language);
    const data = await this.request(
      `/leadership-structure/trade-union/benefits/?lang=${langParam}`
    );
    return data.results || [];
  }

  async getTradeUnionEvents(language = "ru") {
    const langParam = this.getLanguageParam(language);
    const data = await this.request(
      `/leadership-structure/trade-union/events/?lang=${langParam}`
    );
    return data.results || [];
  }

  async getTradeUnionStats(language = "ru") {
    const langParam = this.getLanguageParam(language);
    const data = await this.request(
      `/leadership-structure/trade-union/stats/?lang=${langParam}`
    );
    return data.results || [];
  }

  // Commissions
  async getCommissions(language = "ru", category = null) {
    const langParam = this.getLanguageParam(language);
    const params = new URLSearchParams({ lang: langParam });
    if (category && category !== "all") {
      params.append("category", category);
    }
    const data = await this.request(
      `/leadership-structure/commissions/?${params}`
    );
    return data.results || [];
  }

  // Administrative Structure
  async getAdministrativeDepartments(language = "ru") {
    const langParam = this.getLanguageParam(language);
    const data = await this.request(
      `/leadership-structure/administrative/departments/?lang=${langParam}`
    );
    return data.results || [];
  }

  async getAdministrativeUnits(language = "ru", searchTerm = "") {
    const langParam = this.getLanguageParam(language);
    const params = new URLSearchParams({ lang: langParam });
    if (searchTerm) {
      params.append("search", searchTerm);
    }
    const data = await this.request(
      `/leadership-structure/administrative/units/?${params}`
    );
    return data.results || [];
  }

  // Admission API methods
  async getBachelorInfo(language = "ru") {
    const langParam = this.getLanguageParam(language);
    return await this.request(`/admission/api/bachelor/?lang=${langParam}`, {
      headers: {
        "Accept-Language": langParam,
      },
    });
  }

  async getMasterInfo(language = "ru") {
    const langParam = this.getLanguageParam(language);
    return await this.request(`/admission/api/master/?lang=${langParam}`, {
      headers: {
        "Accept-Language": langParam,
      },
    });
  }

  async getDoctorateInfo(language = "ru") {
    const langParam = this.getLanguageParam(language);
    return await this.request(`/admission/api/doctorate/?lang=${langParam}`, {
      headers: {
        "Accept-Language": langParam,
      },
    });
  }

  async getCollegeInfo(language = "ru") {
    const langParam = this.getLanguageParam(language);
    return await this.request(`/admission/api/college/?lang=${langParam}`, {
      headers: {
        "Accept-Language": langParam,
      },
    });
  }

  async getBachelorQuotas(language = "ru") {
    const langParam = this.getLanguageParam(language);
    return await this.request(`/admission/bachelor-quotas/?lang=${langParam}`, {
      headers: {
        "Accept-Language": langParam,
      },
    });
  }

  async getQuotasByLevel(level, language = "ru") {
    const langParam = this.getLanguageParam(language);
    return await this.request(
      `/admission/api/quotas/${level}/?lang=${langParam}`
    );
  }

  async getAdmissionLevels(language = "ru") {
    const langParam = this.getLanguageParam(language);
    const data = await this.request(`/admission/api/levels/?lang=${langParam}`);
    return data.results || [];
  }

  async getPrograms(language = "ru", filters = {}) {
    const langParam = this.getLanguageParam(language);
    const queryParams = new URLSearchParams({
      lang: langParam,
      ...filters,
    });
    const data = await this.request(`/admission/api/programs/?${queryParams}`);
    return data.results || [];
  }

  async getAdmissionStatistics(language = "ru", filters = {}) {
    const langParam = this.getLanguageParam(language);
    const queryParams = new URLSearchParams({
      lang: langParam,
      ...filters,
    });
    const data = await this.request(
      `/admission/api/statistics/?${queryParams}`
    );
    return data.results || [];
  }

  async getAdmissionFeatures(language = "ru", filters = {}) {
    const langParam = this.getLanguageParam(language);
    const queryParams = new URLSearchParams({
      lang: langParam,
      ...filters,
    });
    const data = await this.request(`/admission/api/features/?${queryParams}`);
    return data.results || [];
  }

  // Get quota types only
  async getQuotaTypes(language = "ru") {
    const langParam = this.getLanguageParam(language);
    return await this.request(`/admission/api/quota-types/?lang=${langParam}`);
  }

  // Get quota stats only
  async getQuotaStats(language = "ru") {
    const langParam = this.getLanguageParam(language);
    return await this.request(`/admission/api/quota-stats/?lang=${langParam}`);
  }

  // Get additional support only
  async getAdditionalSupport(language = "ru") {
    const langParam = this.getLanguageParam(language);
    return await this.request(
      `/admission/api/additional-support/?lang=${langParam}`
    );
  }

  // Get process steps only
  async getProcessSteps(language = "ru") {
    const langParam = this.getLanguageParam(language);
    return await this.request(
      `/admission/api/process-steps/?lang=${langParam}`
    );
  }

  // ===== STUDENT CLUBS MODULE =====

  // Get all student clubs page data in a single request
  async getStudentClubsPageData(language = "ru", filters = {}) {
    const langParam = this.getLanguageParam(language);
    const queryParams = new URLSearchParams({
      lang: langParam,
      ...filters,
    });
    return await this.request(`/student-clubs/clubs/page_data/?${queryParams}`);
  }

  // Get list of student clubs
  async getStudentClubs(language = "ru", filters = {}) {
    const langParam = this.getLanguageParam(language);
    const queryParams = new URLSearchParams({
      lang: langParam,
      ...filters,
    });
    const data = await this.request(`/student-clubs/clubs/?${queryParams}`);
    return data.results || [];
  }

  // Get specific student club by ID
  async getStudentClubById(id, language = "ru") {
    const langParam = this.getLanguageParam(language);
    return await this.request(`/student-clubs/clubs/${id}/?lang=${langParam}`);
  }

  // Get student clubs by category
  async getStudentClubsByCategory(categorySlug, language = "ru") {
    const langParam = this.getLanguageParam(language);
    const data = await this.request(
      `/student-clubs/clubs/?lang=${langParam}&category=${categorySlug}`
    );
    return data.results || [];
  }

  // Get student club categories
  async getStudentClubCategories(language = "ru") {
    const langParam = this.getLanguageParam(language);
    const data = await this.request(
      `/student-clubs/categories/?lang=${langParam}`
    );
    return data.results || [];
  }

  // Get student club statistics
  async getStudentClubStats(language = "ru") {
    const langParam = this.getLanguageParam(language);
    const data = await this.request(`/student-clubs/stats/?lang=${langParam}`);
    return data.results || [];
  }

  // Get student club leaders
  async getStudentClubLeaders(language = "ru", clubId = null) {
    const langParam = this.getLanguageParam(language);
    const params = new URLSearchParams({ lang: langParam });
    if (clubId) {
      params.append("club_id", clubId);
    }
    const data = await this.request(`/student-clubs/leaders/?${params}`);
    return data.results || [];
  }

  // Join a student club
  async joinStudentClub(clubId, userData) {
    return await this.request(`/student-clubs/clubs/${clubId}/join/`, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // ===== STUDENT DISABILITIES MODULE =====

  // Get all disabilities page data in a single request
  async getDisabilitiesPageData(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      const data = await this.request(
        `/student-clubs/disabilities-page/?lang=${langParam}`
      );

      // Normalize response shape to avoid runtime errors in components
      if (!data || typeof data !== "object") {
        return {
          title: "",
          subtitle: "",
          support_services: [],
          contacts: [],
          resources: [],
          emergency: null,
        };
      }

      return {
        title: data.title || "",
        subtitle: data.subtitle || "",
        support_services: Array.isArray(data.support_services)
          ? data.support_services
          : [],
        contacts: Array.isArray(data.contacts) ? data.contacts : [],
        resources: Array.isArray(data.resources) ? data.resources : [],
        emergency: data.emergency || null,
        // include any extra fields for forward compatibility
        ...data,
      };
    } catch (error) {
      console.error("Error fetching disabilities page data:", error);
      throw error;
    }
  }

  // Get disability support services
  async getDisabilityServices(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      const data = await this.request(
        `/student-clubs/disabilities/services/?lang=${langParam}`
      );
      return data.results || [];
    } catch (error) {
      console.error("Error fetching disability services:", error);
      throw error;
    }
  }

  // Get disability contact persons
  async getDisabilityContacts(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      const data = await this.request(
        `/student-clubs/disabilities/contacts/?lang=${langParam}`
      );
      return data.results || [];
    } catch (error) {
      console.error("Error fetching disability contacts:", error);
      throw error;
    }
  }

  // Get disability resources
  async getDisabilityResources(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      const data = await this.request(
        `/student-clubs/disabilities/resources/?lang=${langParam}`
      );
      return data.results || [];
    } catch (error) {
      console.error("Error fetching disability resources:", error);
      throw error;
    }
  }

  // Get disability emergency contact
  async getDisabilityEmergency(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      const data = await this.request(
        `/student-clubs/disabilities/emergency/?lang=${langParam}`
      );
      return data.results && data.results[0] ? data.results[0] : null;
    } catch (error) {
      console.error("Error fetching disability emergency contacts:", error);
      throw error;
    }
  }

  // ===== STUDENT COUNCIL MODULE =====

  // Get all council page data in a single request
  async getCouncilPageData(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      const data = await this.request(
        `/student-clubs/council-page/?lang=${langParam}`
      );

      // Normalize response shape to avoid runtime errors
      if (!data || typeof data !== "object") {
        return {
          title: "",
          subtitle: "",
          members: [],
          initiatives: [],
          events: [],
          stats: {},
        };
      }

      return {
        title: data.title || "",
        subtitle: data.subtitle || "",
        members: Array.isArray(data.members) ? data.members : [],
        initiatives: Array.isArray(data.initiatives) ? data.initiatives : [],
        events: Array.isArray(data.events) ? data.events : [],
        stats: data.stats || {},
        // include any extra fields for forward compatibility
        ...data,
      };
    } catch (error) {
      console.error("Error fetching council page data:", error);
      throw error;
    }
  }

  // Get council members
  async getCouncilMembers(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      const data = await this.request(
        `/student-clubs/council/members/?lang=${langParam}`
      );
      return data.results || [];
    } catch (error) {
      console.error("Error fetching council members:", error);
      throw error;
    }
  }

  // Get council initiatives
  async getCouncilInitiatives(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      const data = await this.request(
        `/student-clubs/council/initiatives/?lang=${langParam}`
      );
      return data.results || [];
    } catch (error) {
      console.error("Error fetching council initiatives:", error);
      throw error;
    }
  }

  // Get council events
  async getCouncilEvents(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      const data = await this.request(
        `/student-clubs/council/events/?lang=${langParam}`
      );
      return data.results || [];
    } catch (error) {
      console.error("Error fetching council events:", error);
      throw error;
    }
  }

  // Get council stats
  async getCouncilStats(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      const data = await this.request(
        `/student-clubs/council/stats/?lang=${langParam}`
      );
      return data || {};
    } catch (error) {
      console.error("Error fetching council stats:", error);
      throw error;
    }
  }

  // ===== SCHOLARSHIP MODULE =====

  // Get all scholarship page data in a single request
  async getScholarshipPageData(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      const data = await this.request(
        `/student-clubs/scholarship-page/?lang=${langParam}`
      );

      // Normalize response shape to avoid runtime errors
      if (!data || typeof data !== "object") {
        return {
          title: "",
          subtitle: "",
          programs: [],
          documents: [],
        };
      }

      return {
        title: data.title || "",
        subtitle: data.subtitle || "",
        programs: Array.isArray(data.programs) ? data.programs : [],
        documents: Array.isArray(data.documents) ? data.documents : [],
        // include any extra fields for forward compatibility
        ...data,
      };
    } catch (error) {
      console.error("Error fetching scholarship page data:", error);
      throw error;
    }
  }

  // Get scholarship programs
  async getScholarshipPrograms(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      const data = await this.request(
        `/student-clubs/scholarship/programs/?lang=${langParam}`
      );
      return data.results || [];
    } catch (error) {
      console.error("Error fetching scholarship programs:", error);
      throw error;
    }
  }

  // Get scholarship required documents
  async getScholarshipDocuments(scholarshipId = null, language = "ru") {
    const langParam = this.getLanguageParam(language);
    const params = new URLSearchParams({ lang: langParam });

    if (scholarshipId) {
      params.append("scholarship_id", scholarshipId);
    }

    try {
      const data = await this.request(
        `/student-clubs/scholarship/documents/?${params}`
      );
      return data.results || [];
    } catch (error) {
      console.error("Error fetching scholarship documents:", error);
      throw error;
    }
  }

  // ===== VISA SUPPORT MODULE =====

  // Get all visa support page data in a single request
  async getVisaSupportPageData(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      const data = await this.request(
        `/student-clubs/visa-page/?lang=${langParam}`
      );

      // Normalize response shape to avoid runtime errors
      if (!data || typeof data !== "object") {
        return {
          title: "",
          subtitle: "",
          services: [],
          contacts: [],
        };
      }

      return {
        title: data.title || "",
        subtitle: data.subtitle || "",
        services: Array.isArray(data.services) ? data.services : [],
        contacts: Array.isArray(data.contacts) ? data.contacts : [],
        // include any extra fields for forward compatibility
        ...data,
      };
    } catch (error) {
      console.error("Error fetching visa support page data:", error);
      throw error;
    }
  }

  // Get visa support services
  async getVisaSupportServices(featured = false, language = "ru") {
    const langParam = this.getLanguageParam(language);
    const endpoint = featured
      ? `/student-clubs/visa-support/services/featured/?lang=${langParam}`
      : `/student-clubs/visa-support/services/?lang=${langParam}`;

    try {
      const data = await this.request(endpoint);
      return data.results || [];
    } catch (error) {
      console.error("Error fetching visa support services:", error);
      throw error;
    }
  }

  // Get visa support contacts
  async getVisaSupportContacts(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      const data = await this.request(
        `/student-clubs/visa-support/contacts/?lang=${langParam}`
      );
      return data.results || [];
    } catch (error) {
      console.error("Error fetching visa support contacts:", error);
      throw error;
    }
  }

  // ===== STUDENT CONTACT INFO MODULE =====

  // Get all contact info data in a single request
  async getContactInfoPageData(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      return await this.request(
        `/student-clubs/contact-info/page_data/contact_info_page/?lang=${langParam}`
      );
    } catch (error) {
      console.error("Error fetching contact info page data:", error);
      throw error;
    }
  }

  // Get contact info
  async getContactInfo(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      const data = await this.request(
        `/student-clubs/contact-info/?lang=${langParam}`
      );
      return data.results || [];
    } catch (error) {
      console.error("Error fetching contact info:", error);
      throw error;
    }
  }

  // Get featured contact info only
  async getFeaturedContactInfo(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      const data = await this.request(
        `/student-clubs/contact-info/featured/?lang=${langParam}`
      );
      return data || [];
    } catch (error) {
      console.error("Error fetching featured contact info:", error);
      throw error;
    }
  }

  // ===== SOCIAL NETWORKS MODULE =====

  // Get all social page data in a single request
  async getSocialPageData(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      return await this.request(
        `/student-clubs/social/page_data/social_page/?lang=${langParam}`
      );
    } catch (error) {
      console.error("Error fetching social page data:", error);
      throw error;
    }
  }

  // Get social network accounts
  async getSocialAccounts(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      const data = await this.request(
        `/student-clubs/social/accounts/?lang=${langParam}`
      );
      return data.results || [];
    } catch (error) {
      console.error("Error fetching social accounts:", error);
      throw error;
    }
  }

  // Get official social accounts only
  async getOfficialSocialAccounts(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      const data = await this.request(
        `/student-clubs/social/accounts/official/?lang=${langParam}`
      );
      return data || [];
    } catch (error) {
      console.error("Error fetching official social accounts:", error);
      throw error;
    }
  }

  // Get social communities
  async getSocialCommunities(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      const data = await this.request(
        `/student-clubs/social/communities/?lang=${langParam}`
      );
      return data.results || [];
    } catch (error) {
      console.error("Error fetching social communities:", error);
      throw error;
    }
  }

  // Get featured social communities only
  async getFeaturedSocialCommunities(language = "ru") {
    const langParam = this.getLanguageParam(language);
    try {
      const data = await this.request(
        `/student-clubs/social/communities/featured/?lang=${langParam}`
      );
      return data || [];
    } catch (error) {
      console.error("Error fetching featured social communities:", error);
      throw error;
    }
  }

  // Search student clubs
  async searchStudentClubs(query, language = "ru", category = null) {
    const langParam = this.getLanguageParam(language);
    try {
      const params = new URLSearchParams({
        lang: langParam,
        search: query,
      });
      if (category) {
        params.append("category", category);
      }
      const data = await this.request(`/student-clubs/clubs/?${params}`);
      return data.results || [];
    } catch (error) {
      console.error("Error searching student clubs:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Named exports bound to the apiService instance so they keep the correct `this`
// when imported directly (e.g. `import { getDisabilitiesPageData } from 'api'`).
export const getLeadership = apiService.getLeadership.bind(apiService);
export const getDirectors = apiService.getDirectors.bind(apiService);
export const getDepartmentHeads =
  apiService.getDepartmentHeads.bind(apiService);
export const getLeadershipById = apiService.getLeadershipById.bind(apiService);
export const getAccreditations = apiService.getAccreditations.bind(apiService);
export const getActiveAccreditations =
  apiService.getActiveAccreditations.bind(apiService);
export const getOrganizationStructure =
  apiService.getOrganizationStructure.bind(apiService);
export const getOrganizationHierarchy =
  apiService.getOrganizationHierarchy.bind(apiService);
export const getDocuments = apiService.getDocuments.bind(apiService);
export const searchLeadership = apiService.searchLeadership.bind(apiService);
export const searchDocuments = apiService.searchDocuments.bind(apiService);
export const searchOrganizationStructure =
  apiService.searchOrganizationStructure.bind(apiService);
// Leadership Structure exports
export const getBoardOfTrustees =
  apiService.getBoardOfTrustees.bind(apiService);
export const getBoardOfTrusteesStats =
  apiService.getBoardOfTrusteesStats.bind(apiService);
export const getAuditCommission =
  apiService.getAuditCommission.bind(apiService);
export const getAuditCommissionStatistics =
  apiService.getAuditCommissionStatistics.bind(apiService);
export const getAcademicCouncil =
  apiService.getAcademicCouncil.bind(apiService);
export const getTradeUnionBenefits =
  apiService.getTradeUnionBenefits.bind(apiService);
export const getTradeUnionEvents =
  apiService.getTradeUnionEvents.bind(apiService);
export const getTradeUnionStats =
  apiService.getTradeUnionStats.bind(apiService);
export const getCommissions = apiService.getCommissions.bind(apiService);
export const getAdministrativeDepartments =
  apiService.getAdministrativeDepartments.bind(apiService);
export const getAdministrativeUnits =
  apiService.getAdministrativeUnits.bind(apiService);
// Admission API exports
export const getBachelorInfo = apiService.getBachelorInfo.bind(apiService);
export const getMasterInfo = apiService.getMasterInfo.bind(apiService);
export const getDoctorateInfo = apiService.getDoctorateInfo.bind(apiService);
export const getCollegeInfo = apiService.getCollegeInfo.bind(apiService);
export const getBachelorQuotas = apiService.getBachelorQuotas.bind(apiService);
export const getQuotasByLevel = apiService.getQuotasByLevel.bind(apiService);
export const getAdmissionLevels =
  apiService.getAdmissionLevels.bind(apiService);
export const getPrograms = apiService.getPrograms.bind(apiService);
export const getAdmissionStatistics =
  apiService.getAdmissionStatistics.bind(apiService);
export const getAdmissionFeatures =
  apiService.getAdmissionFeatures.bind(apiService);
export const getQuotaTypes = apiService.getQuotaTypes.bind(apiService);
export const getQuotaStats = apiService.getQuotaStats.bind(apiService);
export const getAdditionalSupport =
  apiService.getAdditionalSupport.bind(apiService);
export const getProcessSteps = apiService.getProcessSteps.bind(apiService);
// Student Clubs API exports
export const getStudentClubsPageData =
  apiService.getStudentClubsPageData.bind(apiService);
export const getStudentClubs = apiService.getStudentClubs.bind(apiService);
export const getStudentClubById =
  apiService.getStudentClubById.bind(apiService);
export const getStudentClubsByCategory =
  apiService.getStudentClubsByCategory.bind(apiService);
export const getStudentClubCategories =
  apiService.getStudentClubCategories.bind(apiService);
export const getStudentClubStats =
  apiService.getStudentClubStats.bind(apiService);
export const getStudentClubLeaders =
  apiService.getStudentClubLeaders.bind(apiService);
export const joinStudentClub = apiService.joinStudentClub.bind(apiService);
export const searchStudentClubs =
  apiService.searchStudentClubs.bind(apiService);
// Student Disabilities API exports
export const getDisabilitiesPageData =
  apiService.getDisabilitiesPageData.bind(apiService);
export const getDisabilityServices =
  apiService.getDisabilityServices.bind(apiService);
export const getDisabilityContacts =
  apiService.getDisabilityContacts.bind(apiService);
export const getDisabilityResources =
  apiService.getDisabilityResources.bind(apiService);
export const getDisabilityEmergency =
  apiService.getDisabilityEmergency.bind(apiService);
// Student Council API exports
export const getCouncilPageData =
  apiService.getCouncilPageData.bind(apiService);
export const getCouncilMembers = apiService.getCouncilMembers.bind(apiService);
export const getCouncilInitiatives =
  apiService.getCouncilInitiatives.bind(apiService);
export const getCouncilEvents = apiService.getCouncilEvents.bind(apiService);
export const getCouncilStats = apiService.getCouncilStats.bind(apiService);
// Scholarship API exports
export const getScholarshipPageData =
  apiService.getScholarshipPageData.bind(apiService);
export const getScholarshipPrograms =
  apiService.getScholarshipPrograms.bind(apiService);
export const getScholarshipDocuments =
  apiService.getScholarshipDocuments.bind(apiService);
// Visa Support API exports
export const getVisaSupportPageData =
  apiService.getVisaSupportPageData.bind(apiService);
export const getVisaSupportServices =
  apiService.getVisaSupportServices.bind(apiService);
export const getVisaSupportContacts =
  apiService.getVisaSupportContacts.bind(apiService);
// Contact Info API exports
export const getContactInfoPageData =
  apiService.getContactInfoPageData.bind(apiService);
export const getContactInfo = apiService.getContactInfo.bind(apiService);
export const getFeaturedContactInfo =
  apiService.getFeaturedContactInfo.bind(apiService);
// Social Networks API exports
export const getSocialPageData = apiService.getSocialPageData.bind(apiService);
export const getSocialAccounts = apiService.getSocialAccounts.bind(apiService);
export const getOfficialSocialAccounts =
  apiService.getOfficialSocialAccounts.bind(apiService);
export const getSocialCommunities =
  apiService.getSocialCommunities.bind(apiService);
export const getFeaturedSocialCommunities =
  apiService.getFeaturedSocialCommunities.bind(apiService);
