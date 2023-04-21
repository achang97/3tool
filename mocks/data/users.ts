import { User } from '@app/types';

export const mockUser: User = {
  _id: 'user_1',
  email: 'andrew@tryelixir.io',
  firstName: 'Andrew',
  lastName: 'Chang',
  companyId: '123',
  state: {
    isPasswordSet: true,
  },
  roles: {
    isAdmin: true,
    isEditor: true,
    isViewer: true,
  },
};

export const mockUser2: User = {
  _id: 'user_2',
  email: 'akshay@tryelixir.io',
  firstName: 'Akshay',
  lastName: 'Ramaswamy',
  companyId: '123',
  state: {
    isPasswordSet: true,
  },
  roles: {
    isAdmin: false,
    isEditor: true,
    isViewer: false,
  },
};
