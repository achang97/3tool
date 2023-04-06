import { User } from '@app/types';

export const mockUser: User = {
  _id: '1',
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
