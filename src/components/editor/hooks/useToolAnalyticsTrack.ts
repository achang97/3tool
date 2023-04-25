import { analytics } from '@app/analytics';
import { useCallback } from 'react';
import { useActiveTool } from './useActiveTool';

export const useToolAnalyticsTrack = () => {
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
    [tool._id, tool.name]
  );

  return track;
};
