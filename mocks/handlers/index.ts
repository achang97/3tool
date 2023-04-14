import _ from 'lodash';
import { toolsHandlers } from './tools';
import { resourcesHandlers } from './resources';
import { authHandlers } from './auth';
import { usersHandlers } from './users';

export const handlers = _.concat(authHandlers, toolsHandlers, resourcesHandlers, usersHandlers);
