export const getItem = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null;
  return JSON.parse(window.localStorage.getItem(key) || 'null') as T | null;
};

export const setItem = <T>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};
