import { User } from '@app/types';
import { Role } from '../types';
import { getUserRole, getUserRolesFlags } from '../userRoleConversion';

describe('userRoleConversion', () => {
  describe('getUserRole', () => {
    it('should return Role.Admin when isAdmin flag is true', () => {
      expect(
        getUserRole({ roles: { isAdmin: true, isEditor: false, isViewer: false } } as User)
      ).toBe(Role.Admin);
    });

    it('should return Role.Editor when isEditor flag is true', () => {
      expect(
        getUserRole({ roles: { isAdmin: false, isEditor: true, isViewer: false } } as User)
      ).toBe(Role.Editor);
    });

    it('should return Role.Viewer when isViewer flag is true', () => {
      expect(
        getUserRole({ roles: { isAdmin: false, isEditor: false, isViewer: true } } as User)
      ).toBe(Role.Viewer);
    });

    it('should return Role.Admin when all flags are true', () => {
      expect(
        getUserRole({ roles: { isAdmin: true, isEditor: true, isViewer: true } } as User)
      ).toBe(Role.Admin);
    });

    it('should return Role.Admin when isAdmin and isEditor flags are true', () => {
      expect(
        getUserRole({ roles: { isAdmin: true, isEditor: true, isViewer: false } } as User)
      ).toBe(Role.Admin);
    });

    it('should return Role.Admin when isAdmin and isViewer flags are true', () => {
      expect(
        getUserRole({ roles: { isAdmin: true, isEditor: false, isViewer: true } } as User)
      ).toBe(Role.Admin);
    });

    it('should return Role.Editor when isEditor and isViewer flags are true', () => {
      expect(
        getUserRole({ roles: { isAdmin: false, isEditor: true, isViewer: true } } as User)
      ).toBe(Role.Editor);
    });

    it('should return Role.Viewer when all flags are false', () => {
      expect(
        getUserRole({ roles: { isAdmin: false, isEditor: false, isViewer: false } } as User)
      ).toBe(Role.Viewer);
    });
  });

  describe('getUserRolesFlags', () => {
    it('should return correct flags object for Role.Admin', () => {
      expect(getUserRolesFlags(Role.Admin)).toEqual({
        isAdmin: true,
        isEditor: true,
        isViewer: true,
      });
    });

    it('should return correct flags object for Role.Editor', () => {
      expect(getUserRolesFlags(Role.Editor)).toEqual({
        isAdmin: false,
        isEditor: true,
        isViewer: true,
      });
    });

    it('should return correct flags object for Role.Viewer', () => {
      expect(getUserRolesFlags(Role.Viewer)).toEqual({
        isAdmin: false,
        isEditor: false,
        isViewer: true,
      });
    });
  });
});
