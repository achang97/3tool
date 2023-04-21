import _ from 'lodash';
import { toolsHandlers } from './tools';
import { resourcesHandlers } from './resources';
import { authHandlers } from './auth';
import { usersHandlers } from './users';
import { companiesHandlers } from './companies';

export const handlers = _.concat(
  authHandlers,
  companiesHandlers,
  toolsHandlers,
  resourcesHandlers,
  usersHandlers
);
