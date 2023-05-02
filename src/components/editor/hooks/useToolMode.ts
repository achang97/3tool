import { useAppSelector } from '@app/redux/hooks';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export const useToolMode = () => {
  const { pathname } = useRouter();
  const { isPreview } = useAppSelector((state) => state.editor);

  const mode = useMemo(() => {
    if (pathname === '/apps/[id]/[name]') {
      return 'view';
    }
    if (isPreview) {
      return 'preview';
    }
    return 'edit';
  }, [isPreview, pathname]);

  return mode;
};
