import { useEffect, useState } from 'react';

export const useLastClickedLocation = () => {
  const [location, setLocation] = useState<[number, number]>();

  useEffect(() => {
    const handler = ((e: PointerEvent) => {
      setLocation([e.clientX, e.clientY]);
    }) as EventListenerOrEventListenerObject;

    window.addEventListener('click', handler);

    return () => {
      window.removeEventListener('click', handler);
    };
  }, []);

  return location;
};
