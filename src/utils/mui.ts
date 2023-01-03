import {
  experimental_extendTheme as extendTheme,
  SxProps,
} from '@mui/material/styles';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    raised: true;
  }
}

declare module '@mui/material/styles/createPalette' {
  interface GreyscalePalette {
    main: string;
    dark: string;
  }

  interface Greyscale {
    disabled: string;
    border: string;
    primary: GreyscalePalette;
    icon: GreyscalePalette;
    offwhite: GreyscalePalette;
  }

  interface Palette {
    greyscale: Greyscale;
  }

  interface PaletteOptions {
    greyscale: Greyscale;
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
        greyscale: {
          disabled: '#E8E8E8',
          border: '#CDD6E1',
          primary: {
            main: '#DFE3E8',
            dark: '#B6C2D0',
          },
          icon: {
            main: '#A2A9B9',
            dark: '#9099AD',
          },
          offwhite: {
            main: '#F7F7F7',
            dark: '#F2F2F2',
          },
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
            ':hover': {
              background: '#DFE3E8',
            },
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
