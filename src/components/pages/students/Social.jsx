import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { getSocialPageData } from "../../../services/api";
import LoadingSpinner from "../../common/LoadingSpinner";

const Social = () => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [activeTab, setActiveTab] = useState("accounts");
  const [selectedNetwork, setSelectedNetwork] = useState("all");
  const sectionRef = useRef(null);

  // Translation data for UI elements only, not content
  const uiTranslations = t("students.social", { returnObjects: true });

  // Get current language
  const currentLanguage = i18n.language || "ru";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getSocialPageData(currentLanguage);
        setApiData(response);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch social data:", err);
        setError(t("common.errors.apiError"));

        // Set fallback data
        setApiData({
          social_accounts: [],
          featured_accounts: [],
          official_accounts: [],
          communities: [],
          featured_communities: [],
          verified_communities: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentLanguage, t]);

  // Reset active tab when data changes
  useEffect(() => {
    setActiveTab("accounts");
    setSelectedNetwork("all");
  }, [apiData, currentLanguage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const socialAccounts = apiData?.social_accounts || [];
  const featuredAccounts = apiData?.featured_accounts || [];
  const officialAccounts = apiData?.official_accounts || [];
  const communities = apiData?.communities || [];
  const featuredCommunities = apiData?.featured_communities || [];

  // Get unique network types for filtering
  const networkTypes = [
    "all",
    ...new Set(socialAccounts.map((account) => account.network)),
  ];

  // Filter accounts based on selected network
  const filteredAccounts =
    selectedNetwork === "all"
      ? socialAccounts
      : socialAccounts.filter((account) => account.network === selectedNetwork);

  // Filter communities based on selected network
  const filteredCommunities =
    selectedNetwork === "all"
      ? communities
      : communities.filter(
          (community) => community.network === selectedNetwork
        );

  // Helper function to get network color
  const getNetworkColor = (network, defaultColor = "#3b5998") => {
    const account = socialAccounts.find((a) => a.network === network);
    return account?.color_hex || defaultColor;
  };

  // Helper function to get network icon
  const getNetworkIcon = (network, defaultIcon = "fa-globe") => {
    const account = socialAccounts.find((a) => a.network === network);
    return account?.icon || defaultIcon;
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 py-16 lg:py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {uiTranslations?.title || "Social Networks"}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {uiTranslations?.subtitle ||
              "Connect with us on social media and join our student communities"}
          </p>
        </motion.div>

        {/* Featured Accounts Section */}
        {featuredAccounts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {uiTranslations?.featuredAccountsTitle ||
                "Featured Social Accounts"}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredAccounts.map((account) => (
                <motion.a
                  href={account.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={account.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    backgroundColor: account.color_hex || "#f8f9fa",
                    color: account.color_hex ? "#ffffff" : "#333333",
                  }}
                  className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6 text-center"
                >
                  <div className="mb-4 text-4xl">
                    <i className={`fab ${account.icon || "fa-globe"}`}></i>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{account.name}</h3>
                  <p className="text-sm opacity-90">
                    {account.network_display}
                  </p>
                  {account.username && (
                    <p className="text-sm mt-2 font-mono opacity-75">
                      @{account.username}
                    </p>
                  )}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setActiveTab("accounts")}
                className={`px-5 py-2.5 text-sm font-medium rounded-l-md border ${
                  activeTab === "accounts"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {uiTranslations?.accountsTab || "Social Accounts"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("communities")}
                className={`px-5 py-2.5 text-sm font-medium rounded-r-md border ${
                  activeTab === "communities"
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {uiTranslations?.communitiesTab || "Student Communities"}
              </button>
            </div>
          </div>

          {/* Network Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {networkTypes.map((network) => (
              <button
                key={network}
                onClick={() => setSelectedNetwork(network)}
                className={`px-4 py-1.5 text-sm rounded-full ${
                  selectedNetwork === network
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {network === "all"
                  ? uiTranslations?.allNetworks || "All Networks"
                  : network.charAt(0).toUpperCase() + network.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === "accounts" ? (
            <motion.div
              key="accounts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {filteredAccounts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAccounts.map((account) => (
                    <motion.div
                      key={account.id}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <div
                        className="h-2"
                        style={{
                          backgroundColor: account.color_hex || "#3b5998",
                        }}
                      ></div>
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                            style={{
                              backgroundColor: account.color_hex
                                ? `${account.color_hex}20`
                                : "#f0f0f0",
                              color: account.color_hex || "#333333",
                            }}
                          >
                            <i
                              className={`fab ${
                                account.icon || "fa-globe"
                              } text-xl`}
                            ></i>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {account.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {account.network_display}
                              {account.username && ` • @${account.username}`}
                            </p>
                          </div>
                        </div>

                        {account.description && (
                          <p className="text-gray-600 mb-4">
                            {account.description}
                          </p>
                        )}

                        <div className="mt-4">
                          <a
                            href={account.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white transition-colors duration-300"
                            style={{
                              backgroundColor: account.color_hex || "#3b5998",
                            }}
                          >
                            <i className="fas fa-external-link-alt mr-2"></i>
                            {uiTranslations?.visitProfile || "Visit Profile"}
                          </a>
                          {account.is_official && (
                            <span className="ml-3 text-sm text-green-600 font-medium">
                              <i className="fas fa-check-circle mr-1"></i>
                              {uiTranslations?.official || "Official"}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    {uiTranslations?.noAccounts ||
                      "No social accounts available for the selected network."}
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="communities"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Featured Communities */}
              {featuredCommunities.length > 0 && selectedNetwork === "all" && (
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    {uiTranslations?.featuredCommunitiesTitle ||
                      "Featured Communities"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {featuredCommunities.map((community) => (
                      <motion.a
                        href={community.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={community.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="block relative overflow-hidden rounded-xl shadow-lg group"
                      >
                        {community.banner_image ? (
                          <img
                            src={community.banner_image}
                            alt={community.title}
                            className="w-full h-48 object-cover object-center transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="w-full h-48 flex items-center justify-center transition-transform duration-700 group-hover:scale-105"
                            style={{
                              backgroundColor: getNetworkColor(
                                community.network,
                                "#6b46c1"
                              ),
                            }}
                          >
                            <i
                              className={`fab ${getNetworkIcon(
                                community.network
                              )} text-white text-5xl`}
                            ></i>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-6">
                          <h3 className="text-xl font-bold text-white mb-1">
                            {community.title}
                            {community.is_verified && (
                              <i className="fas fa-check-circle ml-2 text-blue-400"></i>
                            )}
                          </h3>
                          <p className="text-sm text-white/80 mb-3">
                            {community.network_display} •{" "}
                            {community.members_count.toLocaleString()}{" "}
                            {uiTranslations?.members || "members"}
                          </p>
                          <p className="text-white/90 line-clamp-2">
                            {community.description}
                          </p>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}

              {/* All Communities */}
              {filteredCommunities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCommunities.map((community) => (
                    <motion.div
                      key={community.id}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      {community.banner_image ? (
                        <img
                          src={community.banner_image}
                          alt={community.title}
                          className="w-full h-32 object-cover object-center"
                        />
                      ) : (
                        <div
                          className="w-full h-24 flex items-center justify-center"
                          style={{
                            backgroundColor: getNetworkColor(
                              community.network,
                              "#6b46c1"
                            ),
                          }}
                        >
                          <i
                            className={`fab ${getNetworkIcon(
                              community.network
                            )} text-white text-3xl`}
                          ></i>
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {community.title}
                            {community.is_verified && (
                              <i className="fas fa-check-circle ml-2 text-blue-500 text-sm"></i>
                            )}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {community.network_display}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {community.description}
                        </p>

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            <span className="mr-3">
                              <i className="fas fa-users mr-1"></i>
                              {community.members_count.toLocaleString()}{" "}
                              {uiTranslations?.members || "members"}
                            </span>
                            <span>
                              <i className="fas fa-comment-alt mr-1"></i>
                              {community.posts_count.toLocaleString()}{" "}
                              {uiTranslations?.posts || "posts"}
                            </span>
                          </div>

                          <a
                            href={community.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white transition-colors duration-300"
                            style={{
                              backgroundColor: getNetworkColor(
                                community.network,
                                "#6b46c1"
                              ),
                            }}
                          >
                            <i className="fas fa-sign-in-alt mr-1"></i>
                            {uiTranslations?.join || "Join"}
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    {uiTranslations?.noCommunities ||
                      "No communities available for the selected network."}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600">
            {uiTranslations?.helpText ||
              "Looking to create a student community? Contact the student affairs office for guidance."}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Social;
