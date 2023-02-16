export const isJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const prettifyJSON = (object: unknown): string => {
  return JSON.stringify(object, null, 2);
};
