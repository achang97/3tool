import { useCallback } from 'react';
import { useAnalytics } from '@app/hooks/useAnalytics';
import { useActiveTool } from './useActiveTool';

export const useToolAnalyticsTrack = () => {
  const analytics = useAnalytics();
  const { tool } = useActiveTool();

  const track = useCallback(
    (...args: Parameters<typeof analytics.track>) => {
      const [event, properties, ...rest] = args;
      analytics.track(
        event,
        {
          ...properties,
          toolId: tool._id,
          toolName: tool.name,
        },
        ...rest
      );
    },
    [analytics, tool._id, tool.name]
  );

  return track;
};
