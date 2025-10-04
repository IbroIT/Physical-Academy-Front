import React from 'react';

// Loading spinner component
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    };

    return (
        <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`}></div>
    );
};

// Loading skeleton component
export const LoadingSkeleton = ({ className = '', lines = 3 }) => {
    return (
        <div className={`animate-pulse ${className}`}>
            {Array.from({ length: lines }, (_, index) => (
                <div key={index} className="h-4 bg-gray-200 rounded mb-3 last:mb-0"></div>
            ))}
        </div>
    );
};

// Card loading skeleton
export const CardSkeleton = ({ className = '' }) => {
    return (
        <div className={`bg-white rounded-lg shadow-md p-6 animate-pulse ${className}`}>
            <div className="flex items-center space-x-4 mb-4">
                <div className="rounded-full bg-gray-200 h-16 w-16"></div>
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
        </div>
    );
};

// Full page loading
export const PageLoading = ({ message = 'Загрузка...' }) => {
    return (
        <div className="min-h-[400px] flex flex-col items-center justify-center">
            <LoadingSpinner size="xl" className="mb-4" />
            <p className="text-gray-600 text-lg">{message}</p>
        </div>
    );
};

// Error display component
export const ErrorDisplay = ({ error, onRetry, className = '' }) => {
    return (
        <div className={`bg-red-50 border border-red-200 rounded-lg p-6 text-center ${className}`}>
            <div className="text-red-600 mb-2">
                <svg className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Ошибка загрузки</h3>
            <p className="text-red-600 mb-4">{error}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Повторить попытку
                </button>
            )}
        </div>
    );
};

// Empty state component
export const EmptyState = ({ message = 'Данные не найдены', icon, className = '' }) => {
    return (
        <div className={`text-center py-12 ${className}`}>
            {icon && (
                <div className="text-gray-400 mb-4">
                    {icon}
                </div>
            )}
            <p className="text-gray-500 text-lg">{message}</p>
        </div>
    );
};