export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export const MSW_API =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_MSW_API === 'true';

export const AUTH0_DOMAIN = process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? '';
export const AUTH0_CLIENT_ID = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? '';
