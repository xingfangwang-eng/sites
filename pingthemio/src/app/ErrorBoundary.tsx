'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Error info:', errorInfo);
    // You can also log the error to an error reporting service here
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-grid px-4">
          <div className="bg-white border border-slate-200 rounded-lg p-8 max-w-md w-full text-center shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Something went wrong</h2>
            <p className="text-slate-700 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page or signing in again.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
