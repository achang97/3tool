import { ComponentType } from '@app/types';

export const getNewComponentId = (
  componentType: ComponentType,
  existingIds: string[]
): string => {
  const componentRegex = new RegExp(`${componentType}(\\d+)`);

  let newId = 1;
  existingIds.forEach((currId) => {
    const match = currId.match(componentRegex);
    const componentNum = match && parseInt(match[1], 10);

    if (componentNum && componentNum >= newId) {
      newId = componentNum + 1;
    }
  });

  return `${componentType}${newId}`;
};
