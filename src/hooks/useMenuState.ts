import { useCallback, useMemo, useState } from 'react';

type HookReturnType = {
  isMenuOpen: boolean;
  menuAnchor: HTMLElement | null;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onMenuClose: () => void;
};

export const useMenuState = (): HookReturnType => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const isMenuOpen = useMemo(() => {
    return Boolean(menuAnchor);
  }, [menuAnchor]);

  const onMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  }, []);

  const onMenuClose = useCallback(() => {
    setMenuAnchor(null);
  }, []);

  return { isMenuOpen, menuAnchor, onMenuOpen, onMenuClose };
};
