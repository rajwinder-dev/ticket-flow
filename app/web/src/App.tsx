import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AxiosError } from 'axios';
import { RouterProvider } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { GlobalProvider } from './context/GlobalContext';
import router from './router';
import { ErrorBoundary } from 'react-error-boundary';
import { devMode } from './config/apiconfig';
import { SocketProvider } from './context/SocketContext';
const queryclient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if ((error as AxiosError)?.status === 403) return false;
        return failureCount < 3;
      },
    },
  },
});
function App() {
  return (
    <>
      <ErrorBoundary fallback={<div>error ErrorBoundary</div>}>
        <QueryClientProvider client={queryclient}>
          <SocketProvider>
            <TooltipProvider>
              <GlobalProvider>
                <RouterProvider router={router} />
                <Toaster />
              </GlobalProvider>
              {devMode && <ReactQueryDevtools />}
            </TooltipProvider>
          </SocketProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
