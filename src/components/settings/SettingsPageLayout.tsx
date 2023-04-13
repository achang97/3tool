import React, { ReactNode } from 'react';
import Head from 'next/head';
import { createTitle } from '@app/utils/window';
import { SideNavProps } from '@app/components/common/SideNav';
import { PageContainer } from '@app/components/common/PageContainer';
import { PageTitle } from '../common/PageTitle';

const sideNavConfig: SideNavProps['config'] = [
  {
    heading: 'Settings',
    items: [{ type: 'link', children: 'Team', href: '/settings/team' }],
  },
  {
    heading: 'Personal',
    items: [{ type: 'link', children: 'Account', href: '/settings/account' }],
  },
];

type SettingsPageLayoutProps = {
  children: ReactNode;
  title: string;
};

export const SettingsPageLayout = ({ children, title }: SettingsPageLayoutProps) => {
  return (
    <>
      <Head>
        <title>{createTitle(`Settings | ${title}`)}</title>
      </Head>
      <main>
        <PageContainer sideNavConfig={sideNavConfig}>
          <PageTitle>{title}</PageTitle>
          {children}
        </PageContainer>
      </main>
    </>
  );
};
