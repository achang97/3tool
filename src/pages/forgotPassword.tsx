import Head from 'next/head';
import { createTitle } from '@app/utils/window';
import { ForgotPasswordForm } from '@app/components/auth/ForgotPasswordForm';

const ForgotPassword = () => {
  return (
    <>
      <Head>
        <title>{createTitle('Forgot Password')}</title>
      </Head>
      <main>
        <ForgotPasswordForm />
      </main>
    </>
  );
};

export default ForgotPassword;
