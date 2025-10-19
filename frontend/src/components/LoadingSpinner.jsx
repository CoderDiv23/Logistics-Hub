import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  message = null, 
  fullScreen = false,
  className = '' 
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  };
  
  // Color classes
  const colorClasses = `text-${color}`;
  
  // Spinner element
  const spinner = (
    <div className={`spinner-border ${sizeClasses[size]} ${colorClasses} ${className}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
  
  // Full screen wrapper
  if (fullScreen) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
        {spinner}
        {message && <p className="mt-3 text-muted">{message}</p>}
      </div>
    );
  }
  
  // Inline spinner with optional message
  return (
    <div className="d-flex align-items-center">
      {spinner}
      {message && <span className="ms-2">{message}</span>}
    </div>
  );
};

export default LoadingSpinner;