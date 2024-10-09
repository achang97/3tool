import { useMemo } from 'react';
import { Tab, Tabs } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ToolbarTemplate } from './common/ToolbarTemplate';

const AUTHENTICATED_LINKS = [
  { to: '/', text: 'Apps' },
  { to: '/resources', text: 'Resources' },
];

export const AuthenticatedToolbar = () => {
  const { pathname } = useRouter();

  const tabsValue = useMemo(
    () => AUTHENTICATED_LINKS.find((link) => link.to === pathname)?.to ?? false,
    [pathname]
  );

  const middle = useMemo(() => {
    return (
      <Tabs
        value={tabsValue}
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          height: '100%',
          gap: 2,
        }}
      >
        {AUTHENTICATED_LINKS.map(({ to, text }) => (
          <Tab
            component={Link}
            key={to}
            href={to}
            sx={{ height: '100%' }}
            label={text}
            value={to}
          />
        ))}
      </Tabs>
    );
  }, [tabsValue]);

  return <ToolbarTemplate middle={middle} testId="authenticated-toolbar" />;
};
