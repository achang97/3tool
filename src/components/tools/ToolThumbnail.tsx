import { lineClamp } from '@app/utils/mui';
import { Typography } from '@mui/material';
import { GridViewRounded } from '@mui/icons-material';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { ThumbnailContainer } from './ThumbnailContainer';

type ToolThumbnailProps = {
  id: string;
  name: string;
  updatedAt: Date;
};

export const ToolThumbnail = ({ id, name, updatedAt }: ToolThumbnailProps) => {
  const { push } = useRouter();

  const handleNavigateToTool = useCallback(() => {
    push(`/tools/${id}`);
  }, [push, id]);

  return (
    <ThumbnailContainer
      icon={
        <GridViewRounded
          fontSize="inherit"
          color="primary"
          sx={{ transform: 'rotate(45deg)' }}
        />
      }
      onClick={handleNavigateToTool}
    >
      <Typography variant="subtitle1" sx={{ ...lineClamp(1) }}>
        {name}
      </Typography>
      <Typography variant="caption">
        Edited {moment(updatedAt).fromNow()}
      </Typography>
    </ThumbnailContainer>
  );
};
