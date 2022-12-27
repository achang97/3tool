export const isInBounds = (
  x: number,
  y: number,
  { left, right, top, bottom }: DOMRect
): boolean => {
  return x >= left && x <= right && y >= top && y <= bottom;
};

export const getTitle = (title: string) => {
  return `${title} - ACA Labs`;
};
