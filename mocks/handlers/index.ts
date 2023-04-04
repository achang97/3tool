import _ from 'lodash';
import { toolHandlers } from './tools';
import { resourceHandlers } from './resources';
import { authHandlers } from './auth';

export const handlers = _.concat(authHandlers, toolHandlers, resourceHandlers);
