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

    // ===== LEADERSHIP STRUCTURE MODULE =====

    // Board of Trustees
    async getBoardOfTrustees(language = 'ru') {
        const langParam = this.getLanguageParam(language);
        const data = await this.request(`/leadership-structure/board-of-trustees/?lang=${langParam}`);
        return data.results || [];
    }

    async getBoardOfTrusteesStats(language = 'ru') {
        const langParam = this.getLanguageParam(language);
        const data = await this.request(`/leadership-structure/board-of-trustees-stats/?lang=${langParam}`);
        return data.results || [];
    }

    // Audit Commission
    async getAuditCommission(language = 'ru') {
        const langParam = this.getLanguageParam(language);
        const data = await this.request(`/leadership-structure/audit-commission/?lang=${langParam}`);
        return data.results || [];
    }

    async getAuditCommissionStatistics(language = 'ru') {
        const langParam = this.getLanguageParam(language);
        const data = await this.request(`/leadership-structure/audit-commission-statistics/?lang=${langParam}`);
        return data.results || [];
    }

    // Academic Council
    async getAcademicCouncil(language = 'ru') {
        const langParam = this.getLanguageParam(language);
        const data = await this.request(`/leadership-structure/academic-council/?lang=${langParam}`);
        return data.results || [];
    }

    // Trade Union
    async getTradeUnionBenefits(language = 'ru') {
        const langParam = this.getLanguageParam(language);
        const data = await this.request(`/leadership-structure/trade-union/benefits/?lang=${langParam}`);
        return data.results || [];
    }

    async getTradeUnionEvents(language = 'ru') {
        const langParam = this.getLanguageParam(language);
        const data = await this.request(`/leadership-structure/trade-union/events/?lang=${langParam}`);
        return data.results || [];
    }

    async getTradeUnionStats(language = 'ru') {
        const langParam = this.getLanguageParam(language);
        const data = await this.request(`/leadership-structure/trade-union/stats/?lang=${langParam}`);
        return data.results || [];
    }

    // Commissions
    async getCommissions(language = 'ru', category = null) {
        const langParam = this.getLanguageParam(language);
        const params = new URLSearchParams({ lang: langParam });
        if (category && category !== 'all') {
            params.append('category', category);
        }
        const data = await this.request(`/leadership-structure/commissions/?${params}`);
        return data.results || [];
    }

    // Administrative Structure
    async getAdministrativeDepartments(language = 'ru') {
        const langParam = this.getLanguageParam(language);
        const data = await this.request(`/leadership-structure/administrative/departments/?lang=${langParam}`);
        return data.results || [];
    }

    async getAdministrativeUnits(language = 'ru', searchTerm = '') {
        const langParam = this.getLanguageParam(language);
        const params = new URLSearchParams({ lang: langParam });
        if (searchTerm) {
            params.append('search', searchTerm);
        }
        const data = await this.request(`/leadership-structure/administrative/units/?${params}`);
        return data.results || [];
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
    // Leadership Structure exports
    getBoardOfTrustees,
    getBoardOfTrusteesStats,
    getAuditCommission,
    getAuditCommissionStatistics,
    getAcademicCouncil,
    getTradeUnionBenefits,
    getTradeUnionEvents,
    getTradeUnionStats,
    getCommissions,
    getAdministrativeDepartments,
    getAdministrativeUnits
} = apiService;