import '@testing-library/jest-dom';
import 'whatwg-fetch';
import moment from 'moment-timezone';

global.fetch = jest.fn();

moment.tz.setDefault('Etc/UTC');
