import { useSnackbar, OptionsObject } from 'notistack';
import { ReactNode, useCallback } from 'react';
import { Snackbar, SnackbarProps } from '../components/common/Snackbar';

export const useEnqueueSnackbar = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const pushSnackbar = useCallback(
    (
      message: ReactNode,
      options: Pick<OptionsObject, 'persist'> & {
        variant: SnackbarProps['variant'];
        action?: ReactNode;
      }
    ) => {
      return enqueueSnackbar(message, {
        ...options,
        content: (key) => {
          return (
            <Snackbar
              key={key}
              message={message}
              variant={options.variant}
              persist={options.persist}
              action={options.action}
              onClose={() => closeSnackbar(key)}
            />
          );
        },
      });
    },
    [closeSnackbar, enqueueSnackbar]
  );

  return pushSnackbar;
};
