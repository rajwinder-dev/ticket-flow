import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { GlobalProvider } from "./context/GlobalContext";
import router from "./router";
const queryclient = new QueryClient();
function App() {
  return (
    <>
      <QueryClientProvider client={queryclient}>
        <TooltipProvider>
          <GlobalProvider>
            <RouterProvider router={router} />
            <Toaster />
          </GlobalProvider>
          <ReactQueryDevtools position="left"/>
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
