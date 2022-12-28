import { User } from '@auth0/auth0-react';

export type ApiError = {
  status: number;
  data: {
    message: string;
  };
};

export type Tool = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  creator: User;
};
