import {
  alpha,
  experimental_extendTheme as extendTheme,
  createTheme,
  SxProps,
} from '@mui/material/styles';
import { gridClasses } from '@mui/x-data-grid';

import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/lab/themeAugmentation';

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

  interface GreyscalePalette {
    main: string;
    dark: string;
  }

  interface Greyscale {
    disabled: string;
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

const { palette } = createTheme({
  palette: {
    divider: '#CDD6E1',
    primary: {
      main: '#1890FF',
      dark: '#1168B9',
    },
    secondary: {
      main: '#DFE3E8',
      dark: '#CDD6E1',
    },
    text: {
      primary: '#505B6B',
      secondary: '#667080',
      tertiary: '#A2A9B9',
    },
    greyscale: {
      disabled: '#E8E8E8',
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
          props: { variant: 'contained', color: 'secondary' },
          style: {
            boxShadow: 'none',
            ':hover': {
              background: palette.divider,
              boxShadow: 'none',
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
          },
        },
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {
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
            '&:hover': {
              backgroundColor: alpha(palette.primary.main, 0.2),
            },
            '&.Mui-selected': {
              backgroundColor: alpha(
                palette.primary.main,
                0.05 + palette.action.selectedOpacity
              ),
              '&:hover': {
                backgroundColor: alpha(
                  palette.primary.main,
                  0.2 + palette.action.selectedOpacity
                ),
              },
            },
          },
          [`.${gridClasses.row}:nth-of-type(even)`]: {
            '&:not(:hover):not(.Mui-selected)': {
              backgroundColor: palette.greyscale.offwhite.main,
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
          overflow: 'visible',
        },
        shrink: {
          transform: 'none',
          fontSize: '0.75rem',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: '40px',
        },
        sizeSmall: {
          height: '32px',
        },
        multiline: {
          height: 'auto',
        },
      },
    },
    // NOTE: There's some buggy behavior in MUI which requires this fontSize to be declared
    // separately from the MuiInputBase root class.
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
        notchedOutline: {
          '> legend': {
            width: 0,
          },
        },
      },
      defaultProps: {
        notched: false,
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
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
