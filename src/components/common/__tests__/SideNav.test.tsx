import { render, screen, within } from '@testing-library/react';
import { NextRouter } from 'next/router';
import userEvent from '@testing-library/user-event';
import { SideNav, SideNavProps } from '../SideNav';

jest.mock('next/router', () => ({
  useRouter: jest.fn<Partial<NextRouter>, []>(() => ({
    pathname: '/settings/team',
  })),
}));

const configWithLinks: SideNavProps['config'] = [
  {
    heading: 'Settings',
    items: [
      { type: 'link', children: 'Team', href: '/settings/team' },
      { type: 'link', children: 'Plan', href: '/settings/plan' },
    ],
  },
  {
    heading: 'Personal',
    items: [{ type: 'link', children: 'Account', href: '/settings/account' }],
  },
];

describe('SideNav', () => {
  it('renders headings received from config prop', () => {
    render(<SideNav config={configWithLinks} />);

    expect(screen.getByRole('heading', { name: /settings/i })).toBeVisible();
    expect(screen.getByRole('heading', { name: /personal/i })).toBeVisible();
  });

  describe("config - item with `type: 'link'`", () => {
    it('renders links received from config prop', () => {
      render(<SideNav config={configWithLinks} />);

      expect(screen.getByRole('link', { name: /team/i })).toBeVisible();
      expect(screen.getByRole('link', { name: /team/i })).toHaveAttribute('href', '/settings/team');
      expect(screen.getByRole('link', { name: /plan/i })).toBeVisible();
      expect(screen.getByRole('link', { name: /plan/i })).toHaveAttribute('href', '/settings/plan');

      expect(screen.getByRole('link', { name: /account/i })).toBeVisible();
      expect(screen.getByRole('link', { name: /account/i })).toHaveAttribute(
        'href',
        '/settings/account'
      );
    });

    it('highlights link that matches the current URL', () => {
      render(<SideNav config={configWithLinks} />);

      expect(screen.getByRole('link', { name: /team/i, current: true })).toBeVisible();
      expect(screen.getByRole('link', { name: /plan/i, current: false })).toBeVisible();
      expect(screen.getByRole('link', { name: /account/i, current: false })).toBeVisible();
    });
  });

  describe("config - item with `type: 'addButton'`", () => {
    it('renders a button with plus icon when an item with `type: addButton` is received from config prop', () => {
      const config: SideNavProps['config'] = [
        {
          heading: 'Folders',
          items: [{ type: 'addButton', children: 'New folder', onClick: jest.fn() }],
        },
      ];
      render(<SideNav config={config} />);

      const newFolderButton = screen.getByRole('button', { name: /new folder/i });

      expect(newFolderButton).toBeVisible();
      expect(within(newFolderButton).getByTestId('AddIcon')).toBeVisible();
    });

    it('calls `onClick` handler for the "addButton" received from config prop when the button is clicked', async () => {
      const handleNewFolderClick = jest.fn();
      const config: SideNavProps['config'] = [
        {
          heading: 'Folders',
          items: [{ type: 'addButton', children: 'New folder', onClick: handleNewFolderClick }],
        },
      ];
      render(<SideNav config={config} />);

      expect(handleNewFolderClick).toHaveBeenCalledTimes(0);

      const newFolderButton = screen.getByRole('button', { name: /new folder/i });
      await userEvent.click(newFolderButton);

      expect(handleNewFolderClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("config - item with `type: 'element'`", () => {
    it('renders children directly when an item with `type: element` is received from config prop', () => {
      const config: SideNavProps['config'] = [
        {
          heading: 'Folders',
          items: [{ type: 'element', children: <h1>Custom children</h1> }],
        },
      ];
      render(<SideNav config={config} />);

      expect(screen.getByRole('heading', { name: /custom children/i })).toBeVisible();
    });
  });
});
