import { useCallback, useState } from 'react';

type HookReturnType = {
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export const useIsHovered = (): HookReturnType => {
  const [isHovered, setIsHovered] = useState(false);

  const onMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return { isHovered, onMouseEnter, onMouseLeave };
};
