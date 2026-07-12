import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  setOrgId: React.Dispatch<React.SetStateAction<string | undefined>>;
  orgId?: string | undefined;
};

const GlobalContext = createContext<ThemeContextType | null>(null);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [orgId, setOrgId] = useState<string | undefined>(undefined);
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "light";
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <GlobalContext.Provider value={{ theme, toggleTheme, setOrgId, orgId }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobalContext must be used inside GlobalProvider");
  return ctx;
};
