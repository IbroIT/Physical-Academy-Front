import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { getContactInfoPageData } from "../../../services/api";
import LoadingSpinner from "../../common/LoadingSpinner";

const ContactInfo = () => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedContact, setSelectedContact] = useState(null);
  const sectionRef = useRef(null);

  // Translation data for UI elements only, not content
  const uiTranslations = t("students.contact", { returnObjects: true });

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
        const response = await getContactInfoPageData(currentLanguage);
        setApiData(response);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch contact info data:", err);
        setError(t("common.errors.apiError"));

        // Set fallback data
        setApiData({
          contact_info: [],
          featured_contacts: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentLanguage, t]);

  // Reset active tab when data changes
  useEffect(() => {
    setActiveTab("all");
    setSelectedContact(null);
  }, [apiData, currentLanguage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const contacts = apiData?.contact_info || [];
  const featuredContacts = apiData?.featured_contacts || [];

  const handleContactClick = (contact) => {
    setSelectedContact(selectedContact?.id === contact.id ? null : contact);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 py-16 lg:py-24"
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
            {uiTranslations?.title || "Student Contact Information"}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {uiTranslations?.subtitle ||
              "Find all the contact information you need as a student"}
          </p>
        </motion.div>

        {/* Featured Contacts Section */}
        {featuredContacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {uiTranslations?.featuredTitle || "Featured Contacts"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredContacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      {contact.photo ? (
                        <img
                          src={contact.photo}
                          alt={contact.contact_name}
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                          <span className="text-2xl text-blue-500">
                            {contact.contact_name?.charAt(0) || "C"}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {contact.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {contact.contact_name}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 text-gray-700">
                      <p className="mb-2">
                        <strong>{uiTranslations?.email || "Email"}:</strong>{" "}
                        {contact.email}
                      </p>
                      {contact.phone && (
                        <p className="mb-2">
                          <strong>{uiTranslations?.phone || "Phone"}:</strong>{" "}
                          {contact.phone}
                        </p>
                      )}
                      <p className="mb-2">
                        <strong>{uiTranslations?.office || "Office"}:</strong>{" "}
                        {contact.office_location}
                      </p>
                      <p>
                        <strong>{uiTranslations?.hours || "Hours"}:</strong>{" "}
                        {contact.office_hours}
                      </p>
                    </div>

                    <div className="text-sm text-gray-600">
                      {contact.description}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filter and All Contacts Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {uiTranslations?.allContactsTitle || "All Contact Information"}
          </h2>

          {contacts.length > 0 ? (
            <div className="space-y-6">
              {contacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleContactClick(contact)}
                  className={`bg-white rounded-lg shadow overflow-hidden cursor-pointer transition-all duration-300 ${
                    selectedContact?.id === contact.id
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                >
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-center mb-4 md:mb-0">
                        {contact.photo ? (
                          <img
                            src={contact.photo}
                            alt={contact.contact_name}
                            className="w-12 h-12 rounded-full object-cover mr-4"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                            <span className="text-xl text-blue-500">
                              {contact.contact_name?.charAt(0) || "C"}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {contact.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {contact.contact_name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-blue-500 hover:text-blue-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <i className="fas fa-envelope mr-1"></i>{" "}
                          {contact.email}
                        </a>
                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone}`}
                            className="text-blue-500 hover:text-blue-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <i className="fas fa-phone mr-1"></i>{" "}
                            {contact.phone}
                          </a>
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedContact?.id === contact.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-gray-200"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-700">
                                <strong>
                                  {uiTranslations?.office || "Office"}:
                                </strong>{" "}
                                {contact.office_location}
                              </p>
                              <p className="text-sm text-gray-700">
                                <strong>
                                  {uiTranslations?.hours || "Hours"}:
                                </strong>{" "}
                                {contact.office_hours}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                {contact.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                {uiTranslations?.noContacts ||
                  "No contact information available at this time."}
              </p>
            </div>
          )}
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600">
            {uiTranslations?.helpText ||
              "Can't find the contact you're looking for? Please contact the main office."}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactInfo;
