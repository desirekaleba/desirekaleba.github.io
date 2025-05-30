import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service in production
    console.error('Error caught by boundary:', error, errorInfo);
    
    // In production, you would send this to your error tracking service
    if (import.meta.env.PROD) {
      // Example: Sentry, LogRocket, etc.
      // Sentry.captureException(error, { extra: errorInfo });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <AlertCircle className="h-16 w-16 text-destructive" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Something went wrong
              </h1>
              <p className="text-muted-foreground">
                We apologize for the inconvenience. An unexpected error has occurred.
              </p>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-destructive mb-2">Error Details (Dev Mode)</h3>
                <pre className="text-sm text-destructive/80 overflow-auto">
                  {this.state.error.message}
                </pre>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button
                onClick={this.handleRetry}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              
              <Button
                onClick={this.handleReload}
                className="flex items-center gap-2"
              >
                Reload Page
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              If the problem persists, please{' '}
              <a 
                href="/contact" 
                className="text-primary hover:underline"
                onClick={() => window.location.href = '/contact'}
              >
                contact us
              </a>
              .
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 