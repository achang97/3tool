import { Typography } from '@mui/material';
import Link from 'next/link';

export const LoginRedirectFooter = () => {
  return (
    <Typography variant="body2" data-testid="login-redirect-footer">
      Or
      <Typography component="span" sx={{ color: 'primary.main' }} fontSize="inherit">
        <Link href="/login"> sign in </Link>
      </Typography>
      if you already have an account.
    </Typography>
  );
};
