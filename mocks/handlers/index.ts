import { toolHandlers } from './tools';
import { resourceHandlers } from './resources';

export const handlers = [...toolHandlers, ...resourceHandlers];
