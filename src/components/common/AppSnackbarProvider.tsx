import { SnackbarProvider } from 'notistack';
import { ReactNode } from 'react';

const DURATION_MS = 3000;
const MAX_SNACK = 3;

type AppSnackbarProviderProps = {
  children: ReactNode;
};

export const AppSnackbarProvider = ({ children }: AppSnackbarProviderProps) => {
  return (
    <SnackbarProvider
      autoHideDuration={DURATION_MS}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      maxSnack={MAX_SNACK}
    >
      {children}
    </SnackbarProvider>
  );
};
