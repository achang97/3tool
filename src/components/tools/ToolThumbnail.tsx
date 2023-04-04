import { useCallback, useMemo } from 'react';
import { lineClamp } from '@app/utils/mui';
import { UserAvatar } from '@app/components/common/UserAvatar';
import { Box, Typography } from '@mui/material';
import { GridViewRounded } from '@mui/icons-material';
import moment from 'moment';
import { useRouter } from 'next/router';
import { stringToColor } from '@app/utils/styles';
import { User } from '@app/types';
import { ThumbnailContainer } from './ThumbnailContainer';

type ToolThumbnailProps = {
  id: string;
  name: string;
  updatedAt: string;
  creatorUser: User;
};

export const ToolThumbnail = ({
  id,
  name,
  updatedAt,
  creatorUser,
}: ToolThumbnailProps) => {
  const { push } = useRouter();

  const iconColor = useMemo(() => {
    return stringToColor(name);
  }, [name]);

  const handleNavigateToTool = useCallback(() => {
    push(`/tools/${id}`);
  }, [push, id]);

  return (
    <ThumbnailContainer
      icon={
        <GridViewRounded
          fontSize="inherit"
          sx={{ transform: 'rotate(45deg)', color: iconColor }}
        />
      }
      onClick={handleNavigateToTool}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={lineClamp(1)}>
            {name}
          </Typography>
          <Typography variant="caption" color="text.tertiary">
            Updated {moment(updatedAt).fromNow()}
          </Typography>
        </Box>
        <UserAvatar user={creatorUser} sx={{ marginLeft: 1 }} />
      </Box>
    </ThumbnailContainer>
  );
};
