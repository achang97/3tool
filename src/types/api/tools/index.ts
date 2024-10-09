import { Action } from './actions';
import { Component } from './components';

export type Tool = {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  components: Component[];
  actions: Action[];
};

export * from './actions';
export * from './components';
export * from './eventHandlers';
