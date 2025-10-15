import React from "react";

const LoadingSpinner = ({ size = 48, className = "" }) => {
  const style = {
    width: size,
    height: size,
    borderWidth: Math.max(2, Math.round(size / 12)),
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        style={style}
        className="border-4 border-t-transparent border-white/60 rounded-full animate-spin"
        aria-label="loading"
      />
    </div>
  );
};

export default LoadingSpinner;
