export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export const MSW_API =
  process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_MSW_API === 'true';
