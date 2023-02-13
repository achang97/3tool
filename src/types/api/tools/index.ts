import { User } from '@auth0/auth0-react';
import { Component } from './components';

export type Tool = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  creator: User;
  components: Component[];
};

export * from './components';
