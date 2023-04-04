export type User = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyId: string;
  state: {
    isPasswordSet?: boolean;
  };
  roles: {
    isAdmin: boolean;
    isEditor: boolean;
    isViewer: boolean;
  };
};
