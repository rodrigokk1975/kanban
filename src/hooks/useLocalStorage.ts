import { useCallback, useEffect, useState } from 'react';

interface VersionedPayload<T> {
  version: number;
  data: T;
}

interface UseLocalStorageOptions<T> {
  version: number;
  isValid?: (value: unknown) => value is T;
}

export function readVersionedStorage<T>(
  key: string,
  fallback: () => T,
  options: UseLocalStorageOptions<T>,
): T {
  if (typeof window === 'undefined') return fallback();

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback();

    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('version' in parsed) ||
      !('data' in parsed)
    ) {
      return fallback();
    }

    const payload = parsed as VersionedPayload<unknown>;
    if (payload.version !== options.version) return fallback();
    if (options.isValid && !options.isValid(payload.data)) return fallback();

    return payload.data as T;
  } catch {
    return fallback();
  }
}

export function writeVersionedStorage<T>(key: string, value: T, version: number): void {
  if (typeof window === 'undefined') return;

  try {
    const payload: VersionedPayload<T> = { version, data: value };
    window.localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // Ignore storage quota or private browsing errors without crashing the UI
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: () => T,
  options: UseLocalStorageOptions<T>,
) {
  const { version, isValid } = options;

  const [value, setValue] = useState<T>(() =>
    readVersionedStorage(key, initialValue, { version, isValid }),
  );

  useEffect(() => {
    writeVersionedStorage(key, value, version);
  }, [key, value, version]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== key) return;
      setValue(readVersionedStorage(key, initialValue, { version, isValid }));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key, initialValue, version, isValid]);

  const reset = useCallback(() => {
    setValue(initialValue());
  }, [initialValue]);

  return [value, setValue, reset] as const;
}
