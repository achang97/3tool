import { lineClamp } from '@app/utils/mui';
import { Typography } from '@mui/material';
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
    <ThumbnailContainer onClick={handleNavigateToTool}>
      <Typography variant="subtitle1" sx={{ ...lineClamp(2) }}>
        {name}
      </Typography>
      <Typography variant="caption">
        Edited {moment(updatedAt.toISOString()).fromNow()}
      </Typography>
    </ThumbnailContainer>
  );
};
