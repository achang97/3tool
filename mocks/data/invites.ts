import { InviteStatus, UserInvite } from '@app/types';

export const mockPendingUserInvite: UserInvite = {
  _id: 'invite_1',
  email: 'chetan@@tryelixir.io',
  companyId: 'company_1',
  status: InviteStatus.Pending,
  roles: {
    isAdmin: false,
    isEditor: true,
    isViewer: true,
  },
  inviterUserId: 'user_1',
};

export const mockFulfilledUserInvite: UserInvite = {
  _id: 'invite_2',
  email: 'akshay@tryelixir.io',
  companyId: 'company_1',
  status: InviteStatus.Fulfilled,
  roles: {
    isAdmin: false,
    isEditor: true,
    isViewer: false,
  },
  inviterUserId: 'user_1',
};
