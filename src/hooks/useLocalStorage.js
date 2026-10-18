import { useEffect, useState } from "react";

function readStoredValue(key, initialValue) {
  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : initialValue;
  } catch {
    return initialValue;
  }
}

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readStoredValue(key, initialValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage may be full or blocked (e.g. some private-browsing modes).
      // The app keeps working in memory; changes just won't persist.
    }
  }, [key, value]);

  return [value, setValue];
}
