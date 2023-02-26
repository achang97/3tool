import { useCallback, useState } from 'react';

type HookReturnType = {
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
};

export const useIsFocused = (): HookReturnType => {
  const [isFocused, setIsFocused] = useState(false);

  const onFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const onBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return { isFocused, onFocus, onBlur };
};
