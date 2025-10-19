import React from 'react';
import ErrorHandler from '../utils/errorHandler';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    ErrorHandler.logError(error, 'ErrorBoundary');
    
    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    // Reset error state and reload the page
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    
    // Reload the page
    window.location.reload();
  };

  handleGoBack = () => {
    // Go back to the previous page
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return ErrorHandler.createErrorFallback(this.state.error, this.state.errorInfo);
    }

    return this.props.children;
  }
}

export default ErrorBoundary;