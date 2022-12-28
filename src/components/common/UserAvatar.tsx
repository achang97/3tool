import { stringToColor } from '@app/utils/styles';
import { Avatar, SxProps, Tooltip } from '@mui/material';
import { useMemo } from 'react';

type UserAvatarProps = {
  name?: string;
  sx?: SxProps;
  size?: number;
};

export const UserAvatar = ({ name, sx, size = 30 }: UserAvatarProps) => {
  const backgroundColor = useMemo(() => {
    return stringToColor(name ?? '');
  }, [name]);

  return (
    <Tooltip title={name}>
      <Avatar
        sx={{
          width: size,
          height: size,
          backgroundColor,
          ...sx,
        }}
      >
        {name?.[0]}
      </Avatar>
    </Tooltip>
  );
};
