export const generateRandomDate = (): string => {
  const now = new Date();
  return new Date(now.getTime() - Math.random() * 1e6).toISOString();
};
