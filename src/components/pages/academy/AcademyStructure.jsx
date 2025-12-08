// AcademicStructure.jsx
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useOrganizationStructure } from "../../../hooks/useApi";
import {
  PageLoading,
  ErrorDisplay,
  EmptyState,
  CardSkeleton,
} from "../../common/Loading";

const AcademicStructure = () => {
  const { t } = useTranslation();
  const [viewType, setViewType] = useState("hierarchical");
  const [selectedType, setSelectedType] = useState("all");
  const [expandedDepartments, setExpandedDepartments] = useState(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState(null);
  const sectionRef = useRef(null);

  const { structure, loading, error, refetch } = useOrganizationStructure(
    viewType === "hierarchical"
  );

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

  // Set visible when data is loaded
  useEffect(() => {
    if (!loading && structure.length > 0) {
      setIsVisible(true);
    }
  }, [loading, structure]);

  const toggleDepartment = (departmentId) => {
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(departmentId)) {
      newExpanded.delete(departmentId);
    } else {
      newExpanded.add(departmentId);
    }
    setExpandedDepartments(newExpanded);
  };

  const getFilteredData = () => {
    if (viewType === "hierarchical") {
      // Возвращаем только корневые элементы для иерархического представления
      if (Array.isArray(structure)) {
        return structure.filter((item) => !item.parent);
      }
      return [];
    }

    if (!structure || !Array.isArray(structure)) return [];

    if (selectedType === "all") {
      return structure;
    }

    return structure.filter((item) => item.structure_type === selectedType);
  };

  const filteredData = getFilteredData();

  const structureTypes = [
    {
      key: "all",
      label: t("structure.types.all", "Все"),
      icon: "🏛️",
      gradient: "from-blue-500 to-emerald-500",
    },
    {
      key: "faculty",
      label: t("structure.types.faculty", "Факультеты"),
      icon: "🎓",
      gradient: "from-emerald-500 to-blue-600",
    },
    {
      key: "department",
      label: t("structure.types.department", "Кафедры"),
      icon: "📚",
      gradient: "from-blue-600 to-emerald-600",
    },
    {
      key: "unit",
      label: t("structure.types.unit", "Подразделения"),
      icon: "🏢",
      gradient: "from-emerald-400 to-blue-500",
    },
    {
      key: "service",
      label: t("structure.types.service", "Службы"),
      icon: "🔧",
      gradient: "from-blue-500 to-emerald-400",
    },
    {
      key: "center",
      label: t("structure.types.center", "Центры"),
      icon: "�",
      gradient: "from-emerald-600 to-blue-500",
    },
  ];

  if (loading) {
    return <PageLoading message={t("structure.loading")} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <ErrorDisplay
            error={error}
            onRetry={refetch}
            className="max-w-md mx-auto"
          />
        </div>
      </div>
    );
  }

  const getTypeGradient = (type) => {
    const typeConfig = structureTypes.find((t) => t.key === type);
    if (!typeConfig) return "from-gray-500 to-gray-600";
    return typeConfig.gradient;
  };

  const DepartmentCard = ({ department, level = 0 }) => {
    const gradient = getTypeGradient(department.structure_type);
    const hasChildren = department.children && department.children.length > 0;
    const isExpanded = expandedDepartments.has(department.id);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: level * 0.1 }}
        className={`${level > 0 ? "ml-4 lg:ml-8 mt-4" : ""}`}
      >
        <motion.div
          className={`bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 hover:border-emerald-400/50 transition-all duration-500 overflow-hidden group cursor-pointer ${
            activeDepartment === department.id
              ? "ring-2 ring-emerald-400 scale-105"
              : ""
          }`}
          onClick={() => {
            if (hasChildren) toggleDepartment(department.id);
            setActiveDepartment(department.id);
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="p-6 lg:p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 lg:space-x-6 flex-1">
                {/* Иконка */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex-shrink-0"
                >
                  <div
                    className={`w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center text-white text-xl lg:text-2xl shadow-2xl`}
                  >
                    {department.icon || "🏛️"}
                  </div>
                </motion.div>

                {/* Контент */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <motion.h3
                        className="text-xl lg:text-2xl font-bold text-white mb-3"
                        layout
                      >
                        {department.name}
                      </motion.h3>

                      {/* Structure Type */}
                      {department.structure_type && (
                        <motion.span
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <span className="mr-2">
                            {structureTypes.find(
                              (t) => t.key === department.structure_type
                            )?.icon || "🏗️"}
                          </span>
                          {department.structure_type_display ||
                            structureTypes.find(
                              (t) => t.key === department.structure_type
                            )?.label}
                        </motion.span>
                      )}
                    </div>

                    {hasChildren && (
                      <motion.button
                        className="flex-shrink-0 ml-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <motion.svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </motion.svg>
                      </motion.button>
                    )}
                  </div>

                  {/* Head Information */}
                  {department.head && (
                    <motion.div
                      className="mt-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm">
                          👤
                        </div>
                        <span className="text-sm font-semibold text-white">
                          {t("structure.head", "Руководитель")}
                        </span>
                      </div>
                      <p className="text-blue-100 text-lg font-medium">
                        {department.head}
                      </p>
                    </motion.div>
                  )}

                  {/* Contact Information */}
                  {(department.phone || department.email) && (
                    <motion.div
                      className="mt-4 space-y-2 text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {department.phone && (
                        <div className="flex items-center gap-3 text-blue-100">
                          <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-sm">📱</span>
                          </div>
                          <a
                            href={`tel:${department.phone}`}
                            className="hover:text-emerald-300 hover:underline transition-colors"
                          >
                            {department.phone}
                          </a>
                        </div>
                      )}
                      {department.email && (
                        <div className="flex items-center gap-3 text-blue-100">
                          <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-sm">📧</span>
                          </div>
                          <a
                            href={`mailto:${department.email}`}
                            className="hover:text-emerald-300 hover:underline transition-colors"
                          >
                            {department.email}
                          </a>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Status */}
                  <motion.div
                    className="flex flex-wrap gap-2 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
                        department.is_active
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                          : "bg-red-500/20 text-red-300 border-red-400/30"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          department.is_active
                            ? "bg-emerald-400 animate-pulse"
                            : "bg-red-400"
                        }`}
                      ></div>
                      {department.is_active
                        ? "✅ " + t("structure.active")
                        : "❌ " + t("structure.inactive")}
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Expand Button for Mobile */}
            {hasChildren && (
              <div className="flex justify-center mt-6 lg:hidden">
                <motion.button
                  className="flex items-center gap-2 text-emerald-300 text-sm font-medium hover:text-emerald-200 transition-colors bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>
                    {isExpanded
                      ? t("structure.showLess")
                      : t("structure.showMore")}
                  </span>
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </motion.button>
              </div>
            )}
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && hasChildren && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="border-t border-white/10 bg-white/5 p-6 lg:p-8"
              >
                <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                    🏢
                  </div>
                  {t("structure.subdepartments")} ({department.children.length})
                </h4>
                <div className="grid gap-4">
                  {department.children.map((child, index) => (
                    <motion.div
                      key={child.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="font-bold text-white text-lg">
                            {child.name}
                          </h5>
                          {child.head_name && (
                            <p className="text-blue-100 text-sm mt-2 flex items-center gap-2">
                              <span>👤</span>
                              {child.head_name}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-3 mt-3">
                            {child.phone && (
                              <span className="text-xs text-blue-200 flex items-center gap-1">
                                📱 {child.phone}
                              </span>
                            )}
                            {child.email && (
                              <span className="text-xs text-blue-200 flex items-center gap-1">
                                📧 {child.email}
                              </span>
                            )}
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
                            child.is_active
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                              : "bg-red-500/20 text-red-300 border-red-400/30"
                          }`}
                        >
                          {child.is_active
                            ? t("structure.active")
                            : t("structure.inactive")}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Recursive children rendering for hierarchical view */}
        <AnimatePresence>
          {viewType === "hierarchical" && isExpanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 mt-6"
            >
              {department.children.map((child) => (
                <DepartmentCard
                  key={child.id}
                  department={child}
                  level={level + 1}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const getStats = () => {
    if (!Array.isArray(structure)) return null;

    return {
      total: structure.length,
      faculties: structure.filter((d) => d.structure_type === "faculties")
        .length,
      administrative: structure.filter(
        (d) => d.structure_type === "administrative"
      ).length,
      leadership: structure.filter((d) => d.structure_type === "leadership")
        .length,
      support: structure.filter((d) => d.structure_type === "support").length,
      active: structure.filter((d) => d.is_active).length,
    };
  };

  const stats = getStats();

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Академические символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🏛️</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">
          🎓
        </div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">👑</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-20"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t("academicStructure.title")}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t("academicStructure.subtitle")}
          </p>
        </motion.div>

        {/* Content */}
        {viewType === "hierarchical" ? (
          // Hierarchical view
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="space-y-6"
          >
            {Array.isArray(filteredData) && filteredData.length > 0 ? (
              filteredData.map((department) => (
                <DepartmentCard key={department.id} department={department} />
              ))
            ) : (
              <EmptyState
                message={t("structure.noData")}
                icon={<div className="text-6xl mb-4">🏛️</div>}
              />
            )}
          </motion.div>
        ) : (
          // Flat grid view
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {Array.isArray(filteredData) && filteredData.length > 0 ? (
              filteredData.map((department) => (
                <DepartmentCard key={department.id} department={department} />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState
                  message={t("structure.noDepartments")}
                  icon={<div className="text-6xl mb-4">🏛️</div>}
                />
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default AcademicStructure;
