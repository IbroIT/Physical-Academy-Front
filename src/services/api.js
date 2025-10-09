// API service for Academy Management System
class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:8000/api';
    }

    // Helper method to get language parameter
    getLanguageParam(language) {
        const langMap = {
            'ru': 'ru',
            'kg': 'kg', // API uses 'kg' for Kyrgyz
            'en': 'en',
            'ky': 'kg' // Map ky to kg for i18n compatibility
        };
        return langMap[language] || 'ru';
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
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

    // Leadership API methods
    async getLeadership(language = 'ru', filters = {}) {
        const langParam = this.getLanguageParam(language);
        const queryParams = new URLSearchParams({
            lang: langParam,
            ...filters
        });

        const data = await this.request(`/leadership-structure/leadership/?${queryParams}`);
        return data.results || [];
    }

    async getDirectors(language = 'ru') {
        const langParam = this.getLanguageParam(language);
        const data = await this.request(`/leadership-structure/leadership/?lang=${langParam}&leadership_type=director`);
        return data.results || [];
    }

    async getDepartmentHeads(language = 'ru') {
        const langParam = this.getLanguageParam(language);
        const data = await this.request(`/leadership-structure/leadership/?lang=${langParam}&leadership_type=department_head`);
        return data.results || [];
    }

    async getLeadershipById(id, language = 'ru') {
        const langParam = this.getLanguageParam(language);
        return await this.request(`/leadership-structure/leadership/${id}/?lang=${langParam}`);
    }

    // Accreditation API methods
    async getAccreditations(language = 'ru', filters = {}) {
        const langParam = this.getLanguageParam(language);
        const queryParams = new URLSearchParams({
            lang: langParam,
            ...filters
        });

        const data = await this.request(`/accreditations/?${queryParams}`);
        return data.results || [];
    }

    async getActiveAccreditations(language = 'ru') {
        const langParam = this.getLanguageParam(language);
        const data = await this.request(`/accreditations/active/?lang=${langParam}`);
        return data.results || [];
    }

    // Organization Structure API methods
    async getOrganizationStructure(language = 'ru', filters = {}) {
        const langParam = this.getLanguageParam(language);
        const queryParams = new URLSearchParams({
            lang: langParam,
            ...filters
        });

        const data = await this.request(`/leadership-structure/organization-structure/?${queryParams}`);
        return data.results || [];
    }

    async getOrganizationHierarchy(language = 'ru') {
        const langParam = this.getLanguageParam(language);
        const data = await this.request(`/leadership-structure/organization-structure/root/?lang=${langParam}`);
        return data || [];
    }

    // Documents API methods
    async getDocuments(language = 'ru', filters = {}) {
        const langParam = this.getLanguageParam(language);
        const queryParams = new URLSearchParams({
            lang: langParam,
            ...filters
        });

        const data = await this.request(`/leadership-structure/documents/?${queryParams}`);
        return data.results || [];
    }

    // Search methods
    async searchLeadership(query, language = 'ru') {
        return await this.getLeadership(language, { search: query });
    }

    async searchDocuments(query, language = 'ru') {
        return await this.getDocuments(language, { search: query });
    }

    async searchOrganizationStructure(query, language = 'ru') {
        return await this.getOrganizationStructure(language, { search: query });
    }

    // Student Clubs API methods
    async getStudentClubsPageData(language = 'ru', filters = {}) {
        const langParam = this.getLanguageParam(language);
        const queryParams = new URLSearchParams({
            lang: langParam,
            ...filters
        });

        return await this.request(`/student-clubs/clubs/page_data/?${queryParams}`);
    }

    async getStudentClubs(language = 'ru', filters = {}) {
        const langParam = this.getLanguageParam(language);
        const queryParams = new URLSearchParams({
            lang: langParam,
            ...filters
        });

        const data = await this.request(`/student-clubs/clubs/?${queryParams}`);
        return data.results || data;
    }

    async getStudentClubById(id, language = 'ru') {
        const langParam = this.getLanguageParam(language);
        return await this.request(`/student-clubs/clubs/${id}/?lang=${langParam}`);
    }

    async getStudentClubsByCategory(categorySlug, language = 'ru') {
        const langParam = this.getLanguageParam(language);
        const data = await this.request(
            `/student-clubs/clubs/by_category/?category=${categorySlug}&lang=${langParam}`
        );
        return data.results || data;
    }

    async getStudentClubCategories(language = 'ru') {
        const langParam = this.getLanguageParam(language);
        const data = await this.request(`/student-clubs/categories/?lang=${langParam}`);
        return data.results || data;
    }

    async getStudentClubStats(language = 'ru') {
        const langParam = this.getLanguageParam(language);
        const data = await this.request(`/student-clubs/stats/?lang=${langParam}`);
        return data.results || data;
    }

    async getStudentClubLeaders(language = 'ru', clubId = null) {
        const langParam = this.getLanguageParam(language);
        const queryParams = new URLSearchParams({ lang: langParam });
        if (clubId) {
            queryParams.append('club', clubId);
        }

        const data = await this.request(`/student-clubs/leaders/?${queryParams}`);
        return data.results || data;
    }

    async joinStudentClub(clubId, userData) {
        return await this.request(`/student-clubs/clubs/${clubId}/join/`, {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async searchStudentClubs(query, language = 'ru', category = null) {
        const filters = { search: query };
        if (category && category !== 'all') {
            filters.category = category;
        }
        return await this.getStudentClubs(language, filters);
    }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Named exports for specific methods if needed
export const {
    getLeadership,
    getDirectors,
    getDepartmentHeads,
    getLeadershipById,
    getAccreditations,
    getActiveAccreditations,
    getOrganizationStructure,
    getOrganizationHierarchy,
    getDocuments,
    searchLeadership,
    searchDocuments,
    searchOrganizationStructure,
    getStudentClubsPageData,
    getStudentClubs,
    getStudentClubById,
    getStudentClubsByCategory,
    getStudentClubCategories,
    getStudentClubStats,
    getStudentClubLeaders,
    joinStudentClub,
    searchStudentClubs
} = apiService;