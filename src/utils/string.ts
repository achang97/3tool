export const isJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const replaceTokensAtIndices = (
  str: string,
  originalTokens: string[],
  replaceTokens: string[],
  indices: number[]
): string => {
  let result = str;
  let lengthDelta = 0;

  originalTokens.forEach((originalToken, i) => {
    const prefix = result.substring(0, indices[i] + lengthDelta);
    const suffix = result.substring(
      indices[i] + originalToken.length + lengthDelta
    );
    result = `${prefix}${replaceTokens[i]}${suffix}`;
    lengthDelta += replaceTokens[i].length - originalToken.length;
  });

  return result;
};
