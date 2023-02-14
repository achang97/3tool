import { User } from '@auth0/auth0-react';
import { Action } from './actions';
import { Component } from './components';

export type Tool = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  creatorUser: User;
  components: Component[];
  actions: Action[];
};

export * from './actions';
export * from './components';
export * from './eventHandlers';
