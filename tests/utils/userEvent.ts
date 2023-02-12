export const replaceSpecialChars = (str: string): string => {
  return str.replace(/[{[]/g, '$&$&');
};
