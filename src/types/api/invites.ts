import { User } from './users';

export enum InviteStatus {
  Pending = 'pending',
  Fulfilled = 'fulfilled',
}

export type UserInvite = {
  _id: string;
  email: string;
  status: InviteStatus;
  companyName?: string;
  companyId?: string;
  inviterUserId: string;
  inviterUser?: User;
  roles?: User['roles'];
};
