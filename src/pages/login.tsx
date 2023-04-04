import Head from 'next/head';
import { createTitle } from '@app/utils/window';
import { LoginForm } from '@app/components/auth/LoginForm';

const Login = () => {
  return (
    <>
      <Head>
        <title>{createTitle('Login')}</title>
      </Head>
      <main>
        <LoginForm />
      </main>
    </>
  );
};

export default Login;
