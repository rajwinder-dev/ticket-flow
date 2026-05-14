import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosError } from "axios";
import { RouterProvider } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { GlobalProvider } from "./context/GlobalContext";
import router from "./router";
import { ErrorBoundary } from "./components/ErrorBoundary";
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
      <QueryClientProvider client={queryclient}>
        <TooltipProvider>
          <ErrorBoundary>
            <GlobalProvider>
              <RouterProvider router={router} />
              <Toaster />
            </GlobalProvider>
          </ErrorBoundary>

          <ReactQueryDevtools />
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
