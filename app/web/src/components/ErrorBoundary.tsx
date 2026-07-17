import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
  Link,
} from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';

export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = 'Something went wrong';
  let description = 'An unexpected error occurred. Please try again.';
  let status: number | undefined;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    title = error.status === 404 ? 'Page not found' : `Error ${error.status}`;
    description =
      error.status === 404
        ? "The page you're looking for doesn't exist or has been moved."
        : error.statusText || description;
  } else if (error instanceof Error) {
    description = error.message || description;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-lg border-destructive/20">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        {import.meta.env.DEV && error instanceof Error && error.stack && (
          <CardContent>
            <pre className="max-h-40 overflow-auto rounded-md bg-muted p-3 text-xs text-muted-foreground">
              {error.stack}
            </pre>
          </CardContent>
        )}

        <CardFooter className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => navigate(0)}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
