import React from 'react';
import { MenuItem, Select, SelectProps } from '@mui/material';
import { Role } from '@app/types/users';

const ROLE_OPTIONS = [
  { id: Role.Admin, name: 'Admin' },
  { id: Role.Editor, name: 'Editor' },
  { id: Role.Viewer, name: 'Viewer' },
];

type UserRoleSelectProps = SelectProps<Role>;

export const UserRoleSelect = (props: UserRoleSelectProps) => {
  return (
    <Select {...props}>
      {ROLE_OPTIONS.map((roleOption) => (
        <MenuItem key={roleOption.id} value={roleOption.id}>
          {roleOption.name}
        </MenuItem>
      ))}
    </Select>
  );
};
