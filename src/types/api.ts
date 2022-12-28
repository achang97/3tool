import { User } from '@auth0/auth0-react';

export type Tool = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  creator: User;
};
