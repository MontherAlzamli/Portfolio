'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import logger from '@/lib/logger';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    logger.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-bg">
          <div className="text-center p-8 max-w-md mx-auto">
            <AlertTriangle className="h-16 w-16 text-danger mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-fg mb-2">
              Something went wrong
            </h2>
            <p className="text-muted mb-6">
              We're sorry, but something unexpected happened. Please try
              refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center mx-auto px-4 py-2 bg-brand-solid text-brand-on rounded-md hover:bg-brand-solid/90 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Components
export function LoadingSpinner({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-brand border-t-transparent ${sizeClasses[size]} ${className}`}
    />
  );
}

export function LoadingCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-surface rounded-lg border border-line p-6 animate-pulse ${className}`}
    >
      <div className="space-y-4">
        <div className="h-4 bg-bg rounded w-3/4"></div>
        <div className="h-4 bg-bg rounded w-1/2"></div>
        <div className="h-4 bg-bg rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function LoadingGrid({
  count = 6,
  className = '',
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}

export function LoadingSection({ className = '' }: { className?: string }) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-8 bg-bg rounded w-1/3 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-bg rounded w-1/2 mx-auto animate-pulse"></div>
        </div>
        <LoadingGrid />
      </div>
    </section>
  );
}
