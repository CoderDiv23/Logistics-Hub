/**
 * Error Handler Utility
 * Provides consistent error handling across the application
 */

class ErrorHandler {
  /**
   * Handle API errors
   * @param {Error} error - The error object
   * @param {string} context - Context where the error occurred
   * @returns {Object} Formatted error object
   */
  static handleApiError(error, context = 'Unknown') {
    console.error(`API Error in ${context}:`, error);
    
    let message = 'An unexpected error occurred';
    let code = 'UNKNOWN_ERROR';
    
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 400:
          message = 'Bad Request - Please check your input';
          code = 'BAD_REQUEST';
          break;
        case 401:
          message = 'Unauthorized - Please log in again';
          code = 'UNAUTHORIZED';
          break;
        case 403:
          message = 'Forbidden - You do not have permission';
          code = 'FORBIDDEN';
          break;
        case 404:
          message = 'Not Found - Resource not available';
          code = 'NOT_FOUND';
          break;
        case 500:
          message = 'Server Error - Please try again later';
          code = 'SERVER_ERROR';
          break;
        default:
          message = `Server Error (${error.response.status})`;
          code = 'SERVER_ERROR';
      }
    } else if (error.request) {
      // Network error
      message = 'Network Error - Please check your connection';
      code = 'NETWORK_ERROR';
    } else {
      // Other errors
      message = error.message || message;
      code = 'CLIENT_ERROR';
    }
    
    return {
      message,
      code,
      originalError: error,
      timestamp: new Date().toISOString(),
      context
    };
  }
  
  /**
   * Handle form validation errors
   * @param {Object} errors - Validation errors object
   * @returns {Object} Formatted validation error object
   */
  static handleValidationErrors(errors) {
    const errorMessages = [];
    
    for (const [field, message] of Object.entries(errors)) {
      errorMessages.push(`${field}: ${message}`);
    }
    
    return {
      message: 'Validation failed',
      details: errorMessages,
      code: 'VALIDATION_ERROR'
    };
  }
  
  /**
   * Show error notification to user
   * @param {string} message - Error message to display
   * @param {string} type - Type of notification (error, warning, info)
   */
  static showErrorNotification(message, type = 'error') {
    // In a real application, this would integrate with a notification system
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Example implementation with a simple alert (in real app, use toast notifications)
    if (type === 'error') {
      alert(`Error: ${message}`);
    }
  }
  
  /**
   * Log error for debugging
   * @param {Error} error - Error object
   * @param {string} context - Context where error occurred
   */
  static logError(error, context) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
    };
    
    console.error('Application Error:', errorInfo);
    
    // In a production environment, you might send this to an error tracking service
    // Example: Sentry.captureException(error, { contexts: { react: { componentStackTrace: context } } });
  }
  
  /**
   * Create a fallback UI for error boundaries
   * @param {Error} error - Error object
   * @param {Object} errorInfo - Error information
   * @returns {JSX.Element} Fallback UI component
   */
  static createErrorFallback(error, errorInfo) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card border-danger">
              <div className="card-header bg-danger text-white">
                <h4 className="mb-0">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Something went wrong
                </h4>
              </div>
              <div className="card-body">
                <p>We're sorry, but something went wrong. Please try refreshing the page.</p>
                <details className="mt-3 p-3 bg-light rounded">
                  <summary className="text-muted">Error details</summary>
                  <pre className="mt-2 mb-0 text-danger">{error.message}</pre>
                  <pre className="mt-2 mb-0 text-muted" style={{ fontSize: '0.8em' }}>
                    {error.stack}
                  </pre>
                </details>
                <div className="mt-3">
                  <button 
                    className="btn btn-primary me-2" 
                    onClick={() => window.location.reload()}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>Refresh Page
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => window.history.back()}
                  >
                    <i className="bi bi-arrow-left me-1"></i>Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorHandler;