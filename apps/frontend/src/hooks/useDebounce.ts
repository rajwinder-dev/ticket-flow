import { useEffect, useState } from "react";

export function useDebounceValue<T>(value: T, delay = 300) { // Lowered default to 300ms
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    // Set the timeout
    const handler = setTimeout(() => {
      setDebounced(value);
    }, delay);

    // This cleanup function runs every time 'value' or 'delay' changes
    // It cancels the previous timeout before starting a new one.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounced;
}
