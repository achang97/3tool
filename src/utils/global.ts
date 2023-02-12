import AbortController from 'abort-controller';
import fetch from 'node-fetch';

export const initFetch = () => {
  Object.assign(globalThis, {
    fetch,
    AbortController,
  });
};
