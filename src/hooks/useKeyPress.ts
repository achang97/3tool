import { useCallback, useEffect } from 'react';

type HookArgs = {
  key: string;
  cmdKey?: boolean;
  onPress: (event: KeyboardEvent) => void;
  selector?: string;
  ignoreInputEvents?: boolean;
};

export const useKeyPress = ({
  key,
  onPress,
  selector,
  ignoreInputEvents,
  cmdKey = false,
}: HookArgs) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== key) {
        return;
      }
      const eventCmdKey = event.metaKey || event.ctrlKey;
      if (eventCmdKey !== cmdKey) {
        return;
      }
      if (
        ignoreInputEvents &&
        // @ts-ignore tagName, role are defined on element
        (event.target?.tagName === 'INPUT' || event.target?.role === 'textbox')
      ) {
        return;
      }
      if (selector && !document.querySelector(selector)?.contains(event.target as Node)) {
        return;
      }

      event.preventDefault();
      onPress(event);
    },
    [cmdKey, ignoreInputEvents, key, onPress, selector]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
};
