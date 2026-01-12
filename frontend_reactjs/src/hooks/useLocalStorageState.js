import { useEffect, useMemo, useState } from "react";

/**
 * Small, dependency-free localStorage hook.
 * Safe in environments where localStorage may be unavailable.
 */

// PUBLIC_INTERFACE
export function useLocalStorageState(key, initialValue) {
  /** Persist state to localStorage under the provided key. */
  const isStorageAvailable = useMemo(() => {
    try {
      return typeof window !== "undefined" && !!window.localStorage;
    } catch {
      return false;
    }
  }, []);

  const [value, setValue] = useState(() => {
    if (!isStorageAvailable) return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw == null) return initialValue;
      return JSON.parse(raw);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (!isStorageAvailable) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore quota/security errors.
    }
  }, [isStorageAvailable, key, value]);

  return [value, setValue];
}
