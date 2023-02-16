export const createNameWithPrefix = (
  prefix: string,
  currentNames: string[]
): string => {
  const prefixRegex = new RegExp(`${prefix}(\\d+)`);

  let numSuffix = 1;
  currentNames.forEach((name) => {
    const match = name.match(prefixRegex);
    const prefixNum = match && parseInt(match[1], 10);

    if (prefixNum && prefixNum >= numSuffix) {
      numSuffix = prefixNum + 1;
    }
  });

  return `${prefix}${numSuffix}`;
};
