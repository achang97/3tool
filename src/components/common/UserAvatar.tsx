import { User } from '@app/types';
import { stringToColor } from '@app/utils/styles';
import { Avatar, SxProps, Tooltip } from '@mui/material';
import { useMemo } from 'react';

type AvatarWithUser = {
  user: User;
  email?: never;
};

type AvatarWithEmail = {
  user?: never;
  email: string;
};

type UserAvatarProps = {
  sx?: SxProps;
  size?: number;
} & (AvatarWithUser | AvatarWithEmail);

/**
 * Pass either `user` or `email` as props to `UserAvatar`. You cannot pass both the props simultaneously.
 * `fullName` will be generated based on the prop that is passed.
 */
export const UserAvatar = ({ user, email, sx, size = 30 }: UserAvatarProps) => {
  const fullName = useMemo(() => {
    return user ? `${user.firstName} ${user.lastName}` : email;
  }, [user, email]);

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
        {fullName[0].toUpperCase()}
      </Avatar>
    </Tooltip>
  );
};
