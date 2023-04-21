import { User } from '@app/types';
import { Role } from './types';

export const getUserRole = (user: User) => {
  if (user.roles.isAdmin) return Role.Admin;
  if (user.roles.isEditor) return Role.Editor;
  if (user.roles.isViewer) return Role.Viewer;
  return Role.Viewer;
};

export const getUserRolesFlags = (role: Role): User['roles'] => {
  switch (role) {
    case Role.Admin:
      return { isAdmin: true, isEditor: true, isViewer: true };
    case Role.Editor:
      return { isAdmin: false, isEditor: true, isViewer: true };
    case Role.Viewer:
      return { isAdmin: false, isEditor: false, isViewer: true };
    default:
      return { isAdmin: false, isEditor: false, isViewer: false };
  }
};
