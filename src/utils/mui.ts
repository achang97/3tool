import {
  alpha,
  experimental_extendTheme as extendTheme,
  createTheme,
  SxProps,
} from '@mui/material/styles';
import { gridClasses } from '@mui/x-data-grid';

import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/lab/themeAugmentation';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    raised: true;
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    code1: React.CSSProperties;
    code2: React.CSSProperties;

    customBody1: React.CSSProperties;
    customBody2: React.CSSProperties;

    customSubtitle1: React.CSSProperties;
    customSubtitle2: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    code1?: React.CSSProperties;
    code2?: React.CSSProperties;

    customBody1?: React.CSSProperties;
    customBody2?: React.CSSProperties;

    customSubtitle1?: React.CSSProperties;
    customSubtitle2?: React.CSSProperties;
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

  interface TypeText {
    tertiary: string;
  }
}

const ODD_OPACITY = 0.2;

const { palette } = createTheme({
  palette: {
    primary: {
      main: '#1890FF',
      dark: '#1168B9',
    },
    text: {
      primary: '#505B6B',
      secondary: '#667080',
      tertiary: '#A2A9B9',
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
});

export const theme = extendTheme({
  colorSchemes: {
    light: {
      palette,
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
    code1: {
      fontFamily: 'monospace',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.286,
    },
    code2: {
      fontFamily: 'monospace',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.25,
    },
    customBody1: {
      fontWeight: 400,
      fontSize: '1.625rem',
      lineHeight: 1.192,
    },
    customBody2: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.188,
    },
    customSubtitle1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.125,
    },
    customSubtitle2: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.25,
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiLoadingButton: {
      defaultProps: {
        variant: 'contained',
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            '&:active': {
              boxShadow: 'inset 0px 2px 6px rgba(0, 0, 0, 0.16)',
            },
          },
        },
        {
          props: { variant: 'raised' },
          style: {
            background: palette.greyscale.primary.main,
            ':hover': {
              background: palette.greyscale.border,
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
            borderColor: palette.primary.main,
            ':hover': {
              background: palette.greyscale.primary.main,
            },
          },
        },
      ],
    },
    MuiTypography: {
      defaultProps: {
        color: 'text.primary',
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          [`.${gridClasses.row}`]: {
            '&:hover, &.Mui-hovered': {
              backgroundColor: alpha(palette.primary.main, ODD_OPACITY),
              '@media (hover: none)': {
                backgroundColor: 'transparent',
              },
            },
          },
          [`.${gridClasses.row}:nth-of-type(even)`]: {
            '&:not(:hover):not(.Mui-hovered)': {
              backgroundColor: palette.greyscale.offwhite.main,
            },
            '&.Mui-selected': {
              backgroundColor: alpha(
                palette.primary.main,
                ODD_OPACITY + palette.action.selectedOpacity
              ),
              '&:hover, &.Mui-hovered': {
                backgroundColor: alpha(
                  palette.primary.main,
                  ODD_OPACITY +
                    palette.action.selectedOpacity +
                    palette.action.hoverOpacity
                ),
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                  backgroundColor: alpha(
                    palette.primary.main,
                    ODD_OPACITY + palette.action.selectedOpacity
                  ),
                },
              },
            },
          },
          [`.${gridClasses.cell}`]: {
            border: 'none',
            ':focus': {
              outlineStyle: 'none',
            },
            ':focus-within': {
              outlineStyle: 'none',
            },
          },
          [`.${gridClasses.columnHeader}`]: {
            ':focus': {
              outlineStyle: 'none',
            },
            ':focus-within': {
              outlineStyle: 'none',
            },
          },
          [`.${gridClasses.columnHeaderTitle}`]: {
            color: palette.text.tertiary,
            textTransform: 'uppercase',
            fontSize: '0.75rem',
          },
          [`.${gridClasses.columnSeparator}`]: {
            display: 'none',
          },
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '8px 24px',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        InputLabelProps: {
          shrink: true,
          variant: 'standard',
        },
        InputProps: {
          notched: false,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          position: 'relative',
        },
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
