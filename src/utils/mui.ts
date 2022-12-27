import {
  experimental_extendTheme as extendTheme,
  SxProps,
} from '@mui/material/styles';

export const theme = extendTheme({
  typography: {
    fontFamily: [
      'Rubik',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: 'text-transform: none !important;',
      },
    },
  },
});

export const lineClamp = (numLines: number): SxProps => {
  return {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: numLines,
    WebkitBoxOrient: 'vertical',
  };
};
