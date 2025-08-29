import { useState, useEffect } from 'react';

export const useLocalStorage = (key: string, defaultValue: string | null = null) => {
  const [value, setValue] = useState<string | null>(defaultValue);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const storedValue = window.localStorage.getItem(key);
      setValue(storedValue);
    }
  }, [key]);

  const setStoredValue = (newValue: string | null) => {
    setValue(newValue);
    if (typeof window !== 'undefined') {
      if (newValue === null) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, newValue);
      }
    }
  };

  return [value, setStoredValue] as const;
};
