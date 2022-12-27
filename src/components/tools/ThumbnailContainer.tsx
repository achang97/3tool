import { Box } from '@mui/material';
import { ReactNode } from 'react';

type ThumbnailContainerProps = {
  children: ReactNode;
  onClick: () => void;
};

export const ThumbnailContainer = ({
  children,
  onClick,
}: ThumbnailContainerProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 2,
        margin: 2,
        backgroundColor: 'grey.100',
        borderRadius: 2,
        textAlign: 'center',
        cursor: 'pointer',
        width: '200px',
        height: '125px',
      }}
      onClick={onClick}
    >
      {children}
    </Box>
  );
};
