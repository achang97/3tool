import { User } from '@app/types';
import { stringToColor } from '@app/utils/styles';
import { Avatar, SxProps, Tooltip } from '@mui/material';
import { useMemo } from 'react';

type UserAvatarProps = {
  user: User;
  sx?: SxProps;
  size?: number;
};

export const UserAvatar = ({ user, sx, size = 30 }: UserAvatarProps) => {
  const fullName = useMemo(() => {
    return `${user.firstName} ${user.lastName}`;
  }, [user.firstName, user.lastName]);

  const backgroundColor = useMemo(() => {
    return stringToColor(fullName);
  }, [fullName]);

  return (
    <Tooltip title={fullName}>
      <Avatar
        sx={{
          width: size,
          height: size,
          backgroundColor,
          ...sx,
        }}
      >
        {fullName[0]}
      </Avatar>
    </Tooltip>
  );
};
