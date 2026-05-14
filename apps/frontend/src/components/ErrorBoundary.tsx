import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    /**
     * Send error to monitoring service here
     * Example:
     * Sentry.captureException(error)
     */
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });

    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] items-center justify-center p-6">
          <Card className="border-destructive/20 w-full max-w-lg shadow-xl">
            <CardHeader className="space-y-4 text-center">
              <div className="bg-destructive/10 mx-auto flex h-14 w-14 items-center justify-center rounded-full">
                <AlertTriangle className="text-destructive h-7 w-7" />
              </div>

              <div>
                <CardTitle className="text-2xl">Something went wrong</CardTitle>

                <p className="text-muted-foreground mt-2 text-sm">
                  An unexpected error occurred while rendering this section.
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {import.meta.env.NODE_ENV === "development" && this.state.error && (
                <div className="bg-muted rounded-md border p-4">
                  <p className="text-destructive mb-2 text-sm font-medium">Error Details</p>

                  <pre className="text-muted-foreground overflow-auto text-xs">
                    {this.state.error.message}
                  </pre>
                </div>
              )}

              <div className="flex justify-center">
                <Button onClick={this.handleReset}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
