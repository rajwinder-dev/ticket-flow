import { useLocation, useNavigate } from 'react-router-dom';

interface NewParams {
  [key: string]: string;
}

export function useCustomParams() {
  const location = useLocation();
  const navigate = useNavigate();

  function setParams(newParams: NewParams, path: string = "") {
    const currentParams = new URLSearchParams(location.search);
    Object.entries(newParams).forEach(([key, value]) => {
      currentParams.set(key, value);
    });

    const newPath = path || location.pathname;
    navigate(`${newPath}?${currentParams.toString()}`);
  }

  function getParams(...keys: string[]) {
    const searchParams = new URLSearchParams(location.search);
    return keys.reduce((acc, key) => {
      acc[key] = searchParams.get(key);
      return acc;
    }, {} as Record<string, string | null>);
  }

  return { getParams, setParams };
}
