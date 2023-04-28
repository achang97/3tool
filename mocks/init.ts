import { API_BASE_URL } from '@app/constants';

const initMocks = async () => {
  if (typeof window === 'undefined') {
    const { server } = await import('./server');
    server.listen();
  } else {
    const { worker } = await import('./browser');
    worker.start({
      onUnhandledRequest: (req, print) => {
        if (req.url.href.includes(API_BASE_URL)) {
          print.warning();
        }
      },
    });
  }
};

initMocks();

export {};
