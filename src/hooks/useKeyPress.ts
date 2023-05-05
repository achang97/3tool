import { useCallback, useEffect } from 'react';

type HookArgs = {
  key: string;
  cmdKey?: boolean;
  onPress: () => void;
};

export const useKeyPress = ({ key, cmdKey = false, onPress }: HookArgs) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== key) {
        return;
      }

      const eventCmdKey = event.metaKey || event.ctrlKey;
      if (eventCmdKey !== cmdKey) {
        return;
      }

      event.preventDefault();
      onPress();
    },
    [cmdKey, key, onPress]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
};
