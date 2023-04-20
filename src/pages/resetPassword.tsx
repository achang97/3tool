import Head from 'next/head';
import { createTitle } from '@app/utils/window';
import { ResetPasswordForm } from '@app/components/auth/ResetPasswordForm';

const ResetPassword = () => {
  return (
    <>
      <Head>
        <title>{createTitle('Reset Password')}</title>
      </Head>
      <main>
        <ResetPasswordForm />
      </main>
    </>
  );
};

export default ResetPassword;
