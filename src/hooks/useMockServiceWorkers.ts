import { MSW_API } from '@app/constants';
import { useEffect } from 'react';

// Start MSW on the server
if (MSW_API) {
  // eslint-disable-next-line global-require
  require('@mocks/init');
}

export const useMockServiceWorkers = () => {
  // Start MSW on the browser
  useEffect(() => {
    if (MSW_API) {
      // eslint-disable-next-line global-require
      require('@mocks/init');
    }
  }, []);
};
