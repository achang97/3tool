import { Box } from '@mui/material';
import { ReactNode } from 'react';

type ThumbnailContainerProps = {
  children: ReactNode;
  icon: ReactNode;
  onClick: () => void;
};

export const ThumbnailContainer = ({
  children,
  icon,
  onClick,
}: ThumbnailContainerProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 3,
        margin: 2,
        backgroundColor: 'grey.100',
        borderRadius: 2,
        cursor: 'pointer',
        width: '300px',
        height: '200px',
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          flex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3.5rem',
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1, width: '100%' }}>{children}</Box>
    </Box>
  );
};
