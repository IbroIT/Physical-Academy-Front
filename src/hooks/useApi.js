import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import apiService from "../services/api";

// Generic hook for API data fetching
export const useApiData = (
  apiMethod,
  dependencies = [],
  initialData = null
) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { i18n } = useTranslation();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiMethod(i18n.language);
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
      console.error("API fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [i18n.language, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for leadership data
export const useLeadership = (filters = {}) => {
  const { i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeadership = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.getLeadership(i18n.language, filters);
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to fetch leadership data");
      console.error("Leadership fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadership();
  }, [i18n.language, JSON.stringify(filters)]);

  return {
    leadership: data,
    loading,
    error,
    refetch: fetchLeadership,
  };
};

// Hook for Scopus data
export const useScopusPage = () => {
  return useApiData((language) => apiService.getScopusPage(language));
};

// Hook for NTS Committee data
export const useNTSCommitteePage = () => {
  return useApiData((language) => apiService.getNTSCommitteePage(language));
};

// Hook for directors only
export const useDirectors = () => {
  const { i18n } = useTranslation();
  return useApiData(() => apiService.getDirectors(i18n.language), [], []);
};

// Hook for accreditations
export const useAccreditations = (activeOnly = false) => {
  const { i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccreditations = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = activeOnly
        ? await apiService.getActiveAccreditations(i18n.language)
        : await apiService.getAccreditations(i18n.language);
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to fetch accreditations");
      console.error("Accreditations fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccreditations();
  }, [i18n.language, activeOnly]);

  return {
    accreditations: data,
    loading,
    error,
    refetch: fetchAccreditations,
  };
};

// Hook for organization structure
export const useOrganizationStructure = (hierarchical = false) => {
  const { i18n } = useTranslation();
  const [data, setData] = useState(hierarchical ? {} : []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStructure = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = hierarchical
        ? await apiService.getOrganizationHierarchy(i18n.language)
        : await apiService.getOrganizationStructure(i18n.language);
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to fetch organization structure");
      console.error("Organization structure fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStructure();
  }, [i18n.language, hierarchical]);

  return {
    structure: data,
    loading,
    error,
    refetch: fetchStructure,
  };
};

// Hook for documents
export const useDocuments = (filters = {}) => {
  const { i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.getDocuments(i18n.language, filters);
      setData(result);
    } catch (err) {
      console.error("Documents fetch error:", err);

      // Enhanced error handling with fallback
      if (err.message.includes("500") && i18n.language !== "ru") {
        // If there's a server error with non-Russian language, try Russian as fallback
        try {
          console.log("Attempting fallback to Russian language...");
          const fallbackResult = await apiService.getDocuments("ru", filters);
          setData(fallbackResult);
          setError("Language not fully supported, showing Russian content");
        } catch (fallbackErr) {
          setError(fallbackErr.message || "Failed to fetch documents");
          setData([]);
        }
      } else {
        setError(err.message || "Failed to fetch documents");
        setData([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [i18n.language, JSON.stringify(filters)]);

  return {
    documents: data,
    loading,
    error,
    refetch: fetchDocuments,
  };
};

// Hook for search functionality
export const useSearch = (searchType = "leadership") => {
  const { i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let result = [];
      switch (searchType) {
        case "leadership":
          result = await apiService.searchLeadership(
            searchQuery,
            i18n.language
          );
          break;
        case "documents":
          result = await apiService.searchDocuments(searchQuery, i18n.language);
          break;
        case "structure":
          result = await apiService.searchOrganizationStructure(
            searchQuery,
            i18n.language
          );
          break;
        default:
          throw new Error(`Unknown search type: ${searchType}`);
      }

      setResults(result);
    } catch (err) {
      setError(err.message || "Search failed");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        search(query);
      } else {
        setResults([]);
      }
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [query, i18n.language, searchType]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    search,
  };
};

// Hook for bachelor quotas
export const useBachelorQuotas = () => {
  const { i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuotasData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(
        "useBachelorQuotas - fetching data with language:",
        i18n.language
      );

      // Добавляем timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 5000)
      );

      const result = await Promise.race([
        apiService.getBachelorQuotas(i18n.language),
        timeoutPromise,
      ]);

      console.log("useBachelorQuotas - received result:", result);
      setData(result);
    } catch (err) {
      console.error("useBachelorQuotas - error:", err);
      setError(err.message || "Failed to fetch bachelor quotas data");
      // В случае ошибки, все равно останавливаем loading
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotasData();
  }, [i18n.language]);

  return {
    quotasData: data,
    loading,
    error,
    refetch: fetchQuotasData,
  };
};

// ===== STUDENT CLUBS HOOKS =====

// Hook for all student clubs page data
export const useStudentClubsPageData = (filters = {}) => {
  const { i18n } = useTranslation();
  const [data, setData] = useState({
    title: "",
    subtitle: "",
    stats: [],
    categories: [],
    clubs: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPageData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.getStudentClubsPageData(
        i18n.language,
        filters
      );
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to fetch student clubs page data");
      console.error("Student clubs page data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, [i18n.language, JSON.stringify(filters)]);

  return {
    data,
    loading,
    error,
    refetch: fetchPageData,
  };
};

// Hook for student clubs list
export const useStudentClubs = (filters = {}) => {
  const { i18n } = useTranslation();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.getStudentClubs(i18n.language, filters);
      setClubs(result);
    } catch (err) {
      setError(err.message || "Failed to fetch student clubs");
      console.error("Student clubs fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, [i18n.language, JSON.stringify(filters)]);

  return {
    clubs,
    loading,
    error,
    refetch: fetchClubs,
  };
};

// Hook for single student club
export const useStudentClub = (clubId) => {
  const { i18n } = useTranslation();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClub = async () => {
    if (!clubId) {
      setClub(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await apiService.getStudentClubById(clubId, i18n.language);
      setClub(result);
    } catch (err) {
      setError(err.message || "Failed to fetch student club details");
      console.error(`Student club ${clubId} fetch error:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClub();
  }, [i18n.language, clubId]);

  return {
    club,
    loading,
    error,
    refetch: fetchClub,
  };
};

// Hook for student club categories
export const useStudentClubCategories = () => {
  const { i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.getStudentClubCategories(i18n.language);
      setCategories(result);
    } catch (err) {
      setError(err.message || "Failed to fetch student club categories");
      console.error("Student club categories fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [i18n.language]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
};

// Hook for joining student club
export const useJoinStudentClub = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const joinClub = async (clubId, userData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const result = await apiService.joinStudentClub(clubId, userData);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.message || "Failed to join student club");
      console.error(`Join student club ${clubId} error:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    joinClub,
    loading,
    error,
    success,
    reset,
  };
};
