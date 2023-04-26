import { AnalyticsBrowser } from '@segment/analytics-next';

// NOTE: We don't want to log events when running the app locally.
const writeKey =
  process.env.NODE_ENV !== 'development' ? process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY : '';

export const analytics = AnalyticsBrowser.load({
  writeKey: writeKey ?? '',
});
