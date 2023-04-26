import { analytics } from '@app/analytics';
import { useCallback } from 'react';
import { useSignedInUser } from './useSignedInUser';

export const useAnalytics = () => {
  const user = useSignedInUser();

  const track = useCallback(
    (...args: Parameters<typeof analytics.track>) => {
      const [event, properties, ...rest] = args;
      analytics.track(
        event,
        {
          ...properties,
          companyId: user?.companyId,
        },
        ...rest
      );
    },
    [user?.companyId]
  );

  const page = useCallback(
    (...args: Parameters<typeof analytics.page>) => {
      const [category, event, properties, ...rest] = args;
      analytics.page(
        category,
        event,
        {
          ...properties,
          companyId: user?.companyId,
        },
        ...rest
      );
    },
    [user?.companyId]
  );

  return { track, page };
};
