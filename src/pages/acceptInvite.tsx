import Head from 'next/head';
import { createTitle } from '@app/utils/window';
import { AcceptInviteForm } from '@app/components/auth/AcceptInviteForm';

const AcceptInvite = () => {
  return (
    <>
      <Head>
        <title>{createTitle('Accept Invite')}</title>
      </Head>
      <main>
        <AcceptInviteForm />
      </main>
    </>
  );
};

export default AcceptInvite;
