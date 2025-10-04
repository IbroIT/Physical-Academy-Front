// API service for Academy Management System
class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:8000/api/v1';
    }

    // Helper method to get language parameter
    getLanguageParam(language) {
        const langMap = {
            'ru': 'ru',
            'kg': 'ky', // API uses 'ky' for Kyrgyz
            'en': 'en'
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

        const data = await this.request(`/leadership/?${queryParams}`);
        return data.results || [];
    }

    async getDirectors(language = 'ru') {
        const langParam = this.getLanguageParam(language);
        const data = await this.request(`/leadership/directors/?lang=${langParam}`);
        return data.results || [];
    }

    async getDepartmentHeads(language = 'ru') {
        const langParam = this.getLanguageParam(language);
        const data = await this.request(`/leadership/department-heads/?lang=${langParam}`);
        return data.results || [];
    }

    async getLeadershipById(id, language = 'ru') {
        const langParam = this.getLanguageParam(language);
        return await this.request(`/leadership/${id}/?lang=${langParam}`);
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

        const data = await this.request(`/organization-structure/?${queryParams}`);
        return data.results || [];
    }

    async getOrganizationHierarchy(language = 'ru') {
        const langParam = this.getLanguageParam(language);
        return await this.request(`/organization-structure/hierarchy/?lang=${langParam}`);
    }

    // Documents API methods
    async getDocuments(language = 'ru', filters = {}) {
        const langParam = this.getLanguageParam(language);
        const queryParams = new URLSearchParams({
            lang: langParam,
            ...filters
        });

        const data = await this.request(`/documents/?${queryParams}`);
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
    searchOrganizationStructure
} = apiService;