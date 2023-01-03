import {
  experimental_extendTheme as extendTheme,
  SxProps,
} from '@mui/material/styles';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    raised: true;
  }
}

export const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#1890FF',
          dark: '#1168B9',
        },
        text: {
          primary: '#667080',
          // NOTE: The secondary color is actually darker than the primary color,
          // which is unconventional.
          secondary: '#212B36',
          disabled: '#A2A9B9',
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
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
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            ':active': {
              boxShadow: 'inset 0px 2px 6px rgba(0, 0, 0, 0.16)',
            },
          },
        },
        {
          props: { variant: 'raised' },
          style: {
            background: '#DFE3E8',
            ':hover': {
              background: '#CDD6E1',
            },
            ':active': {
              boxShadow: 'inset 0px 2px 6px rgba(0, 0, 0, 0.16)',
            },
          },
        },
        {
          props: { variant: 'outlined' },
          style: {
            borderWidth: '2px !important',
            borderColor: 'var(--primary-main)',
          },
        },
      ],
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
