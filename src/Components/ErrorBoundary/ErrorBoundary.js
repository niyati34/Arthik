import React from 'react';
import styled from 'styled-components';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    
    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallbackStyled>
          <div className="error-container">
            <div className="error-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h1>Something went wrong</h1>
            <p>We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.</p>
            
            <div className="error-actions">
              <button onClick={this.handleRetry} className="retry-button">
                Try Again
              </button>
              <button onClick={() => window.location.reload()} className="refresh-button">
                Refresh Page
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development)</summary>
                <pre className="error-stack">
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </ErrorFallbackStyled>
      );
    }

    return this.props.children;
  }
}

const ErrorFallbackStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem;

  .error-container {
    max-width: 500px;
    text-align: center;
    background: white;
    padding: 3rem 2rem;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
  }

  .error-icon {
    color: #ef4444;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 1rem;
  }

  p {
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .error-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .retry-button,
  .refresh-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .retry-button {
    background: #10b981;
    color: white;

    &:hover {
      background: #059669;
      transform: translateY(-1px);
    }
  }

  .refresh-button {
    background: #f1f5f9;
    color: #0f172a;
    border: 1px solid #e2e8f0;

    &:hover {
      background: #e2e8f0;
    }
  }

  .error-details {
    margin-top: 2rem;
    text-align: left;
    border-top: 1px solid #e2e8f0;
    padding-top: 1rem;

    summary {
      cursor: pointer;
      color: #64748b;
      font-weight: 500;
      margin-bottom: 1rem;

      &:hover {
        color: #0f172a;
      }
    }
  }

  .error-stack {
    background: #f1f5f9;
    padding: 1rem;
    border-radius: 6px;
    font-size: 0.75rem;
    color: #475569;
    overflow-x: auto;
    white-space: pre-wrap;
    border: 1px solid #e2e8f0;
  }

  @media (max-width: 640px) {
    padding: 1rem;

    .error-container {
      padding: 2rem 1.5rem;
    }

    .error-actions {
      flex-direction: column;
      align-items: center;
    }

    .retry-button,
    .refresh-button {
      width: 100%;
      max-width: 200px;
    }
  }
`;

export default ErrorBoundary;
