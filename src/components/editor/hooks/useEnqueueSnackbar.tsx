import { useSnackbar, OptionsObject } from 'notistack';
import { useCallback } from 'react';
import { Snackbar, SnackbarProps } from '../common/Snackbar';

export const useEnqueueSnackbar = () => {
  const { enqueueSnackbar } = useSnackbar();

  const pushSnackbar = useCallback(
    (message: string, options: OptionsObject & { variant: SnackbarProps['variant'] }) => {
      enqueueSnackbar(message, {
        ...options,
        content: (key) => {
          return <Snackbar key={key} message={message} variant={options.variant} />;
        },
      });
    },
    [enqueueSnackbar]
  );

  return pushSnackbar;
};
