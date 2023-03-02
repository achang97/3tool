import '@testing-library/jest-dom';
import 'whatwg-fetch';
import moment from 'moment-timezone';

global.fetch = jest.fn();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
window.confirm = jest.fn();
window.open = jest.fn();

document.createRange = () => {
  const range = new Range();

  range.getBoundingClientRect = jest.fn();

  // @ts-ignore purposefully overriding function
  range.getClientRects = jest.fn(() => ({
    item: () => null,
    length: 0,
  }));

  return range;
};

moment.tz.setDefault('Etc/UTC');
