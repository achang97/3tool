import { Layout } from 'react-grid-layout';

export const hasLayoutMoved = (
  prevLayout: Layout,
  newLayout: Layout
): boolean => {
  return newLayout.x !== prevLayout.x || newLayout.y !== prevLayout.y;
};

export const hasLayoutResized = (
  prevLayout: Layout,
  newLayout: Layout
): boolean => {
  return newLayout.w !== prevLayout.w || newLayout.h !== prevLayout.h;
};
